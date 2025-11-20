import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const NameField = ({ fullNameId = "fullName" }) => {
  return (
    <>
      <Field>
        <FieldLabel htmlFor={fullNameId}>Họ và tên</FieldLabel>
        <Input
          id={fullNameId}
          autoComplete="off"
          placeholder="Nhập họ và tên"
        />
      </Field>
    </>
  );
};

export default NameField;
