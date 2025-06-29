import { Component, computed, effect, inject, model, signal } from '@angular/core';
import options from "../../data/options.json";
import { NamesService } from './names.service';
import { ChildNode, HierarchyNode, HierarchyService, TaxonomyNode } from './hierarchy.service';
import { ImageSearchService } from './image-search.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-root',
    imports: [ButtonModule],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    readonly namesService = inject(NamesService);
    readonly hierarchyService = inject(HierarchyService);
    readonly imageService = inject(ImageSearchService);

    readonly inputName = model<string>("");
    readonly namesOptions = computed(() => this.namesService.getNamesMatching(this.inputName()));
    readonly selectedSpecies = signal<TaxonomyNode | undefined>(undefined);

    readonly answer = signal<string>(this.pickRandomId());
    readonly answerName = computed(() => this.hierarchyService.getSpeciesDetails(this.answer())?.scientificName);
    readonly answerPicture = this.imageService.getImageForSignal(this.answerName);
    readonly answerHierarchy = computed(() => this.hierarchyService.getSpeciesHierarchy(this.answer()));

    readonly currentLevel = signal<string>("1");
    readonly currentChildren = computed(() => this.mapChildren(this.hierarchyService.getChildren(this.currentLevel()), this.answerHierarchy()));

    readonly guessed = signal<string[]>([]);

    constructor()
    {
        effect(() => {
            const correctId = this.currentChildren().find(child => child.correct)?.id ?? "";
            if (this.guessed().includes(correctId))
            {
                setTimeout(() => {
                    this.guessed.set([]);
                    this.currentLevel.set(correctId);
                }, 1000);
            }
        })
    }

    pickRandomId()
    {
        return options[Math.floor(Math.random() * options.length)];
    }

    mapChildren(children: ChildNode[], answerHierarchy: HierarchyNode[] | undefined): ChildOptions[]
    {
        if (null == answerHierarchy)
        {
            return [];
        }

        const ret: ChildOptions[] = [];

        for (const child of children)
        {
            ret.push({
                ...child, 
                correct: answerHierarchy.find(level => level.id === child.id) != null
            })
        }

        return ret;
    }

    appendGuess(guess: string)
    {
        this.guessed.update((guessed) => [...guessed, guess]);
    }
}

interface ChildOptions extends ChildNode
{
    correct: boolean;
}

