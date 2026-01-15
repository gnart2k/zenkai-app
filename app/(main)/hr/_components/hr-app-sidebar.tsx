'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Suspense } from 'react';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';
import { CircleIcon } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const navMain = [
    {
      title: 'Dashboard',
      url: '/hr/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Jobs',
      url: '/hr/jobs',
      icon: IconFolder,
    },
    {
      title: 'Candidates',
      url: '/hr/candidates',
      icon: IconUsers,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: IconSettings,
    },
  ];

function UserProfile() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const u = {
    name: user?.name ?? (user?.email ? user.email.split('@')[0] : 'Guest'),
    email: user?.email ?? '',
    avatar: user?.avatar ?? '',
  }

  return <NavUser user={u} />;
}

export function HRAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <CircleIcon className="!size-5" />
                <span className="text-base font-semibold">Zenkai</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain}/>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<div className="h-12 w-full rounded-lg bg-gray-200 animate-pulse" />}>
            <UserProfile />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
