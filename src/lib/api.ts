import { handleSignOut, useUserContext } from "@/app/context";
import { queryClient } from "@/app/providers";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useEffect } from "react";
const axiosInstance = axios.create({});

interface FailedRequestQueueItem {
	resolve: (token: string) => void;
	reject: (error: AxiosError) => void;
}

let failedQueue: FailedRequestQueueItem[] = [];
let isRefreshing = false;

const processQueue = (
	error: AxiosError | null,
	token: string | null = null,
) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else if (token) {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

function AxiosInterceptor() {
	const user = useUserContext();

	useEffect(() => {
		const responseInterceptor = axiosInstance.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as InternalAxiosRequestConfig & {
					_retry?: boolean;
				};

				// only handle 401s that are not being retried
				if (error.response?.status === 401 && !originalRequest._retry) {
					if (isRefreshing) {
						// if we are refreshing, add the new request to a queue
						return new Promise<string>((resolve, reject) => {
							failedQueue.push({ resolve, reject });
						}).catch((err) => Promise.reject(err));
					}

					originalRequest._retry = true;
					isRefreshing = true;

					try {
						const refreshToken = localStorage.getItem("refreshToken");
						if (!refreshToken) {
							handleSignOut(user);
							return Promise.reject(error);
						}

						const { data } = await axios.post<{ access_token: string }>(
							`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
							{ refresh_token: refreshToken },
						);

						const newAccessToken = data.access_token;

						localStorage.setItem("accessToken", newAccessToken);

						user.setAccessToken(newAccessToken);

						axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

						processQueue(null, newAccessToken);

						await queryClient.invalidateQueries();

						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
						}
						return axiosInstance(originalRequest);
					} catch (refreshError) {
						processQueue(refreshError as AxiosError, null);
						handleSignOut(user);
						return Promise.reject(refreshError);
					} finally {
						isRefreshing = false;
					}
				}

				return Promise.reject(error);
			},
		);

		const requestInterceptor = axiosInstance.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("accessToken");
				if (token && config.headers) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		return () => {
			axiosInstance.interceptors.request.eject(requestInterceptor);
			axiosInstance.interceptors.response.eject(responseInterceptor);
		};
	}, [user]);

	return null;
}

export { axiosInstance, AxiosInterceptor };
