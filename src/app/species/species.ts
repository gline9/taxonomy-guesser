import { Component, computed, inject, input } from "@angular/core";
import { HierarchyService } from "../hierarchy.service";
import { ImageSearchService } from "../image-search.service";

@Component({
    selector: 'app-species',
    templateUrl: 'species.html'
})
export class SpeciesComponent
{
    readonly hierarchyService = inject(HierarchyService);
    readonly imageSearchService = inject(ImageSearchService);

    readonly speciesId = input.required<string>();
    readonly species = computed(() => this.hierarchyService.getSpeciesDetails(this.speciesId()));
    readonly imageUrl = computed(() => {
        const species = this.species();
        if (null == species)
        {
            return undefined;
        }

        return this.imageSearchService.getImage(species.scientificName)();
    })
}
