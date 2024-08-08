"use client";

import {
  createContext,
  useContext,
  useEffect,
  type PropsWithChildren,
} from "react";
import { usePathname } from "next/navigation";

import { reactClient, TRPCReactProvider } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";

type AuthStates = "LOADING" | "AUTHED" | "UNAUTHED";
const AuthContext = createContext<{
  refetch: () => unknown;
  status: AuthStates;
  user: RouterOutputs["account"]["getUserId"];
}>({
  refetch: () => null,
  status: "LOADING",
  user: null,
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const user = reactClient.account.getUserId.useQuery();
  let status: AuthStates = "UNAUTHED";
  if (user.data) status = "AUTHED";
  if (user.isLoading) status = "LOADING";
  const refetch = user.refetch;
  useEffect(() => {
    void refetch();
  }, [pathname, refetch]);

  return (
    <AuthContext.Provider
      value={{
        refetch: user.refetch,
        user: user.data ?? null,
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return { ...ctx };
};

export function WithGlobalProvider(props: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      <TRPCReactProvider>
        <AuthProvider>{props.children}</AuthProvider>
      </TRPCReactProvider>
    </div>
  );
}
