interface String {
    isNullOrWhitespace: () => boolean;
}
String.prototype.isNullOrWhitespace = (function () {
    return function () {
        return this === null || this.match(/^ *$/) !== null;
    };
})();