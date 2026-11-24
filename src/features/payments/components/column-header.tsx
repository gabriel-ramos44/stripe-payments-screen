"use client";
import { useRef } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from "lucide-react";
import { columnDefinition, type ColumnId } from "../columns";
import type { PaymentSort, SortKey } from "../query";
import styles from "./payments.module.css";
import { Button, Menu, MenuItem } from "@/components/ui/primitives";

export function ColumnHeader({
  id,
  order,
  sort,
  onSort,
  onMove,
  onResize,
  width,
}: {
  id: ColumnId;
  order: ColumnId[];
  sort: PaymentSort;
  onSort: (key: SortKey, direction?: PaymentSort["direction"]) => void;
  onMove: (source: ColumnId, target: ColumnId) => void;
  onResize: (id: ColumnId, width: number) => void;
  width: number;
}) {
  const column = columnDefinition(id);
  const sortKey = "sort" in column ? column.sort : null;
  const active = sortKey === sort.key;
  const sortedGroup = active || (id === "amount" && sort.key === "status");
  const Icon = active
    ? sort.direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;
  const resizing = useRef<{ x: number; width: number } | null>(null);
  return (
    <th
      scope="col"
      data-column={id}
      aria-sort={
        sortKey
          ? sortedGroup
            ? sort.direction === "asc"
              ? "ascending"
              : "descending"
            : "none"
          : undefined
      }
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes("text/column-id"))
          event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        const source = event.dataTransfer.getData("text/column-id");
        if (order.includes(source as ColumnId)) onMove(source as ColumnId, id);
      }}
    >
      <span className={styles.headerContent}>
        {sortKey ? (
          <button
            className={styles.sortButton}
            onClick={() => onSort(sortKey)}
            aria-label={`Sort by ${id === "created" ? "created" : column.label.toLowerCase()} ${active && sort.direction === "asc" ? "descending" : "ascending"}`}
          >
            {column.label}
            <Icon size={12} aria-hidden="true" />
          </button>
        ) : (
          column.label
        )}
        {id === "amount" && (
          <Menu
            label="Status sorting"
            trigger={
              <Button
                variant="ghost"
                iconOnly
                className={styles.statusSort}
                aria-label="Sort by status"
              >
                <ArrowUpDown size={11} aria-hidden="true" />
              </Button>
            }
          >
            <MenuItem onSelect={() => onSort("status", "asc")}>
              Sort by status ascending
            </MenuItem>
            <MenuItem onSelect={() => onSort("status", "desc")}>
              Sort by status descending
            </MenuItem>
          </Menu>
        )}
        <button
          className={styles.dragHandle}
          aria-label={`Reorder ${column.label} column. Use Alt and arrow keys.`}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData("text/column-id", id);
            event.dataTransfer.effectAllowed = "move";
          }}
          onKeyDown={(event) => {
            const index = order.indexOf(id);
            const target =
              event.key === "ArrowLeft"
                ? order[index - 1]
                : event.key === "ArrowRight"
                  ? order[index + 1]
                  : undefined;
            if (
              event.altKey &&
              (event.key === "ArrowLeft" || event.key === "ArrowRight")
            ) {
              event.preventDefault();
              if (target) onMove(id, target);
            }
          }}
        >
          <GripVertical size={11} aria-hidden="true" />
        </button>
      </span>
      <span
        role="separator"
        aria-label={`Resize ${column.label} column`}
        aria-orientation="vertical"
        aria-valuenow={width}
        aria-valuemin={column.min}
        aria-valuemax={600}
        tabIndex={0}
        className={styles.resizeHandle}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          resizing.current = {
            x: event.clientX,
            width:
              event.currentTarget.parentElement!.getBoundingClientRect().width,
          };
        }}
        onPointerMove={(event) => {
          if (resizing.current)
            onResize(
              id,
              resizing.current.width + event.clientX - resizing.current.x,
            );
        }}
        onPointerUp={() => {
          resizing.current = null;
        }}
        onPointerCancel={() => {
          resizing.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            onResize(
              id,
              event.currentTarget.parentElement!.getBoundingClientRect().width +
                (event.key === "ArrowRight" ? 10 : -10),
            );
          }
        }}
      />
    </th>
  );
}
