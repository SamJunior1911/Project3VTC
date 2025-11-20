"use client";
import React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useDispatch, useSelector } from "react-redux";
import {
  calculateTotal,
  setSelectedCoupon,
  fetchCouponAsync,
} from "@/store/checkoutSlice";

const DiscountCode = ({ control, name }) => {
  const dispatch = useDispatch();
  const { coupon, loading } = useSelector((state) => state.checkout);
  console.log(coupon);

  // ✅ Tự động fetch coupon khi render lần đầu
  React.useEffect(() => {
    dispatch(fetchCouponAsync());
  }, [dispatch]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const [open, setOpen] = React.useState(false);

        React.useEffect(() => {
          const selected = coupon.find((c) => c.coupon_code === value);
          dispatch(setSelectedCoupon(selected || null));
          dispatch(calculateTotal());
        }, [value, coupon, dispatch]);

        const selectedCoupon = coupon.find((c) => c.coupon_code === value);

        if (loading?.coupon) {
          return (
            <Button variant="outline" disabled className="w-[200px]">
              Đang tải mã giảm giá...
            </Button>
          );
        }

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {selectedCoupon
                  ? selectedCoupon.coupon_type === "percent"
                    ? `${selectedCoupon.coupon_code} (${selectedCoupon.coupon_value}%)`
                    : `${selectedCoupon.coupon_code} (${selectedCoupon.coupon_value.toLocaleString()})VND`
                  : "Chọn mã giảm giá"}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Tìm mã giảm giá..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy mã nào.</CommandEmpty>
                  <CommandGroup>
                    {coupon.map((c) => (
                      <CommandItem
                        key={c._id}
                        value={c.coupon_code}
                        onSelect={(currentCode) => {
                          onChange(currentCode === value ? "" : currentCode);
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === c.coupon_code
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {c.coupon_type === "percent"
                          ? ` ${c.coupon_code} ${c.coupon_value}%`
                          : `${c.coupon_code} (${c.coupon_value.toLocaleString()})VND`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};

export default DiscountCode;
