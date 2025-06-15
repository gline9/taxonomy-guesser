import { httpResource } from "@angular/common/http";
import { computed, Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class NamesService
{
    readonly nameMap = httpResource<SpeciesNameMap>(() => "name-index.json");

    readonly names = computed(() => {
        const nameMap = this.nameMap.value();
        if (null == nameMap)
        {
            return [];
        }

        return Object.keys(nameMap).sort();
    });

    getNamesMatching(search: string): string[]
    {
        const ret = [];
        for (const name of this.names())
        {
            if (name.toLowerCase().includes(search.toLowerCase()))
            {
                ret.push(name);

                if (ret.length == 10)
                {
                    return ret;
                }
            }
        }

        return ret;
    }
}

export type SpeciesNameMap = {
    [K in string]: string;
};