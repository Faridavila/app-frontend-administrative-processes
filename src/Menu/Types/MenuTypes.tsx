export interface MenuTypes {
  id: number;
  name: string;
  description: string;
  shortName: string;
  fatherMenuId: number;
  menuTypeId: {
    id: number;
    description: string;
  };
  status: 'ACTIVE' | 'INACTIVE';
}
