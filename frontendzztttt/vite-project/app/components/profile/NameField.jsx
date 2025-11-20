import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const NameField = ({
  register,
  fullNameData = "fullName",
  fullNameId = "fullName",
  errors,
}) => {
  return (
    <>
      <Field>
        <FieldLabel htmlFor={fullNameId}>Họ và tên</FieldLabel>
        <Input
          id={fullNameId}
          autoComplete="off"
          placeholder="Nhập họ và tên"
          {...register(fullNameData, { required: "Vui lòng nhập họ và tên" })}
        />
        {errors?.[fullNameData] && (
          <p className="text-red-500 text-sm">{errors[fullNameData].message}</p>
        )}
      </Field>
    </>
  );
};

export default NameField;
