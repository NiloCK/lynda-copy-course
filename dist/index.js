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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVksQ0FBQyxXQUFNLFVBRW5CLENBQUMsQ0FGNEI7QUFFN0I7SUFBQTtJQWFBLENBQUM7SUFaaUIsV0FBSSxHQUFsQjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUMzQixLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7WUFDcEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1NBQ3pCLENBQUMsQ0FBQTtRQUNGLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxJQUFJO1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFBO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDTCxhQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7QUFFRCxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMifQ==