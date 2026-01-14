
'use client';

import Link from 'next/link';
import { PanelLeft, CircleIcon, Search, Briefcase, Users, Calendar, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';
import { signOut } from '@/app/(login)/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>
              {user.email.split(' ').map((n) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.name || user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={handleSignOut} className="w-full">
            <button type="submit" className="flex w-full">
                <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                    Sign out
                </DropdownMenuItem>
            </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
            <SheetTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
            >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                    <CircleIcon className="h-6 w-6 text-orange-500" />
                    <span className="sr-only">Zenkai</span>
                </Link>
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={cn(
                            'flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                            {
                                'bg-muted text-foreground': pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href)),
                            }
                        )}
                    >
                        <link.icon className="h-5 w-5" />
                        {link.name}
                    </Link>
                ))}
            </nav>
            </SheetContent>
        </Sheet>

        <div className="w-full flex-1">
            <form>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
            </div>
            </form>
        </div>
        <UserNav />
    </header>
  );
}
