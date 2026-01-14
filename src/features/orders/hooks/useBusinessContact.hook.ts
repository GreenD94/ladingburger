import { useState, useEffect } from 'react';
import { BusinessContact } from '@/features/database/types/index.type';
import { getBusinessContact } from '@/features/database/actions/businessContacts/getBusinessContact.action';
import { EMPTY_BUSINESS_CONTACT } from '@/features/database/constants/emptyObjects.constants';

export const useBusinessContact = () => {
  const [businessContact, setBusinessContact] = useState<BusinessContact>(EMPTY_BUSINESS_CONTACT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessContact = async () => {
      try {
        const contact = await getBusinessContact();
        if (contact) {
          setBusinessContact(contact);
        }
      } catch (error) {
        console.error('Error fetching business contact:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessContact();
  }, []);

  return { businessContact, isLoading };
};

