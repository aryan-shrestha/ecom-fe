'use client';

import * as React from 'react';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutGrid,
  Package,
  Users,
} from 'lucide-react';

// This is sample data.
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Products',
      url: '/dashboard/products',
      icon: Package,
      isActive: true,
      items: [
        {
          title: 'All Products',
          url: '/dashboard/products',
        },
        {
          title: 'Create Product',
          url: '/dashboard/products/new',
        },
      ],
    },
    {
      title: 'Categories',
      url: '/dashboard/categories',
      icon: LayoutGrid,
      isActive: true,
    },
    {
      title: 'Users',
      url: '/dashboard/users',
      icon: Users,
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
