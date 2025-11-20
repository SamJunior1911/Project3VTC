import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const InputField = ({ label, value, buttonLabel, onButtonClick, href }) => {
  return (
    <>
      <Field orientation="horizontal">
        <FieldLabel className="!flex-none">{label}</FieldLabel>
        <p>{value}</p>
        <Button variant="ghost" onClick={onButtonClick} type="button">
          <Link to={href}>{buttonLabel}</Link>
        </Button>
      </Field>
    </>
  );
};

export default InputField;
