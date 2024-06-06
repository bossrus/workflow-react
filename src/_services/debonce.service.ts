export function debounce(func: (...args: any[]) => void) {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	return (...args: any[]) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func(...args);
		}, 300);
	};
}