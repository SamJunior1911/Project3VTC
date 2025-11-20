import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { changePassword } from "@/services/customerService";
import { LoaderCircle } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    const { newPassword, confirmNewPassword } = data;
    if (newPassword !== confirmNewPassword) {
      setError("confirmNewPassword", {
        type: "manual",
        message: "Mật khẩu xác nhận không khớp",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(data);

      toast.success(
        response?.message || "Mật khẩu đã được thay đổi thành công!"
      );
      reset();
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);

      let errorMessage = "Có lỗi xảy ra khi đổi mật khẩu.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến máy chủ.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);

      if (errorMessage.includes("Mật khẩu cũ không đúng")) {
        setError("oldPassword", { type: "manual", message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Đổi mật khẩu</CardTitle>
        <CardDescription>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </CardDescription>
      </CardHeader>
      <hr className="w-[800px] mx-auto 2xl:w-[980px]" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-7 px-10">
          <div className="w-full max-w-md">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="old-password">Mật khẩu cũ</FieldLabel>
                  <div className="relative">
                    <Input
                      id="old-password"
                      type={showOldPassword ? "text" : "password"}
                      {...register("oldPassword", {
                        required: "Mật khẩu cũ là bắt buộc",
                      })}
                      disabled={loading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showOldPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.oldPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.oldPassword.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Mật khẩu mới</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showNewPassword ? "text" : "password"}
                      {...register("newPassword", {
                        required: "Mật khẩu mới là bắt buộc",
                        minLength: {
                          value: 8,
                          message: "Mật khẩu phải có ít nhất 8 ký tự",
                        },
                        pattern: {
                          value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                          message:
                            "Mật khẩu phải có ít nhất 1 chữ hoa và 1 ký tự đặc biệt (!@#$%^&*)",
                        },
                      })}
                      disabled={loading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Xác nhận mật khẩu mới
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmNewPassword", {
                        required: "Vui lòng xác nhận mật khẩu mới",
                      })}
                      disabled={loading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmNewPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmNewPassword.message}
                    </p>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
            <div className="mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Lưu mật khẩu"}
              </Button>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export default ChangePassword;
