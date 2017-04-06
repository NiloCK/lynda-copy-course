import * as fs from 'fs'
import * as path from 'path'
import * as sqlite3 from 'sqlite3'

class Main {
    public static main(): number {
        // check for src and dest args
        console.log(`Arglength: ${process.argv.length}`);
        process.argv.forEach((value, index) => {
            console.log(`Arg ${index}: ${value}`);
        })



        try {
            directoryIsALyndaFolder(process.argv[2])
            directoryIsALyndaFolder(process.argv[3])
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
            console.log(`Copying ${table} table`);

            sourceDB.each(`select * from ${table}`, (error, row) => {
                console.log(row);
                let sql: string = `insert into ${table} (${objectKeys(row)}) values (\"${objectVals(row)}\")`;
                destDB.run(sql)
            })
        })

        sourceDB.each("select * from Author", function (err, row) {

            // console.log(row);
        })

        function objectVals(obj: object): string {
            let ret = ""

            //let code = "let ret = \"\""
            let code = "ret += obj[\""
            code += Object.getOwnPropertyNames(obj).join('\"]; ret += "\", \""; ret += obj[\"')
            code += "\"];"

            eval(code)

            return ret;
        }

        function objectKeys(obj: Object): string {
            return Object.getOwnPropertyNames(obj).join(', ')
        }

        function jsonToSQL(data: Object): string {
            let ret: string = "";
            let keys = Object.getOwnPropertyNames(data)

            for (var i = 0; i < keys.length - 1; i++) {
                ret += keys[i] + ' = ' + data[keys[i]] + ', ';
            }
            ret += keys[keys.length - 1] + ' = ' + data[keys[keys.length - 1]]

            return ret;
        }

        function directoryIsALyndaFolder(dir: string): void {
            let good: boolean = fs.statSync(dir).isDirectory();
            console.log(good);

            fs.exists(path.join(dir, "db.sqlite"), (exists) => {
                good = exists;
            })

            if (!good) {
                throw new Error(`Arg ${dir} is not recogized as a Lynda directory.`)
            }
        }

        return 0;
    }
}

Main.main();