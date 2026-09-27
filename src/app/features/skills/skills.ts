import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Textarea } from 'primeng/textarea';

import { SkillsService } from './skills.service';
import { ISkills } from '@/app/core/interfaces';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-skills',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        ConfirmDialogModule,
        Textarea,
        TooltipModule,
        IconFieldModule,
        InputIconModule
    ],
    templateUrl: './skills.html',
    styleUrl: './skills.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService, ConfirmationService]
})
export class Skills implements OnInit {
    skills = signal<ISkills[]>([]);
    filteredSkills = signal<ISkills[]>([]);
    displayDialog = signal(false);
    skill = signal<Partial<ISkills>>({});
    loading = signal(false);

    private skillsService = inject(SkillsService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private authService = inject(AuthService);

    ngOnInit(): void {
        this.loadSkills();
    }

    loadSkills(): void {
        this.loading.set(true);
        this.skillsService.getAllSkills().subscribe({
            next: (data) => {
                this.skills.set(data);
                this.filteredSkills.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load skills' });
                this.loading.set(false);
            }
        });
    }

    onFilter(event: any): void {
        const query = event.target.value.toLowerCase();
        const filtered = this.skills().filter(s =>
            s.name.toLowerCase().includes(query) ||
            (s.description && s.description.toLowerCase().includes(query))
        );
        this.filteredSkills.set(filtered);
    }

    openNew(): void {
        this.skill.set({});
        this.displayDialog.set(true);
    }

    edit(skill: ISkills): void {
        this.skill.set({ ...skill });
        this.displayDialog.set(true);
    }

    delete(skillId: string): void {
        const userString = localStorage.getItem('user');
        if (!userString) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User session not found. Please login again.' });
            return;
        }

        const user = JSON.parse(userString);
        const userId = user.id;

        if (!userId) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User ID not found in session.' });
            return;
        }

        console.log('Attempting to delete skill relationship:', { userId, skillId });

        this.confirmationService.confirm({
            header: 'Delete Skill',
            message: 'Are you sure you want to remove this skill from your profile?',
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
                this.skillsService.deleteUserSkill(userId, skillId).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Skill removed', life: 3000 });
                        this.loadSkills();
                    },
                    error: (err: any) => {
                        console.error('Delete API Error:', err);
                        const msg = err.error?.message || 'Failed to remove skill';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'API Error',
                            detail: msg
                        });
                    }
                });
            }
        });
    }

    save(): void {
        const data = this.skill();
        if (!data.name) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Name is required' });
            return;
        }

        if (data.id) {
            const userString = localStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;
            const userId = user?.id;

            if (!userId) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User ID not found in session.' });
                return;
            }

            console.log('Attempting to update skill level:', { userId, skillId: data.id, level: 1 });

            this.skillsService.updateUserSkill(userId, data.id, 1).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Skill level updated', life: 3000 });
                    this.displayDialog.set(false);
                    this.loadSkills();
                },
                error: (err: any) => {
                    console.error('Update API Error:', err);
                    const msg = err.error?.message || 'Failed to update skill';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
                }
            });
        } else {
            this.skillsService.createSkill({
                name: data.name!,
                description: data.description
            }).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Skill created', life: 3000 });
                    this.displayDialog.set(false);
                    this.loadSkills();
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create skill' })
            });
        }
    }
}
