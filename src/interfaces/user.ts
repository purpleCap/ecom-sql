export interface UserAttributes {
    id?: string;
    firstname: string;
    lastname: string;
    mobile: string;
    email: string;
    password?: string,
    role?: string,
    isDeleted?: '0' | '1',
    isBlocked?: '0' | '1',
    refreshToken?: string,
  }