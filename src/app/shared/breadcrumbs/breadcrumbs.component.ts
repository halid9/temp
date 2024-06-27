import { Component, Input, OnInit } from '@angular/core';
import { BreadcrumbItem } from '../interfaces';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})

/**
 * Bread Crumbs Component
 */
export class BreadcrumbsComponent implements OnInit {

    @Input() title: string = '';
    @Input()
    breadcrumbItems!: BreadcrumbItem[];

    constructor() { }

    ngOnInit(): void {
    }

}
