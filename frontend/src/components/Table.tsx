import type { ReactNode } from "react";
import Spinner from "./Spinner";

export interface TableColumn<T> {
    key: keyof T | string;
    title: string;
    className?: string;
    render?: (row: T) => ReactNode;
}

interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
}

export default function Table<T>({
    columns,
    data,
    loading = false,
    emptyMessage = "No records found.",
}: TableProps<T>) {
    return (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="min-w-full">
                <thead className="bg-[var(--color-background)]">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className={`border-b border-[var(--color-border)] px-4 py-3 text-left text-sm font-semibold text-[var(--color-text)] ${column.className ?? ""}`}
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-8 text-center text-[var(--color-text-secondary)]"
                            >
                                <Spinner/>Loading...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-8 text-center text-[var(--color-text-secondary)]"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr
                                key={index}
                                className="border-b border-[var(--color-border)] hover:bg-[var(--color-background)]"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={String(column.key)}
                                        className={`px-4 py-3 text-sm text-[var(--color-text)] ${column.className ?? ""}`}
                                    >
                                        {column.render
                                            ? column.render(row)
                                            : String(
                                                  row[column.key as keyof T] ?? ""
                                              )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}