import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
export interface User {
  displayName: string | null;
  setDisplayName: Dispatch<SetStateAction<string | null>>;
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  refreshToken: string | null;
  setRefreshToken: Dispatch<SetStateAction<string | null>>;
  isSignedIn: boolean;
  setIsSignedIn: Dispatch<SetStateAction<boolean>>;
}

export const UserContext = createContext<User | undefined>(undefined);

export function useUserContext() {
  const at = useContext(UserContext);

  if (at === undefined) {
    throw new Error(
      "useAccessTokenContext must be used with a non-undefined AccessTokenContext"
    );
  }
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedName = localStorage.getItem("displayName");
    at.setAccessToken(storedToken);
    if (storedToken !== null) at.setIsSignedIn(true);
    at.setDisplayName(storedName);
  });
  return at;
}
