export class FilterParams {
    public searchKey: string;
    public searchValue: string;
    public isFull: boolean;

    constructor(init?: Partial<FilterParams>) {
        Object.assign(this, init);
    }
}