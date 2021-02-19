import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    data1 = ('01/01/2021' as string).toDate();
    data2 = '2021-01-01'.toDate();
}
