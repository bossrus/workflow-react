import { IDeleteMessage } from '@/interfaces/currentStates.interface.ts';

export const isNotValidDeleteMessage = (deleteMessage: IDeleteMessage | undefined, marker: string, _id: string) => {
	return !deleteMessage ||
		!deleteMessage.message.includes(marker) ||
		deleteMessage.id !== _id ||
		deleteMessage.result === undefined;
};