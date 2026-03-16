"use client";

import React from "react";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxList,
    ComboboxItem,
} from "@/components/ui/combobox";

interface FormComboboxProps<T> {
    items: T[];
    value: string;
    onValueChange: (value: string | any | null) => void;
    placeholder: string;
    renderItem: (item: T) => React.ReactNode;
    getItemValue: (item: T) => string;
    getItemLabel?: (item: T) => string;
    emptyText?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export function FormCombobox<T>({
    items,
    value,
    onValueChange,
    placeholder,
    renderItem,
    getItemValue,
    getItemLabel,
    emptyText = "No items found.",
    required,
    disabled,
    className,
}: FormComboboxProps<T>) {
    const selectedItem = items.find(item => getItemValue(item) === value);

    return (
        <div className={className}>
            <Combobox
                items={items}
                onValueChange={onValueChange}
                disabled={disabled}
                value={value}
            >
                <ComboboxInput
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    value={selectedItem && getItemLabel ? getItemLabel(selectedItem) : value}
                />
                <ComboboxContent>
                    <ComboboxEmpty>{emptyText}</ComboboxEmpty>
                    <ComboboxList>
                        {(item: T) => (
                            <ComboboxItem
                                key={getItemValue(item)}
                                value={getItemValue(item)}
                            >
                                {renderItem(item)}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}
