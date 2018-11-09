export default function debounce(fn, ms) {
	let timerId

	return (...args) => {
		clearTimeout(timerId)
		timerId = setTimeout(fn.bind(fn, ...args), ms)
	}
}
