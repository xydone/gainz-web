import { handleSignOut, useUserContext } from "@/app/context";
import axios from "axios";
import { useEffect } from "react";

const axiosInstance = axios.create({});

function AxiosInterceptor() {
  const user = useUserContext();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            let refreshToken = user.refreshToken;
            if (user.refreshToken == null) {
              refreshToken = localStorage.getItem("refreshToken");
              if (refreshToken == null) throw new Error("No refresh token");
              user.setRefreshToken(refreshToken);
            }
            await axios
              .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                refresh_token: refreshToken,
              })
              .then(({ data }) => {
                user.setAccessToken(data.access_token);
                localStorage.setItem("accessToken", data.access_token);
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
              })
              .catch(() => {
                handleSignOut(user);
              });

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token error:", refreshError);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [user]);

  return null;
}

export { axiosInstance, AxiosInterceptor };
