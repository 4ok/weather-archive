import { create as getSelect } from '../../../blocks/select/select.js'
import getStore from '../../../helpers/getStore.js'
import { items } from './groups-data.js'
import weatherConfig from '../../../configs/weather.js'
import routes from '../../../routes.js'

const { dataType: defaultDataType } = routes.weather.defaultParams
const { excludesGroups } = weatherConfig

function getOptions({ dataType }) {
	const { group } = getStore()
	const excludes = excludesGroups[dataType] || []
	let result

	if (group) {
		result = items.map((item) => {

			if (item.value === group) {
				item.selected = true
			}

			if (excludes.includes(item.value)) {
				item.className = 'hidden'
				item.disabled = true
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
	const { dataType = defaultDataType } = getStore()

	const select = getSelect({
		name: 'group',
		className: 'weather-groups',
		options: getOptions({ dataType }),
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
