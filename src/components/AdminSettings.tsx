import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Loader2 } from '../lib/icons';
import { toast } from '../lib/toast';
import { getAccessToken } from '../lib/auth';
import { projectId } from '../utils/supabase/info';

export function AdminSettings() {
  const [email, setEmail] = useState('admin@gmail.com');
  const [role, setRole] = useState<'user' | 'admin'>('admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        toast.error('Anda harus login terlebih dahulu');
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/admin/update-role`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, role })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Gagal update role');
        setIsLoading(false);
        return;
      }

      toast.success('Role berhasil diupdate!', {
        description: `${email} sekarang memiliki role: ${role}`,
        duration: 3000,
      });

      console.log('Role update success:', data);
    } catch (error) {
      console.error('Update role error:', error);
      toast.error('Terjadi kesalahan saat update role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          <CardTitle>Admin Role Manager</CardTitle>
        </div>
        <CardDescription>
          Update role untuk user tertentu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateRole} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-email">Email User</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="user@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-role">Role</Label>
            <select
              id="user-role"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              'Update Role'
            )}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Catatan:</strong> Untuk set role admin pertama kali, gunakan email yang sama dengan akun login Anda saat ini.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}