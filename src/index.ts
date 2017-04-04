import * as r from 'readline'
import * as sqlite3 from 'sqlite3'

class HelloW {
    public static main(): number {
        let sourceDB = new sqlite3.Database('db.sqlite', sqlite3.OPEN_READONLY, (err: Error) => {
            console.log(err);
        });

        sourceDB.each("select * from Author", function (err, row) {

            console.log(row);
        })

        return 0;
    }
}

HelloW.main();