export interface Response<Item> {
    data: Item;
}

export interface ResponseList<Item> {
    pagination: {
        limit: number;
        offset: number;
        total: number;
    };
    data: Item[];
}

export interface ResponseError {
    message: string;
}
