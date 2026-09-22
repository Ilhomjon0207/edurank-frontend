import { Injectable } from '@angular/core';
import { BaseCrudService } from '../../core/services/base-crud.service';
import { ICriterion, ICreateCriterion, IUpdateCriterion } from '../../core/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CriterionService extends BaseCrudService<ICriterion, ICreateCriterion, IUpdateCriterion> {
  constructor() {
    super('/criterion');
  }

  getAllCriteria(): Observable<ICriterion[]> {
    return this.getAll();
  }

  createCriterion(criterion: ICreateCriterion) {
    return this.create(criterion);
  }

  updateCriterion(id: string, criterion: IUpdateCriterion) {
    return this.update(id, criterion);
  }

  deleteCriterion(id: string): Observable<any> {
    return this.delete(id);
  }
}
