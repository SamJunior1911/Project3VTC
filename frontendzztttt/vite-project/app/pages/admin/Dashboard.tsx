import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Widgets,
  Settings,
  User,
  ShoppingBag,
  ChartLine,
  Table,
  Bell,
  Mail,
  Calendar,
  ListTodo,
  Gallery,
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

// Mock data
const mockData = {
  earnings: "$3468.96",
  sales: 82,
  walletBalance: "$4,567.53",
  referralEarning: "$1689.53",
  estimateSales: "$2851.53",
  totalEarning: "$52,567.53",
  traffic: [
    { platform: "Facebook", percentage: 34, color: "bg-blue-500" },
    { platform: "Youtube", percentage: 55, color: "bg-orange-500" },
    { platform: "Direct Search", percentage: 11, color: "bg-yellow-500" },
  ],
  revenueStatus: [
    {
      title: "Revenue Status",
      value: "$432",
      change: "+",
      trend: "up",
      color: "bg-blue-50",
    },
    {
      title: "Page View",
      value: "$432",
      change: "+",
      trend: "up",
      color: "bg-yellow-50",
    },
    {
      title: "Bounce Rate",
      value: "$432",
      change: "+",
      trend: "up",
      color: "bg-orange-50",
    },
    {
      title: "Revenue Status",
      value: "$432",
      change: "+",
      trend: "up",
      color: "bg-purple-50",
    },
  ],
  recentActivities: [
    {
      time: "42 Mins Ago",
      type: "Task Updated",
      user: "Nikolai",
      description: "Updated a Task",
    },
    {
      time: "1 day Ago",
      type: "Deal Added",
      user: "Panshi",
      description: "Updated a Task",
    },
    {
      time: "42 Mins Ago",
      type: "Published Article",
      user: "Rasel",
      description: "Published an Article",
    },
    {
      time: "1 day Ago",
      type: "Dock Updated",
      user: "Reshmi",
      description: "Updated a Dock",
    },
    {
      time: "1 day Ago",
      type: "Replied Comment",
      user: "Jenathon",
      description: "Added a Comment",
    },
  ],
  orderStatus: [
    {
      invoice: "12386",
      customer: "Charly Dues",
      from: "Brazil",
      price: "$299",
      status: "Process",
    },
    {
      invoice: "12386",
      customer: "Marko",
      from: "Italy",
      price: "$2642",
      status: "Open",
    },
    {
      invoice: "12386",
      customer: "Deniyel Onak",
      from: "Russia",
      price: "$981",
      status: "On Hold",
    },
    {
      invoice: "12386",
      customer: "Belgiri Bastana",
      from: "Korea",
      price: "$369",
      status: "Process",
    },
    {
      invoice: "12386",
      customer: "Sarti Onuska",
      from: "Japan",
      price: "$1240",
      status: "Open",
    },
  ],
};

// Sidebar component
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Widgets, label: "Widgets" },
    { icon: Settings, label: "UI Elements" },
    { icon: Settings, label: "Advanced UI" },
    { icon: Settings, label: "Form Elements" },
    { icon: Settings, label: "Editors" },
    { icon: ChartLine, label: "Charts" },
    { icon: Table, label: "Tables" },
    { icon: Settings, label: "Popups" },
    { icon: Settings, label: "Notifications" },
    { icon: Settings, label: "Icons" },
    { icon: Settings, label: "Maps" },
    { icon: User, label: "User Pages" },
    { icon: Settings, label: "Error Pages" },
    { icon: Settings, label: "General Pages" },
    { icon: ShoppingBag, label: "E-Commerce" },
    { icon: Mail, label: "E-mail" },
    { icon: Calendar, label: "Calendar" },
    { icon: ListTodo, label: "Todo List" },
    { icon: Gallery, label: "Gallery" },
    { icon: BookOpen, label: "Documentation" },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"} z-50`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          {isOpen && <span className="font-bold text-xl">Lector.</span>}
        </div>
        {isOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-800 rounded"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      <nav className="mt-6 px-4">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-3 rounded-lg mb-2 cursor-pointer transition-colors ${item.active ? "bg-blue-600" : "hover:bg-gray-800"}`}
          >
            <item.icon size={20} />
            {isOpen && <span>{item.label}</span>}
          </div>
        ))}
      </nav>
    </div>
  );
};

// Header component
const Header = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white shadow-md z-40 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Bell size={20} />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Mail size={20} />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src="https://placehold.co/32x32"
            alt="User"
            className="rounded-full"
          />
          <Settings size={20} />
        </div>
      </div>
    </header>
  );
};

