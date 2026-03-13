export const cleanBaseUrl = (baseUrl: string) => baseUrl.replace(/\/$/, "");


export const fetchAuth = async (url: string, { arg }: { arg: { creds: { username: string; password: string } } }) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_DUMMY_API_TOKEN}`,
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