#!/usr/bin/env node

import CourseCopier from '../src/index'
import * as minimist from 'minimist'
import * as inq from 'inquirer'

let args = minimist(process.argv.slice(2));
let sourceDir: string = args._[0];
let destDir: string = args._[1];
let copier = new CourseCopier(sourceDir, destDir);

inq.prompt([
    {
        type: "checkbox",
        name: "courseList",
        message: "Which courses would you like to copy?",
        // todo need to populate this array from the copier / have the copier emit this prompt
        choices: [

            {
                name: "NoSQL",
                value: "111598"
            }
        ]
    }
]).then((answers) => {
    console.log(JSON.stringify(answers, null, '  '));

    answers.courseList.forEach((course: string) => {
        copier.copy(parseInt(course));
    })

    // wait();
})

function wait() {
    if (!copier.isReady()) {
        console.log("Reading database info...");
        setTimeout(wait, 50);
    } else {
        console.log("Done");
        console.log(`there are ${copier.sourceDir.courses.length} source courses:`)
        copier.sourceDir.courses.forEach((course, i) => {
            console.log(`Id: ${course.id}\tTitle: ${course.title}`);
        })
        console.log(`there are ${copier.destDir.courses.length} destination courses:`)
        copier.destDir.courses.forEach((course, i) => {
            console.log(`Id: ${course.id}\tTitle: ${course.title}`);
        })
        copier.copy();
    }
}
