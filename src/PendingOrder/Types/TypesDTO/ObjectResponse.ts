export interface ObjectResponse<T> {
    message: string;
    code: number;
    content?: T; 
}
