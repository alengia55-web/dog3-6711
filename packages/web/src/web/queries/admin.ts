import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";
import { authClient } from "../lib/auth";
import { adminDict, type AdminDict } from "../lib/admin-translations";
import { useLocale } from "../hooks/use-locale";

/** Bilingual strings for the back office, following the site's language toggle. */
export function useAdminText(): { a: AdminDict; locale: "el" | "en" } {
  const { locale } = useLocale();
  return { a: adminDict[locale] as unknown as AdminDict, locale };
}

/** Signed-in employee, or an error when the session is missing/expired. */
export function useStaffSession() {
  return useQuery(orpc.staff.me.queryOptions({ retry: false, staleTime: 30_000 }));
}

export function useDashboard() {
  return useQuery(orpc.stats.dashboard.queryOptions({ retry: false }));
}

export function useAdminDogs() {
  return useQuery(orpc.dogs.adminList.queryOptions({ retry: false }));
}

export function useSiteSettings() {
  return useQuery(orpc.settings.get.queryOptions({ staleTime: 60_000 }));
}

export function useAdminApplications() {
  return useQuery(orpc.applications.adminList.queryOptions({ retry: false }));
}

export function useStaffList() {
  return useQuery(orpc.staff.list.queryOptions({ retry: false }));
}

/** Invalidates everything that depends on the dog list, public pages included. */
export function useDogMutations() {
  const qc = useQueryClient();
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: orpc.dogs.key() });
    void qc.invalidateQueries({ queryKey: orpc.stats.key() });
  };
  return {
    create: useMutation(orpc.dogs.create.mutationOptions({ onSuccess: refresh })),
    update: useMutation(orpc.dogs.update.mutationOptions({ onSuccess: refresh })),
    remove: useMutation(orpc.dogs.remove.mutationOptions({ onSuccess: refresh })),
    toggleAdopted: useMutation(orpc.dogs.toggleAdopted.mutationOptions({ onSuccess: refresh })),
    reorder: useMutation(orpc.dogs.reorder.mutationOptions({ onSuccess: refresh })),
  };
}

export function useApplicationMutations() {
  const qc = useQueryClient();
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: orpc.applications.key() });
    void qc.invalidateQueries({ queryKey: orpc.stats.key() });
  };
  return {
    setStatus: useMutation(orpc.applications.setStatus.mutationOptions({ onSuccess: refresh })),
    setNotes: useMutation(orpc.applications.setNotes.mutationOptions({ onSuccess: refresh })),
    remove: useMutation(orpc.applications.remove.mutationOptions({ onSuccess: refresh })),
  };
}

export function useSettingsMutation() {
  const qc = useQueryClient();
  return useMutation(
    orpc.settings.update.mutationOptions({
      onSuccess: () => void qc.invalidateQueries({ queryKey: orpc.settings.key() }),
    }),
  );
}

export function useStaffMutations() {
  const qc = useQueryClient();
  const refresh = () => void qc.invalidateQueries({ queryKey: orpc.staff.key() });
  return {
    setRole: useMutation(orpc.staff.setRole.mutationOptions({ onSuccess: refresh })),
    remove: useMutation(orpc.staff.remove.mutationOptions({ onSuccess: refresh })),
    register: useMutation(orpc.staff.register.mutationOptions()),
  };
}

/** Reactive Better Auth session — used to redirect away from the login page. */
export function useAuthSession() {
  return authClient.useSession();
}
