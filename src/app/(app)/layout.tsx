import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { userProfileData } from '@/lib/data';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInitials = userProfileData.name.split(' ').map(n => n[0]).join('');

  return (
    <SidebarProvider>
      <div className={`${inter.variable} flex min-h-screen font-body`}>
        <Sidebar className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-3 p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="h-6 w-6" />
              </div>
              <span className="text-lg font-semibold">FinGuard AI</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="bg-background/80">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block font-medium">{userProfileData.name}</span>
              <Avatar>
                <AvatarImage src="https://placehold.co/32x32" alt={userProfileData.name} data-ai-hint="user avatar" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
