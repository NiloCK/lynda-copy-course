import * as r from 'readline'


class HelloW {
    public static main(): number {
        console.log(process.version);


        console.log("Hello World!");
        console.log("Hello World!");
        console.log("Hello World!");
        let reader = r.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        let name = reader.question("What's your name?", function (resp: string) {
            console.log("Hi " + resp)
        });

        return 0;
    }
}

HelloW.main();