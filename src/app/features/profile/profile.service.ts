import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from '@/app/core/services/base-crud.service';
import { IProfile, IUpdateProfile } from '@/app/core/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ProfileService extends BaseCrudService<IProfile, IProfile, IUpdateProfile> {
    constructor() {
        super('/profile');
    }

    getCurrentProfile(): Observable<IProfile> {
        return this.http.get<IProfile>(`${this.apiUrl}${this.endpoint}/me`);
    }
}
