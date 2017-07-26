export class Settings {
    public startupScreen: string;
    public appStorageLocation: string;
    public epubLocation: string;

    constructor(init?: Partial<Settings>) {
        Object.assign(this, init);
    }
}