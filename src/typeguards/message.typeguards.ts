/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from 'telegraf/types';

export const isTextMessage = (obj: any): obj is Message.TextMessage => {
	if ('text' in obj && typeof obj.text == 'string') {
		return true;
	}
	return false;
};

export const isAudioMessage = (obj: any): obj is Message.AudioMessage => {
	if ('audio' in obj && 'file_id' in obj.audio && typeof obj.audio.file_id == 'string') {
		return true;
	}
	return false;
};

export const isDocumentMessage = (obj: any): obj is Message.DocumentMessage => {
	if ('document' in obj && 'file_id' in obj.document && typeof obj.document.file_id == 'string') {
		return true;
	}
	return false;
};

export const isAnimationMessage = (obj: any): obj is Message.AnimationMessage => {
	if ('animation' in obj && 'file_id' in obj.animation && typeof obj.animation.file_id == 'string') {
		return true;
	}
	return false;
};

export const isPhotoMessage = (obj: any): obj is Message.PhotoMessage => {
	if ('photo' in obj && Array.isArray(obj.photo) && 'file_id' in obj.photo[0] && typeof obj.photo[0].file_id == 'string') {
		return true;
	}
	return false;
};

export const isVideoMessage = (obj: any): obj is Message.VideoMessage => {
	if ('video' in obj && 'file_id' in obj.video && typeof obj.video.file_id == 'string') {
		return true;
	}
	return false;
};

export const isVoiceMessage = (obj: any): obj is Message.VoiceMessage => {
	if ('voice' in obj && 'file_id' in obj.voice && typeof obj.voice.file_id == 'string') {
		return true;
	}
	return false;
};
