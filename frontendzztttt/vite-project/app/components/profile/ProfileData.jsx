import React, { useEffect, useRef, useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgeInfo } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { maskSensitive } from "@/helpers/maskValue";
import { days, getDay, getMonth, getYear, months, years } from "@/lib/dateData";
import NameField from "./NameField";
import InputField from "./InputField";
import SelectedField from "./selectedField";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCustomerAsync } from "@/store/checkoutSlice";
import { useDispatch } from "react-redux";
import { LoaderCircle } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { patchAvatar } from "@/services/customerService";

function useCustomerData() {
  return useOutletContext();
}

const ProfileData = () => {
  const { customer } = useCustomerData();
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      birthday: { day: "", month: "", year: "" },
      avatar: "",
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        fullName: customer.fullName || "",
        email: customer.email || "",
        phone: customer.phoneNumber || "",
        avatar: customer.avatar || "",
      });

      if (customer.birthDay) {
        setTimeout(() => {
          setValue("birthday.day", getDay(customer.birthDay));
          setValue("birthday.month", getMonth(customer.birthDay));
          setValue("birthday.year", getYear(customer.birthDay));
        }, 0);
      }

      if (customer.avatar) {
        setPreviewUrl(customer.avatar);
      }
    }
  }, [customer, reset]);

  const currentEmail = watch("email");
  const currentPhone = watch("phone");
  const hasBirthday = !!customer?.birthDay;

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
        setUploadError(
          "Định dạng file không hợp lệ. Vui lòng chọn file .JPEG hoặc .PNG."
        );
        return;
      }
      if (file.size > 1048576) {
        setUploadError("Dung lượng file quá lớn. Vui lòng chọn file dưới 1MB.");
        return;
      }
      setUploadError("");

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      setValue("avatar", file);
    }
  };

  useEffect(() => {
    if (uploadError) {
      toast.warning(uploadError);
    }
  }, [uploadError]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setUploadError("");

    const {
      fullName,
      birthday: { day, month, year },
      avatar,
    } = formData;

    const submitFormData = new FormData();

    submitFormData.append("fullName", fullName);

    if (day && month && year) {
      const dateString = `${year}-${String(month)}-${String(day)}`;
      submitFormData.append("birthDay", dateString);
    }

    try {
      await dispatch(createCustomerAsync(submitFormData));
      if (avatar && avatar instanceof File) {
        const avatarData = new FormData();
        avatarData.append("avatar", avatar);

        try {
          await patchAvatar(avatarData);
        } catch (error) {
          console.error("Lỗi khi cập nhật avatar:", error);
          toast.error("Lỗi khi cập nhật avatar");
        }
      }
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      toast.error("Cập nhật hồ sơ thất bại. Vui lòng thử lại sau.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 900);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hồ sơ của tôi</CardTitle>
        <CardDescription>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </CardDescription>
      </CardHeader>
      <hr className="w-[800px] mx-auto 2xl:w-[980px]" />

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between gap-2 ">
            <div className="flex-1 px-5">
              <FieldGroup>
                <NameField
                  register={register}
                  fullNameData="fullName"
                  errors={errors}
                />
                <InputField
                  label="Email"
                  value={maskSensitive(currentEmail)}
                  buttonLabel="Thay đổi"
                  href="/profile/email"
                />

                {currentPhone ? (
                  <InputField
                    label="Số điện thoại"
                    value={maskSensitive(currentPhone)}
                    buttonLabel="Thay đổi"
                    href="/profile/phone"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Chưa có số điện thoại</p>
                    <Button variant="ghost" type="button">
                      <Link to="/profile/phone">Thêm số điện thoại</Link>
                    </Button>
                  </div>
                )}

                <Field orientation="horizontal">
                  <FieldLabel className="!flex-none">Ngày sinh</FieldLabel>
                  <Dialog>
                    <DialogTrigger>
                      <BadgeInfo className="cursor-pointer size-4" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Ngày sinh chỉ có thể được cập nhật một lần
                        </DialogTitle>
                        <DialogDescription>
                          Bạn chi có thể thay đổi ngày sinh một lần do chính
                          sách của chúng tôi
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">OK</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="grid grid-cols-3 gap-4">
                    <SelectedField
                      name="birthday.day"
                      control={control}
                      placeholder="Ngày"
                      options={days}
                      error={errors.birthday?.day}
                      rules={{ required: "Ngày là bắt buộc" }}
                      disabled={hasBirthday}
                    />
                    <SelectedField
                      name="birthday.month"
                      placeholder="Tháng"
                      control={control}
                      options={months}
                      error={errors.birthday?.month}
                      rules={{ required: "Tháng là bắt buộc" }}
                      disabled={hasBirthday}
                    />
                    <SelectedField
                      name="birthday.year"
                      control={control}
                      placeholder="Năm"
                      options={years}
                      error={errors.birthday?.year}
                      rules={{ required: "Năm là bắt buộc" }}
                      disabled={hasBirthday}
                    />
                  </div>
                </Field>
              </FieldGroup>
              <Button
                type="submit"
                variant="outline"
                className="pl-5 mt-5 ease-in-out"
                disabled={isSubmitting}
              >
                {isSubmitting && <LoaderCircle className="animate-spin" />}
                {isSubmitting ? "Đang lưu" : "Lưu"}
              </Button>
            </div>
            <div className="border-r h-[250px]"></div>
            <div className="w-sm md:w-xs flex flex-col gap-4 items-center justify-start ">
              <Avatar
                className="size-25 cursor-pointer"
                onClick={handleOpenFile}
              >
                <AvatarImage
                  src={previewUrl || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleOpenFile}
              >
                Chọn ảnh
              </Button>
              <Input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpeg,.png,.jpg"
              />
              <div className="text-gray-500 text-sm">
                <p>Dụng lượng file tối đa 1 MB</p>
                <p>Định dạng:.JPEG, .PNG</p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileData;
