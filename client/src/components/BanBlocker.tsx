import { useAuth } from "@/hooks/use-auth";
import { createContext, useContext, ReactNode } from "react";

interface BanBlockerContextType {
  isBanned: boolean;
}

const BanBlockerContext = createContext<BanBlockerContextType>({ isBanned: false });

export function useBanBlocker() {
  const context = useContext(BanBlockerContext);
  if (!context) {
    throw new Error('useBanBlocker must be used within BanBlockerProvider');
  }
  return context;
}

interface BanBlockerProviderProps {
  children: ReactNode;
}

export function BanBlockerProvider({ children }: BanBlockerProviderProps) {
  const { user } = useAuth();
  const isBanned = user?.isBanned || false;

  return (
    <BanBlockerContext.Provider value={{ isBanned }}>
      <div 
        className={isBanned ? "pointer-events-none select-none" : ""}
        style={isBanned ? { 
          filter: "blur(2px)",
          opacity: 0.3,
          userSelect: "none"
        } : {}}
      >
        {children}
      </div>
    </BanBlockerContext.Provider>
  );
}