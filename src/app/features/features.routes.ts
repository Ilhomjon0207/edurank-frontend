import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
        data: { title: 'Dashboard' }
    },
    {
        path: 'applications',
        loadComponent: () => import('./applications/applications').then((m) => m.Applications),
        data: { title: 'Applications' }
    },
    {
        path: 'ranking',
        loadComponent: () => import('./ranking/ranking').then((m) => m.Ranking),
        data: { title: 'Ranking' }
    },
    {
        path: 'jobs',
        loadComponent: () => import('./jobs/jobs').then((j) => j.Jobs),
        data: { title: 'Jobs' }
    },
    {
        path: 'criterion',
        loadComponent: () => import('./criterion/criterion').then((c) => c.Criterion),
        data: { title: 'Criteria' }
    },
];

export default routes;
