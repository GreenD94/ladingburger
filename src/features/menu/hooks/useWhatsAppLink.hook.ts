import { useState, useEffect } from 'react';
import { getBusinessContact } from '@/features/database/actions/businessContacts/getBusinessContact.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export const useWhatsAppLink = (isOpen: boolean): string => {
  const [whatsappLink, setWhatsappLink] = useState<string>(EMPTY_STRING);

  useEffect(() => {
    if (!isOpen) return;

    const fetchWhatsAppLink = async () => {
      try {
        const contact = await getBusinessContact();
        const hasWhatsAppLink = contact && contact.whatsappLink && contact.whatsappLink !== EMPTY_STRING;
        
        if (hasWhatsAppLink) {
          setWhatsappLink(contact.whatsappLink);
        } else {
          setWhatsappLink(EMPTY_STRING);
        }
      } catch (error) {
        setWhatsappLink(EMPTY_STRING);
      }
    };

    fetchWhatsAppLink();
  }, [isOpen]);

  return whatsappLink;
};

