import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Package } from "lucide-react";

export default function EmptyProductList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package />
        </EmptyMedia>
        <EmptyTitle>No product Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any products yet. Get started by creating
          your first product.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link href="/dashboard/products/new">Create Product</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
