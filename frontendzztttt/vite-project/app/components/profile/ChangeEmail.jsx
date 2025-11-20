"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MailIcon } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  changeProfileData,
  getOTPUpdateProfile,
} from "../../services/customerService";
import { isValidEmail } from "../../helpers/regexCheck";

const ChangeEmail = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    try {
      await getOTPUpdateProfile("/api/customer/send-otp-update");
      toast.success("Đã gửi mã OTP về email cũ,vui lòng kiểm tra");
      setTimeLeft(60);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Có lỗi xảy ra khi gửi OTP");
    }
  };

  const submitEmail = async () => {
    const payload = {
      newEmail: email,
      otp,
    };
    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email mới");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Địa chỉ email không hợp lệ");
      return;
    }
    try {
      const customerResponse = await changeProfileData(payload);
      console.log(customerResponse);
      toast.success("Đã đổi email thành công !");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  React.useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thay đổi địa chỉ email</CardTitle>
      </CardHeader>
      <hr className="w-[800px] mx-auto 2xl:w-[980px]" />

      <CardContent className="space-y-7">
        <div className="flex items-center gap-10">
          <p>Địa chỉ email mới</p>
          <InputGroup className="mt-0">
            <InputGroupInput
              type="email"
              placeholder="Đăng nhập vào địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex items-center gap-5">
          <p className="mr-11">Xác nhận OTP</p>

          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button
            variant="ghost"
            type="button"
            onClick={sendOtp}
            disabled={timeLeft > 0}
          >
            {timeLeft > 0 ? `Gửi lại OTP sau:${timeLeft}s` : "Gửi OTP"}
          </Button>
        </div>
        <Button variant="secondary" className="ml-3" onClick={submitEmail}>
          Gửi
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChangeEmail;
