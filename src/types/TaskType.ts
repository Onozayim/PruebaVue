export interface TaskType {
	id: number;
	created_at: string;
	description: string;
	name: string;
	completed: number;
}

export interface Option {
	text: string;
	value: string;
}
