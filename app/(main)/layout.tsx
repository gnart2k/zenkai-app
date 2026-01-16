'use client';

import Link from 'next/link';
import { use, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CircleIcon, Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';
import { signOut } from '@/lib/features/auth/actions';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { HRAppSidebar } from './hr/_components/hr-app-sidebar';
import { SiteHeader } from '@/components/common/site-header';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <div>
            {children}
      </div>
    </section>
  );
}
