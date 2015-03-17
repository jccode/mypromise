
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
    return new Promise(function (resolve, reject) {
        if (promises.length === 0) return resolve([]);
        var len = promises.length, 
            results = new Array(len);
        function res(i, val) {
            try {
                if (val && (typeof val === 'object' || typeof val === 'function')) {
                    var then = getThen(val);
                    if(then) {
                        then.call(val, function (val) { res(i, val); }, reject);
                        return;
                    }
                }
                results[i] = val;
                if (--len === 0) {
                    resolve(results);
                }
            } catch (ex) {
                reject(ex);
            }
        }
        for (var i = 0; i < promises.length; i++) {
            res(i, promises[i]);
        }
    });
}


// ---------- Promise ----------

var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(fn) {
    this.state = PENDING;
    this.result = null;
    this.handlers = [];

    function resolve(result) {
        try {
            var then = getThen(result);
            if (then) {
                doResolve(then.bind(result), resolve, reject);
                return;
            }
            this._fulfill(result);
        } catch (e) {
            this._reject(e);
        }
    }

    doResolve(fn, resolve.bind(this), this._reject.bind(this));
}

Promise.prototype = {
    _fulfill: function(result) {
        this.state = FULFILLED;
        this.result = result;
        this.handlers.forEach(this._handle.bind(this));
        this.handlers = null;
    }, 

    _reject: function(error) {
        this.state = REJECTED;
        this.result = error;
        this.handlers.forEach(this._handle.bind(this));
        this.handlers = null;
    },

    _handle: function(handler) {
        if (this.state === PENDING) {
            this.handlers.push(handler);
        }
        else if(this.state === FULFILLED) {
            typeof handler.onFulfilled === 'function' && handler.onFulfilled(this.result);
        }
        else if(this.state === REJECTED) {
            typeof handler.onRejected === 'function' && handler.onRejected(this.result);
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
            self._handle({
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
        });
    } catch (ex) {
        if (done) return;
        done = true;
        onRejected(ex);
    }
}
