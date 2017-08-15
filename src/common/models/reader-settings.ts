export class ReaderSettings {
    public fontSize: number = 15;
    public brightness: number = 1;
    public invertColors: boolean = false;
    public horizontalScrolling: boolean = false;
    public autoScrollEnabled: boolean = false;
    public autoScrollSpeed: number = 100;

    constructor(init?: Partial<ReaderSettings>) {
        Object.assign(this, init);
    }
}