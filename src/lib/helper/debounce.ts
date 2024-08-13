// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function debounce<T extends Function>(func: T, delay = 1000): (...args: unknown[]) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return function (this: unknown, ...args: unknown[]) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const context = this;
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(context, args);
		}, delay);
	};
}
