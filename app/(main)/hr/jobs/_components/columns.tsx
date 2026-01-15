
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import Link from "next/link";

export type Job = {
    id: number;
    title: string | null;
    status: "draft" | "published" | "archived" | null;
    createdAt: Date | null;
}

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
        if (status === 'published') variant = 'default';
        if (status === 'archived') variant = 'destructive';

        return <Badge variant={variant} className="capitalize">{status}</Badge>;
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/jobs/${job.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/jobs/${job.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
