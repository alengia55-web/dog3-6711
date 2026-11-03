import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";
import { CONTACT } from "../lib/translations";

/**
 * Contact and bank details as the staff maintain them in the back office,
 * falling back to the built-in placeholders until they are filled in.
 */
export function useContact() {
  const { data } = useQuery(orpc.settings.get.queryOptions({ staleTime: 60_000 }));
  const merged = { ...CONTACT } as Record<string, string>;
  for (const [key, value] of Object.entries(data ?? {})) {
    if (typeof value === "string" && value.length > 0) merged[key] = value;
  }
  return merged as typeof CONTACT;
}
