import { Component, computed, effect, inject, model, signal } from '@angular/core';
import options from "../../data/options.json";
import { NamesService } from './names.service';
import { FormsModule } from '@angular/forms';
import { HierarchyNode, HierarchyService, Species } from './hierarchy.service';
import { ImageSearchService } from './image-search.service';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
    selector: 'app-root',
    imports: [FormsModule, AutoCompleteModule],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    readonly namesService = inject(NamesService);
    readonly hierarchyService = inject(HierarchyService);
    readonly imageService = inject(ImageSearchService);

    readonly inputName = model<string>("");
    readonly namesOptions = computed(() => this.namesService.getNamesMatching(this.inputName()));
    readonly selectedSpecies = signal<Species | undefined>(undefined);

    readonly answer = signal<string>(this.pickRandomId());
    readonly answerHierarchy = computed(() => this.hierarchyService.getSpeciesHierarchy(this.answer()));

    readonly guess = signal<string | undefined>(undefined);
    readonly closestAncestor = computed(() => {
        const guess = this.guess();

        if (null == guess)
        {
            return undefined;
        }

        const answerHierarchy = this.answerHierarchy();
        const guessHierarchy = this.hierarchyService.getSpeciesHierarchy(guess);

        if (null == answerHierarchy || null == guessHierarchy)
        {
            return undefined;
        }

        return this.getCommonRoot(answerHierarchy, guessHierarchy);
    })

    readonly closestImage = computed(() => {
        const closestAncestor = this.closestAncestor();
        if (null == closestAncestor)
        {
            return undefined;
        }

        return this.imageService.getImage(closestAncestor.name)();
    })

    constructor()
    {
        effect(() => {
            const selectedSpecies = this.selectedSpecies();
            if (null != selectedSpecies)
            {
                this.guessSpecies(selectedSpecies);
            }
        })
    }

    pickRandomId()
    {
        return options[Math.floor(Math.random() * options.length)];
    }

    guessSpecies(species: Species)
    {
        this.guess.set(species.id);
        this.inputName.set("");
        this.selectedSpecies.set(undefined);
    }

    sortByLength(a: string, b: string): number
    {
        return a.length - b.length;
    }

    getCommonRoot(firstHierarchy: HierarchyNode[], secondHierarchy: HierarchyNode[]): HierarchyNode
    {
        let ret = firstHierarchy[0];
        let index = 0;
        while (index < firstHierarchy.length && firstHierarchy[index].name === secondHierarchy[index]?.name && firstHierarchy[index] != null)
        {
            ret = firstHierarchy[index++];
        }

        return ret;
    }
}

