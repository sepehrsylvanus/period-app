import { createPeriodDay, getPeriodDays } from "@/actions/periodDay.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetPeriodDays = () =>
  useQuery({
    queryKey: ["getPeriodDays"],
    queryFn: async () => {
      const periodDays = await getPeriodDays();
      return periodDays;
    },
  });

export const useCreatePeriodDay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const newPeriodDay = await createPeriodDay(data);
      return newPeriodDay;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getPeriodDays"] });
      toast.success(data);
    },
    onError: (error: any) => toast.error(error.message),
  });
};
