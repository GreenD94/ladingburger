export interface CreateAdmin {
  email: string;
  password: string;
  isEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin extends CreateAdmin {
  _id: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

