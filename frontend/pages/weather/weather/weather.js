import { render as renderMenu } from '../menu/menu.js'
import { render as renderFilters } from '../filters/filters.js'
import { render as renderChart } from '../chart/chart.js'

import { getData as getFormData } from '../../../blocks/form/form.js'
import { getParams as getMenuParams } from '../../../blocks/menu/menu.js'

import { replaceRoute } from '../../../helpers/history.js'
import weatherConfig from '../../../configs/weather.js'
import getStore from '../../../helpers/getStore.js'
import debounce from '../../../helpers/debounce.js'

const { excludesGroups } = weatherConfig

const TITLE = 'Weather service archive'

const state = {}

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
		yearFrom: yearFrom ? Number(yearFrom) : null,
		yearTo: yearTo ? Number(yearTo) : null,
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

function onResize() {
	const currentBodyWidth = document.body.clientWidth

	if (state.bodyWidth !== currentBodyWidth) {
		state.bodyWidth = currentBodyWidth

		renderChart()
	}
}

export function render() {
	document.title = TITLE
	state.bodyWidth = document.body.clientWidth

	window.addEventListener('resize', debounce(onResize, 400))

	renderHeader()
	renderMenu({ onChange })
	renderFilters({ onChange })
	renderChart()
}
