"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { APPLICATION_STATUSES } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoFilter } from "react-icons/io5";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function FilterStatus({ filterFunc }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Filter by application status"
                    className="w-[200px] justify-between"
                >
                    {value ? (
                        APPLICATION_STATUSES.find((s) => s.value === value)?.label
                    ) : (
                        <div className="flex gap-3 items-center justify-center">
                            <IoFilter />
                            Status
                        </div>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                        <CommandEmpty>No status found.</CommandEmpty>
                        <CommandGroup>
                            {APPLICATION_STATUSES.map((s) => (
                                <CommandItem
                                    key={s.value}
                                    value={s.value}
                                    onSelect={(currentValue) => {
                                        const next = currentValue === value ? "" : currentValue;
                                        setValue(next);
                                        setOpen(false);
                                        filterFunc(next);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === s.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span
                                        className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: s.color }}
                                    />
                                    {s.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
