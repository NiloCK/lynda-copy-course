#!/usr/bin/env node

import CourseCopier from '../src/index'
import * as minimist from 'minimist'

let args = minimist(process.argv.slice(2));
let sourceDir: string = args._[0];
let destDir: string = args._[1];
let copier = new CourseCopier(sourceDir, destDir);

function wait() {
    if (!copier.isReady()) {
        console.log("waiting... ???");
        setTimeout(wait, 50);
    } else {
        console.log("Done");
        console.log(`there are ${copier.sourceDir.courses.length} source courses`) // should be 6
        console.log(`there are ${copier.destDir.courses.length} destination courses`) // should be 0
        // copier.copy();
    }
}

wait();


