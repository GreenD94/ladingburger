/**
 * WhatsApp utility functions for generating links and message templates
 * Cost-effective solution using wa.me links instead of API
 */

export interface MessageTemplate {
  id: string;
  label: string;
  generate: (orderId: string, customerName?: string) => string;
}

/**
 * Generate WhatsApp link with pre-filled message
 */
export const generateWhatsAppLink = (
  phone: string,
  message: string
): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Generate business WhatsApp link (uses business WhatsApp number from config)
 */
export const generateBusinessWhatsAppLink = (
  businessWhatsAppLink: string,
  message: string
): string => {
  // Extract phone from business link or use as-is
  const encodedMessage = encodeURIComponent(message);
  if (businessWhatsAppLink.includes('wa.me/')) {
    return `${businessWhatsAppLink}?text=${encodedMessage}`;
  }
  // If it's just a phone number
  const cleanPhone = businessWhatsAppLink.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Message templates for common scenarios
 */
export const messageTemplates: MessageTemplate[] = [
  {
    id: 'orderConfirmed',
    label: 'Confirmar Pedido',
    generate: (orderId: string, customerName?: string) => {
      const greeting = customerName ? `Hola ${customerName}!` : 'Hola!';
      return `${greeting} Confirmamos tu pedido #${orderId.slice(-6)}. Está en preparación. Te avisaremos cuando esté listo.`;
    },
  },
  {
    id: 'orderReady',
    label: 'Pedido Listo',
    generate: (orderId: string, customerName?: string) => {
      const greeting = customerName ? `Hola ${customerName}!` : 'Hola!';
      return `${greeting} Tu pedido #${orderId.slice(-6)} está listo para recoger!`;
    },
  },
  {
    id: 'paymentConfirmed',
    label: 'Confirmar Pago',
    generate: (orderId: string, customerName?: string) => {
      const greeting = customerName ? `Hola ${customerName}!` : 'Hola!';
      return `${greeting} Confirmamos el pago de tu pedido #${orderId.slice(-6)}. Gracias por tu compra!`;
    },
  },
  {
    id: 'paymentPending',
    label: 'Recordar Pago',
    generate: (orderId: string, customerName?: string) => {
      const greeting = customerName ? `Hola ${customerName}!` : 'Hola!';
      return `${greeting} Recordatorio: Tu pedido #${orderId.slice(-6)} está esperando confirmación de pago. Por favor envía el comprobante.`;
    },
  },
  {
    id: 'orderInTransit',
    label: 'Pedido en Camino',
    generate: (orderId: string, customerName?: string) => {
      const greeting = customerName ? `Hola ${customerName}!` : 'Hola!';
      return `${greeting} Tu pedido #${orderId.slice(-6)} está en camino. Llegará pronto!`;
    },
  },
  {
    id: 'orderIssue',
    label: 'Problema con Pedido',
    generate: (orderId: string, customerName?: string) => {
      const greeting = customerName ? `Hola ${customerName}!` : 'Hola!';
      return `${greeting} Hemos detectado un problema con tu pedido #${orderId.slice(-6)}. Por favor contáctanos para resolverlo.`;
    },
  },
];

/**
 * Get message template by ID
 */
export const getMessageTemplate = (templateId: string): MessageTemplate | undefined => {
  return messageTemplates.find(t => t.id === templateId);
};

/**
 * Generate WhatsApp link for customer
 */
export const generateCustomerWhatsAppLink = (
  phone: string,
  templateId: string,
  orderId: string,
  customerName?: string
): string | null => {
  if (!phone) return null;
  
  const template = getMessageTemplate(templateId);
  if (!template) return null;
  
  const message = template.generate(orderId, customerName);
  return generateWhatsAppLink(phone, message);
};

/**
 * Generate business WhatsApp link with message
 */
export const generateBusinessWhatsAppLinkWithMessage = (
  businessWhatsAppLink: string,
  templateId: string,
  orderId: string,
  customerName?: string
): string | null => {
  if (!businessWhatsAppLink) return null;
  
  const template = getMessageTemplate(templateId);
  if (!template) return null;
  
  const message = template.generate(orderId, customerName);
  return generateBusinessWhatsAppLink(businessWhatsAppLink, message);
};

