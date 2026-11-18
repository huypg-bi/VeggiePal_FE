import { CornerDownRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Giá trị rỗng/undefined (vd "Tất cả danh mục") cùng được coi là một khóa; số được đổi sang chuỗi.
const EMPTY_KEY = "__empty__";
const toKey = (value) => (value === "" || value == null ? EMPTY_KEY : String(value));

export default function SelectField({
  options,
  value,
  onValueChange,
  placeholder,
  variant = "pill",
  active = false,
  id,
  name,
  disabled,
  onBlur,
  className,
  contentClassName,
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
  align = "start",
}) {
  const items = options.map((option) => ({
    value: toKey(option.value),
    label: option.label,
    icon: option.icon,
    // level: 0 = mục cha (in đậm), 1 = mục con (thụt vào); bỏ trống = mục thường.
    level: option.level,
    description: option.description,
    triggerLabel: option.triggerLabel ?? option.label,
  }));
  const key = toKey(value);
  const selectedKey = items.some((item) => item.value === key) ? key : null;
  const selectedItem = items.find((item) => item.value === selectedKey);
  const SelectedIcon = selectedItem?.icon;
  // Nhãn trên nút: dùng triggerLabel (vd "Món ăn › Việt Nam") nếu option có đặt.
  // Option có description thì ô dạng field hiện thêm mô tả mờ cạnh nhãn (ô pill giữ chỉ nhãn để vừa bề ngang).
  const renderValue = () => {
    if (!selectedItem) return placeholder;
    if (!selectedItem.description || variant === "pill") return selectedItem.triggerLabel;
    return (
      <span className="flex min-w-0 items-baseline gap-2">
        <span className="shrink-0">{selectedItem.triggerLabel}</span>
        <span className="truncate text-xs font-normal text-subtle">{selectedItem.description}</span>
      </span>
    );
  };

  const handleValueChange = (nextKey) => {
    const option = options.find((o) => toKey(o.value) === nextKey);
    if (option) onValueChange?.(option.value);
  };

  return (
    <Select
      id={id}
      name={name}
      disabled={disabled}
      items={items}
      value={selectedKey}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        variant={variant}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        onBlur={onBlur}
        className={
          active ? `border-brand/40 bg-brand-soft text-brand ${className ?? ""}` : className
        }
      >
        {variant === "pill" ? (
          <span className="grid min-w-0 flex-1 text-left">
            <span className="col-start-1 row-start-1 flex items-center gap-2 truncate">
              {SelectedIcon && <SelectedIcon className="size-4 shrink-0" />}
              <SelectValue placeholder={placeholder}>{renderValue}</SelectValue>
            </span>
            {[...items.map((item) => ({ ...item, label: item.triggerLabel })), { label: placeholder, icon: null }].map((item, index) =>
              item.label ? (
                <span
                  key={index}
                  aria-hidden
                  className="invisible col-start-1 row-start-1 flex h-0 items-center gap-2 overflow-hidden font-semibold whitespace-nowrap"
                >
                  {item.icon && <item.icon className="size-4 shrink-0" />}
                  {item.label}
                </span>
              ) : null,
            )}
          </span>
        ) : (
          <span className="flex items-center gap-2 truncate">
            {SelectedIcon && <SelectedIcon className="size-4 shrink-0" />}
            <SelectValue placeholder={placeholder}>{renderValue}</SelectValue>
          </span>
        )}
      </SelectTrigger>
      <SelectContent align={align} className={contentClassName}>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <span className={cn("flex items-center gap-2", item.level >= 1 && "pl-3")}>
              {item.level >= 1 && <CornerDownRight className="size-3.5 text-subtle" />}
              {item.icon && <item.icon className="size-4 shrink-0" />}
              <span className="flex min-w-0 flex-col">
                <span className={cn(item.level === 0 && "font-semibold text-ink")}>{item.label}</span>
                {item.description && <span className="text-xs font-normal text-subtle">{item.description}</span>}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
