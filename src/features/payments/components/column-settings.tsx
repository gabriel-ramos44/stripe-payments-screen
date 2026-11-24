"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Settings } from "@/components/ui/stripe-icons";
import { Button, Popover } from "@/components/ui/primitives";
import { columnDefinition, type ColumnId, type ColumnWidths } from "../columns";
import styles from "./payments.module.css";

export function ColumnSettings({
  order,
  widths,
  onMove,
  onResize,
  onReset,
}: {
  order: ColumnId[];
  widths: ColumnWidths;
  onMove: (source: ColumnId, target: ColumnId) => void;
  onResize: (id: ColumnId, width: number) => void;
  onReset: () => void;
}) {
  return (
    <Popover
      label="Edit columns"
      trigger={
        <Button>
          <Settings />
          Edit columns
        </Button>
      }
    >
      <div className={styles.columnSettings}>
        <strong>Edit columns</strong>
        <p className={styles.hint}>
          Drag header grips to reorder, or use the arrows below. Resize with
          sliders or header separators. All required fields stay visible.
        </p>
        {order.map((id, index) => {
          const column = columnDefinition(id);
          return (
            <div className={styles.columnSetting} key={id}>
              <span>{column.label}</span>
              <div>
                <Button
                  variant="ghost"
                  iconOnly
                  disabled={index === 0}
                  aria-label={`Move ${column.label} left`}
                  onClick={() => onMove(id, order[index - 1]!)}
                >
                  <ArrowUp />
                </Button>
                <Button
                  variant="ghost"
                  iconOnly
                  disabled={index === order.length - 1}
                  aria-label={`Move ${column.label} right`}
                  onClick={() => onMove(id, order[index + 1]!)}
                >
                  <ArrowDown />
                </Button>
              </div>
              <label>
                <span className="sr-only">{column.label} width</span>
                <input
                  type="range"
                  min={column.min}
                  max={600}
                  step={5}
                  value={widths[id] ?? column.width}
                  onChange={(event) => onResize(id, Number(event.target.value))}
                />
                <output>{widths[id] ?? column.width}px</output>
              </label>
            </div>
          );
        })}
        <Button onClick={onReset}>Reset columns</Button>
      </div>
    </Popover>
  );
}
