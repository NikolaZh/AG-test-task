import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, MoreHorizontal, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Product } from "@/types";

const LoadingRows = ({ length }: { length: number }) => {
    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <TableRow key={index}>
                    <TableCell className="w-10">
                        <Skeleton className="h-4 w-4 rounded-sm" />
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-7 w-8 rounded-full" />
                            <Skeleton className="h-7 w-7 rounded-full" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}


const priceFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PriceValue = ({ value }: { value: number }) => {
  const parts = priceFormatter.formatToParts(value);

  return (
    <div className="flex w-full items-center justify-center font-medium tabular-nums">
      {parts.map((part, index) => {
        if (part.type === "fraction" || part.type === "decimal") {
          return (
            <span key={`${part.type}-${index}`} className="text-zinc-400">
              {part.value}
            </span>
          );
        }

        return <span key={`${part.type}-${index}`}>{part.value}</span>;
      })}
    </div>
  );
};


const getSortInfo = (isSorted: boolean, order: "asc" | "desc") => {
    if (!isSorted) {
        return null;
    }
    return order === "asc" ? <ArrowDown className="ml-2 h-3.5 w-3.5" /> : <ArrowUp className="ml-2 h-3.5 w-3.5" />
}

const TableHeadWithSort = ({ title, onClick, isSorted, order, className = "" }: { title: string; onClick: () => void, isSorted: boolean, order?: "asc" | "desc", className?: string }) => {
    return (
        <TableHead onClick={onClick} className={cn("min-w-24 text-muted-foreground cursor-pointer", className)}>
            <div className="flex items-center">
                {title} <>{order && getSortInfo(isSorted, order)}</>
            </div>
        </TableHead>
    )
}


interface IProductsTable {
    isLoading: boolean;
    error: Error;
    sortHandler: (key: string) => void;
    perPage: number;
    items?: Product[];
    sortBy?: string;
    sortOrder?: "asc" | "desc";

}


const ProductsTable = ({ isLoading, error, items = [], sortHandler, perPage, sortBy, sortOrder }: IProductsTable) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const onToggleAllVisible = (checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...items.map((item) => item.id)])));
            return;
        }

        setSelectedIds((prev) => prev.filter((id) => !items.some((item) => item.id === id)));
    };

    const onToggleOne = (id: string, checked: boolean) => {
        setSelectedIds((prev) => {
            if (checked) {
                return Array.from(new Set([...prev, id]));
            }

            return prev.filter((itemId) => itemId !== id);
        });
    };

    const allVisibleSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id));

    return (
        <Table>
            <TableHeader>
                <TableRow className={cn("hover:bg-transparent", allVisibleSelected && "border-l-4 border-l-primary")}>
                    <TableHead className="w-10">
                        <Checkbox
                            checked={allVisibleSelected}
                            onCheckedChange={(checked) => onToggleAllVisible(Boolean(checked))}
                            aria-label="Выбрать все товары на странице"
                        />
                    </TableHead>
                    <TableHeadWithSort title="Наименование" onClick={() => sortHandler("title")} isSorted={sortBy === "title"} order={sortOrder} className="min-w-70" />
                    <TableHeadWithSort title="Вендор" onClick={() => sortHandler("brand")} isSorted={sortBy === "brand"} order={sortOrder} />
                    <TableHeadWithSort title="Артикул" onClick={() => sortHandler("sku")} isSorted={sortBy === "sku"} order={sortOrder} />
                    <TableHeadWithSort title="Оценка" onClick={() => sortHandler("rating")} isSorted={sortBy === "rating"} order={sortOrder} />
                    <TableHeadWithSort title="Цена, ₽" onClick={() => sortHandler("price")} isSorted={sortBy === "price"} order={sortOrder} />
                    <TableHead className="w-30" />
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? <LoadingRows length={perPage} /> : null}

                {!isLoading && error ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-28 text-center text-sm text-red-500">
                            Не удалось загрузить товары.
                        </TableCell>
                    </TableRow>
                ) : null}

                {!isLoading && !error && items.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-28 text-center text-sm text-muted-foreground">
                            По вашему запросу ничего не найдено.
                        </TableCell>
                    </TableRow>
                ) : null}

                {!isLoading && !error
                    ? items.map((item) => {
                        const isSelected = selectedIds.includes(item.id);

                        return (
                            <TableRow
                                key={item.id}
                                className={cn(isSelected && "hover:primary-hover-50/40 border-l-4! border-l-primary")}
                            >
                                <TableCell>
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) => onToggleOne(item.id, Boolean(checked))}
                                        aria-label={`Выбрать ${item.title}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <img src={item.images[0]} className="h-10 w-10 rounded-md bg-muted-foreground" />
                                        <div>
                                            <div className="line-clamp-1 text-sm font-semibold text-foreground">
                                                {item.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{item.category}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm font-semibold text-foreground">
                                    {item.brand}
                                </TableCell>
                                <TableCell className="text-sm text-foreground">{item.sku}</TableCell>
                                <TableCell>
                                    <span className={cn("text-sm font-medium", item.rating < 4 && "text-red-500")}>{item.rating.toFixed(1)}</span>/5
                                </TableCell>
                                <TableCell className="text-sm text-foreground">
                                    <PriceValue value={item.price} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            size="icon"
                                            className="h-7 w-10 rounded-full primary hover:primary-hover"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-accent border-muted-foreground border-2"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })
                    : null}
            </TableBody>
        </Table>
    )
}


export default ProductsTable