import { CategoryTypes } from "../CategoryTypes";
import { PageDto } from "../TypesDTO/Page";

export interface PeriodsPageDto{
    content: CategoryTypes[],
    pageable: PageDto,
    numberOfelements: number,
    totalPages:number
}