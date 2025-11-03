import { handleSignOut, useUserContext } from "@/app/context";
import axios, { type AxiosError } from "axios";
import { useEffect, useRef } from "react";

const axiosInstance = axios.create({});

function AxiosInterceptor() {
	const user = useUserContext();
	const isRefreshingRef = useRef(false);

	useEffect(() => {
		const requestInterceptor = axiosInstance.interceptors.request.use(
			(config) => {
				if (user.accessToken) {
					config.headers.Authorization = `Bearer ${user.accessToken}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);

		const responseInterceptor = axiosInstance.interceptors.response.use(
			async (response) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config;
				if (
					error.response?.status === 401 &&
					originalRequest &&
					!isRefreshingRef.current
				) {
					isRefreshingRef.current = true;
					try {
						let refreshToken = user.refreshToken;
						if (user.refreshToken == null) {
							refreshToken = localStorage.getItem("refreshToken");
							if (refreshToken == null) {
								return handleSignOut(user);
							}
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
							})
							.finally(() => {
								isRefreshingRef.current = false;
							});
					} catch (refreshError) {
						return Promise.reject(refreshError);
					}
				}

				return Promise.reject(error);
			},
		);

		return () => {
			axiosInstance.interceptors.response.eject(requestInterceptor);
			axiosInstance.interceptors.response.eject(responseInterceptor);
		};
	}, [user]);

	return null;
}

export { axiosInstance, AxiosInterceptor };
