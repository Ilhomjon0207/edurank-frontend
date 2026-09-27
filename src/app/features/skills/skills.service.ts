import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from '@/app/core/services/base-crud.service';
import { ISkills, ICreateSkill, IUpdateSkill } from '@/app/core/interfaces';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillsService extends BaseCrudService<ISkills, ICreateSkill, IUpdateSkill> {
  constructor() {
    super('/skills');
  }

  getAllSkills(): Observable<ISkills[]> {
    return this.getAll();
  }

  createSkill(skill: ICreateSkill) {
    return this.create(skill);
  }

  updateUserSkill(userId: string, skillId: string, level: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/skills/users/${userId}/${skillId}`, { level });
  }

  deleteUserSkill(userId: string, skillId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/skills/users/${userId}/${skillId}`);
  }
}
