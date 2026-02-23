'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth';
import { useLogoutAllMutation } from '@/features/auth';


export default function AccountPage() {
  const { user } = useAuth();
  const logoutAllMutation = useLogoutAllMutation();

  const handleLogoutAll = () => {
    if (confirm('Are you sure you want to logout from all devices?')) {
      logoutAllMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="mt-1 text-sm text-gray-600">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">User ID</label>
              <p className="mt-1 text-sm text-gray-600">{user?.id}</p>
            </div>
            {user?.created_at && (
              <div>
                <label className="text-sm font-medium">Member Since</label>
                <p className="mt-1 text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Password</h3>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Sessions</h3>
              <p className="mb-3 text-sm text-gray-600">Logout from all devices and sessions</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogoutAll}
                disabled={logoutAllMutation.isPending}
              >
                {logoutAllMutation.isPending ? 'Logging out...' : 'Logout All Devices'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
