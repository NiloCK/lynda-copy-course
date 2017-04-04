"use strict";
var r = require('readline');
var HelloW = (function () {
    function HelloW() {
    }
    HelloW.main = function () {
        console.log("Hello World!");
        var reader = r.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        var name = reader.question("What's your name?", function (resp) {
            console.log("Hi " + resp);
        });
        return 0;
    };
    return HelloW;
}());
HelloW.main();
//# sourceMappingURL=index.js.map