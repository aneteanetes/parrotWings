class JQueryPromise {
    constructor(executor) {
        let dfd = $.Deferred();
        function fulfilled(value) {
            let promise = value;
            if (value && promise.then) {
                promise.then(fulfilled, rejected);
            }
            else {
                dfd.resolve(value);
            }
        }
        function rejected(reason) {
            let promise = reason;
            if (reason && promise.then) {
                promise.then(fulfilled, rejected);
            }
            else {
                dfd.reject(reason);
            }
        }
        executor(fulfilled, rejected);
        return dfd.promise();
    }
}
//# sourceMappingURL=jqueryPromise.js.map