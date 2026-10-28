import { useQuery } from "@tanstack/react-query";

import { getPublicUsers } from "@/shared/api/publicUserApi";
import { normalizeIds } from "@/shared/utils/ids";

const toUserMap = (users) => new Map(users.map((u) => [u.id, u]));

export function usePublicUsers(ids) {
  const uniqueIds = normalizeIds(ids);
  return useQuery({
    queryKey: ["users", "public", uniqueIds],
    queryFn: () => getPublicUsers(uniqueIds),
    select: toUserMap,
    enabled: uniqueIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
