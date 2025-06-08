import { getUser } from "@/actions/user.action";
import { TUser } from "@/models/user.model";
import { useQuery } from "@tanstack/react-query";
export const useGetUser = (id: string) =>
  useQuery<TUser>({
    queryKey: ["getUser"],
    queryFn: async () => {
      const user = await getUser(id);
      return user;
    },
  });
