import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import AddressSelector from "../order/AddressSelector";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { useEffect, useMemo, useState } from "react";
import { toCodeAddress } from "@/helpers/getSubvn";

export function AddressFormDialog({
  mode,
  title,
  description,
  trigger,
  onAdd,
  onUpdate,
  addressData = null,
}) {
  const [openDialog, setOpenDialog] = useState(false);

  const DEFAULT_VALUES = useMemo(
    () => ({
      fullName: "",
      phone: "",
      address: { city: "", district: "", ward: "" },
      addressDetail: "",
      isDefault: false,
    }),
    []
  );
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (openDialog) {
      if (mode === "add") {
        reset(DEFAULT_VALUES);
      } else if (mode === "update" && addressData) {
        const inputAddress = addressData.address;
        const {
          city: cityCode,
          district: districtCode,
          ward: wardCode,
        } = toCodeAddress(inputAddress);
        reset({
          fullName: addressData.fullName || "",
          phone: addressData.phone || "",
          address: { city: cityCode, district: districtCode, ward: wardCode },
          addressDetail: addressData.addressDetail || "",
          isDefault: addressData.isDefault || false,
        });
      }
    }
  }, [openDialog, mode, addressData, reset, DEFAULT_VALUES]);

  const handleFormSubmit = async (data) => {
    const {
      city: cityCode,
      district: districtCode,
      ward: wardCode,
    } = toCodeAddress(data.address);

    const payload = {
      ...data,
      address: {
        city: cityCode,
        district: districtCode,
        ward: wardCode,
      },
    };
    if (mode === "add" && onAdd) {
      await onAdd(payload);
      setOpenDialog(false);
    } else if (mode === "update" && onUpdate) {
      await onUpdate(addressData._id, payload);
      setOpenDialog(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] ">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-5 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  placeholder="Họ và tên"
                  {...register("fullName", {
                    required: "Vui lòng nhập họ tên",
                    pattern: {
                      value: /^[a-zA-ZÀ-Ỹà-ỹ\s]+$/,
                      message: "Họ tên không được chứa ký tự đặc biệt hoặc số",
                    },
                  })}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  placeholder="Số điện thoại"
                  id="phone"
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="">Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã</Label>
              <AddressSelector
                control={control}
                name="address"
                errors={errors}
              />

              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="addressDetail">Địa chỉ cụ thể</Label>
              <Textarea
                placeholder="Địa chỉ cụ thể."
                id="addressDetail"
                className="resize-none"
                {...register("addressDetail", {
                  required: "Địa chỉ cụ thể là bắt buộc",
                })}
              />
              {errors.addressDetail && (
                <p className="text-red-500 text-sm my-2">
                  {errors.addressDetail.message}
                </p>
              )}
            </div>
          </div>

          <FieldGroup className="mt-4">
            <Field orientation="horizontal">
              <Controller
                name="isDefault"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="checkout-7j9-same-as-shipping-wgm"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />

              <FieldLabel
                htmlFor="checkout-7j9-same-as-shipping-wgm"
                className="font-normal"
              >
                Đặt làm địa chỉ mặc định
              </FieldLabel>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                }}
              >
                Trở lại
              </Button>
            </DialogClose>
            <Button type="submit">Hoàn thành</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
