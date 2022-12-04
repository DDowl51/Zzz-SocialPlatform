import { useCallback, useMemo, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { UserType } from 'interfaces/index';

type MethodType = 'get' | 'post' | 'patch' | 'delete' | 'options';
type PayloadType = {
  token?: string;
  data?: Object;
};
export type LoginResType = {
  user: UserType;
  token: string;
};
type ErrorType = {
  status: string;
  message: string;
};
export type HandleFn<ResType = {}> = (data: ResType) => void;

function useHttp<ResType>(
  url: string,
  handleData: HandleFn<ResType>,
  method: MethodType
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<ErrorType> | null>(null);

  const controller = useMemo(() => new AbortController(), []);

  const request = useCallback(
    (payload: PayloadType) => {
      if (method === 'delete') {
        return axios.delete(url, {
          headers: { authorization: `Bearer ${payload.token}` },
          signal: controller.signal,
        });
      }
      return axios[method](url, payload.data, {
        headers: { authorization: `Bearer ${payload.token}` },
        signal: controller.signal,
      });
    },
    [method, url, controller]
  );

  const makeRequest = useCallback(
    async (payload: PayloadType) => {
      try {
        setLoading(true);

        const response = await request(payload);
        handleData(response.data);
      } catch (error) {
        setError(error as AxiosError<ErrorType>);
      } finally {
        setLoading(false);
      }
    },
    [handleData, request]
  );

  return { loading, error, makeRequest, controller };
}

export default useHttp;
