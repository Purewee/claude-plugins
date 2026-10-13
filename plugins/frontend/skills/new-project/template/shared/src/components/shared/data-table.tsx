// #file tables
// #if next
'use client'

// #endif
import {
  type ColumnDef,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  functionalUpdate,
  type PaginationState,
  type RowData,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useId } from 'react'
// #if vite && i18n
import { useTranslation } from 'react-i18next'
// #elif next && i18n
import { useTranslations } from 'next-intl'
// #endif
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const DATA_TABLE_FEATURES = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  columnVisibilityFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

export type DataTableFeatures = typeof DATA_TABLE_FEATURES

export type DataTableColumn<TData extends RowData> = ColumnDef<
  DataTableFeatures,
  TData,
  // biome-ignore lint/suspicious/noExplicitAny: columns of one table hold different value types
  any
>

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  pageSize?: number
  serverPagination?: {
    pageIndex: number
    rowCount: number
    onPageChange: (pageIndex: number) => void
  }
}

const SORT_ICON_CLASS = 'size-3.5 shrink-0'

export function DataTable<TData extends RowData>({
  columns,
  data,
  pageSize = 10,
  serverPagination,
}: DataTableProps<TData>) {
// #if vite && i18n
  const { t } = useTranslation()
// #elif next && i18n
  const t = useTranslations()
// #endif
  const togglesId = useId()
  const table = useTable({
    features: DATA_TABLE_FEATURES,
    columns,
    data,
    initialState: { pagination: { pageIndex: 0, pageSize } },
    ...(serverPagination
      ? {
          manualPagination: true,
          rowCount: serverPagination.rowCount,
          state: {
            pagination: { pageIndex: serverPagination.pageIndex, pageSize },
          },
          onPaginationChange: (
            updater:
              | PaginationState
              | ((old: PaginationState) => PaginationState),
          ) =>
            serverPagination.onPageChange(
              functionalUpdate(updater, {
                pageIndex: serverPagination.pageIndex,
                pageSize,
              }).pageIndex,
            ),
        }
      : {}),
  })

  const hideable = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())
  const { pageIndex } = table.state.pagination
  const pageCount = Math.max(table.getPageCount(), 1)
  const rows = table.getRowModel().rows

  return (
    <div className="flex w-full flex-col gap-4">
      {hideable.length > 0 ? (
        <fieldset className="flex flex-wrap items-center gap-3 text-brand-body-sm text-brand-on-surface-variant{{?theme: dark:text-brand-on-surface-variant-dark}}">
          <legend className="sr-only">{{T:table.columns}}</legend>
          {hideable.map((column) => (
            <label
              key={column.id}
              htmlFor={`${togglesId}-${column.id}`}
              className="flex cursor-pointer items-center gap-1.5"
            >
              <input
                id={`${togglesId}-${column.id}`}
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                className="cursor-pointer"
              />
              {typeof column.columnDef.header === 'string'
                ? column.columnDef.header
                : column.id}
            </label>
          ))}
        </fieldset>
      ) : null}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    scope="col"
                    aria-sort={
                      sorted === 'asc'
                        ? 'ascending'
                        : sorted === 'desc'
                          ? 'descending'
                          : undefined
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1.5 font-semibold"
                      >
                        <table.FlexRender header={header} />
                        {sorted === 'asc' ? (
                          <ArrowUp
                            aria-hidden="true"
                            className={SORT_ICON_CLASS}
                          />
                        ) : sorted === 'desc' ? (
                          <ArrowDown
                            aria-hidden="true"
                            className={SORT_ICON_CLASS}
                          />
                        ) : (
                          <ArrowUpDown
                            aria-hidden="true"
                            className={SORT_ICON_CLASS}
                          />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center text-brand-on-surface-variant{{?theme: dark:text-brand-on-surface-variant-dark}}"
              >
                {{T:table.empty}}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <nav
        aria-label={{TA:table.pagination}}
        className="flex items-center justify-end gap-3 text-brand-body-sm text-brand-on-surface-variant{{?theme: dark:text-brand-on-surface-variant-dark}}"
      >
        <span aria-live="polite">
          {pageIndex + 1} / {pageCount}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {{T:table.previous}}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {{T:table.next}}
        </Button>
      </nav>
    </div>
  )
}
