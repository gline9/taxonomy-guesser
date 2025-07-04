import { Component, input } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { Dialog } from "primeng/dialog";

@Component({
    selector: 'app-finished-page',
    templateUrl: 'finished.html',
    imports: [Dialog, ButtonModule]
})
export class FinishedPageComponent
{
    readonly speciesLeft = input.required<number>();
    readonly livesLeft = input.required<number>();

    public copyResults()
    {
        const results = `
${this.speciesLeft() == 0 ? 'I won with ' + this.livesLeft() + ' lives left!' : 
    'I narrowed it down to ' + this.speciesLeft() + ' species!'
}

https://gline9.github.io/taxonomy-guesser
#taxonomyGuesser
`;

        navigator.clipboard.writeText(results);
    }
}
