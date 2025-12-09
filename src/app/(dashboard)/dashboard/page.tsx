"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumbs } from "@/store/breadcrumbs";
import React from "react";

const Dashboard = () => {
  const setBreadcrumbs = useBreadcrumbs((state) => state.setBreadcrumbs);

  React.useEffect(() => {
    setBreadcrumbs([{ title: "Dashboard", url: "/dashboard" }]);
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <Skeleton className="h-36 rounded-md" />
      <Skeleton className="h-36 rounded-md" />
      <Skeleton className="h-36 rounded-md" />
      <Skeleton className="h-36 rounded-md" />
    </div>
  );
};

export default Dashboard;
