// PaymentMethods.js
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Controller } from "react-hook-form";
import { paymentMethodsData } from "../../lib/paymentData";

const PaymentMethods = ({ control, name, errors }) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{ required: "Please select a payment method" }}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            className="space-y-3 mt-5"
          >
            {paymentMethodsData.map((method) => (
              <Label
                key={method.id}
                htmlFor={method.id}
                className="flex cursor-pointer rounded-lg border border-gray-300 p-4 peer-checked:border-gray-950"
              >
                <img
                  src={method.image}
                  alt={method.name}
                  className="w-12 object-contain"
                />
                <div className="ml-5 flex-1">
                  <span className="mt-2 text-base font-semibold">
                    {method.name}
                  </span>
                  <p className="text-slate-500 text-sm leading-6">
                    {method.description}
                  </p>
                </div>
                <RadioGroupItem
                  className="h-6 w-6"
                  value={method.id}
                  id={method.id}
                />
              </Label>
            ))}
          </RadioGroup>
        )}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name].message}</p>
      )}
    </>
  );
};

export default PaymentMethods;
