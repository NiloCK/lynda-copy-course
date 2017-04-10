#!/usr/bin/env node

"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var sqlite3 = require("sqlite3");
var ncp_1 = require("ncp");
var Main = (function () {
    function Main() {
    }
    Main.main = function () {
        try {
            Main.directoryIsALyndaFolder(process.argv[2]);
            Main.directoryIsALyndaFolder(process.argv[3]);
        }
        catch (err) {
            console.log(err);
            process.abort();
        }
        var sourceDir = process.argv[2];
        var destDir = process.argv[3];
        var sourceDB = new sqlite3.Database(path.join(sourceDir, 'db.sqlite'), sqlite3.OPEN_READONLY, function (err) {
            if (err)
                console.log(err.message);
        });
        var destDB = new sqlite3.Database(path.join(destDir, 'db.sqlite'), sqlite3.OPEN_READWRITE, function (err) {
            if (err)
                console.log(err.message);
        });
        var tables = [
            "Author", "Chapter", "Course", "Video"
        ];
        tables.forEach(function (table) {
            console.log("Copying " + table + " table");
            sourceDB.serialize(function () {
                sourceDB.each("select * from " + table, function (error, row) {
                    console.log(row);
                    var keys = Object.keys(row);
                    var columns = keys.toString();
                    var parameters = {};
                    var values = '';
                    Object.keys(row).forEach(function (r) {
                        var key = '$' + r;
                        values = Object.keys(row).indexOf(r) === 0 ? key : values.concat(',', key);
                        parameters[key] = row[r];
                    });
                    destDB.run("insert into " + table + " (" + columns + ") values (" + values + ")", parameters);
                });
            });
        });
        sourceDir = path.join(sourceDir + "/offline");
        destDir = path.join(destDir + "/offline");
        ncp_1.ncp(sourceDir, destDir, {
            "clobber": false
        }, function (err) {
            if (err) {
                console.log(err.message);
            }
            console.log("Copying complete.");
        });
        return 0;
    };
    Main.directoryIsALyndaFolder = function (dir) {
        var good = fs.statSync(dir).isDirectory();
        console.log(good);
        fs.exists(path.join(dir, "db.sqlite"), function (exists) {
            good = exists;
        });
        if (!good) {
            throw new Error("Arg " + dir + " is not recogized as a Lynda directory.");
        }
    };
    return Main;
}());
Main.main();
//# sourceMappingURL=index.js.map