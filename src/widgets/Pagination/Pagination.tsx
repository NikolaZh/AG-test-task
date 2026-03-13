import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IPagination {
    page: number;
    total: number;
    itemsLength: number;
    perPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const Pagination = ({ page, total, itemsLength, perPage, setPage }: IPagination) => {
    const totalPages = Math.max(1, Math.ceil(total / perPage));

    const pageNumbers = useMemo(() => {
        const visible = 5;
        const start = Math.max(1, Math.min(page - 2, totalPages - visible + 1));
        const end = Math.min(totalPages, start + visible - 1);

        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }, [page, totalPages]);

    return (
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
                Показано {itemsLength === 0 ? 0 : (page - 1) * perPage + 1}-
                {(page - 1) * perPage + itemsLength} из {total}
            </div>

            <div className="flex items-center gap-1 self-end">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {pageNumbers.map((pageNumber) => (
                    <Button
                        key={pageNumber}
                        variant={pageNumber === page ? "default" : "outline"}
                        size="icon"
                        className={
                            pageNumber === page
                                ? "h-8 w-8 rounded-md primary primary-hover"
                                : "h-8 w-8 rounded-md border-zinc-200 bg-white text-muted-foreground"
                        }
                        onClick={() => setPage(pageNumber)}
                    >
                        {pageNumber}
                    </Button>
                ))}

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default Pagination;