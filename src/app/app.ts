import { Component, computed, signal } from '@angular/core';
import options from "../../data/options.json";
import { httpResource } from '@angular/common/http';
import { key } from "../key.json";

@Component({
    selector: 'app-root',
    imports: [],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    readonly hierarchy = httpResource<SpeciesMap>(() => "hierarchy.json");

    readonly answer = signal<string>(this.pickRandomId());
    readonly details = computed(() => this.hierarchy.value()?.[this.answer()]);
    readonly imageResults = httpResource<ImageResults>(() => {
        const species = this.details();
        if (null == species)
        {
            return undefined;
        }

        return `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(key)}&cx=268a54f600bbd4c96&q=${encodeURIComponent(species.scientificName)}&searchType=image&num=1`
    })

    readonly imageUrl = computed(() => {
        const image = this.imageResults.value();
        if (null == image)
        {
            return undefined;
        }

        return image.items[0].link;
    });

    pickRandomId()
    {
        return options[Math.floor(Math.random() * options.length)];
    }
}

type SpeciesMap = {
    [K in string]: Species;
}

interface Species {
    id: string;
    parentId: string;
    type: string;
    scientificName: string;
    names?: string[];
}

interface ImageResults {
    items: ResultItem[];
}

interface ResultItem {
    link: string;
}

