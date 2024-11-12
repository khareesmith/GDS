import * as React from "react"
import { AlertCircle } from "lucide-react"

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
const baseStyles = "relative w-full rounded-lg border p-4"
const variantStyles = {
    default: "bg-background text-foreground",
    destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
}

return (
    <div
        ref={ref}
        role="alert"
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
    />
)
})
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`text-sm [&_p]:leading-relaxed ${className}`}
        {...props}
    />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }