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

    databasePath(): string {
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
    public copy(): number {
        // validate input

        let tables: Array<string> = [
            "Author", "Chapter", "Course", "Video"
        ]

        tables.forEach((table) => {
            // console.log(`Copying ${table} table`);

            this.sourceDir.db.serialize(() => {
                this.sourceDir.db.each(`select * from ${table}`, (error, row) => {
                    // console.log(row);
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
                    this.destDir.db.run(`insert into ${table} (${columns}) values (${values})`, parameters);
                })
            })
        })

        let filesSourceDir = path.join(this.sourceDir.dir() + "/offline");
        let filesDestDir = path.join(this.destDir.dir() + "/offline");

        ncp(filesSourceDir, filesDestDir, {
            "clobber": false
        }, (err) => {
            if (err) {
                console.log(err.message);
            }
            console.log("Copying complete.")
        });

        return 0;
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