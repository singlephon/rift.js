
export default class DataUtils {
    static extractData(payload) {
        let value = this.isSynthetic(payload) ? payload[0] : payload;
        let meta = this.isSynthetic(payload) ? payload[1] : void 0;
        if (this.isObjecty(value)) {
            Object.entries(value).forEach(([key, iValue]) => {
                value[key] = this.extractData(iValue);
            });
        }
        return value;
    }

    static isSynthetic(subject) {
        return Array.isArray(subject) && subject.length === 2 && typeof subject[1] === "object" && Object.keys(subject[1]).includes("s");
    }

    static isObjecty(subject) {
        return typeof subject === "object" && subject !== null;
    }
}
