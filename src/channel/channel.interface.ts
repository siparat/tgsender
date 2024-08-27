import { ChannelModel } from '@prisma/client';

export type IChannelEntity = Omit<ChannelModel, 'id'> & { id?: number };
