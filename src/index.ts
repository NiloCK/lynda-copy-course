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

        //        sourceDB.close();

        // console.log(process.version);


        // console.log("Hello World!");
        // console.log("Hello World!");
        // console.log("Hello World!");
        // let reader = r.createInterface({
        //     input: process.stdin,
        //     output: process.stdout
        // })
        // let name = reader.question("What's your name?", function (resp: string) {
        //     console.log("Hi " + resp)
        // });

        return 0;
    }
}

HelloW.main();