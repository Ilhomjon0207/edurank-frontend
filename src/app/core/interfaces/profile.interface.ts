import { IUser } from '@/app/core/interfaces/user.interface';

export interface IProfile {
    id: string;
    userId: string;
    createdAt: string;
    User: IUser;
    gpa: number | null;
    experienceMonths: number | null;
    bio: string | null;
}

export interface IUpdateProfile {
    name?: string;
    email?: string;
    gpa?: number | null;
    experienceMonths?: number | null;
    bio?: string | null;
}
