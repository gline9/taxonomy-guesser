import { httpResource } from "@angular/common/http";
import { computed, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HierarchyService
{
    private readonly hierarchyResource = httpResource<TaxonomyMap>(() => "hierarchy.json");
    private readonly childMap = computed(() => {
        const hierarchy = this.hierarchyResource.value();

        if (null == hierarchy)
        {
            return undefined;
        }

        return this.getChildMap(hierarchy);
    });

    public getChildren(id: string): TaxonomyNode[]
    {
        return this.childMap()?.[id] ?? [];
    }

    public getChildMap(hierarchy: TaxonomyMap): ChildrenMap
    {
        const ret: ChildrenMap = {};

        for (const id of Object.keys(hierarchy))
        {
            if (id === "1")
            {
                continue;
            }

            ret[hierarchy[id].parentId] ??= [];
            ret[hierarchy[id].parentId].push(hierarchy[id]);
        }

        return ret;
    }

    public getSpeciesDetails(id: string): TaxonomyNode | undefined
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
                type: currentNode.type,
                id: currentNode.id
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

type TaxonomyMap = {
    [K in string]: TaxonomyNode;
}

type ChildrenMap = {
    [K in string]: TaxonomyNode[];
}

export interface TaxonomyNode {
    id: string;
    parentId: string;
    type: string;
    scientificName: string;
    names?: string[];
}

export interface HierarchyNode {
    name: string;
    type: string;
    id: string;
}