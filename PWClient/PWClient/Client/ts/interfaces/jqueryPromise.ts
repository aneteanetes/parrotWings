class JQueryPromise<T> {
    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
        let dfd = $.Deferred<T>();
        function fulfilled(value?: T | PromiseLike<T>) {
            let promise = <PromiseLike<T>>value;
            if (value && promise.then) {
                promise.then(fulfilled, rejected);
            }
            else {
                dfd.resolve(<T>value);
            }
        }
        function rejected(reason) {
            let promise = <PromiseLike<T>>reason;
            if (reason && promise.then) {
                promise.then(fulfilled, rejected);
            }
            else {
                dfd.reject(<T>reason);
            }
        }
        executor(fulfilled, rejected);
        return dfd.promise();
    }    
} 