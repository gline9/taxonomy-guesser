import { httpResource } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HierarchyService
{
    private readonly hierarchyResource = httpResource<SpeciesMap>(() => "hierarchy.json");

    public getSpeciesDetails(id: string): Species | undefined
    {
        const hierarchy = this.hierarchyResource.value();

        if (null == hierarchy)
        {
            return undefined;
        }

        return hierarchy[id];
    }
}

type SpeciesMap = {
    [K in string]: Species;
}

export interface Species {
    id: string;
    parentId: string;
    type: string;
    scientificName: string;
    names?: string[];
}
