#!/usr/bin/env node

import CourseCopier, { Course } from '../src/index'
import * as minimist from 'minimist'
import * as inq from 'inquirer'

let args = minimist(process.argv.slice(2));
let sourceDir: string = args._[0];
let destDir: string = args._[1];
let copier = new CourseCopier(sourceDir, destDir);

waitForCopierInstantiation();

function waitForCopierInstantiation() {
    if (!copier.isReady()) {
        console.log("Reading database info...");
        setTimeout(waitForCopierInstantiation, 50);
    } else {

        inq.prompt([
            {
                type: "checkbox",
                name: "courseList",
                message: "The following courses are available for copying. Which would you like to copy?",
                choices: copier.eligibleCoursesChoiceList()
            }
        ]).then((answers) => {
            answers.courseList.forEach((course: Course) => {
                copier.copy(course.id);
            })
        })
    }
}
