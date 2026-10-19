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

/**
 * Dropdown chọn một giá trị, thay cho <select> gốc.
 * options: [{ value, label }]; onValueChange(value) nhận lại đúng `value` gốc (số, chuỗi hay undefined)
 * của option được chọn. Giá trị không khớp option nào thì hiện `placeholder`.
 * variant: "pill" (thanh lọc) | "field" (ô trong form). `id` để <label htmlFor> trỏ tới.
 * `active` tô nhẹ nút khi đang lọc khác mặc định (chỉ dùng với variant pill).
 */
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
  const items = options.map((option) => ({ value: toKey(option.value), label: option.label }));
  const key = toKey(value);
  const selectedKey = items.some((item) => item.value === key) ? key : null;

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
          // Các nhãn ẩn xếp chồng cùng một ô lưới để nút luôn rộng bằng mục dài nhất,
          // nhờ đó menu (rộng đúng bằng nút) và nút không bao giờ lệch nhau.
          <span className="grid min-w-0 flex-1 text-left">
            <SelectValue placeholder={placeholder} className="col-start-1 row-start-1" />
            {[...items.map((item) => item.label), placeholder].map((label, index) =>
              label ? (
                <span
                  key={index}
                  aria-hidden
                  className="invisible col-start-1 row-start-1 h-0 overflow-hidden font-semibold whitespace-nowrap"
                >
                  {label}
                </span>
              ) : null,
            )}
          </span>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent align={align} className={contentClassName}>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
