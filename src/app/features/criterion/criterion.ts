import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { CriterionService } from './criterion.service';
import { ICreateCriterion, ICriterion } from '../../core/interfaces';
import { Textarea } from 'primeng/textarea';

@Component({
    selector: 'app-criterion',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, InputNumberModule, ToastModule, ConfirmDialogModule, Textarea, TooltipModule, IconFieldModule, InputIconModule],
    templateUrl: './criterion.html',
    styleUrl: './criterion.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService, ConfirmationService]
})
export class Criterion implements OnInit {
    criteria = signal<ICriterion[]>([]);
    filteredCriteria = signal<ICriterion[]>([]);
    displayDialog = signal(false);
    criterion = signal<Partial<ICriterion>>({});
    loading = signal(false);

    constructor(
        private criterionService: CriterionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.loadCriteria();
    }

    loadCriteria(): void {
        this.loading.set(true);
        this.criterionService.getAllCriteria().subscribe({
            next: (data) => {
                this.criteria.set(data);
                this.filteredCriteria.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load criteria' });
                this.loading.set(false);
            }
        });
    }

    onFilter(event: any): void {
        const query = event.target.value.toLowerCase();
        const filtered = this.criteria().filter(c =>
            c.name.toLowerCase().includes(query) ||
            (c.description && c.description.toLowerCase().includes(query))
        );
        this.filteredCriteria.set(filtered);
    }

    openNew(): void {
        this.criterion.set({});
        this.displayDialog.set(true);
    }

    edit(criterion: ICriterion): void {
        this.criterion.set({ ...criterion });
        this.displayDialog.set(true);
    }

    delete(id: string): void {
        this.confirmationService.confirm({
            header: 'Delete Criterion',
            message: 'Are you sure you want to delete this criterion?',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger',
                outlined: true
            },
            accept: () => {
                this.criterionService.deleteCriterion(id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Criterion deleted', life: 3000 });
                        this.loadCriteria();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete criterion' });
                    }
                });
            }
        });
    }

    save(): void {
        const data = this.criterion();
        if (!data.name || data.weight === undefined) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Name and Weight are required' });
            return;
        }

        if (data.id) {
            this.criterionService.updateCriterion(data.id, data as any).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Criterion updated', life: 3000 });
                    this.displayDialog.set(false);
                    this.loadCriteria();
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update criterion' })
            });
        } else {
            const createData: ICreateCriterion = {
                name: data.name!,
                weight: data.weight!,
                description: data.description
            };
            this.criterionService.createCriterion(createData).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Criterion created', life: 3000 });
                    this.displayDialog.set(false);
                    this.loadCriteria();
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create criterion' })
            });
        }
    }
}
