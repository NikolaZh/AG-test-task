export type ProductsSortOrder = "asc" | "desc";

type BuildProductsUrlParams = {
    baseUrl: string;
    limit: number;
    skip: number;
    q?: string;
    sortBy?: string;
    order?: ProductsSortOrder;
};

export const buildProductsUrl = ({
    baseUrl,
    limit,
    skip,
    q,
    sortBy,
    order,
}: BuildProductsUrlParams): string => {
    const normalizedQuery = q?.trim();
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");

    const url = new URL(
        normalizedQuery ? `${cleanBaseUrl}/search` : cleanBaseUrl
    );

    url.searchParams.set("limit", String(limit));
    url.searchParams.set("skip", String(skip));

    if (normalizedQuery) {
        url.searchParams.set("q", normalizedQuery);
    }

    if (sortBy) {
        url.searchParams.set("sortBy", sortBy);
    }

    if (sortBy && order) {
        url.searchParams.set("order", order);
    }

    return url.toString();
};

export const fetchProducts = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
};