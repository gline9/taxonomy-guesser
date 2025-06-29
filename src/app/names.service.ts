import { httpResource } from "@angular/common/http";
import { computed, inject, Injectable } from "@angular/core";
import { HierarchyService, TaxonomyNode } from "./hierarchy.service";

@Injectable({providedIn: 'root'})
export class NamesService
{
    readonly hierarchyService = inject(HierarchyService);
    readonly nameMap = httpResource<SpeciesNameMap>(() => "name-index.json");

    readonly names = computed(() => {
        const nameMap = this.nameMap.value();
        if (null == nameMap)
        {
            return [];
        }

        return Object.keys(nameMap).sort();
    });

    getNamesMatching(search: string): TaxonomyNode[]
    {
        if (search.length < 2)
        {
            return [];
        }

        const nameMap = this.nameMap.value();

        if (null == nameMap)
        {
            return [];
        }

        const scoreMap = new Map<string, number>();
        for (const name of this.names())
        {
            const score = this.scoreMatch(search, name);
            if (null == score)
            {
                continue;
            }

            const id = nameMap[name];
            scoreMap.set(id, Math.min(scoreMap.get(id) ?? Number.MAX_VALUE, score));
        }

        return [...scoreMap.entries()].sort((a, b) => a[1] - b[1]).map(a => {
            return this.hierarchyService.getSpeciesDetails(a[0])
        }).filter(a => a != null).slice(0, 10);
    }

    private scoreMatch(search: string, target: string): number | undefined
    {
        if (!target.toLowerCase().includes(search.toLowerCase()))
        {
            return undefined;
        }

        return target.length + target.toLowerCase().indexOf(search.toLowerCase());
    }
}

export type SpeciesNameMap = {
    [K in string]: string;
};