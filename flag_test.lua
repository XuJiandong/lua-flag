
local flag = require("flag")

local f = flag.String("flag", "default flag value", " no usage ")
local b = flag.Bool("bo", true, " usage of bo")
local b2 = flag.Bool("bo2", true, " usage of bo2")
local n = flag.Number("num", 1001, "usage of num")
local fd = flag.String("flag2", "flag2", " no usage")
local client = flag.Bool("client", true, "client")
local server = flag.Bool("server", false, "server")
local dir = flag.String("dir", "/default", "dir")

local function main()
    flag.Parse("-flag=f", "-num", "1", "-dir", "/home", "-server", "True", "-bo2", "false", "-bo", "0", "--", "-a", "-b", "-c")
    assert(f[1] == "f")
    assert(b[1] == false)
    assert(n[1] == 1)
    assert(fd[1] == "flag2")
    assert(b2[1] == false)
    assert(client[1] == true)
    assert(server[1] == true)
    assert(dir[1] == "/home")

    assert(flag.Args()[1] == "-a")
    assert(flag.Args()[2] == "-b")
    assert(flag.Args()[3] == "-c")
end

main()
