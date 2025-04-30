export interface ResultList<Item> {
    pagination: {
        limit: number;
        offset: number;
        total: number;
    };
    data: Item[];
}
