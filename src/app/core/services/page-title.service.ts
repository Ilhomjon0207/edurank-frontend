import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  constructor(private titleService: Title, private router: Router) {
    this.initTitleListener();
  }

  private initTitleListener(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.router.routerState.snapshot.root;
      while (route.firstChild) {
        route = route.firstChild;
      }
      const title = route.data?.['title'];
      if (title) {
        this.titleService.setTitle(`${title} - EduRank`);
      }
    });
  }

  private getRouteTitle(route: any): string | null {
    if (route.firstChild) {
      return this.getRouteTitle(route.firstChild) || route.data?.['title'];
    }
    return route.data?.['title'];
  }
}
