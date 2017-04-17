#!/usr/bin/env node

import CourseCopier from '../src/index'
import * as minimist from 'minimist'

let args = minimist(process.argv.slice(2));
let sourceDir: string = args._[0];
let destDir: string = args._[1];
let copier = new CourseCopier(sourceDir, destDir);

// copier.copy();
console.log(copier.sourceCourses.length)
console.log(copier.destCourses.length)
