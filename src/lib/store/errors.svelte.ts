export type Error = {
	message: string;
	action?: () => void | Promise<void>;
};

let errors = $state<Error[]>([]);

function add(error: Error): void {
	errors.push(error);
}

function clean(): void {
	errors = [];
}

function remove(index: number): void {
	errors.splice(index, 1);
}

export const errorsStore = {
	get errors() {
		return errors;
	},
	add,
	clean,
	remove
};
