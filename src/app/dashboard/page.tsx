'use client';

import { useState, useEffect } from 'react';
import { getDisplayName, getWorkspaceName } from '@/lib/auth-redirect';
import { useAuth } from '@/hooks/useAuth';
import { 
  UserPlus, 
  DollarSign, 
  FileText, 
  BarChart3 
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Stats cards data
  const stats = [
    {
      name: 'Total Customers',
      value: '1,234',
      change: '+12%',
      icon: UserPlus,
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-300',
    },
    {
      name: 'Revenue',
      value: '$12,345',
      change: '+23%',
      icon: DollarSign,
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-300',
    },
    {
      name: 'Documents',
      value: '123',
      change: '+18%',
      icon: FileText,
      iconBg: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-300',
    },
    {
      name: 'Active Projects',
      value: '12',
      change: '+2',
      icon: BarChart3,
      iconBg: 'bg-orange-100 dark:bg-orange-900',
      iconColor: 'text-orange-600 dark:text-orange-300',
    },
  ];

  // Recent activity data
  const activities = [
    {
      id: 1,
      title: 'New subscription',
      description: 'You subscribed to the Pro plan',
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'Document uploaded',
      description: 'quarterly-report-q1-2023.pdf was uploaded',
      time: '1 day ago',
    },
    {
      id: 3,
      title: 'Profile updated',
      description: 'You updated your profile information',
      time: '3 days ago',
    },
    {
      id: 4,
      title: 'Account created',
      description: 'Your account was created',
      time: '1 week ago',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {getDisplayName(user)}</h1>
        <p className="mt-1 text-muted-foreground">
          {getWorkspaceName(user)
            ? `${getWorkspaceName(user)} · here is what is happening today.`
            : 'Here is what is happening with your account today.'}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border border-border bg-card px-5 py-6 shadow-sm"
          >
            <div className="flex items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.iconBg}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="ml-2 text-sm font-medium text-green-600">
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Recent Activity</h2>
            </div>
            <div className="divide-y divide-border">
              {activities.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <div className="flex justify-between">
                    <p className="font-medium">{activity.title}</p>
                    <span className="text-sm text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Create New Document
                </button>
                <button className="w-full rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                  Invite Team Member
                </button>
                <button className="w-full rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                  Update Payment Method
                </button>
                <button className="w-full rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 