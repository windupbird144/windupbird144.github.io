type DexData = {
    columns: string[],
    types: string[],
    regions: Record<RegionId, [
            string,
            string,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number
        ][]>
}

const columns = ["region","id","name","type1","type2","eggs","eggdex","pkmn","pokedex","shinydex","albidex","melandex"] as const
// const REGION = 0
// const ID = 1
// const NAME = 2
// const TYPE1 = 3
// const TYPE2 = 4
const EGGS = 5
const EGGDEX = 6
const PKMN = 7
const POKEDEX = 8
const regions = {
    '1': 'Kanto',
    '2': 'Johto',
    '3': 'Hoenn',
    '4': 'Sinnoh',
    '5': 'Unova',
    '6': 'Kalos',
    '7': 'Alola',
    '8': 'Galar',
    '97': 'PFQ Exclusives',
    '98': 'PFQ Megas',
    '99': 'PFQ Variants'
} as const

type RegionId = keyof typeof regions

type Pokemon = [
    RegionId,
    string,
    string,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
]


function extractDexdata(html: string) : DexData {
    const jsons = substringBetween(html, '<script type="application/json" id="dexdata">', '</script>')
    return JSON.parse(jsons) as DexData
}

function expand(dexdata: DexData) : Pokemon[] {
    const result : Pokemon[] = []
    for (let [region, pkmns] of Object.entries(dexdata.regions)) {
        for (const pkmn of pkmns) {
            result.push([region as RegionId, ...pkmn])
        }
    }
    return result
}

function predicateMissingEggdex(pokemon: Pokemon) : boolean {
    return pokemon[columns.indexOf("eggdex")] < pokemon[columns.indexOf("eggs")]
}

function predicateMissingPokedex(pokemon: Pokemon) : boolean {
    return pokemon[columns.indexOf("pokedex")] < pokemon[columns.indexOf("pkmn")]
}

function filterMisssing(pokemon: Pokemon[]) : Pokemon[] {
    return pokemon.filter(p => predicateMissingEggdex(p) || predicateMissingPokedex(p))    
}

function substringBetween(s: string, startDelimiter: string, endDelimiter: string): string {
    const start = s.indexOf(startDelimiter) + startDelimiter.length
    const end = s.indexOf(endDelimiter, start)
    return s.substring(start, end)
}


function exportTable(pokemon: Pokemon[]) : string {
    let bbcode = "[css=overflow-x:scroll][table]"
    bbcode += "[tr][th]Pokemon[/th][th]Eggs[/th][th]Pkmn[/th][th]Region[/th][/tr]"
    for (let p of pokemon) {
            
            bbcode += "[tr]"
            bbcode += `[td]${p[columns.indexOf("name")]}[/td]`
            bbcode += `[td]${(p[EGGS] - p[EGGDEX]) || '-'}[/td]`
            bbcode += `[td]${(p[PKMN] - p[POKEDEX]) || '-'}[/td]`
            bbcode += `[td]${regions[p[0] as RegionId]}[/td]`
            bbcode += "[/tr]"
    }
    bbcode += "[/table][/css]"
    return bbcode
}

export function html2table(html: string) : string {
    return exportTable(filterMisssing(expand(extractDexdata(html))))
}