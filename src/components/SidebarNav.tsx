"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Tags,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Media", href: "/media", icon: Image },
  { name: "Users", href: "/users", icon: Users },
  { name: "Taxonomies", href: "/taxonomies", icon: Tags },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={classNames(
            pathname === item.href
              ? "bg-gray-900 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white",
            "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
          )}
        >
          <item.icon
            className={classNames(
              pathname === item.href
                ? "text-gray-300"
                : "text-gray-400 group-hover:text-gray-300",
              "mr-3 h-6 w-6 flex-shrink-0"
            )}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
