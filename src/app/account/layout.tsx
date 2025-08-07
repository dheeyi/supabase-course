import { ReactNode } from 'react';
import Sidebar from '@/components/ui/custom/sidebar';
import { getCurrentUserAccount } from '@/app/login/actions';

export default async function AccountLayout({ children }: {
  children: ReactNode
}) {
  const userData = await getCurrentUserAccount();

  return (
    <div className="flex">
      <Sidebar userData={userData} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
