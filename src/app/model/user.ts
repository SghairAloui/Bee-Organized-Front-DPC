export interface User {
    userId?: number;
    name?: string;
    userEmail?: string;
    userPassword?: string;
    userCity?: string;
    userRole?: Role[];
    roles?: Role[];
    delete?:boolean;

  }

  
  export interface Role {
    id?: number; 
    name?: string;
  }
  