export interface BusinessContact {
  whatsappLink: string;
  instagramLink: string;
  venezuelaPayment: {
    phoneNumber: string;
    bankAccount: string;
    documentNumber: string;
  };
  qrCodeUrl: string;
  createdAt: Date;
  updatedAt: Date;
} 