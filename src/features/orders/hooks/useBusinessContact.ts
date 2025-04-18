import { useState, useEffect } from 'react';
import { BusinessContact } from '@/features/database/types';
import { getBusinessContact } from '@/features/database/actions/businessContacts/getBusinessContact';

export const useBusinessContact = () => {
  const [businessContact, setBusinessContact] = useState<BusinessContact | null>(null);
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