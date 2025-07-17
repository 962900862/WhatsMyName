"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { ContextValue } from "@/types/context";
import { User } from "@/types/user";
import useOneTapLogin from "@/hooks/useOneTapLogin";
import { useSession } from "next-auth/react";

const AppContext = createContext({} as ContextValue);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  // Always call the hook, but conditionally use its functionality inside
  const oneTapLogin = useOneTapLogin();
  
  // Initialize one-tap login if enabled, using safe client-side checks
  useEffect(() => {
    // Only attempt to access window in client-side context
    if (typeof window !== 'undefined') {
      // The oneTapLogin logic should check for auth configs internally
      oneTapLogin();
    }
  }, [oneTapLogin]);

  const { data: session } = useSession();

  // Use empty string as default theme
  const [theme, setTheme] = useState<string>("");

  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        showSignModal,
        setShowSignModal,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
