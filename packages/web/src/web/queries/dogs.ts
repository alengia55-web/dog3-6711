import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useDogs() {
  return useQuery(orpc.dogs.list.queryOptions({ staleTime: 60_000 }));
}

export function useDogStats() {
  return useQuery(orpc.dogs.stats.queryOptions({ staleTime: 60_000 }));
}
