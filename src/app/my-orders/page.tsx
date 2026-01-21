import { redirect } from 'next/navigation';
import { checkUserSession, getCurrentUserData } from '@/features/menu/actions/userAuth.action';
import { MyOrdersContainer } from '@/features/menu/containers/MyOrdersContainer.container';

export default async function MyOrdersPage() {
  const isAuthenticated = await checkUserSession();
  
  if (!isAuthenticated) {
    redirect('/menu');
  }

  const user = await getCurrentUserData();

  return <MyOrdersContainer user={user} />;
}

