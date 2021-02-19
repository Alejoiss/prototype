export class Prototypes {
    static init(): void {
        // tslint:disable-next-line:no-string-literal
        String.prototype['toDate'] = function() {
            if (!this) { return null; }

            if (this.indexOf('/') !== -1) {
                return new Date(this.toString());
            } else if (this.indexOf('-') !== -1) {
                return new Date(this.split('-').reverse().join('/'));
            }

            return null;
        };
    }
}
