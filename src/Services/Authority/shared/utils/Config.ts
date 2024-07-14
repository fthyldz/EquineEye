export default class Config {
    static get(key: string, defaultValue?: string): string {
        return process.env[key] || defaultValue || "";
    }

    static getNumber(key: string, defaultValue?: number): number {
        return Number(process.env[key]) || defaultValue || 0;
    }
}
