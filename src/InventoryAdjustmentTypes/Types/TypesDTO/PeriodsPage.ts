import { InventoryAdjustmentTypes } from "./../InventoryAdjustmentTypes";
import { PageDto } from "../TypesDTO/Page";

export interface PeriodsPageDto {
  content: InventoryAdjustmentTypes[];
  pageable: PageDto;
  numberOfelements: number;
  totalPages: number;
}
