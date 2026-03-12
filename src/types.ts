export interface UserData {
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    gender: string,
    image: string,
    accessToken: string,
    refreshToken: string
}

export type Product = {
    id: string;
    title: string;
    category: string;
    brand: string;
    sku: string;
    rating: number;
    price: number;
    images: string[]
};

export type ProductsResponse = {
    products: Product[];
    total: number;
    page: number;
    perPage: number;
};