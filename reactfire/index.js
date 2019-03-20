"use strict";
exports.__esModule = true;
var React = require("react");
var auth_1 = require("rxfire/auth");
var operators_1 = require("rxjs/operators");
function tester() {
    return 'hello world';
}
exports.tester = tester;
function useUser(auth) {
    var _a = React.useState(null), currentUser = _a[0], setUser = _a[1];
    var _b = React.useState(false), isLoading = _b[0], setIsLoading = _b[1];
    var activePromise = React.useRef();
    if (isLoading) {
        throw activePromise.current;
    }
    React.useEffect(function () {
        var observable = auth_1.user(auth);
        activePromise.current = observable.pipe(operators_1.first()).toPromise();
        setIsLoading(true);
        var subscription = observable.subscribe(function (u) {
            setIsLoading(false);
            setUser(u);
        }, function (error) {
            throw new Error(JSON.stringify(error));
        });
        return subscription.unsubscribe;
    }, []);
    return currentUser;
}
exports.useUser = useUser;
