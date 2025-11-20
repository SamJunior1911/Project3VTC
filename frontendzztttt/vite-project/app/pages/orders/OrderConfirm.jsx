import HeaderCheckout from "@/components/HeaderCheckout";
import React, { useEffect, useState } from "react";
import { Hourglass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrderData } from "../../services/orderService.js";
import { get } from "@/utils/requestProduct";
import { Link } from "react-router";
const OrderConfirm = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderSummary = async () => {
      try {
        const res = await getOrderData("api/order/get");
        setOrders(res || []);

        if (res?.order_detail?.length > 0) {
          const updatedOrderDetail = await Promise.all(
            res.order_detail.map(async (item) => {
              console.log(item);
              try {
                const assetRes = await get(`api/assets/${item.product_id}`);
                const path = assetRes.map((asset) => asset.path) || [];
                return { ...item, path };
              } catch (error) {
                console.error("Lỗi khi fetch asset:", error);
                return { ...item, path: [] };
              }
            })
          );

          setOrderDetail(updatedOrderDetail);
        } else {
          setOrderDetail([]);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSummary();
  }, []);

  console.log(orderDetail);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* header */}
      <HeaderCheckout />

      {/* main content */}
      <div className="flex flex-col items-center justify-center gap-3 text-center py-10">
        <Hourglass className="w-12 h-12 " />
        <h1 className="text-3xl font-medium">Thank you for your purchase</h1>
        <p className="text-gray-500 ">
          We've received your order will ship in 5-7 business days. <br /> Your
          order id is{" "}
          <span className="font-semibold text-gray-700">#{orders.id}</span>
        </p>
      </div>

      {/* order summary */}
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl capitalize">order summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orderDetail.map((od) => (
              <div
                key={od.id}
                className="flex items-center border-b pb-4 gap-3"
              >
                <img
                  src={od.image}
                  className="w-20 object-cover"
                  alt={od.name}
                />

                <div className="flex-1">
                  <p className="text-gray-700 text-sm">{od.name}</p>
                  <p className="text-gray-500 text-sm">
                    Số lượng: {od.quantity}
                  </p>
                </div>
                <span>{od.price.toLocaleString()} VND</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between font-bold px-15">
            <span>Total</span>
            <span>{loading ? "" : orders.total.toLocaleString()} VND</span>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-5">
        <Button
          variant="outline"
          size="lg"
          className="border-gray-500 hover:bg-gray-50 cursor-pointer"
        >
          <Link to="/" className="text-gray-700 no-underline">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirm;
