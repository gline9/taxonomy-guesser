import { HttpClient, HttpParams } from "@angular/common/http";
import { computed, inject, Injectable, Signal } from "@angular/core";
import { key } from "../key.json";
import { map, Observable } from "rxjs";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { CachingHttpService } from "./caching-http.service";

@Injectable({providedIn: 'root'})
export class ImageSearchService extends CachingHttpService<SafeUrl[]>
{
    readonly httpClient = inject(HttpClient);
    readonly sanitizer = inject(DomSanitizer);

    override getInitialValue(): SafeUrl[]
    {
        return [];
    }

    override getByRequest(request: string): Observable<SafeUrl[]>
    {
        const params = new HttpParams()
            .appendAll({
                key,
                cx: "268a54f600bbd4c96",
                q: request,
                searchType: "image",
                imgType: "photo",
                num: 10
            })
        return this.httpClient.get<ImageResults>(
            `https://www.googleapis.com/customsearch/v1`,
                {
                    observe: 'body',
                    params
                }
            )
            .pipe(map(value => value.items.map(item => this.sanitizer.bypassSecurityTrustUrl(item.link))));
    }

    public getImageForSignal(textSignal: Signal<string | undefined>): Signal<SafeUrl[]>
    {
        return this.queryForSignal(textSignal);
    }

    public getImage(text: string): Signal<SafeUrl[]>
    {
        return this.queryForValue(text);
    }
}

interface ImageResults {
    items: ResultItem[];
}

interface ResultItem {
    link: string;
}
