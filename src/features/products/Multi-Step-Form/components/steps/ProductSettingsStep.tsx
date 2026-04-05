'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CreateProductRequest } from '@/features/products/types/products.types';

const settingsSchema = z.object({
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  sort_order: z.coerce.number().int().nonnegative().optional(),
});

type SettingsFields = z.infer<typeof settingsSchema>;

interface ProductSettingsStepProps {
  defaultValues?: Partial<CreateProductRequest>;
  isPending?: boolean;
  error?: string | null;
  onBack: () => void;
  onNext: (data: SettingsFields) => void;
}

export function ProductSettingsStep({
  defaultValues,
  isPending,
  error,
  onBack,
  onNext,
}: ProductSettingsStepProps) {
  const [tagInput, setTagInput] = useState('');

  const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);

  const form = useForm<SettingsFields>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      tags: defaultValues?.tags ?? [],
      featured: defaultValues?.featured ?? false,
      sort_order: defaultValues?.sort_order ?? 0,
    },
  });

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        const next = [...tags, newTag];
        setTags(next);
        form.setValue('tags', next);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    form.setValue('tags', next);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Settings</CardTitle>
            <CardDescription>Additional product configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Press Enter or comma to add"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        onClick={() => removeTag(tag)}
                        className="cursor-pointer"
                      >
                        {tag}
                        <X className="ml-2 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>Tags for categorization and filtering</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Featured Product</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      disabled={isPending}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Lower numbers appear first</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
                Back
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
