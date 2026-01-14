export interface CreateAdmin {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin extends CreateAdmin {
  _id: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

