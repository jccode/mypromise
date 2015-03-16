
describe("mypromise lib spec", function() {

    it("basic test", function() {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var resolveValue;

        promise.then(function(value) {
            resolveValue = value;
        });
        expect(resolveValue).toBeUndefined();

        deferred.resolve(123);
        expect(resolveValue).toEqual(123);
    });

    it("$q should return a defer object as well", function() {
        var deferred = $q(function(resolve, reject) {
        });

        expect(deferred instanceof Deferred).toBeTruthy();
    });
});
