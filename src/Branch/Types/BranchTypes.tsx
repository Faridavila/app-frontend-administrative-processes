export interface BranchTypes {
  id: number;
  mainBranch: string;
  branchName: string;
  departmentName: string;
  companyName: string;
  municipality: string;
  departmentId: number;
  companyId: number;
  municipalityId: number;
  status: 'ACTIVE' | 'INACTIVE';
}

