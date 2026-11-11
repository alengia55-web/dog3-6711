import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { createClient } from "@libsql/client";
import { ensurePetGovColumn } from "./migrate-pet-gov";
import { isPetGovListingUrl } from "../packages/web/src/shared/pet-gov";

const dir = await mkdtemp(join(tmpdir(), "shelter-pet-gov-test-"));
process.env.DATABASE_URL = `file:${dir}/test.sqlite`;
delete process.env.DATABASE_AUTH_TOKEN;
delete process.env.RESEND_API_KEY;
process.env.WEBSITE_URL = "http://localhost:4200";
process.env.STAFF_INVITE_CODE = "isolated-test-invite";
process.env.BETTER_AUTH_SECRET = "isolated-test-secret-not-used-in-production-12345";
const db = createClient({ url: process.env.DATABASE_URL });
const snapshot = JSON.parse(await readFile(new URL("./current-public-data.json", import.meta.url), "utf8"));
for (const sql of snapshot.schema) await db.execute(sql);
const original = snapshot.dogs[0];
const keys = Object.keys(original);
await db.execute({ sql: `INSERT INTO dogs (${keys.map(k => `"${k}"`).join(",")}) VALUES (${keys.map(() => "?").join(",")})`, args: keys.map(k => original[k]) });
await db.execute("INSERT INTO settings (key,value) VALUES ('dogsSeeded','true')");
await ensurePetGovColumn(db);
assert.deepEqual({ ...(await db.execute("SELECT * FROM dogs")).rows[0] }, { ...original, pet_gov_url: "" });
await ensurePetGovColumn(db);
const listing = "https://pet.gov.gr/emzs-pet-adoption-gateway/details?id=123";
assert.ok(isPetGovListingUrl(listing));
assert.ok(isPetGovListingUrl(listing.replace("pet.gov.gr", "adoptastray.gov.gr")));
const invalid = ["https://pet.gov.gr/emzs-pet-adoption-gateway", "javascript:alert(1)", "https://pet.gov.gr.evil.example/emzs-pet-adoption-gateway/details?id=123", listing.replace("https:", "http:"), listing.replace("id=123", "id=oops"), listing + "&redirect=https://evil.example", listing.replace("pet.gov.gr", "user@pet.gov.gr")];
for (const url of invalid) assert.equal(isPetGovListingUrl(url), false, url);

const { default: app } = await import("../packages/web/src/api/index");
const require = createRequire(new URL("../packages/web/package.json", import.meta.url));
const { createORPCClient } = await import(pathToFileURL(require.resolve("@orpc/client")).href);
const { RPCLink } = await import(pathToFileURL(require.resolve("@orpc/client/fetch")).href);
let token = "";
const client: any = createORPCClient(new RPCLink({
  url: `${process.env.WEBSITE_URL}/api/rpc`,
  headers: () => ({ origin: process.env.WEBSITE_URL!, ...(token ? { authorization: `Bearer ${token}` } : {}) }),
  fetch: (request: Request) => app.fetch(request),
}));
assert.equal((await client.dogs.list())[0].petGovUrl, "");
await assert.rejects(() => client.dogs.update({ id: original.id, petGovUrl: listing }), (error: any) => error.status === 401);
await client.staff.register({ name: "Isolated test", email: "pet-gov-test@example.invalid", password: "isolated-test-password", inviteCode: process.env.STAFF_INVITE_CODE });
const login = await app.fetch(new Request(`${process.env.WEBSITE_URL}/api/auth/sign-in/email`, { method: "POST", headers: { origin: process.env.WEBSITE_URL!, "content-type": "application/json" }, body: JSON.stringify({ email: "pet-gov-test@example.invalid", password: "isolated-test-password" }) }));
assert.equal(login.status, 200);
token = login.headers.get("set-auth-token")!;
assert.ok(token);
await client.dogs.update({ id: original.id, petGovUrl: `  ${listing}  ` });
assert.equal((await client.dogs.get({ id: original.id })).petGovUrl, listing);
assert.equal((await client.dogs.list())[0].petGovUrl, listing);
for (const url of invalid) await assert.rejects(() => client.dogs.update({ id: original.id, petGovUrl: url }), (error: any) => error.status === 400);
await client.dogs.update({ id: original.id, traitsEn: "Preserved link test" });
assert.equal((await client.dogs.get({ id: original.id })).petGovUrl, listing);
await ensurePetGovColumn(db);
assert.equal((await client.dogs.get({ id: original.id })).petGovUrl, listing);
await client.dogs.update({ id: original.id, petGovUrl: "" });
assert.equal((await client.dogs.list())[0].petGovUrl, "");
const input = { name: "Test", nameEn: "Test", photo: original.photo, sex: "male", ageEl: "2", ageEn: "2", sizeEl: "Μικρό", sizeEn: "Small", storyEl: "Δοκιμή", storyEn: "Isolated test", petGovUrl: listing };
const created = await client.dogs.create(input);
assert.equal((await client.dogs.get({ id: created.id })).petGovUrl, listing);
const blank = await client.dogs.create({ ...input, nameEn: "Blank", petGovUrl: undefined });
assert.equal(blank.petGovUrl, "");
console.log("PASS: isolated additive migration/idempotence, URL allowlist, unauthenticated rejection, create/update/read/clear, whitespace normalization and unrelated-edit preservation. No production data changed.");
db.close();