// Dashboard card component
const DashboardCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className={`p-4 rounded-lg ${color} shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
        <div className="p-2 bg-white rounded-full">{icon}</div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

// Revenue status card component
const RevenueStatusCard = ({ title, value, change, trend, color }) => {
  return (
    <div className={`p-4 rounded-lg ${color} shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="flex items-center mt-2">
            <p className="text-xl font-bold">{value}</p>
            <div
              className={`ml-2 flex items-center ${trend === "up" ? "text-green-500" : "text-red-500"}`}
            >
              {trend === "up" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="ml-1">{change}</span>
            </div>
          </div>
        </div>
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9M9 9M9 9l6 6M9 9l6-6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Order status table component
const OrderStatusTable = ({ orders }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold">Order Status</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
            Add
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            <Edit size={16} />
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            <Trash2 size={16} />
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            <Eye size={16} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                INVOICE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CUSTOMERS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                FROM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PRICE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.invoice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.from}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      order.status === "Process"
                        ? "bg-red-100 text-red-800"
                        : order.status === "Open"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Showing 1 to 20 of 20 entries
        </span>
        <div className="flex space-x-1">
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            <ChevronLeft size={16} />
          </button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
            1
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            2
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            3
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            4
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            5
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            6
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Recent activities component
const RecentActivities = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type.includes("Task")
                  ? "bg-blue-500"
                  : activity.type.includes("Deal")
                    ? "bg-pink-500"
                    : activity.type.includes("Published")
                      ? "bg-cyan-500"
                      : activity.type.includes("Dock")
                        ? "bg-yellow-500"
                        : "bg-green-500"
              }`}
            >
              <span className="text-white text-xs font-bold">
                {activity.type.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-gray-600">
                    {activity.user} {activity.description}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Traffic chart component
const TrafficChart = ({ traffic }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold mb-4">Traffic</h3>
      <div className="flex justify-center items-center h-48">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full"></div>
            </div>
          </div>
          <div className="absolute inset-0">
            <div className="w-full h-full">
              {traffic.map((item, index) => (
                <div
                  key={index}
                  className={`absolute top-0 left-0 w-full h-full ${item.color}`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((index * 2 * Math.PI) / 3)}% ${50 - 50 * Math.sin((index * 2 * Math.PI) / 3)}%)`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {traffic.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
            <div>
              <p className="font-bold">{item.percentage}%</p>
              <p className="text-xs text-gray-500">{item.platform}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App component
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} />

      <main
        className={`pt-16 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}
      >
        <div className="p-6">
          {/* Dashboard header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Overview of Latest Month</p>
          </div>

          {/* Main dashboard content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left column - Earnings and Sales */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Current Month Earnings
                </h2>
                <div className="flex space-x-4 text-sm">
                  <button className="text-blue-600 border-b-2 border-blue-600 pb-1">
                    DAILY
                  </button>
                  <button className="text-gray-500">WEEKLY</button>
                  <button className="text-gray-500">MONTHLY</button>
                  <button className="text-gray-500">YEARLY</button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-800">
                  {mockData.earnings}
                </p>
                <p className="text-gray-600">Current Month Earnings</p>
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-800">
                  {mockData.sales}
                </p>
                <p className="text-gray-600">Current Month Sales</p>
              </div>

              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-medium">
                Last Month Summary
              </button>

              {/* Line chart placeholder */}
              <div className="mt-6 h-40 bg-gray-100 rounded relative">
                <div className="absolute top-4 left-4 right-4 bottom-4 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 300 100"
                      className="text-gray-400"
                    >
                      <path
                        d="M0,50 C50,20 100,80 150,50 C200,20 250,80 300,50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle cx="150" cy="50" r="4" fill="red" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Traffic */}
            <div className="lg:col-span-1">
              <TrafficChart traffic={mockData.traffic} />
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                title: "Wallet Balance",
                value: mockData.walletBalance,
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                title: "Referral Earning",
                value: mockData.referralEarning,
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 006.364 6.364L12 14l1.318 1.318a4.5 4.5 0 006.364-6.364L12 12l-1.318-1.318a4.5 4.5 0 00-6.364 6.364z"
                    />
                  </svg>
                ),
              },
              {
                title: "Estimate Sales",
                value: mockData.estimateSales,
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8v6h-8v-6z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 13h8v6h-8v-6z"
                    />
                  </svg>
                ),
              },
              {
                title: "Earning",
                value: mockData.totalEarning,
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-pink-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9l4 4m0 0l-4 4m4-4H7m6 6v-6"
                    />
                  </svg>
                ),
              },
            ].map((stat, index) => (
              <DashboardCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color="bg-white"
              />
            ))}
          </div>

          {/* Revenue status cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {mockData.revenueStatus.map((status, index) => (
              <RevenueStatusCard
                key={index}
                title={status.title}
                value={status.value}
                change={status.change}
                trend={status.trend}
                color={status.color}
              />
            ))}
          </div>

          {/* Bottom section with recent activities and order status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivities activities={mockData.recentActivities} />
            <OrderStatusTable orders={mockData.orderStatus} />
          </div>
        </div>
      </main>
    </div>
  );
}
