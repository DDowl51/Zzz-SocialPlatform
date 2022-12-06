import axios from 'axios';
import { EventSourcePolyfill } from 'event-source-polyfill';
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNote } from 'stores/notification.action';
import { StateType } from 'stores/store';

type SseContextType = {
  sse: EventSourcePolyfill | null;
  connect: () => void;
  disconnect: () => Promise<void>;
};
const initValue = {
  sse: null,
  connect: () => {},
  disconnect: async () => {},
};

export const SseContext = createContext<SseContextType>(initValue);

let init = false;
export const SseContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch<any>();
  const token = useSelector<StateType, string>(state => state.auth.token);
  const [sse, setSse] = useState<EventSourcePolyfill | null>(null);
  const connect = useCallback(() => {
    if (sse) return;
    setSse(() => {
      return new EventSourcePolyfill('/api/sse', {
        headers: { authorization: `Bearer ${token}` },
      });
    });
  }, [sse, token]);

  useEffect(() => {
    if (!init && sse) {
      init = true;
      sse.addEventListener('like-post', event => {
        console.log((event as MessageEvent).data);
        dispatch(fetchNote());
      });
      sse.addEventListener('comment-post', event => {
        console.log((event as MessageEvent).data);
        dispatch(fetchNote());
      });
    }
  }, [dispatch, sse]);

  const disconnect = useCallback(async () => {
    if (!sse) return;
    await axios.delete('/api/sse', {
      headers: { authorization: `Bearer ${token}` },
    });
    sse.close();
    setSse(null);
  }, [sse, token]);

  return (
    <SseContext.Provider value={{ sse, connect, disconnect }}>
      {children}
    </SseContext.Provider>
  );
};

export default SseContext;
