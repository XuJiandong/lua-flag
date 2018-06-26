let AllowBoolValue  = new  Map<string, boolean>([
    ["1", true],
    ["0", false],
    ["t", true],
    ["f", false],
    ["T", true],
    ["F", false],
    ["true", true],
    ["false", false],
    ["TRUE", true],
    ["FALSE", false],
    ["True", true],
    ["False", false]
])

function convert(t: KindType, val: string) : any {
    if (t == KindType.String) {
        return val
    } else if (t == KindType.Bool) {
        if (val == null) {
            return true
        }
        let r = AllowBoolValue.has(val)
        if (r === undefined)
            console.log(`wrong bool value: ${val}`)
        else
            return AllowBoolValue.get(val);
    } else if (t == KindType.Number) {
        return Number.parseFloat(val)
    } else {
        console.log("unknow type", t)
    }
}

enum KindType {
    Bool,
    String,
    Number
}

class Entry {
    constructor(public HasDefault: boolean, public Default: any,
               public Usage: string, public Kind: KindType, public Value: any[]) {
    }
}

let Defined = new Map<string, Entry>();
export let Args = new Array<string>();

export function Parse(...args : string[]) {
    let stop = false
    for (let i = 0; i < args.length; i++) {
        let arg = args[i]
        if (stop || arg.slice(0, 1) != "-") {
            Args.push(arg)
        } else if (arg == "--") {
            stop = true
        } else if (arg == "-") {
            stop = true
            Args.push(arg)
        } else {
            let ms = arg.match(/-(.+)=(.+)/)
            let k, v: string = ""
            if (ms) {
                k = ms[1].toString()
                v = ms[2].toString()
            }
            if (k) {
                // -flag=x
                let entry: Entry | undefined = Defined.get(k)
                if (!entry) {
                    console.log("undefined flag", k)
                } else {
                    if (entry.HasDefault) {
                        entry.Value.pop()
                        entry.HasDefault = false
                    }
                    entry.Value.push(convert(entry.Kind, v))
                }
            } else {
                let ms = arg.match(/-(.+)/)
                if (ms)
                    k = ms[1].toString();
                if (k) {
                    let a = args[i + 1]
                    if (a && a.slice(0, 1) != "-") {
                        // -flag x
                        let entry : Entry | undefined = Defined.get(k)
                        if (!entry) {
                            console.log("undefined flag", k)
                        } else {
                            if (entry.HasDefault) {
                                entry.Value.pop()
                                entry.HasDefault = false
                            }
                            entry.Value.push(convert(entry.Kind, a))
                        }
                        i = i + 1
                    } else {
                        // -flag
                        let entry : Entry | undefined = Defined.get(k)
                        if (!entry) {
                            console.log(`undefined flag ${k}`)
                        } else {
                            if (entry.Kind != KindType.Bool) {
                                console.log(`-${k} need one argument`)
                            }
                            if (entry.HasDefault) {
                                entry.Value.pop()
                                entry.HasDefault = false
                            }
                            entry.Value.push(convert(entry.Kind, ""))
                        }
                    }
                }
            }
        }
    } // end of "for (let i = 0; i < args.length; i++) {"
}

export function Bool(name: string, value: boolean, usage: string) {
    let ptr = [value]
    let e = new Entry(true, value, usage, KindType.Bool, ptr);
    Defined.set(name, e)
    return ptr
}

export function String(name: string, value: string, usage: string) {
    let ptr = [value]
    let e = new Entry(true, value, usage, KindType.String, ptr);
    Defined.set(name, e)
    return ptr
}


export function Number2(name: string, value: number, usage: string) {
    let ptr = [value]
    let e = new Entry(true, value, usage, KindType.Number, ptr);
    Defined.set(name, e)
    return ptr
}

export function PrintDefaults() {
    for (let [k, entry] of Defined) {
        console.log(`-${k} ${entry.Kind}`)
        console.log(`  ${entry.Usage} (default ${entry.Default})`)
    }
}
