import { computed, inject, Injector, Signal, untracked } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, Observable, of } from "rxjs";

export abstract class CachingHttpService<T>
{
    readonly injector = inject(Injector)

    readonly cache: {[K in string]?: Signal<T>} = {};

    abstract getByRequest(request: string): Observable<T>;

    abstract getInitialValue(): T;

    public queryForSignal(valueSignal: Signal<string | undefined>): Signal<T>
    {
        return computed(() => {
            const value = valueSignal();
            if (null == value)
            {
                return this.getInitialValue();
            }

            return this.queryForValue(value)();
        })
    }

    public queryForValue(value: string): Signal<T>
    {
        if (null != this.cache[value])
        {
            return this.cache[value];
        }

        const ret = untracked(() => {
            return toSignal(
                this.getByRequest(value).pipe(catchError(() => of(this.getInitialValue()))),
                {
                    injector: this.injector,
                    initialValue: this.getInitialValue(),
                }
            );
        });

        this.cache[value] = ret;
        return ret;
    }
}
