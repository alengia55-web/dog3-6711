export const PET_GOV_PLATFORM_URL = "https://pet.gov.gr/emzs-pet-adoption-gateway";

/** Validate only official individual listing URLs, not the general gateway or arbitrary redirects. */
export function isPetGovListingUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && ["pet.gov.gr", "adoptastray.gov.gr"].includes(url.hostname)
      && !url.username && !url.password && !url.port && !url.hash
      && /^\/emzs-pet-adoption-gateway\/details\/?$/.test(url.pathname)
      && url.searchParams.size === 1
      && /^[1-9]\d*$/.test(url.searchParams.get("id") ?? "");
  } catch {
    return false;
  }
}