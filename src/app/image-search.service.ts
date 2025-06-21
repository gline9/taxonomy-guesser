import { HttpClient, HttpParams } from "@angular/common/http";
import { computed, inject, Injectable, Injector, Signal, untracked } from "@angular/core";
import { key } from "../key.json";
import { map } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from "@angular/platform-browser";

@Injectable({providedIn: 'root'})
export class ImageSearchService
{
    readonly httpClient = inject(HttpClient);
    readonly injector = inject(Injector);
    readonly sanitizer = inject(DomSanitizer);

    readonly imageUrlMap: {[K in string]?: Signal<SafeUrl | undefined>} = {};

    public getImage(text: string): Signal<SafeUrl | undefined>
    {
        if (null != this.imageUrlMap[text])
        {
            return this.imageUrlMap[text];
        }

        const ret = untracked(() => {
            const params = new HttpParams()
                .appendAll({
                    key,
                    cx: "268a54f600bbd4c96",
                    q: text,
                    searchType: "image",
                    imgType: "photo",
                    siteSearch: "wikipedia.org",
                    siteSearchFilter: "i",
                    num: 10
                })
            return toSignal(
            this.httpClient.get<ImageResults>(
                `https://www.googleapis.com/customsearch/v1`,
                    {
                        observe: 'body',
                        params
                    }
                )
                .pipe(map(value => this.sanitizer.bypassSecurityTrustUrl(value.items[0].link))),
            {
                injector: this.injector
            });
        });

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
