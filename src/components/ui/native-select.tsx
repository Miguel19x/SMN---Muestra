import * as React from "react"
import { cn } from "@/lib/utils"

export interface NativeSelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    placeholder?: string
}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
    ({ className, children, placeholder, ...props }, ref) => {
        return (
            <select
                className={cn(
                    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground",
                    className
                )}
                ref={ref}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {children}
            </select>
        )
    }
)
NativeSelect.displayName = "NativeSelect"

export { NativeSelect }
