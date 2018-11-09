import { create as createSelect } from '../../../blocks/select/select.js'
import getStore from '../../../helpers/getStore.js'
import { items } from './seasons-data.js'

function getOptions() {
	const { season } = getStore()
	let result

	if (season) {
		result = items.map((item) => {

			if (item.value === season) {
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

function render({ container, onChange }) {
	const select = createSelect({
		name: 'season',
		options: getOptions(),
		onChange,
	})

	container.append(select)
}

function onDomReady({ container, onChange }) {
	render({
		container,
		onChange,
	})
}

export function init({ container, onChange }) {
	document.addEventListener('DOMContentLoaded', onDomReady.bind(null, {
		container,
		onChange,
	}))
}
