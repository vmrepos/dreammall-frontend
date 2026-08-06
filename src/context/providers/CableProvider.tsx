

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useAuth } from "../AuthContext";
import { CableContext } from "../CableContext";
import type { Consumer, Subscription } from "@rails/actioncable";
import { subscribeRestaurantsChannel } from "../../services/cable";

type DriversChannelHandle = {
  consumer: Consumer;
  subscription: Subscription;
  disconnect: () => void;
};

export const CableProvider = ({ children }: { children: ReactNode }) => {
  const { restaurant } = useAuth();
  type Listener = (data: any) => void;
  const listenersRef = useRef(new Set<Listener>());
  const handleRef = useRef<DriversChannelHandle | null>(null);

  const notify = useCallback((data: any) => {
    listenersRef.current.forEach(listener => listener(data));
  }, [])


  useEffect(() => {
    if (!restaurant) {
      handleRef.current?.disconnect();
      handleRef.current = null;
      return;
    }
    let cancelled = false;

    const handle = subscribeRestaurantsChannel(notify)
    if (!handle) return;
    if (cancelled) {
      handle.disconnect();
      return;
    }
    handleRef.current = handle;
    return () => {
      cancelled = true;
      handleRef.current?.disconnect();
      handleRef.current = null;
    }
  }, [restaurant, notify])

  const subscribe = useCallback((callback: (data: unknown) => void) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  const value = useMemo(() => ({
    subscribe
  }), [subscribe])

  return <CableContext.Provider value={value}>{children}</CableContext.Provider>
}