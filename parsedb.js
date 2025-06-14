const fs = require("fs");

const node_headers = [
    "tax_id",
    "parent tax_id",
    "rank",
    "embl code",
    "division id",
    "inherited div flag",
    "genetic code id",
    "inherited GC  flag",
    "mitochondrial genetic code id",
    "inherited MGC flag",
    "GenBank hidden flag",
    "hidden subtree root flag",
    "comments"
];


const data = fs.readFileSync("raw-data/nodes.dmp", "utf-8");
const parsed = {};

for (const line of data.split("\t|\n"))
{
    const parts = line.split("\t|\t");
    parsed[parts[0]] = {
        id: parts[0],
        parentId: parts[1],
        type: parts[2]
    };
}

const nameIndex = {};

const names = fs.readFileSync("raw-data/names.dmp", "utf-8");

for (const line of names.split("\t|\n"))
{
    const parts = line.split("\t|\t");

    if (null == parts[3])
    {
        continue;
    }

    if (parts[3].includes('scientific name'))
    {
        parsed[parts[0]].scientificName = parts[1];
        continue;
    }

    if (!parts[3].includes('common name'))
    {
        continue;
    }

    if (parts[1].includes('_'))
    {
        continue;
    }

    const item = parsed[parts[0]];
    item.names = item.names ?? [];
    item.names.push(parts[1]);
    nameIndex[parts[2] == '' ? parts[1] : parts[2]] = item.id;
}

const options = [];

for (const key of Object.keys(parsed))
{
    if (null == parsed[key].type || (parsed[key].type.includes('species') && parsed[key].names == null))
    {
        delete parsed[key];
        continue;
    }

    if (parsed[key].type === 'species')
    {
        options.push(parsed[key].id);
    }
}

fs.writeFileSync("data/name-index.json", JSON.stringify(nameIndex, null, 4), 'utf-8');
fs.writeFileSync("data/hierarchy.json", JSON.stringify(parsed, null, 4), 'utf-8');
fs.writeFileSync("data/options.json", JSON.stringify(options, null, 4), 'utf-8');
