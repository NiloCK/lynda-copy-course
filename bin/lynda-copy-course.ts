#!/usr/bin/env node

import CourseCopier, { Course } from '../src/index'
import * as minimist from 'minimist'
import * as inq from 'inquirer'



let args = minimist(process.argv.slice(2), {
    boolean: "all",
    alias: { "all": "a" }
});


let sourceDir: string = args._[0];
let destDir: string = args._[1];
let copier = new CourseCopier(sourceDir, destDir);

waitForCopierInstantiation();

function waitForCopierInstantiation() {
    if (!copier.isReady()) {
        console.log("Reading database info...");
        setTimeout(waitForCopierInstantiation, 50);
    } else {
        if (args["all"]) { // copy all eligible courses
            copier.copy(0);
        } else { // ask user which courses to copy
            copier.initializeCopyDialogue();
        }
    }
}
