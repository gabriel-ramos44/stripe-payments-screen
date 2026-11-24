import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { PAGE_SIZES, type PageSize } from "../query";
import styles from "./payments.module.css";

export function PaymentsPagination({
  page,
  pageCount,
  first,
  last,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageCount: number;
  first: number;
  last: number;
  total: number;
  pageSize: PageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;
}) {
  return (
    <nav className={styles.pagination} aria-label="Payments pagination">
      <span role="status">
        Viewing {first}–{last} of {total.toLocaleString("en-US")} results
      </span>
      <div className={styles.paginationControls}>
        <label>
          Rows per page
          <select
            value={pageSize}
            onChange={(event) =>
              onPageSizeChange(Number(event.target.value) as PageSize)
            }
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <span>
          Page {page} of {pageCount}
        </span>
        <Button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft />
          Previous
        </Button>
        <Button
          disabled={page >= pageCount || total === 0}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}
