import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function CategoryFormSkeleton() {
  return (
    <>
      <div className="space-y-6">
        <DialogHeader>
          <DialogTitle>
            <Skeleton className="h-6 w-40" />
          </DialogTitle>
          <DialogDescription>
            <Skeleton className="mt-2 h-4 w-64" />
          </DialogDescription>
        </DialogHeader>

        {/* Name Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        <DialogFooter>
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </DialogFooter>
      </div>
    </>
  );
}
