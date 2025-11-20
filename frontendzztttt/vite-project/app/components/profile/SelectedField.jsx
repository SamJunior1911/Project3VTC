import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

const SelectedField = ({
  name,
  control,
  placeholder,
  options,
  error,
  disabled = false,
  rules = {},
}) => {
  return (
    <Field>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                error && "border-red-500",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={disabled}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </Field>
  );
};

export default SelectedField;
