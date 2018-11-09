export function loading(progress = true) {
	const method = (progress) ? 'add' : 'remove'

	document.querySelector('.main').classList[method]('main__loading')
}
