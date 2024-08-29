import { UserModel } from '@prisma/client';
import { PartialFields } from '../../types/partial-fields';

export type IUserEntity = PartialFields<UserModel, 'id' | 'tgId' | 'token'>;
