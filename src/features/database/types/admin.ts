// Type for creating a new admin
export interface CreateAdmin {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type for an existing admin (includes _id and comparePassword)
export interface Admin extends CreateAdmin {
  _id: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
} 