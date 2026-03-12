import { createContext, useState } from "react";
import useSWRMutation from "swr/mutation";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import type { UserData } from "@/types";

export interface LoginParams {
    username: string;
    password: string;
    remember: boolean;
}

const fetchAuth = async (url: string, { arg }: { arg: { token: string; creds: { username: string; password: string } } }) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${arg.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: arg.creds.username,
            password: arg.creds.password,
        }),
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
    }

    return res.json();
};


export const AuthContext = createContext<{
    token: string;
    onLogin: (params: LoginParams) => void;
    onLogout: () => void;
    isLoading: boolean;
    error?: string;
}>({
    token: "",
    onLogin: () => { },
    onLogout: () => { },
    isLoading: false
});

type AuthProviderProps = {
    children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [userLocalData, setUserLocalData, removeUserLocalData] = useLocalStorage<UserData | undefined>("user", undefined)
    const [userSessionData, setUserSessionData, removeUserSessionData] = useSessionStorage<UserData | undefined>("user", undefined)
    const [token, setToken] = useState<string>(userSessionData?.accessToken || userLocalData?.accessToken || "");
    const [fetchError, setFetchError] = useState<string>();

    const { error, trigger, isMutating } = useSWRMutation<UserData, string, string, { token: string; creds: { username: string; password: string } }>(import.meta.env.VITE_AUTH_ENDPOINT as string, fetchAuth)

    const handleLogin = async ({ username, password, remember }: LoginParams) => {
        setFetchError("")

        try {
            const res = await trigger({ token, creds: { username, password } })

            if (remember) {
                setUserLocalData(res)
            } else {
                setUserSessionData(res)
            }
            setToken(res.accessToken)
        } catch (error) {
            setFetchError("Unknown network Error")
        }
    };

    const handleLogout = () => {
        setToken("");
        removeUserLocalData();
        removeUserSessionData()
    };

    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogout,
        isLoading: isMutating,
        error: fetchError || error
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider