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
        if (!this.hierarchyResource.hasValue())
        {
            return undefined;
        }

        return this.hierarchyResource.value()[id];
    }

    public getSpeciesHierarchy(id: string): HierarchyNode[] | undefined
    {
        if (!this.hierarchyResource.hasValue())
        {
            return undefined;
        }

        const hierarchy = this.hierarchyResource.value();
        const retHierarchy: HierarchyNode[] = [];

        let currentId = id;

        while (null != hierarchy[currentId])
        {
            const currentNode = hierarchy[currentId];
            retHierarchy.push({
                name: currentNode.scientificName,
                type: currentNode.type
            });

            if (currentId === currentNode.parentId)
            {
                break;
            }

            currentId = currentNode.parentId;
        }

        console.log("hierarchy", retHierarchy);

        return retHierarchy.reverse();
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

export interface HierarchyNode {
    name: string;
    type: string;
}