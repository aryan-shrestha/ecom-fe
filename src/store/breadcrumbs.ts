import { type Breadcrumb } from "@/core/types/breadcrumb";
import { create } from "zustand/react";

type BreadcrumbsState = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  clearBreadcrumbs: () => void;
  getBreadcrumbs: () => Breadcrumb[];
};

export const useBreadcrumbs = create<BreadcrumbsState>((set, get) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  clearBreadcrumbs: () => set({ breadcrumbs: [] }),
  getBreadcrumbs: () => get().breadcrumbs,
}));
