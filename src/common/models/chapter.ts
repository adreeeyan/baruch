import * as moment from "moment";

export class Chapter {
    public id: number;
    public number: number;
    public title: string;
    public content: string;
    public isRead: boolean;
    public lastUpdated: Date;

    constructor(init?: Partial<Chapter>) {
        Object.assign(this, init);
    }

    get lastUpdatedText() {
        return this.lastUpdated != null ? moment(this.lastUpdated).fromNow() : "";
    }
}
