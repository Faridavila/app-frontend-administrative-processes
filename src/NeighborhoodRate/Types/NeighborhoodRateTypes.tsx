export interface NeighborhoodRateTypes {
  id: number;
  departmentId: number;
  departmentName: string;
  cityId: number;
  cityName: string;
  neighborhood: string;
  rate: number;
  status: string;
}


export interface GeneralRate {
  cityId: number;
  departmentId: number;
  rate: number;
  typeOperation: string;
}
