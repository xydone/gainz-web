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
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedName = localStorage.getItem("displayName");
    at.setAccessToken(storedAccessToken);
    at.setRefreshToken(storedRefreshToken);
    if (storedAccessToken !== null || storedRefreshToken !== null) {
      at.setIsSignedIn(true);
    }
    at.setDisplayName(storedName);
  });
  return at;
}

export function handleSignOut(user: User) {
  user.setAccessToken(null);
  user.setRefreshToken(null);
  user.setIsSignedIn(false);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("displayName");
}
