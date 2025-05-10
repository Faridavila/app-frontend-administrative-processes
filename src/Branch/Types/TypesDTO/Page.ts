import { sortDto } from "./Sort";

export interface PageDto{
    pageNumber: number,
    pageSize: number,
    sort: sortDto,
    unpaged: boolean,
    totalElements: number,
    size: number
}