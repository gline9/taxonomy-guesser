import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, Injector, Signal, untracked } from "@angular/core";
import { key } from "../key.json";
import { map } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({providedIn: 'root'})
export class ImageSearchService
{
    readonly httpClient = inject(HttpClient);
    readonly injector = inject(Injector);

    readonly imageUrlMap: {[K in string]?: Signal<string | undefined>} = {};

    public getImage(text: string): Signal<string | undefined>
    {
        if (null != this.imageUrlMap[text])
        {
            return this.imageUrlMap[text];
        }

        const ret = untracked(() => toSignal(
            this.httpClient.get<ImageResults>(`https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(key)}&cx=268a54f600bbd4c96&q=${encodeURIComponent(text)}&searchType=image&num=1`, {observe: 'body'})
                .pipe(map(value => value.items[0].link)),
            {
                injector: this.injector
            }
        ));

        this.imageUrlMap[text] = ret;
        return ret;
    }
}

interface ImageResults {
    items: ResultItem[];
}

interface ResultItem {
    link: string;
}
