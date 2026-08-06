import { createContext, useContext } from "react";
type ChannelMessage = {
  type: string;
  message: unknown;
}
type ContextProps = {
  subscribe: (callback: (data: ChannelMessage) => void) => () => void;
};
export const CableContext = createContext<ContextProps>({
  subscribe: () => () => { },
});
export function useCable() {
  return useContext(CableContext);
}
