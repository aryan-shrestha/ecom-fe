"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/store/breadcrumbs";

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs((state) => state.breadcrumbs);

  if (!breadcrumbs.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb) => (
          <BreadcrumbItem key={crumb.title}>
            <BreadcrumbLink href={crumb.url}>{crumb.title}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
