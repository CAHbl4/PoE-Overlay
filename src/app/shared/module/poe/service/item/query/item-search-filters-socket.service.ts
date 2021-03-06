import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemSearchFiltersService, Language } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersSocketService implements ItemSearchFiltersService {
    public add(item: Item, language: Language, query: Query): void {
        const validSockets = (item.sockets || []).filter(x => !!x);
        if (validSockets.length <= 0) {
            return;
        }

        query.filters.socket_filters = {
            filters: {}
        };

        // ignore color for now. just count and linked count.

        const sockets = validSockets.filter(x => !!x.color);
        if (sockets.length > 0) {
            query.filters.socket_filters.filters.sockets = {
                min: sockets.length
            };
        }


        let count = 0;
        let maxCount = 0;
        validSockets.forEach(x => {
            if (x.linked) {
                ++count;
            }
            if (count > maxCount) {
                maxCount = count;
            }
            if (!x.linked) {
                count = 0;
            }
        });

        if (maxCount > 0) {
            query.filters.socket_filters.filters.links = {
                min: maxCount + 1
            };
        }
    }
}
