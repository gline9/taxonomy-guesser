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

        for (const id of Object.keys(ret))
        {
            for (const child of ret[id])
            {
                if (null != child.children)
                {
                    continue;
                }

                child.children = this.getNumChildren(child.id, ret);
            }
        }

        return ret;
    }

    private getNumChildren(id: string, map: ChildrenMap): number
    {
        if (null == map[id])
        {
            return 1;
        }

        return map[id].map(child => {
            const numChildren = this.getNumChildren(child.id, map);
            child.children = numChildren;
            return numChildren;
        }).reduce((a, b) => a + b, 0);
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

        return retHierarchy.reverse();
    }
}

type TaxonomyMap = {
    [K in string]: TaxonomyNode;
}

type ChildrenMap = {
    [K in string]: ChildNode[];
}

export interface ChildNode extends TaxonomyNode {
    children?: number;
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