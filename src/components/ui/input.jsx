import { cn } from "cn"

import { inputVariants } from "@/components/ui/variants/input-variants"

function Input({ className, variant, type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Input }
