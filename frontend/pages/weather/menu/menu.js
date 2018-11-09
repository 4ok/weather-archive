import { create as createMenu } from '../../../blocks/menu/menu.js'
import getStore from '../../../helpers/getStore.js'
import { items } from './menu-data.js'

function getItems() {
	const { dataType } = getStore()
	let result

	if (dataType) {
		result = items.map((item) => {

			if (item.params.dataType === dataType) {
				item.selected = true
			}

			return item
		})
	} else {
		result = [ ...items ]

		result[0].selected = true
	}

	return result
}

function render({ onChange }) {
	const menu = createMenu({
		items: getItems(),
		onChange,
	})

	document
		.querySelector('.aside')
		.append(menu)
}

function onDomReady({ onChange }) {
	render({ onChange })
}

export function init({ onChange }) {
	document.addEventListener(
		'DOMContentLoaded',
		onDomReady.bind(this, { onChange })
	)
}
