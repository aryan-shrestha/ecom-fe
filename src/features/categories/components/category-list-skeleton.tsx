import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

export default function CategoryListSkeleton() {
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* Title */}
            <Skeleton className="h-6 w-40" />

            {/* Create button */}
            <Skeleton className="h-10 w-36" />
          </div>

          {/* Description */}
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell align="right">
                  <Skeleton className="ml-auto h-4 w-16" />
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {/* Name */}
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">
                    <div className="flex justify-end space-x-2">
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
