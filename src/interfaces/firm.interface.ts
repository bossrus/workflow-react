export interface IFirm {
	_id: string;
	title: string;
	titleSlug: string;
	basicPriority: number;
	version: number;
	isDeleted: number;
}

export interface IFirmsObject {
	[_id: string]: IFirm;
}

export type IFirmUpdate = Partial<IFirm>
