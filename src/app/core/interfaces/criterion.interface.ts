export interface ICriterion {
  id: string;
  name: string;
  description?: string;
  weight: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateCriterion {
  name: string;
  description?: string;
  weight: number;
}

export interface IUpdateCriterion extends Partial<ICreateCriterion> {}
