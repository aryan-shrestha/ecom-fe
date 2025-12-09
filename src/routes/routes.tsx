import { Route } from "@/core/types/route";
import {
  BarChart2,
  LayoutDashboard,
  Package,
  Percent,
  Settings,
  Truck,
  Users,
} from "lucide-react";

const routes: Route[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "/dashboard" },
      { title: "Activity", url: "/dashboard/activity" },
      { title: "Reports", url: "/dashboard/reports" },
    ],
  },
  {
    title: "Orders",
    url: "/orders",
    icon: Truck,
    isActive: false,
    items: [
      { title: "All Orders", url: "/orders" },
      { title: "Pending", url: "/orders/pending" },
      { title: "Completed", url: "/orders/completed" },
      { title: "Returns", url: "/orders/returns" },
    ],
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
    isActive: false,
    items: [
      { title: "All Products", url: "/products" },
      { title: "Add Product", url: "/products/new" },
      { title: "Categories", url: "/products/categories" },
      { title: "Inventory", url: "/products/inventory" },
    ],
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
    isActive: false,
    items: [
      { title: "All Customers", url: "/customers" },
      { title: "Segments", url: "/customers/segments" },
      { title: "Reviews", url: "/customers/reviews" },
    ],
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart2,
    isActive: false,
    items: [
      { title: "Sales Overview", url: "/analytics/sales" },
      { title: "Product Performance", url: "/analytics/products" },
      { title: "Customer Insights", url: "/analytics/customers" },
    ],
  },
  {
    title: "Discounts",
    url: "/discounts",
    icon: Percent,
    isActive: false,
    items: [
      { title: "All Discounts", url: "/discounts" },
      { title: "Create Discount", url: "/discounts/new" },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    isActive: false,
    items: [
      { title: "Store Settings", url: "/settings/store" },
      { title: "Payment Methods", url: "/settings/payments" },
      { title: "Shipping", url: "/settings/shipping" },
      { title: "Team Members", url: "/settings/team" },
    ],
  },
];

export default routes;
