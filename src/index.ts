import * as fs from 'fs'
import * as path from 'path'
import * as sqlite3 from 'sqlite3'
import { ncp } from 'ncp'

class Course {
    title: string;
    id: number;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }

    toString(): string {
        return this.title;
    }
}

class LyndaDirectory {
    private ready: boolean = false;
    private directory: string;
    db: sqlite3.Database;

    courses: Array<Course>;

    /**
     * Creates an object representation of the lynda course data in a given directory.
     * 
     * @param access the read/write accessibilite from sqlite3:
     *        sqlite3.OPEN_CREATE, ...OPEN_READONLY, ...OPEN_READWRITE
     */
    constructor(directory: string, access: number) {
        try {
            LyndaCourseCopier.directoryIsALyndaFolder(directory);
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
        this.directory = directory;

        this.attachDB(access);
        this.populateCourses();

        if (access === sqlite3.OPEN_READWRITE) {
            this.initializeOutputDirectories();
        }
    }
    private initializeOutputDirectories() {
        try { fs.mkdirSync(path.join(this.directory, "offline")) } catch (e) {
            // console.log(e);
        };
        try { fs.mkdirSync(path.join(this.directory, "offline/", "ldc-dl-courses")) } catch (e) {
            // console.log(e);
        }
    }

    private waitFor(cb: Function = () => { }) {
        cb();
        if (!this.isReady()) {
            setTimeout(this.waitFor(cb), 50);
        }
    }
    private attachDB(access: number) {
        //this.ready = false;

        this.db = new sqlite3.Database(
            this.databasePath(),
            access,
            (err: Error) => {
                if (err) console.log(err.message);
            }
        );

        //this.waitFor();
    }

    public getCoursePath(id: number) {
        return path.join(this.directory, 'offline/ldc-dl-courses/', id.toString());
    }

    private databasePath(): string {
        return path.join(this.directory, 'db.sqlite');
    }

    /**
     * Returns the path of the directory.
     */
    dir(): string {
        return this.directory;
    }

    isReady(): boolean {
        return (this.ready);
    }

    private setReady(val: boolean) {
        this.ready = val;
    }

    populateCourses() {
        this.ready = false;
        this.courses = new Array<Course>();

        this.db.each("select ID, Title from Course",
            (function (err: Error, row: any) {
                if (err) {
                    console.log(err);
                }
                this.courses.push(
                    new Course(
                        row.ID,
                        row.Title
                    )
                )
            }).bind(this),
            this.setReady.bind(this, true)
        )

    }

}

export default class LyndaCourseCopier {

    sourceDir: LyndaDirectory;
    destDir: LyndaDirectory;

    /**
     *
     * @param sourceDir Directory containing courses to be copied
     * @param destDir Directory to copy courses to
     */
    constructor(sourceDir: string, destDir: string) {
        this.sourceDir = new LyndaDirectory(sourceDir, sqlite3.OPEN_READONLY);
        this.destDir = new LyndaDirectory(destDir, sqlite3.OPEN_READWRITE);
    }

    isReady(): boolean {
        return (this.sourceDir.isReady() && this.destDir.isReady());
    }


    /**
     * Copies ALL courses from the source directory into the destination directory.
     */
    public copy(courseID: number = 0): number {
        let ret = 0;

        if (courseID === 0) {
            this.sourceDir.courses.forEach(
                (course, index) => this.copy.bind(this, course.id)()
            )

            return ret;
        }

        let tables: Array<string> = [
            "Author", "Chapter", "Video"
        ]

        tables.forEach((table) => {
            // console.log(`Copying ${table} table`);

            this.sourceDir.db.serialize(() => {
                this.sourceDir.db.each(`select * from ${table} where CourseId = ${courseID}`,
                    (error: Error, row: any) => {
                        this.copyDatabaseRow.bind(this, error, row, table)();
                    })
            })
        })

        this.sourceDir.db.each(`select * from Course where ID = ${courseID}`,
            (error: Error, row: any) => {
                this.copyDatabaseRow.bind(this, error, row, 'Course')();
            }
        )

        try {
            fs.mkdirSync(this.destDir.getCoursePath(courseID));
        } catch (e) {
            console.log(e);
        }

        ncp(this.sourceDir.getCoursePath(courseID),
            this.destDir.getCoursePath(courseID), {
                "clobber": false,
            },
            (err) => {
                if (err) {
                    console.log(`Error copying course ${courseID}: ${err}`);
                } else {
                    console.log(`Finished copying course ${courseID}.`)
                }
            });

        return 0;
    }

    copyDatabaseRow(err: Error, row: any, tableName: string) {
        const keys = Object.keys(row); // ['column1', 'column2']
        const columns = keys.toString(); // 'column1,column2'
        let parameters = {};
        let values = '';

        // Generate values and named parameters
        Object.keys(row).forEach((r) => {
            var key = '$' + r;
            // Generates '$column1,$column2'
            values = Object.keys(row).indexOf(r) === 0 ? key : values.concat(',', key);
            // Generates { $column1: 'foo', $column2: 'bar' }
            parameters[key] = row[r];
        });

        // SQL: insert into OneTable (column1,column2) values ($column1,$column2)
        // Parameters: { $column1: 'foo', $column2: 'bar' }
        this.destDir.db.run(`insert into ${tableName} (${columns}) values (${values})`, parameters);
    }
    static directoryIsALyndaFolder(dir: string): void {
        let isDirectory: boolean;
        let containsSQLiteDB: boolean;

        isDirectory = fs.statSync(dir).isDirectory();
        if (isDirectory) {
            containsSQLiteDB = fs.existsSync(path.join(dir, "db.sqlite"));
        }

        if (!(isDirectory && containsSQLiteDB)) {
            throw new Error(
                `Arg ${dir} is not a Lynda directory.
The input directories should be folders which contain 'db.sqlite'.`)
        }
    }


}