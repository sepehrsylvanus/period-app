import { getSymptoms } from "@/actions/symptopm.action";
import { TSymptom } from "@/models/symptoms.model";
import { useQuery } from "@tanstack/react-query";

export const useGetSymptoms = () =>
  useQuery<TSymptom[]>({
    queryKey: ["getSymptoms"],
    queryFn: async () => {
      const symptoms = await getSymptoms();
      return symptoms;
    },
  });
