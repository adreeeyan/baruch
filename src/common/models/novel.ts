
export class Novel {
    constructor(
        public id: number,
        public title: string,
        public cover: string,
        public status: string,
        public source: string,
        public datePublished: Date,
        public lastUpdated: Date,
        public chaptersCount:number,
        public synopsis: string,
        public authors: Array<any>) {
    }
}

export class EmptyNovel extends Novel {
    constructor() {
        super(-1, "ttile", "cover", "status", "source", new Date(), new Date(), 0, "synopsis",[]);
    }
}
