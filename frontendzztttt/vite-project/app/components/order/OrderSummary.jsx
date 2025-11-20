import { get } from "@/utils/requestProduct";
import React, { useEffect, useState } from "react";

const OrderSummary = ({ cart: apiCart }) => {
  const [cartNew, setCartNew] = useState([]);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const updatedCart = await Promise.all(
          apiCart.map(async (item) => {
            try {
              const res = await get(`api/assets/${item.product_id}`);
              const path = res.map((asset) => asset.path) || [];
              return { ...item, path };
            } catch (error) {
              console.error("Lỗi khi fetch asset:", error);
              return { ...item, path: [] };
            }
          })
        );
        setCartNew(updatedCart);
      } catch (error) {
        console.error("Lỗi tổng:", error);
      }
    };

    fetchAsset();
  }, [apiCart]);

  return (
    <div className="px-4 pt-8">
      <h2 className="sub-heading">Order Summary</h2>
      <p className="main-heading">
        Check your items. And select a suitable shipping method.
      </p>

      <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
        {cartNew.map((nc) => (
          <div className="flex flex-col bg-white sm:flex-row" key={nc.id}>
            <img
              src={nc.path[0]}
              alt=""
              className="m-2 h-24 w-28 rounded-md border object-cover"
            />
            <div className="flex flex-1 flex-col py-4 px-4">
              <span className="font-semibold">{nc.title}</span>
              <span className="text-gray-600">SL:{nc.quantity}</span>
              <p className="text-lg font-bold">
                {nc.total.toLocaleString()} VND
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;
