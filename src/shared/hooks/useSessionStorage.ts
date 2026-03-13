import { useCallback, useState } from "react";

type SetValue<T> = T | ((prev: T) => T);

export function useSessionStorage<T>(key: string, initialValue: T) {
    const readValue = useCallback((): T => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            const item = window.sessionStorage.getItem(key);
            return item !== null ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.error(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    }, [key, initialValue]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue = useCallback(
        (value: SetValue<T>) => {
            try {
                const newValue =
                    value instanceof Function ? value(readValue()) : value;

                setStoredValue(newValue);

                if (typeof window !== "undefined") {
                    window.sessionStorage.setItem(key, JSON.stringify(newValue));
                }
            } catch (error) {
                console.error(`Error setting sessionStorage key "${key}":`, error);
            }
        },
        [key, readValue]
    );

    const removeValue = useCallback(() => {
        try {
            if (typeof window !== "undefined") {
                window.sessionStorage.removeItem(key);
            }
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing sessionStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue] as const;
}