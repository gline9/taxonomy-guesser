import { Component, computed, signal } from '@angular/core';
import options from "../../data/options.json";
import { SpeciesComponent } from "./species/species";

@Component({
    selector: 'app-root',
    imports: [SpeciesComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    readonly answer = signal<string>(this.pickRandomId());

    pickRandomId()
    {
        return options[Math.floor(Math.random() * options.length)];
    }
}

