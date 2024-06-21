/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';

// Products Services
import { SupportTicketModel } from './support-ticket.model';
import { SortColumn, SortDirection } from './tickets-sortable.directive';
import { Tickets } from './data';
import { restApiService } from 'src/app/core/services/rest-api.service';

interface SearchResult {
  tickets: SupportTicketModel[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(tickets: SupportTicketModel[], column: SortColumn, direction: string): SupportTicketModel[] {
  if (direction === '' || column === '') {
    return tickets;
  } else {
    return [...tickets].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(ticket: SupportTicketModel, term: string, pipe: PipeTransform) {
  return ticket.status.toLowerCase().includes(term.toLowerCase())
  ;
}

@Injectable({providedIn: 'root'})
export class TicketsService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _tickets$ = new BehaviorSubject<SupportTicketModel[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  tickets?: any;

  private _state: State = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0
  };

  constructor(private pipe: DecimalPipe, public ApiService: restApiService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._tickets$.next(result.tickets);
      this._total$.next(result.total);
    });

    this._search$.next();

    // Api Data
    this.ApiService.getTicketData().subscribe(
      data => {        
        this.tickets = data;
    });

  }

  getTicketData(){
    return this.ApiService.getTicketData();
  }

  get tickets$() { return this._tickets$.asObservable(); }
  get datas() { return this.tickets; }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get startIndex() { return this._state.startIndex; }
  get endIndex() { return this._state.endIndex; }
  get totalRecords() { return this._state.totalRecords; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set startIndex(startIndex: number) { this._set({ startIndex }); }
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    // this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    console.log('tickets search called ')
    const datas = (this.datas);
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let tickets = sort(datas, sortColumn, sortDirection);

    // 2. filter
    tickets = tickets.filter(country => matches(country, searchTerm, this.pipe));
    const total = tickets.length;

    // 3. paginate
    this.totalRecords = tickets.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
        this.endIndex = this.totalRecords;
    }
    tickets = tickets.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({tickets, total});
  }
}
