
// ---------- $q ----------

function $q(fn) {
    return new Deferred();
}

$q.defer = $q;

// ---------- Deferred ----------

function Deferred() {
    this.promise = new Promise();
}

Deferred.prototype = {
    resolve: function(value) {
        
    }, 

    reject: function(reason) {
        
    }, 

    notify: function(value) {
        
    }
}


// ---------- Promise ----------

function Promise() {
    
}

Promise.prototype = {
    then: function(successCallback, errorCallback, notifyCallback) {
        
    }, 

    catch: function(errorCallback) {
        
    }, 

    finally: function(callback, notifyCallback) {
        
    }
}
