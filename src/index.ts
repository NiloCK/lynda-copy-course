import * as fs from 'fs'
import * as path from 'path'
import * as sqlite3 from 'sqlite3'
import { ncp } from 'ncp'

export default class LyndaCourseCopier {
    public static main(): number {
        // validate input
        try {
            LyndaCourseCopier.directoryIsALyndaFolder(process.argv[2])
            LyndaCourseCopier.directoryIsALyndaFolder(process.argv[3])
        } catch (err) {
            console.log(err);
            process.abort();
        }

        let sourceDir = process.argv[2];
        let destDir = process.argv[3];

        let sourceDB = new sqlite3.Database(
            path.join(sourceDir, 'db.sqlite'),
            sqlite3.OPEN_READONLY,
            (err: Error) => {
                if (err) console.log(err.message);
            });
        let destDB = new sqlite3.Database(
            path.join(destDir, 'db.sqlite'),
            sqlite3.OPEN_READWRITE,
            (err: Error) => {
                if (err) console.log(err.message)
            })

        let tables: Array<string> = [
            "Author", "Chapter", "Course", "Video"
        ]

        tables.forEach((table) => {
            // console.log(`Copying ${table} table`);

            sourceDB.serialize(() => {
                sourceDB.each(`select * from ${table}`, (error, row) => {
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
                    destDB.run(`insert into ${table} (${columns}) values (${values})`, parameters);
                })
            })
        })

        sourceDir = path.join(sourceDir + "/offline");
        destDir = path.join(destDir + "/offline");

        ncp(sourceDir, destDir, {
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
        let good: boolean = fs.statSync(dir).isDirectory();
        console.log(good);

        fs.exists(path.join(dir, "db.sqlite"), (exists) => {
            good = exists;
        })

        if (!good) {
            throw new Error(`Arg ${dir} is not recogized as a Lynda directory.`)
        }
    }


}

LyndaCourseCopier.main();