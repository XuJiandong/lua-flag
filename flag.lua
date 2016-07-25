
-- mimic https://golang.org/pkg/flag/
local flag = {}

flag.defined = {}
flag.args = {}


local function info(...)
    print(...)
end

local function warn(...)
    print(...)
end

local function fatal(...)
    print(...)
    os.exit(1)
end

local function convert(t, val)
    if t == "string" then
        return val
    elseif t == "bool" then
        return true
    elseif t == "number" then
        return tonumber(val)
    else
        fatal("unknown type", t)
    end
end

--
-- syntax:
-- -flag=x
--
-- -flag
-- -flag x
function flag.Parse(...)
    local args = {...}
    local argc = select("#", ...)

    for i = 1, argc do
        local arg = args[i]
        if arg:sub(1, 1) ~= "-" then
            table.insert(flag.args, arg)
        else
            local k, v = arg:match("%-(.+)=(.+)")
            if k then
                -- -flag=x
                local entry = flag.defined[k]
                if not entry then
                    fatal("undefined flag", k)
                else
                    if entry.hasDefault then
                        table.remove(entry.value)
                        entry.hasDefault=false
                    end
                    table.insert(entry.value, convert(entry.kind, v))
                end
            else
                k = arg:match("%-(.+)")
                if k then
                    local a = args[i+1]
                    if a and a:sub(1, 1) ~= "-" then
                        -- -flag x
                        local entry = flag.defined[k]
                        if not entry then
                            fatal("undefined flag", k)
                        else
                            if entry.hasDefault then
                                table.remove(entry.value)
                                entry.hasDefault=false
                            end
                            table.insert(entry.value, convert(entry.kind, a))
                        end
                        i = i + 1
                    else
                        -- -flag
                        local entry = flag.defined[k]
                        if not entry then
                            fatal("undefined flag", k)
                        else
                            if entry.kind ~= "bool" then
                                fatal("-" .. k, "need one argument")
                            end
                            if entry.hasDefault then
                                table.remove(entry.value)
                                entry.hasDefault=false
                            end
                            table.insert(entry.value, convert(entry.kind))
                        end
                    end
                end
            end
        end
    end
end


function flag.Args()
    return flag.args
end

function flag.Bool(name, value, usage)
    if type(value) ~= "boolean" then
        fatal("invalid value in flag.Bool")
    end
    local ptr = {value}
    flag.defined[name] = {
        hasDefault = true,
        ["default"] = value,
        ["usage"] = usage, 
        ["kind"] = "bool",
        ["value"] = ptr,
    }
    return ptr
end

function flag.String(name, value, usage)
    if type(value) ~= "string" then
        fatal("invalid value in flag.String")
    end
    local ptr = {value}
    flag.defined[name] = {
        hasDefault = true,
        ["default"] = value,
        ["usage"] = usage, 
        ["kind"] = "string", 
        ["value"] = ptr,
    }
    return ptr
end

function flag.Number(name, value, usage)
    if type(value) ~= "number" then
        fatal("invalid value in flag.Number")
    end
    local ptr = {value}
    flag.defined[name] = {
        hasDefault = true,
        ["default"] = value,
        ["usage"] = usage, 
        ["kind"] = "number",
        ["value"] = ptr,
    }
    return ptr
end

function flag.PrintDefaults()
    -- -x int
    --    usage-message-for-x (default 7)
    for name, entry in pairs(flag.defined) do
        info(string.format("-%s %s", name, entry.kind))
        info(string.format("  %s (default %s)", entry.usage, tostring(entry.default)))
    end
end

return flag

