import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const InputField = ({ label, value, buttonLabel, onButtonClick }) => {
  return (
    <>
      <Field orientation="horizontal">
        <FieldLabel className="!flex-none">{label}</FieldLabel>
        <p>{value}</p>
        <Button variant="ghost" onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      </Field>
    </>
  );
};

export default InputField;
