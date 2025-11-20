import Header from "~/components/user/Header";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Pencil } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { User } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { getCustomerData } from "../services/customerService";
import { LoaderCircle } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";
import { BadgeCheckIcon } from "lucide-react";
import { ClipboardList } from "lucide-react";

const UserProfile = () => {
  const [customerData, setCustomerData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const res = await getCustomerData("api/customer/profile");
        setCustomerData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    fetchCustomerData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center  justify-center bg-slate-100">
        <LoaderCircle className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="container mx-auto flex p-6">
        {/* left side */}
        <aside className="w-64 h-screen flex flex-col items-end pt-6">
          <div className="flex flex-col items-center">
            <div className="flex gap-4">
              <Avatar className="size-12">
                <AvatarImage
                  src={customerData.avatar || "https://github.com/shadcn.png  "}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div>
                <h2 className="font-medium text-sm">
                  {customerData?.fullName ?? ""}
                </h2>

                <div className="flex items-center gap-1 text-gray-500 cursor-pointer">
                  <Pencil className=" size-3" />
                  <Link
                    to="/profile"
                    className="text-sm font-medium capitalize hover:text-gray-700 transition"
                  >
                    sửa hồ sơ
                  </Link>
                </div>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="mt-2 bg-blue-500 text-white dark:bg-blue-600 translate-x-[-35px]"
            >
              <BadgeCheckIcon className="size-3" />{" "}
              {(customerData.isVerified && "Đã xác thực") || "Chưa xác thực"}
            </Badge>
          </div>

          <nav className="mt-10">
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className="flex items-center gap-2">
                  <User /> <span className="capitalize">tài khoản của tôi</span>
                </Link>

                <ul className="pl-10 text-sm mt-2 space-y-3">
                  <li>
                    <NavLink
                      to="/profile"
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "text-nature-600 font-semibold"
                          : "text-gray-600 hover:text-nature-500"
                      }
                    >
                      Hồ sơ
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/profile/address"
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "text-nature-600 font-semibold"
                          : "hover:text-nature-500 text-gray-600"
                      }
                    >
                      Địa chỉ
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/profile/password"
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "text-nature-600 font-semibold"
                          : "hover:text-nature-500 text-gray-600"
                      }
                    >
                      Đổi mật khẩu
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  to="/profile/purchase"
                  className="flex items-center gap-2"
                >
                  <ClipboardList size={20} />{" "}
                  <span className="capitalize">đơn mua</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* main */}
        <div className="w-full lg:w-[70%] lg:mx-auto">
          <Outlet context={{ customer: customerData }} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
