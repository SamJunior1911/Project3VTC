import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TicketPercent } from "lucide-react";
import DiscountCode from "./DiscountCode";
import PlaceOrderButton from "./PlaceOrderButton";
import AddressSelector from "./AddressSelector";
import { useSelector } from "react-redux";
import { Checkbox } from "@/components/ui/checkbox";

const PaymentDetails = ({ register, control, errors, onSubmit, loading }) => {
  const { subtotal, discountAmount, total } = useSelector(
    (state) => state.checkout
  );
  return (
    <div className="px-4 pt-8 mt-10  lg:mt-0 h-screen">
      <h2 className="sub-heading">Payment Details</h2>
      <p className="main-heading">
        Complete your order by providing your payment details.
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        {/* email */}
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="fullName">Fullname</Label>
          <Input
            type="text"
            id="fullName"
            placeholder="JoneDoe"
            {...register("fullName", { required: "fullname is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* card holder */}
        <div className="grid w-full items-center gap-3 ">
          <Label htmlFor="phone-number">Phone Number</Label>
          <Input
            type="tel"
            id="phone-number"
            placeholder="Enter your phone number"
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^\d+$/,
                message: "Phone number must contain only numbers",
              },
              minLength: {
                value: 10,
                message: "Phone number is too short",
              },
            })}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* address */}
        <div className="space-y-2">
          <Label htmlFor="">Your address</Label>
          <AddressSelector control={control} name="address" errors={errors} />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* address detail */}
        <div className="grid w-full gap-3">
          <Label htmlFor="addressDetail">Address Detail</Label>
          <Textarea
            placeholder="Type your deail address here."
            id="addressDetail"
            {...register("addressDetail", {
              required: "Address detail is required",
            })}
          />
          {errors.addressDetail && (
            <p className="text-red-500 text-sm">
              {errors.addressDetail.message}
            </p>
          )}
        </div>

        {/* Save Address */}
        <div className="flex items-center gap-3">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Lưu thông tin làm địa chỉ </Label>
        </div>

        {/* discount */}
        <div className="rounded-lg border overflow-hidden p-3 bg-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-300">
                <TicketPercent />
              </div>
              <div>
                <p className="font-medium">Discount code</p>
                <p className="text-sm text-gray-500">Save 20% with code</p>
              </div>
            </div>
            <DiscountCode control={control} name="discount" errors={errors} />
            {errors.discount && (
              <p className="text-red-500 text-sm">{errors.discount.message}</p>
            )}
          </div>
        </div>

        {/* total */}
        <div>
          <div className="border-t border-b py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Subtotal</p>
              <p className="font-semibold text-gray-900">
                {subtotal.toLocaleString()} VND
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Discount</p>
              <p className="font-semibold text-gray-900">
                - {(discountAmount || 0).toLocaleString()} VND
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Total</p>
            <p className="font-semibold text-gray-900">
              {total.toLocaleString()} VND
            </p>
          </div>

          <div className="mt-6 mb-8 text-center pb-2">
            <PlaceOrderButton loading={loading} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentDetails;
