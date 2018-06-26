import * as flag from "./flag"
import * as assert from "assert"


let f = flag.String("flag", "default flag value", " no usage ")
let b = flag.Bool("bo", true, " usage of bo")
let b2 = flag.Bool("bo2", true, " usage of bo2")
let n = flag.Number2("num", 1001, "usage of num")
let fd = flag.String("flag2", "flag2", " no usage")
let client = flag.Bool("client", true, "client")
let server = flag.Bool("server", false, "server")
let dir = flag.String("dir", "/default", "dir")

export function main() {
    flag.Parse("-flag=f", "-num", "1", "-dir", "/home", "-server", "True", "-bo2", "false", "-bo", "0", "--", "-a", "-b", "-c")
    assert(f[0] == "f")
    assert(b[0] == false)
    assert(n[0] == 1)
    assert(fd[0] == "flag2")
    assert(b2[0] == false)
    assert(client[0] == true)
    assert(server[0] == true)
    assert(dir[0] == "/home")

    assert(flag.Args[0] == "-a")
    assert(flag.Args[1] == "-b")
    assert(flag.Args[2] == "-c")

    console.log("done")
}

main()
