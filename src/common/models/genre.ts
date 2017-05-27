export class Genre {
    public id: number;
    public name: string;
    public checked: boolean;

    constructor(init?: Partial<Genre>) {
        Object.assign(this, init);
    }
}