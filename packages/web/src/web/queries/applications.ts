import { useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useSubmitAdoption() {
  return useMutation(orpc.applications.submitAdoption.mutationOptions());
}

export function useSubmitVolunteer() {
  return useMutation(orpc.applications.submitVolunteer.mutationOptions());
}

export function useSubmitInKind() {
  return useMutation(orpc.applications.submitInKind.mutationOptions());
}
