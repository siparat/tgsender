import { ChannelModel } from '@prisma/client';
import { PartialFields } from 'types/partial-fields';

export type IChannelEntity = PartialFields<ChannelModel, 'id' | 'avatar'>;
