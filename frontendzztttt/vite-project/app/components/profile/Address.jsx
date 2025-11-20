"use client";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddressFormDialog } from "./AddressFormDialog";
import { Badge } from "../ui/badge";
import AlertDialog from "./AlertDialogPopup";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddressCustomerAsync,
  deleteAddressAsync,
  fetchAddressesAsync,
  updateAddressAsync,
} from "@/store/customerSlice";
import { toNameAddress } from "@/helpers/getSubvn";

const Address = () => {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.customer);

  const addressesData = addresses.map((adrr) => ({
    ...adrr,
    address: toNameAddress(adrr.address),
  }));

  React.useEffect(() => {
    const fetchAddresses = async () => {
      try {
        await dispatch(fetchAddressesAsync()).unwrap();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      }
    };
    fetchAddresses();
  }, [dispatch]);

  const handleAddAddress = async (addressData) => {
    try {
      const result = await dispatch(
        addAddressCustomerAsync(addressData)
      ).unwrap();
      toast.success(result.message);
    } catch (error) {
      console.log("Lỗi khi thêm địa chỉ:", error);
      toast.error(error || "Không thể thêm địa chỉ.");
    }
  };

  const handleUpdateAddress = async (address_id, addressData) => {
    try {
      await dispatch(updateAddressAsync({ address_id, addressData })).unwrap();
      toast.success("Cập nhật địa chỉ thành công");
    } catch (error) {
      console.log("Lỗi khi cập nhật địa chỉ:", error);
      toast.error(error || "Không thể cập nhật địa chỉ.");
    }
  };

  const handleDeleteAddress = async (address_id) => {
    try {
      await dispatch(deleteAddressAsync({ address_id })).unwrap();
      toast.success("Xóa địa chỉ thành công");
    } catch (error) {
      console.log("Lỗi khi xóa địa chỉ:", error);
      toast.error(error || "Không thể xóa địa chỉ.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Địa chỉ của tôi</CardTitle>
        <CardAction>
          <AddressFormDialog
            mode="add"
            trigger={<Button variant="outline">+ Thêm địa chỉ mới</Button>}
            title="Thêm địa chỉ"
            description="Thêm địa chỉ của bạn ở đây (dùng thông tin trước sáp nhập)."
            onAdd={handleAddAddress}
          />
        </CardAction>
      </CardHeader>
      <hr className="w-[800px] mx-auto 2xl:w-[980px]" />

      <CardContent className="space-y-7">
        {Array.isArray(addressesData) &&
          addressesData.map((address, idx) => (
            <React.Fragment key={address.id ?? idx}>
              <div key={address.id ?? idx}>
                {/* header */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <span>{address.fullName}</span>
                    <span className="border-l h-6 border-slate-400"></span>
                    <span className="text-gray-500 text-sm">
                      {address.phone ?? "(+84) 198 819 525"}
                    </span>
                  </div>
                  <div>
                    <AddressFormDialog
                      mode="update"
                      title="Cập nhật địa chỉ"
                      description="Thay đổi địa chỉ của bạn ở đây (dùng thông tin trước sáp nhập)."
                      trigger={<Button variant="ghost">Cập nhật</Button>}
                      addressData={address}
                      onUpdate={handleUpdateAddress}
                    />
                    <AlertDialog
                      action={handleDeleteAddress}
                      button={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                        >
                          Xoá
                        </Button>
                      }
                      title="Bạn có chắc muốn xoá địa chỉ này?"
                      description="Hành động này không thể hoàn tác. Địa chỉ sẽ bị xoá vĩnh viễn khỏi hệ thống."
                      onConfirm={() => handleDeleteAddress(address._id)}
                    />
                  </div>
                </div>

                {/* content */}
                <div className="flex">
                  <div className="text-gray-500">
                    <p>{address.street}</p>
                    <p>
                      {address.address.city}, {address.address.district},{" "}
                      {address.address.ward}
                    </p>
                  </div>
                </div>

                {/* footer */}
                <div className="mt-2">
                  {address.isDefault ? (
                    <Badge variant="orangeOutline">Mặc định</Badge>
                  ) : null}
                </div>
              </div>

              {idx < addresses.length - 1 && <hr />}
            </React.Fragment>
          ))}
      </CardContent>
    </Card>
  );
};

export default Address;
