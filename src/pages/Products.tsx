import { useEffect, useState } from "react";
import useSWR from "swr";
import { RefreshCw, Search, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "../shared/hooks/useDebounce";
import AddProductForm from "../features/AddProductForm/AddProductForm";
import ProductsTable from "../widgets/ProductsTable/ProductsTable";
import Pagination from "../widgets/Pagination/Pagination";
import type { ProductsResponse } from "@/types";
import { buildProductsUrl, fetchProducts } from "../api/products";

const PER_PAGE = 5;

const ProductsPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 700);
    const [sort, setSort] = useState<{ sortBy: string; order: "asc" | "desc" } | undefined>()

    const productsUrl = buildProductsUrl({
        baseUrl: import.meta.env.VITE_PRODUCTS_ENDPOINT,
        limit: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
        q: debouncedSearch,
        sortBy: sort?.sortBy,
        order: sort?.order,
    });

    const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(productsUrl, fetchProducts);

    const sortHandler = (key: string) => {
        setPage(1);
        if (!sort || sort.sortBy !== key) {
            setSort({ sortBy: key, order: "asc" })
            return;
        }
        setSort({ sortBy: key, order: sort.order === "asc" ? "desc" : 'asc' });
    }

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    return (
        <div className="min-h-screen bg-card">
            <div className="mx-auto max-w-7xl p-5">
                <div className="overflow-hidden rounded-md border border-muted bg-white shadow-sm">
                    <div className="flex items-center gap-6 border-b border-zinc-100 px-4 py-7 md:px-6">
                        <div className="min-w-55 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                            Товары
                        </div>

                        <div className="w-full max-w-200">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Найти"
                                    className="h-10 rounded-lg border-muted-foreground bg-muted pl-9 text-sm shadow-none placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-8 bg-card" />

                    <div className="px-4 py-5">
                        <div className="mb-10 flex items-center justify-between gap-4">
                            <h2 className=" text-xl font-semibold tracking-[-0.03em] text-foreground">
                                Все позиции
                            </h2>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-lg border-muted-foreground"
                                    onClick={() => mutate()}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <AddProductForm />
                            </div>
                        </div>

                        <ProductsTable
                            items={data?.products}
                            isLoading={isLoading}
                            error={error}
                            perPage={PER_PAGE}
                            sortHandler={sortHandler}
                            sortBy={sort?.sortBy}
                            sortOrder={sort?.order}
                        />

                        <Pagination
                            page={page}
                            total={data?.total ?? 0}
                            itemsLength={data?.products.length ?? 0}
                            perPage={PER_PAGE}
                            setPage={setPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ProductsPage