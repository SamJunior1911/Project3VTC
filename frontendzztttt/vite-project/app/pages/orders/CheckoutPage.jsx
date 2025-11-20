import React, { useEffect, useState } from "react";
import Header from "../../components/user/Header";
import OrderSummary from "../../components/order/OrderSummary";
import PaymentDetails from "../../components/order/PaymentDetails";
import PaymentMethods from "../../components/order/PaymentMethods";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import {
  calculateTotal,
  createCustomerAsync,
  createOrderAsync,
  fetchCartAsync,
  fetchCouponAsync,
} from "@/store/checkoutSlice";
import { toast } from "sonner";
import useWebSocket from "@/hooks/useWebsocket";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getCouponData } from "../../services/couponService";
import { fetchAddressesAsync } from "@/store/customerSlice";
import CheckoutAdress from "@/components/CheckoutAdress";

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addresses } = useSelector((state) => state.customer);

  const handleWebSocketMessage = (data) => {
    if (data.redirect_url) {
      setRedirectUrl(data.redirect_url);
    } else if (data.status === "failed") {
      console.error("Payment failed:", data.error);
      toast("Có lỗi khi tạo đơn hàng", {
        description: "Hãy vui lòng thử lại sau",
        action: {
          label: "Ẩn",
        },
      });
      setLoading(false);
    }
  };

  useWebSocket("ws://localhost:9600", handleWebSocketMessage);

  const {
    cart,
    total,
    coupon,
    selectedCoupon,
    loading: { cart: loadingCart }, //cần thêm
  } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (redirectUrl && redirectUrl !== "cod") {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((addr) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else {
        setSelectedAddress(addresses[0]);
      }
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchCouponAsync());
  }, [dispatch]);
  useEffect(() => {
    dispatch(calculateTotal());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAddressesAsync());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setError,
    watch,
    clearErrors,
  } = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: {},
      addressDetail: "",
      discount: "",
      selectedPaymentMethod: "",
    },
  });

  useEffect(() => {
    if (selectedAddress) {
      reset({
        fullName: selectedAddress.fullName || "",
        phoneNumber: selectedAddress.phone || "",
        address: {
          city: selectedAddress.address?.city || "",
          district: selectedAddress.address?.district || "",
          ward: selectedAddress.address?.ward || "",
        },
        addressDetail: selectedAddress.addressDetail || "",
      });
    }
  }, [selectedAddress]);
  const discountValue = watch("discount");
  useEffect(() => {
    if (discountValue) {
      const selected = coupon.find((c) => c.coupon_code === discountValue);
      if (selected && total < selected.coupon_min_spend) {
        setError("discount", {
          type: "manual",
          message: `Đơn hàng cần tối thiểu ${selected.coupon_min_spend.toLocaleString()}đ để dùng mã này`,
        });
      } else {
        clearErrors("discount");
      }
    } else {
      clearErrors("discount");
    }
  }, [discountValue, coupon, total, setError, clearErrors]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const orderPayload = {
        customerToken: localStorage.getItem("token"),
        coupon_id: selectedCoupon?._id || null,
        method: data.selectedPaymentMethod,
        items: cart.map((item) => ({
          product_id: item.product_id,
          name: item.title,
          quantity: item.quantity,
          price: item.total,
        })),
        address: {
          city: data.address.city,
          district: data.address.district,
          ward: data.address.ward,
          addressDetail: data.addressDetail,
        },
      };

      const customerPayload = {
        fullName: data.fullName,
        phone: data.phoneNumber,
        address: {
          city: data.address.city,
          district: data.address.district,
          ward: data.address.ward,
        },
        addressDetail: data.addressDetail,
      };

      const [orderResponse, paymentResponse] = await Promise.all([
        dispatch(createCustomerAsync(customerPayload)),
        dispatch(createOrderAsync(orderPayload)),
      ]);

      if (data.selectedPaymentMethod === "cod") {
        navigate("/order-summary");
      }
    } catch (error) {
      console.error("Error when submitting checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setOpenDialog(false);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Header />
      <div className="flex flex-col sm:px-10 lg:px-20 xl:px-32 ">
        <div className="bg-white p-2 my-5 ">
          <div className="my-5 px-2 space-y-3 ">
            <div className="flex gap-2 items-center text-[#ee4d2d]">
              <MapPin />
              <p className="capitalize text-lg">địa chỉ nhận hàng</p>
            </div>
            <CheckoutAdress
              selectedAddress={selectedAddress}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              addresses={addresses}
              handleSelectAddress={handleSelectAddress}
            />
          </div>
        </div>

        <div className="flex flex-row min-h-screen">
          <div className="w-full lg:w-1/2 bg-white">
            <OrderSummary cart={cart} />
            <div className="px-4">
              <h3 className="mt-8 text-lg font-medium">Shipping Methods</h3>
              <PaymentMethods
                control={control}
                register={register}
                name="selectedPaymentMethod"
                errors={errors}
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 bg-white">
            <PaymentDetails
              register={register}
              control={control}
              errors={errors}
              onSubmit={handleSubmit(onSubmit)}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
