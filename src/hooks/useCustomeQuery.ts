import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config";
import type { AxiosRequestConfig } from "axios";

interface IAuthenticatedQuery {
  url: string;
  queryKey: string[];
  config?: AxiosRequestConfig;
  enabled?: boolean;
}
const useCustomeQuery = ({ url, queryKey, config, enabled = true }: IAuthenticatedQuery) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, config);
      return data;
    },
    enabled,
  });
};

export default useCustomeQuery;
