import { createContext, useContext, useEffect, useState } from "react";
import { userInfoService } from "../services/user-info-service";

// undefined = still loading
// null = not authenticated
// object = authenticated user
const CurrentUserContext = createContext(undefined);

export function CurrentUserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialUser = userInfoService.initialUser;
    setUser(initialUser);
    setLoading(false);

    userInfoService.setHandler(setUser);

    return () => {
      userInfoService.setHandler(null);
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={loading ? undefined : user}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
