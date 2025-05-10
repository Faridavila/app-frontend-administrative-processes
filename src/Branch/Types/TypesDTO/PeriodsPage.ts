import { BranchTypes } from "../BranchTypes";
import { PageDto } from "../TypesDTO/Page";

export interface PeriodsPageDto{
    content: BranchTypes[],
    pageable: PageDto,
    numberOfelements: number,
    totalPages:number
}