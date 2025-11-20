import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Badge } from "./ui/badge";
import {
  getDistrictName,
  getProvinceName,
  getWardName,
} from "@/helpers/getSubvn";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { MapPinX } from "lucide-react";

const RenderAddressList = ({
  addresses,
  handleSelectAddress,
  selectedAddress,
}) => {
  if (!addresses || addresses.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPinX />
          </EmptyMedia>
          <EmptyTitle>Không có địa chỉ nào</EmptyTitle>
          <EmptyDescription>
            Bạn chưa có địa chỉ nào,bấm vào nút thêm địa chỉ để bắt đầu thêm địa
            chỉ mới !
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to="/profile/address">
            <Button>Thêm địa chỉ</Button>
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto">
      {addresses.map((addr) => (
        <div
          key={addr._id}
          className={`p-3 border rounded-md cursor-pointer ${
            selectedAddress && addr._id === selectedAddress._id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:bg-gray-50"
          }`}
          onClick={() => handleSelectAddress(addr)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{addr.fullName}</h4>
              <p className="text-gray-600">{addr.phone}</p>
              <p className="text-gray-600">
                {addr.addressDetail}, {getWardName(addr.address.ward)},{" "}
                {getDistrictName(addr.address.district)},{" "}
                {getProvinceName(addr.address.city)}
              </p>
            </div>
            {addr.isDefault && (
              <Badge variant="secondary" className="text-xs">
                Mặc định
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderAddressList;
