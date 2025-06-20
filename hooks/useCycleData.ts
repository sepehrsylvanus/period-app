import { getCycleDatas } from "@/actions/cycleData.action";
import { TCylcleData } from "@/models/cycleData.model";
import { useQuery } from "@tanstack/react-query";

export const useGetCycleDatas = () =>
  useQuery<TCylcleData[]>({
    queryKey: ["getCycleData"],
    queryFn: async () => {
      const cycleDatas = await getCycleDatas();
      return cycleDatas;
    },
  });
