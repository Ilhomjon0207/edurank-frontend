export interface ISkills {
    id: string;
    name: string;
    description: string;
}

export interface ICreateSkill {
    name: string;
    description?: string;
}

export interface IUpdateSkill {
    name?: string;
    description?: string;
}

export interface IJobSkill {
    skillId: string;
    requiredLevel: number;
    skill: ISkills;
}
