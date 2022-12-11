import React, { useCallback, useMemo, useState, useEffect } from 'react';
import axios, { AxiosError, AxiosResponse, Canceler } from 'axios';
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
export type HandleFn<ResType = any> = (data: ResType) => void;

type RequestObj = {
  request: string;
  state: {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<
      React.SetStateAction<AxiosError<ErrorType> | null>
    >;
    handleData: HandleFn<any>;
  }[];
}[];

function useHttp<ResType>(
  url: string,
  handleData: HandleFn<ResType>,
  method: MethodType
) {
  const newRequest = `${method} ${url}`;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<ErrorType> | null>(null);

  const controller = useMemo(() => new AbortController(), []);

  const pendingRequest = useMemo<RequestObj>(() => [], []);
  const foundRequest = useMemo(
    () => pendingRequest.find(pr => pr.request === newRequest),
    [newRequest, pendingRequest]
  );
  if (foundRequest) {
    foundRequest.state.push({
      setLoading,
      setError,
      handleData,
    });
  } else {
    pendingRequest.push({
      request: newRequest,
      state: [{ setLoading, setError, handleData }],
    });
  }

  const request = useCallback(
    (payload: PayloadType) => {
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

        if (foundRequest) {
          return;
        }

        const response = await request(payload);

        const requestIndex = pendingRequest.findIndex(
          pr => pr.request === newRequest
        );

        if (requestIndex === -1) {
          handleData(response.data);
        } else {
          pendingRequest[requestIndex].state.forEach(s => {
            s.handleData(response.data);
          });
        }
      } catch (error) {
        const requestIndex = pendingRequest.findIndex(
          pr => pr.request === newRequest
        );
        if (requestIndex === -1) {
          setError(error as AxiosError<ErrorType>);
        } else {
          pendingRequest[requestIndex].state.forEach(s => {
            s.setError(error as AxiosError<ErrorType>);
          });
        }
      } finally {
        const requestIndex = pendingRequest.findIndex(
          pr => pr.request === newRequest
        );
        if (requestIndex === -1) {
          setLoading(false);
        } else {
          pendingRequest[requestIndex].state.forEach(s => {
            s.setLoading(false);
          });
        }

        pendingRequest.splice(requestIndex, 1);
      }
    },
    [foundRequest, handleData, request, newRequest, pendingRequest]
  );

  return { loading, error, makeRequest, controller };
}

export default useHttp;
