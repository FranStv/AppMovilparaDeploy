import axios from 'axios';
import {tesloApi} from '../../config/api/tesloApi';
import {User} from '../../domain/entities/user';
import type {AuthResponse} from '../../infrastructure/interfaces/auth.responses';

const returnUserToken = (data: AuthResponse) => {
  const user: User = {
    id: data.id,
    email: data.email,
    fullName: data.fullName,
    isActive: data.isActive,
    roles: data.roles,
  };

  return {
    user: user,
    token: data.token,
  };
};

export const authLogin = async (email: string, password: string) => {
  console.log('llega al login');
  console.log(email);
  console.log(password);
  email = email.toLowerCase();
  try {
    console.log('entra en auth.ts');
    const {data} = await tesloApi.post<AuthResponse>('/auth/login', {
      email,
      password,
    });    
    return returnUserToken(data);
  } catch (error) {    
    if (error instanceof Error) {      
      console.log(error.message);
    }
    
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    }
    return null;
  }
};

export const authCheckStatus = async () => {
  try {
    const {data} = await tesloApi.get<AuthResponse>('/auth/check-status');
    return returnUserToken(data);
  } catch (error) {
    console.log(error);
    return null;
  }
};
