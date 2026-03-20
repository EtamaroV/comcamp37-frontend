"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface SchoolAutocompleteProps {
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    name?: string // เพิ่มเพื่อให้เข้ากับ Hook Form
}

export const SchoolInput = React.forwardRef<HTMLInputElement, SchoolAutocompleteProps>(
    ({ value = "", onChange, placeholder, className, name }, ref) => {
        const [open, setOpen] = React.useState(false)
        const [schools, setSchools] = React.useState<string[]>([])
        const [isLoading, setIsLoading] = React.useState(false)

        const fetchSchools = React.useCallback(async (query: string) => {
            if (!query || query.length < 2) {
                setSchools([])
                return
            }
            setIsLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/util/schools?q=${encodeURIComponent(query)}`)
                const data = await response.json()
                if (Array.isArray(data)) setSchools(data)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }, [])

        React.useEffect(() => {
            const timer = setTimeout(() => {
                if (open) fetchSchools(value)
            }, 300)
            return () => clearTimeout(timer)
        }, [value, open, fetchSchools])

        return (
            <div className="w-full">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <input
                            ref={ref}
                            name={name}
                            type="text"
                            autoComplete="off"
                            className={cn(
                                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                                className
                            )}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => {
                                onChange(e.target.value)
                                setOpen(true)
                            }}
                            onFocus={() => setOpen(true)}
                        />
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-[--radix-popover-trigger-width] p-0"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        align="start"
                    >
                        {!isLoading && (value?.length ?? 0) > 0 && (
                        <Command shouldFilter={false}>
                            <CommandList className="max-h-[250px] overflow-y-auto">
                                <CommandGroup>
                                    {value && !schools.includes(value) && !isLoading && (
                                        <CommandItem value={value} onSelect={() => setOpen(false)} className="px-4 py-3">
                                            <Check className="mr-2 h-4 w-4 opacity-100" />
                                            ใช้ค่าที่พิมพ์: "{value}"
                                        </CommandItem>
                                    )}
                                    {schools.map((school) => (
                                        <CommandItem
                                            className="px-4 py-3"
                                            key={school}
                                            value={school}
                                            onSelect={(currentValue) => {
                                                onChange(currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", value === school ? "opacity-100" : "opacity-0")} />
                                            {school}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                        )}
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)

SchoolInput.displayName = "SchoolInput"