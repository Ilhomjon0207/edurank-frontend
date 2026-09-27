import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ProfileService } from './profile.service';
import { IProfile } from '@/app/core/interfaces';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, InputNumberModule, ToastModule, ProgressSpinner, ConfirmDialogModule, TextareaModule],
    templateUrl: './profile.html',
    styleUrl: './profile.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService, ConfirmationService]
})
export class Profile implements OnInit {
    private readonly profileService = inject(ProfileService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    readonly profile = signal<IProfile | null>(null);
    readonly loading = signal(false);
    readonly editing = signal(false);

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        this.loading.set(true);
        this.profileService.getCurrentProfile().subscribe({
            next: (data) => {
                this.profile.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load profile' });
                this.loading.set(false);
            }
        });
    }

    startEdit(): void {
        const current = this.profile();
        if (current) {
            this.profile.set({
                ...current,
                User: { ...current.User }
            });
            this.editing.set(true);
        }
    }

    cancelEdit(): void {
        this.editing.set(false);
        this.loadProfile();
    }

    confirmSave(): void {
        this.confirmationService.confirm({
            header: 'Confirm Changes',
            message: 'Are you sure you want to save the changes to your profile?',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Save',
                severity: 'primary'
            },
            accept: () => {
                this.editing.set(false);
                this.saveProfile();
            }
        });
    }

    saveProfile(): void {
        const currentProfile = this.profile();
        if (!currentProfile) return;

        const updateData: any = {
            gpa: currentProfile.gpa,
            experienceMonths: currentProfile.experienceMonths,
            bio: currentProfile.bio,
            name: currentProfile.User?.name,
            email: currentProfile.User?.email
        };

        this.loading.set(true);
        this.profileService.update(currentProfile.id, updateData).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Profile updated', life: 3000 });
                this.editing.set(false);
                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update profile' });
                this.loading.set(false);
            }
        });
    }
}
