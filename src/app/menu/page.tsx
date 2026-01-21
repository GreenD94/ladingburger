import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { checkUserSession } from '@/features/menu/actions/userAuth.action';
import { getCurrentUserData } from '@/features/menu/actions/userAuth.action';
import { hasActiveOrder } from '@/features/menu/actions/orderCheck.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { MenuContainer } from '@/features/menu/containers/Menu.container';

export default async function MenuPage() {
  const isLoggedIn = await checkUserSession();
  
  if (isLoggedIn) {
    const user = await getCurrentUserData();
    const hasPhoneNumber = user.phoneNumber !== EMPTY_STRING;
    
    if (hasPhoneNumber) {
      const hasActive = await hasActiveOrder(user.phoneNumber);
      
      if (hasActive) {
        redirect('/my-orders');
      }
    }
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuContainer />
    </Suspense>
  );
}
