import * as fs from 'fs'
import * as path from 'path'
import * as sqlite3 from 'sqlite3'
import { ncp } from 'ncp'

let sqliteDB = (databasePath: string, access: number): sqlite3.Database => {
    return new sqlite3.Database(
        databasePath,
        access,
        (err: Error) => {
            if (err) console.log(err.message);
        }
    );
}

let databasePath = (directoryPath: string): string => {
    return path.join(directoryPath, 'db.sqlite');
}

export default class LyndaCourseCopier {
    private sourceDir: string;
    private destDir: string;
    private sourceDB: sqlite3.Database;
    private destDB: sqlite3.Database;

    /**
     *
     * @param sourceDir Directory containing courses to be copied
     * @param destDir Directory to copy courses to
     */
    constructor(sourceDir: string, destDir: string) {
        try {
            LyndaCourseCopier.directoryIsALyndaFolder(sourceDir)
            LyndaCourseCopier.directoryIsALyndaFolder(destDir)
        } catch (err) {
            console.log(err);
            process.abort();
        }

        this.sourceDir = sourceDir;
        this.destDir = destDir;

        this.sourceDB = sqliteDB(
            databasePath(sourceDir),
            sqlite3.OPEN_READONLY
        );
        this.destDB = sqliteDB(
            databasePath(destDir),
            sqlite3.OPEN_READWRITE
        );
    }


    /**
     * Copies all courses from the source directory into the destination directory.
     */
    public copy(): number {
        // validate input

        let tables: Array<string> = [
            "Author", "Chapter", "Course", "Video"
        ]

        tables.forEach((table) => {
            // console.log(`Copying ${table} table`);

            this.sourceDB.serialize(() => {
                this.sourceDB.each(`select * from ${table}`, (error, row) => {
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
                    this.destDB.run(`insert into ${table} (${columns}) values (${values})`, parameters);
                })
            })
        })

        let filesSourceDir = path.join(this.sourceDir + "/offline");
        let filesDestDir = path.join(this.destDir + "/offline");

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