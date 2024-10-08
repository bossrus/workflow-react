export interface IDepartment {
	_id: string;
	title: string;
	titleSlug: string;
	numberInWorkflow: string;
	isUsedInWorkflow: boolean;
	version?: number;
	isDeleted?: number;
}

export interface IDepartmentsObject {
	[_id: string]: IDepartment;
}

export type IDepartmentUpdate = Partial<IDepartment>