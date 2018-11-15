import { create as createMenu } from '../../../blocks/menu/menu.js'
import getStore from '../../../helpers/getStore.js'
import routes from '../../../routes.js'
import { items } from './menu-data.js'

const { dataType: defaultDataType } = routes.weather.defaultParams

function getItems() {
	const { dataType = defaultDataType } = getStore()

	return items.map((item) => {

		if (item.params.dataType === dataType) {
			item.selected = true
		}

		return item
	})
}

export function render({ onChange }) {
	const menu = createMenu({
		items: getItems(),
		onChange,
	})

	document
		.querySelector('.aside')
		.append(menu)
}
