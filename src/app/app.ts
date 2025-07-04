import { Component, computed, effect, inject, model, signal } from '@angular/core';
import options from "../../data/options.json";
import { NamesService } from './names.service';
import { ChildNode, HierarchyNode, HierarchyService, TaxonomyNode } from './hierarchy.service';
import { ImageSearchService } from './image-search.service';
import { ButtonModule } from 'primeng/button';
import { WikipediaService } from './wikipedia.service';
import { FinishedPageComponent } from "./finished/finished";

@Component({
    selector: 'app-root',
    imports: [ButtonModule, FinishedPageComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    readonly namesService = inject(NamesService);
    readonly hierarchyService = inject(HierarchyService);
    readonly imageService = inject(ImageSearchService);
    readonly wikipediaService = inject(WikipediaService);

    readonly inputName = model<string>("");
    readonly namesOptions = computed(() => this.namesService.getNamesMatching(this.inputName()));
    readonly selectedSpecies = signal<TaxonomyNode | undefined>(undefined);

    readonly answer = signal<string>(this.pickRandomId());
    readonly answerName = computed(() => this.hierarchyService.getSpeciesDetails(this.answer())?.scientificName);
    readonly answerPicture = this.imageService.getImageForSignal(this.answerName);
    readonly answerHierarchy = computed(() => this.hierarchyService.getSpeciesHierarchy(this.answer()));

    readonly currentLevel = signal<string>("1");
    readonly guessedRaw = signal<ChildNode[]>([]);
    readonly currentChildren = computed(() => this.mapChildren(this.hierarchyService.getChildren(this.currentLevel()), this.answerHierarchy(), this.guessedRaw()));
    readonly currentCorrect = computed(() => this.currentChildren().find(child => child.correct)?.id ?? undefined);
    readonly speciesLeft = computed(() => this.currentChildren().map((child) => child.guessed ? 0 : child.children ?? 0).reduce((a, b) => a + b, 0));

    readonly wrongGuesses = signal<number>(0);
    readonly lives = computed(() => {
        const ret: string[] = [];
        const wrong = this.wrongGuesses();
        for (let i = 0; i < 5 - wrong; i++)
        {
            ret.push('pi-heart-fill');
        }

        for (let i = 0; i < wrong; i++)
        {
            ret.push('pi-heart');
        }
        
        return ret;
    })

    constructor()
    {
        effect(() => {
            const correctId = this.currentCorrect();
            if (null == correctId)
            {
                return;
            }

            if (this.guessedRaw().filter(guess => guess.id === correctId).length > 0)
            {
                setTimeout(() => {
                    this.guessedRaw.set([]);
                    this.currentLevel.set(correctId);
                }, 1000);
            }
        })
    }

    pickRandomId()
    {
        return options[Math.floor(Math.random() * options.length)];
    }

    mapChildren(children: ChildNode[], answerHierarchy: HierarchyNode[] | undefined, guessed: ChildNode[]): ChildOptions[]
    {
        if (null == answerHierarchy)
        {
            return [];
        }

        const ret: ChildOptions[] = [];

        for (const child of children)
        {
            const childGuessed = guessed.find(node => node.id === child.id) != null
            ret.push({
                ...child, 
                correct: answerHierarchy.find(level => level.id === child.id) != null,
                guessed: childGuessed,
                description: !childGuessed ? "" : this.wikipediaService.queryForValue(child.scientificName)()
            })
        }

        return ret;
    }

    appendGuess(guess: ChildNode)
    {
        const correct = guess.id === this.currentCorrect();
        this.guessedRaw.update((guessed) => [...guessed, guess]);
        if (!correct)
        {
            this.wrongGuesses.update(guesses => guesses + 1);
        }
    }

    computeGuessedInfo(guessed: ChildNode[]): GuessedOption[]
    {
        return guessed.map(node => ({
            id: node.id,
            description: this.wikipediaService.queryForValue(node.scientificName)()
        }));
    }
}

interface ChildOptions extends ChildNode
{
    correct: boolean;
    guessed: boolean;
    description: string;
}

interface GuessedOption
{
    id: string;
    description: string;
}
