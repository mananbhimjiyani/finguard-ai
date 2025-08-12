'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Wallet, ClipboardCheck, Settings, Video } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare, tooltip: 'AI Chat' },
  { href: '/portfolio', label: 'Portfolio', icon: Wallet, tooltip: 'Portfolio' },
  { href: '/risk-assessment', label: 'Risk Assessment', icon: ClipboardCheck, tooltip: 'Risk Assessment' },
  { href: '/future-self', label: 'Future Self', icon: Video, tooltip: 'Future Self Visualizer' },
  { href: '/settings', label: 'Settings', icon: Settings, tooltip: 'Settings' },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={item.tooltip}
            >
              <Link href={item.href}>
                <Icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
