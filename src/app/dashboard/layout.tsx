'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  User, 
  Settings, 
  CreditCard, 
  FileText, 
  Menu, 
  X, 
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/Toaster';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-border bg-card">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-xl font-bold">LaunchPad Web</span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-border p-4">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-foreground">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-card">
            <div className="flex h-full flex-col overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-5">
                <span className="text-xl font-bold">LaunchPad Web</span>
                <button
                  type="button"
                  className="-mr-2 rounded-md p-2 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 px-2 py-4">
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-muted'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon
                          className={`mr-4 h-6 w-6 flex-shrink-0 ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex flex-shrink-0 border-t border-border p-4">
                <div className="flex flex-1 items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-foreground">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="ml-auto text-muted-foreground hover:text-foreground"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top navbar */}
        <div className="flex h-16 flex-shrink-0 border-b border-border bg-card">
          <button
            type="button"
            className="border-r border-border px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1"></div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
} 