
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

    it("$q should return a Promise object as well", function() {
        var prom = $q(function(resolve, reject) {
        });

        expect(prom instanceof Promise).toBeTruthy();
    });

    it("should support combine multipy promise into one", function() {
        var a, b;
        var pa = $q(function() {
            setTimeout(function() {
                a = 1;
            }, 200);
        });
        var pb = $q(function() {
            setTimeout(function() {
                b = 2;
            }, 100);
        });
        $q.all([pa, pb]).then(function() {
            expect(a).toBe(1);
            expect(b).toBe(2);
        });
    });
});
