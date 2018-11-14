const classNames = {
	menu: 'menu',
	selectedItem: 'menu__item_selected',
}

const state = {}

function onClick({ onChange }, e) {
	const { target } = e

	if (target.classList.contains('menu__item')) {
		const data = getItemParams(target)

		highlightItem(target)
		onChange(e, data)
	}

	e.preventDefault()
}

function getItemParams(item) {
	return JSON.parse(item.dataset.params)
}

export function highlightItem(item) {

	if (state.selectedItem) {
		state.selectedItem.classList.remove(classNames.selectedItem)
	}

	item.classList.add(classNames.selectedItem)

	state.selectedItem = item
}

function getItemElem({ text, selected, params }) {
	const elem = document.createElement('a')

	elem.className = 'menu__item'
	elem.textContent = text
	elem.dataset.params = JSON.stringify(params)
	elem.href = '#'

	if (selected) {
		elem.classList.add(classNames.selectedItem)
		state.selectedItem = elem
	}

	return elem
}

function getMenu({ items }) {
	const menu = document.createElement('nav')

	menu.className = classNames.menu

	items.forEach((item) => {
		const elem = getItemElem(item)

		menu.append(elem)
	})

	return menu
}

export function getParams() {
	const selectedItem = document.querySelector(`.${ classNames.selectedItem }`)

	return getItemParams(selectedItem)
}

export function create({ items, onChange }) {
	const menu = getMenu({ items })

	menu.addEventListener('click', onClick.bind(null, { onChange }))

	return menu
}
