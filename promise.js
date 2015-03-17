
// ---------- $q ----------

function $q(resolver) {
    return new Promise(resolver);
}

$q.defer = function() {
    // to be implement
}

$q.reject = function(reason) {
    // to be implement
}

$q.when = function(value) {
    // to be implement
}

$q.all = function(promises) {
    var args = Array.prototype.slice.call(promises);
    return new Promise(function (resolve, reject) {
        if (args.length === 0) return resolve([]);
        var remaining = args.length;
        function res(i, val) {
            try {
                if (val && (typeof val === 'object' || typeof val === 'function')) {
                    var then = val.then;
                    if (typeof then === 'function') {
                        then.call(val, function (val) { res(i, val) }, reject);
                        return;
                    }
                }
                args[i] = val;
                if (--remaining === 0) {
                    resolve(args);
                }
            } catch (ex) {
                reject(ex);
            }
        }
        for (var i = 0; i < args.length; i++) {
            res(i, args[i]);
        }
    });
}


// ---------- Promise ----------

var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(fn) {
    this.state = PENDING;

    this.value = null;

    this.handlers = [];

    
    function resolve(result) {
        try {
            var then = getThen(result);
            if (then) {
                doResolve(then.bind(result), resolve, reject);
                return;
            }
            this.fulfill(result);
        } catch (e) {
            this.reject(e);
        }
    }

    

    

    

    doResolve(fn, resolve.bind(this), this.reject.bind(this));
}

Promise.prototype = {
    fulfill: function(result) {
        this.state = FULFILLED;
        this.value = result;
        this.handlers.forEach(this.handle.bind(this));
        this.handlers = null;
    }, 

    reject: function(error) {
        this.state = REJECTED;
        this.value = error;
        this.handlers.forEach(this.handle.bind(this));
        this.handlers = null;
    },

    handle: function(handler) {
        if (this.state === PENDING) {
            this.handlers.push(handler);
        } else {
            if (this.state === FULFILLED &&
                typeof handler.onFulfilled === 'function') {
                handler.onFulfilled(this.value);
            }
            if (this.state === REJECTED &&
                typeof handler.onRejected === 'function') {
                handler.onRejected(this.value);
            }
        }
    },

    then: function (successCallback, errorCallback) {
        var self = this;
        return new Promise(function (resolve, reject) {
            return self.done(function (result) {
                if (typeof successCallback === 'function') {
                    try {
                        return resolve(successCallback(result));
                    } catch (ex) {
                        return reject(ex);
                    }
                } else {
                    return resolve(result);
                }
            }, function (error) {
                if (typeof errorCallback === 'function') {
                    try {
                        return resolve(errorCallback(error));
                    } catch (ex) {
                        return reject(ex);
                    }
                } else {
                    return reject(error);
                }
            });
        });
    },

    done: function (onFulfilled, onRejected) {
        var self = this;
        setTimeout(function () {
            self.handle({
                onFulfilled: onFulfilled,
                onRejected: onRejected
            });
        }, 0);
    }
}


function getThen(value) {
    var t = typeof value;
    if (value && (t === 'object' || t === 'function')) {
        var then = value.then;
        if (typeof then === 'function') {
            return then;
        }
    }
    return null;
}


function doResolve(fn, onFulfilled, onRejected) {
    var done = false;
    try {
        fn(function (value) {
            if (done) return;
            done = true;
            onFulfilled(value);
        }, function (reason) {
            if (done) return;
            done = true;
            onRejected(reason);
        })
    } catch (ex) {
        if (done) return;
        done = true;
        onRejected(ex);
    }
}
