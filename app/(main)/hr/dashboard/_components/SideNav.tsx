
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Briefcase, Users, Calendar, Settings, LogOut, CircleIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useSWR, { mutate } from 'swr';
import { User } from '@/lib/db/schema';
import { Suspense } from 'react';
import { signOut } from '@/lib/features/auth/actions';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const links = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Job Postings', href: '/dashboard/jobs', icon: Briefcase },
  { name: 'Candidates', href: '/dashboard/candidates', icon: Users },
  { name: 'Interviews', href: '/dashboard/interviews', icon: Calendar },
  { name: 'Team Settings', href: '/settings', icon: Settings },
];

function UserNav() {
    const { data: user } = useSWR<User>('/api/user', fetcher);
    const router = useRouter();

    async function handleSignOut() {
    await signOut();
        mutate('/api/user');
        router.push('/');
    }

    if (!user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
                <div className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                    <Avatar className="cursor-pointer size-9">
                        <AvatarImage alt={user.name || ''} />
                        <AvatarFallback>
                            {user.email.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                        <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1 w-56">
                <DropdownMenuItem className="cursor-pointer">
                    <Link href="/settings" className="flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <form action={handleSignOut} className="w-full">
                    <button type="submit" className="flex w-full">
                        <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <CircleIcon className="h-6 w-6 text-orange-500" />
                <span className="">Zenkai</span>
            </Link>
        </div>
        <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {links.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        {
                        'text-primary bg-muted': pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href)),
                        }
                    )}
                    >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                </Link>
                ))}
            </nav>
        </div>
        <div className="mt-auto p-4 border-t">
            <Suspense fallback={<div className="h-12 w-full rounded-lg bg-gray-200 animate-pulse" />}>
                <UserNav />
            </Suspense>
        </div>
    </div>
  );
}
