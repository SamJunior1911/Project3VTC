import React, { useRef } from "react";
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
import { days, months, years } from "@/lib/dateData";
import NameField from "./NameField";
import InputField from "./InputField";
import SelectedField from "./selectedField";

const ProfileData = () => {
  const fileInputRef = useRef(null);

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hồ sơ của tôi</CardTitle>
        <CardDescription>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </CardDescription>
      </CardHeader>
      <hr className="w-[900px] mx-auto lg:w-[980px]" />

      <CardContent>
        <div className="flex justify-between gap-2 ">
          <div className="flex-1 px-5">
            <FieldGroup>
              <NameField />
              <InputField
                label="Email"
                value={maskSensitive("tenlinhtinh39@gmail.com")}
                buttonLabel="Thay đổi"
              />
              <InputField
                label="Số điện thoại "
                value={maskSensitive("0358672991")}
                buttonLabel="Thay đổi"
              />

              <Field orientation="horizontal">
                <FieldLabel className="!flex-none">Ngày sinh</FieldLabel>
                <Dialog>
                  <DialogTrigger>
                    {" "}
                    <BadgeInfo className="cursor-pointer size-4" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Ngày sinh chỉ có thể được cập nhật một lần
                      </DialogTitle>
                      <DialogDescription>
                        Bạn chi có thể thay đổi ngày sinh một lần do chính sách
                        của chúng tôi
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
                  <SelectedField placeholder="Ngày" options={days} />
                  <SelectedField placeholder="Tháng" options={months} />
                  <SelectedField placeholder="Năm" options={years} />
                </div>
              </Field>
            </FieldGroup>
            <Button variant="outline" className="pl-5 mt-5">
              Lưu
            </Button>
          </div>
          <div className="border-r h-[250px]"></div>
          <div className="w-sm flex flex-col gap-4 items-center justify-start ">
            <Avatar className="size-25 cursor-pointer" onClick={handleOpenFile}>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button size="lg" variant="outline" onClick={handleOpenFile}>
              Chọn ảnh
            </Button>
            <Input type="file" className="hidden" ref={fileInputRef} />
            <div className="text-gray-500 text-sm">
              <p>Dụng lượng file tối đa 1 MB</p>
              <p>Định dạng:.JPEG, .PNG</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileData;
