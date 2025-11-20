"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Smartphone } from "lucide-react";
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
import { isValidPhone } from "../../helpers/regexCheck";

const ChangePhone = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [phone, setPhone] = useState("");
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

  const submitPhone = async () => {
    const payload = {
      phone,
      otp,
    };
    if (!phone) {
      toast.error("Vui lòng nhập số điện thoại mới");
      return;
    }
    if (!isValidPhone(phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }
    try {
      await changeProfileData(payload);
      toast.success("Đã đổi số điện thoại thành công !");
      window.location.href = "/profile";
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
        <CardTitle className="text-lg">Thay đổi số điện thoại</CardTitle>
      </CardHeader>
      <hr className="w-[800px] mx-auto 2xl:w-[980px]" />

      <CardContent className="space-y-7">
        <div className="flex items-center gap-10">
          <p>Số điện thoại mới</p>
          <InputGroup className="mt-0">
            <InputGroupInput
              type="tel"
              placeholder="Nhập vào số điện thoại của bạn"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <InputGroupAddon>
              <Smartphone />
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
        <Button variant="secondary" className="ml-3" onClick={submitPhone}>
          Gửi
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChangePhone;
