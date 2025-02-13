import { useState } from "react";
import { useUserContext } from "../context";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function SignInMenu({
  isVisible,
  toggleVisibility,
  setDisplayName,
}: {
  isVisible: boolean;
  toggleVisibility: () => void;
  setDisplayName: (name: string | null) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFailedSignIn, setFailedSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const context = useUserContext();
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const sendRequest = async () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        username: username,
        password: password,
      })
      .then((response) => {
        const { access_token, refresh_token, display_name } = response.data;

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("displayName", display_name);

        toggleVisibility();
        setDisplayName(display_name);
        context.setAccessToken(access_token);
        context.setRefreshToken(refresh_token);
        context.setIsSignedIn(true);
      })
      .catch((error) => {
        setFailedSignIn(true);
        console.warn(error);
      });
  };
  return (
    <>
      {isVisible && (
        <div
          className="flex-col items-center z-10 absolute bg-primary text-foreground p-4 right-0 top-12"
          id="sign-in-container"
        >
          <div className="flex flex-col gap-[1em]">
            <div>
              <label htmlFor="username" className="mr-[1em]">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                className="bg-accent"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="mr-[1em]">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                className="bg-accent"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="checkbox"
                id="show-password"
                className="mr-[1em]"
                checked={showPassword}
                onChange={handleTogglePasswordVisibility}
              />
              <label htmlFor="show-password">Show password</label>
            </div>
            <Button
              className="bg-accent text-white cursor-pointer px-[2em] py-[0.5em] rounded-lg border-none hover:bg-background active:bg-accent-strong"
              id="sign-in-button"
              onClick={sendRequest}
            >
              Sign in
            </Button>
            {isFailedSignIn && <p className="text-red-500">Sign in failed</p>}
          </div>
        </div>
      )}
    </>
  );
}
