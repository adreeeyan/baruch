export class ReaderSettings {
    public _id: string = "unique";
    public _rev: number;
    public fontSize: number = 18;
    public brightness: number = 1;
    public invertColors: boolean = false;
    public horizontalScrolling: boolean = false;

    constructor(init?: Partial<ReaderSettings>) {
        Object.assign(this, init);
    }
}