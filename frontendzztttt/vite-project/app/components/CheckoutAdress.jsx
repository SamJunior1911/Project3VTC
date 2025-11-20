import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RenderAddressList from "./RenderAddressList";
import { toNameAddress } from "../helpers/getSubvn";
import { Link } from "react-router-dom";

const CheckoutAdress = ({
  selectedAddress,
  openDialog,
  setOpenDialog,
  addresses,
  handleSelectAddress,
}) => {
  const { city, district, ward } = toNameAddress(selectedAddress?.address);

  return (
    <div className="flex items-center gap-5">
      {!addresses || addresses.length === 0 ? (
        <>
          <p>Chưa có địa chỉ nào</p>
          <Link to="/profile/address">
            <Button variant="ghost">Thêm địa chỉ</Button>
          </Link>
        </>
      ) : (
        <>
          <h3 className="font-bold">
            {selectedAddress?.fullName} (+84) {selectedAddress?.phone}
          </h3>
          <p>
            {selectedAddress?.addressDetail}, {ward}, {district}, {city}
          </p>
          {selectedAddress?.isDefault && (
            <span className="border border-[#ee4d2d] rounded-[1px] text-[#ee4d2d] text-[12px] px-[5px] py-[2px] capitalize shrink-0">
              Mặc định
            </span>
          )}
        </>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          {addresses && addresses.length > 0 && (
            <Button variant="outline" className="ml-auto">
              Chọn
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>Chọn địa chỉ nhận hàng</DialogTitle>
            <DialogDescription>
              Chọn một trong các địa chỉ dưới đây
            </DialogDescription>
            <RenderAddressList
              addresses={addresses}
              handleSelectAddress={handleSelectAddress}
              selectedAddress={selectedAddress}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutAdress;
