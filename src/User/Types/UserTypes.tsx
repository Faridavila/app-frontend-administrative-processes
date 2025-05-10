export interface UserTypes {
  id: number;
  name: string;
  login: string;
  password: string;
  email: string;
  rol: {
    id: number;
    name: string;
  };
  position: {
    id: number;
    description: string;
  };
  company: {
    companyid: number;
    companyName: string;
  };
  area: {
    id: number;
    description: string;
  };
  status: 'ACTIVE' | 'INACTIVE';
}
