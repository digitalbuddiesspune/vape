import { useQuery } from "@tanstack/react-query";
import { getWhatsRightForYouItems } from "../../api/api";
import { queryKeys } from "./queryKeys";

export function useWhatsRightForYouQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.whatsRightForYou.all,
    queryFn: async () => {
      const { data } = await getWhatsRightForYouItems();
      return data.data || [];
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
