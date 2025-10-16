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
  { name: "Posts", href: "/manage-posts", icon: FileText },
  { name: "Media", href: "/media", icon: Image },
  { name: "Users", href: "/users", icon: Users },
  { name: "Taxonomies", href: "/taxonomies", icon: Tags },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SidebarNav({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={onItemClick}
          className={classNames(
            pathname === item.href
              ? "bg-accent text-white shadow-lg"
              : "text-textSecondary hover:bg-accent/10 hover:text-accent",
            "group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
          )}
        >
          <item.icon
            className={classNames(
              pathname === item.href
                ? "text-white"
                : "text-textSecondary group-hover:text-accent",
              "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200"
            )}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
