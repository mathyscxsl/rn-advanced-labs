import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as repo from "../services/robotRepo";

const keys = {
  all: ["robots"] as const,
  list: (params: repo.ListParams | undefined) => ["robots", "list", params ?? {}] as const,
  detail: (id: string) => ["robots", "detail", id] as const,
};

export function useRobotsQuery(params?: repo.ListParams) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => repo.list(params ?? {}),
  });
}

export function useRobotQuery(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => repo.getById(id).then((r) => r!),
    enabled: !!id,
  });
}

export function useCreateRobotMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: repo.CreateRobotInput) => repo.create(input),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useUpdateRobotMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: repo.UpdateRobotChanges }) => repo.update(id, changes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useDeleteRobotMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => repo.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}
