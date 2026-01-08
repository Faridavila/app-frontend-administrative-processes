export interface TerminalTypes {
  id: number;
  name: string;
  numerationId: number;
  prefix: string;
  initialNumber: number;
  finalNumber: number;
  users: UserList[];
  numberUser: number;
  status: string;
}


export interface UserList {
  userId: number;
  userName: string;
}

