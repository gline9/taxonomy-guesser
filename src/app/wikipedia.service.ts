import { inject, Injectable } from "@angular/core";
import { CachingHttpService } from "./caching-http.service";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class WikipediaService extends CachingHttpService<string>
{
    readonly httpClient = inject(HttpClient);

    override getByRequest(request: string): Observable<string>
    {
        return this.httpClient.get<{description: string}>(
            `https://api.wikimedia.org/core/v1/wikipedia/en/page/${encodeURIComponent(request)}/description`,
            {
                observe: 'body'
            }
        ).pipe(map(value => value.description));
    }

    override getInitialValue(): string
    {
        return "";
    }

}
