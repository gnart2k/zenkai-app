'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  FileText,
  Video,
  Briefcase,
  Clock,
  Settings,
} from 'lucide-react';

import { NavMain } from '@/components/common/nav-main';
import { NavUser } from '@/components/common/nav-user';
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

const menuItems = [
  {
    title: 'Dashboard',
    url: '/job-seeker/dashboard',
    icon: Home,
  },
  {
    title: 'My CV',
    url: '/job-seeker/my-cv',
    icon: FileText,
  },
  {
    title: 'Mock Interview',
    url: '/job-seeker/mock-interview',
    icon: Video,
  },
  {
    title: 'Job Market',
    url: '/job-seeker/job-market',
    icon: Briefcase,
  },
  {
    title: 'My Applications',
    url: '/job-seeker/my-applications',
    icon: Clock,
  },
  {
    title: 'Interview History',
    url: '/job-seeker/interview-history',
    icon: Clock,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
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

export function JobSeekerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
              <Link href="/hr/dashboard">
                <CircleIcon className="!size-5" />
                <span className="text-base font-semibold">Zenkai</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems}/>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<div className="h-12 w-full rounded-lg bg-gray-200 animate-pulse" />}>
            <UserProfile />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
