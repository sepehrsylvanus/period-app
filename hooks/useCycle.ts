import { getCycleData } from "@/actions/cycle.action";
import { useQuery } from "@tanstack/react-query";

export const useGetCycle = (userId: string) =>
  useQuery<>({
    queryKey: ["cycle-data", userId],
    queryFn: async () => {
      const cycleData = await getCycleData(userId);
      return cycleData;
    },
  });
