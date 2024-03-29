import { Route } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { ReviewComponent } from './review/review.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: MainPageComponent,
    },
    {
        path: 'review',
        component: ReviewComponent
    }
];
