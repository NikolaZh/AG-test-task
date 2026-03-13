import { createContext, useState } from "react";
import useSWRMutation from "swr/mutation";
import { useLocalStorage } from "../../shared/hooks/useLocalStorage";
import { useSessionStorage } from "../../shared/hooks/useSessionStorage";
import type { UserData } from "@/types";
import { cleanBaseUrl, fetchAuth } from "../../api/auth";

export interface LoginParams {
    username: string;
    password: string;
    remember: boolean;
}

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

    const baseUrl = cleanBaseUrl(import.meta.env.VITE_AUTH_ENDPOINT);

    const { error, trigger, isMutating } = useSWRMutation<UserData, string, string, { creds: { username: string; password: string } }>(baseUrl, fetchAuth)

    const handleLogin = async ({ username, password, remember }: LoginParams) => {
        setFetchError("")

        try {
            const res = await trigger({ creds: { username, password } })

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