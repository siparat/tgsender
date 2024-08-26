import { UserModel } from '@prisma/client';

export type IUserEntity = Omit<UserModel, 'id'> & { id?: number };
