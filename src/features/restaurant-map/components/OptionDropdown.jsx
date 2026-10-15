import { useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/variants/button-variants";
import { cn } from "@/lib/utils";

/**
 * Nút outline mở menu chọn một giá trị (sắp xếp, bán kính...).
 * options: [{ value, label }]; onSelect(value) nhận lại đúng `value` của mục được bấm.
 */
export default function OptionDropdown({ label, options, value, onSelect }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label={label}
        className={buttonVariants({
          variant: "outline",
          className: "h-9 shadow-sm",
        })}
      >
        {selected.label}
        <ChevronDown
          className={cn(
            "size-4 text-subtle transition-transform",
            open && "rotate-180",
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="rounded-2xl p-1.5">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={
              option.value === value
                ? "bg-brand-soft font-semibold text-brand"
                : undefined
            }
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
