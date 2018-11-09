import { init as initMenu } from '../menu/menu.js'
import { init as initFilters } from '../filters/filters.js'

import {
	init as initChart,
	render as renderChart,
} from '../chart/chart.js'

import { getData as getFormData } from '../../../blocks/form/form.js'
import { getParams as getMenuParams } from '../../../blocks/menu/menu.js'

import { replaceRoute } from '../../../helpers/history.js'
import weatherConfig from '../../../configs/weather.js'
import getStore from '../../../helpers/getStore.js'
import debounce from '../../../helpers/debounce.js'

const { excludesGroups } = weatherConfig

const TITLE = 'Weather service archive'

function correctGroupsSelect({ dataType }) {
	const select = document.querySelector('.weather-groups')
	const options = [ ...select.options ]

	options.forEach((option) => {
		const excludes = excludesGroups[dataType]
		const hide = (excludes && excludes.includes(option.value))
		const method = hide ? 'add' : 'remove'

		option.disabled = hide
		option.classList[method]('hidden')
	})

	select.selectedIndex = 0
}

function onChange(e, data) {
	const store = getStore()
	const params = (Object.keys(store).length > 0)
		? Object.assign({}, store, data)
		: Object.assign({}, getFormData({ name: 'filters' }), getMenuParams())

	if (data.dataType) {
		params.group = 'all-groups'

		correctGroupsSelect({ dataType: data.dataType })
	}

	const {
		dataType,
		yearFrom,
		yearTo,
		season,
		group,
	} = params

	replaceRoute('weather', {
		dataType,
		season,
		group,
		yearFrom: Number(yearFrom),
		yearTo: Number(yearTo),
	})

	renderChart()
}

function renderHeader() {
	const title = document.createElement('h1')

	title.className = 'main__header'
	title.textContent = TITLE

	document
		.querySelector('.main')
		.prepend(title)
}

function onDomReady() {
	renderHeader()

	document.title = TITLE
}

export function init() {
	document.addEventListener('DOMContentLoaded', onDomReady)
	window.addEventListener('resize', debounce(renderChart, 400))

	initMenu({ onChange })
	initFilters({ onChange })
	initChart()
}
