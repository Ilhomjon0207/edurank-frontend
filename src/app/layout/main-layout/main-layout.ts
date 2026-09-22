import {Component, computed, effect, inject, signal} from '@angular/core';

import {RouterOutlet, Router, NavigationEnd} from "@angular/router";
import {LayoutService} from "@/app/layout/service/layout.service";
import {NgClass} from "@angular/common";
import {Topbar} from '../topbar/topbar'
import {Sidebar} from "@/app/layout/sidebar/sidebar";
import {Footer} from "@/app/layout/footer/footer";
import { Card } from 'primeng/card';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-main-layout',
    imports: [RouterOutlet, NgClass, Topbar, Sidebar, Footer, Card],
    templateUrl: './main-layout.html',
    styleUrl: './main-layout.scss'
})
export class MainLayout {
    layoutService = inject(LayoutService);
    private router = inject(Router);
    pageTitle = signal('Dashboard');

    constructor() {
        this.initTitleListener();
        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.mobileMenuActive) {
                document.body.classList.add('blocked-scroll');
            } else {
                document.body.classList.remove('blocked-scroll');
            }
        });
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
                this.pageTitle.set(title);
            }
        });
    }

    containerClass = computed(() => {
        const config = this.layoutService.layoutConfig();
        const state = this.layoutService.layoutState();
        return {
            'layout-overlay': config.menuMode === 'overlay',
            'layout-static': config.menuMode === 'static',
            'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
            'layout-overlay-active': state.overlayMenuActive,
            'layout-mobile-active': state.mobileMenuActive
        };
    });
}
