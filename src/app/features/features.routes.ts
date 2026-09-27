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
    {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then((m) => m.Profile),
        data: { title: 'Profile' }
    },
    {
        path: 'skills',
        loadComponent: () => import('./skills/skills').then((s) => s.Skills),
        data: { title: 'Skills' }
    },
];

export default routes;
