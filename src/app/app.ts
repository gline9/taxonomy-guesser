import { Component, computed, inject, model, signal } from '@angular/core';
import options from "../../data/options.json";
import { NamesService } from './names.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-root',
    imports: [FormsModule],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    readonly namesService = inject(NamesService);

    readonly inputName = model<string>("");
    readonly namesOptions = computed(() => this.namesService.getNamesMatching(this.inputName()));

    readonly answer = signal<string>(this.pickRandomId());

    pickRandomId()
    {
        return options[Math.floor(Math.random() * options.length)];
    }
}

