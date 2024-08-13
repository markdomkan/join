import JsEvents from '@markdomkan/js-events';

const jsEvents = new JsEvents();

type Events = {
	UserNameChange: string;
};

function emit<T extends keyof Events>(event: T, data: Events[T]): void {
	jsEvents.emit(event, data);
}

function on<T extends keyof Events>(event: T, callback: (data: Events[T]) => void): void {
	jsEvents.on(event, callback);
}

export const bus = {
	emit,
	on
};
