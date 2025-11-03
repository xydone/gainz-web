import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
	useEffect,
} from "react";
export interface User {
	accessToken: string | null;
	setAccessToken: Dispatch<SetStateAction<string | null>>;
	refreshToken: string | null;
	setRefreshToken: Dispatch<SetStateAction<string | null>>;
	isSignedIn: boolean | null;
	setIsSignedIn: Dispatch<SetStateAction<boolean | null>>;
	loading: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>;
}

export const UserContext = createContext<User | undefined>(undefined);

export function useUserContext() {
	const at = useContext(UserContext);
	if (at === undefined) {
		throw new Error(
			"useAccessTokenContext must be used with a non-undefined AccessTokenContext",
		);
	}
	useEffect(() => {
		const storedAccessToken = localStorage.getItem("accessToken");
		const storedRefreshToken = localStorage.getItem("refreshToken");
		at.setAccessToken(storedAccessToken);
		at.setRefreshToken(storedRefreshToken);
		if (storedAccessToken !== null || storedRefreshToken !== null) {
			at.setIsSignedIn(true);
		} else {
			at.setIsSignedIn(false);
		}
		at.setLoading(false);
	});
	return at;
}

export function handleSignOut(user: User) {
	user.setAccessToken(null);
	user.setRefreshToken(null);
	user.setIsSignedIn(false);
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
}
