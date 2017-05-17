
export class Chapter {
    public id: number;
    public number: number;
    public title: string;
    public content: string;
    public isRead: boolean;

    constructor(init?: Partial<Chapter>) {
        Object.assign(this, init);
    }
}
