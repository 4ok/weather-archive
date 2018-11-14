import { loading } from '../../../blocks/main/main.js'
import { create as createChart } from '../../../blocks/chart/chart.js'

import getStore from '../../../helpers/getStore.js'
import routes from '../../../routes.js'
import chartData from './chart-data.js'

import config from '../../../configs/common.js'
import weatherConfig from '../../../configs/weather.js'
import getWorkerResult from '../../../helpers/getWorkerResult.js'
import userError from '../../../helpers/userError.js'

const STEP_X = 16
const WORKERS_PATH = 'pages/weather/chart/workers/'
const USER_ERROR = 'Chart won\'t be displayed, please try reloading the page'

const { excludesGroups } = weatherConfig
const { dataType: defaultDataType } = routes.weather.defaultParams

const axesTitles = {
	temperature: {
		y: 'Temperature',
		x: 'Period',
	},
	precipitation: {
		y: 'Precipitation',
		x: 'Period',
	},
}

const summaryNames = {
	min: 'Minimum',
	avg: 'Average',
	max: 'Maximum',
}

const unitsNames = {
	temperature: { y: '℃' },
	precipitation: { y: 'mm' },
}

function getChartWorkerResult(name, data) {
	return getWorkerResult(WORKERS_PATH + name, data)
}

function getData() {
	const { dataType = defaultDataType } = getStore()

	return chartData[dataType]
}

function onDomReady({ dataPromise }) {
	render({ dataPromise })
}

function getChartSize() {
	const fakeElem = document.createElement('div')

	fakeElem.className = 'chart__canvas'

	document.querySelector('.main').append(fakeElem)

	const { width, height } = fakeElem.getBoundingClientRect()

	fakeElem.remove()

	return {
		width,
		height,
	}
}

function getSummaryItems({ data, unitsName }) {
	const sortedData = [ ...data ].sort((a, b) => a.v - b.v)

	const max = sortedData[sortedData.length - 1]
	const min = sortedData[0]

	const { locale } = config
	const dateOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}

	const getDate = ({ y, m, d }) => new Date(`${ y }-${ m }-${ d }`)
		.toLocaleDateString(locale, dateOptions)

	return {
		max: {
			name: summaryNames.max,
			date: getDate(max),
			value: max.v,
			unitsName,
		},
		min: {
			name: summaryNames.min,
			date: getDate(min),
			value: min.v,
			unitsName,
		},
		avg: {
			name: summaryNames.avg,
			value: (data.reduce((result, item) => result + item.v, 0) / data.length).toFixed(1),
			unitsName,
		},
	}
}

function filterGroups({ dataType, group, groupsItems }) {
	const excludes = excludesGroups[dataType]

	if (group && group !== 'all-groups') {
		return { [group]: groupsItems[group] }
	}

	if (excludes) {
		excludes.forEach((exclude) => {
			delete groupsItems[exclude]
		})
	}

	return groupsItems
}

function clearChart() {
	const prevChart = document.querySelector('.chart')

	if (prevChart) {
		prevChart.remove()
	}
}

export async function render({ dataPromise = getData() } = {}) {
	clearChart()
	loading()

	let data

	try {
		data = await dataPromise
	} catch (e) {
		userError(`${ e.message }. ${ USER_ERROR }`)
		loading(false)

		return
	}

	const { width, height } = getChartSize()
	const {
		dataType = defaultDataType,
		group,
	} = getStore()

	const { season } = getStore()

	if (season && season !== 'all-seasons') {
		data = await getChartWorkerResult('filterData', {
			data,
			season,
		})
	}

	let groupsValues = await getChartWorkerResult('getGroupsValues', {
		data,
		width,
		stepX: STEP_X,
	})

	groupsValues = filterGroups({
		dataType,
		group,
		groupsItems: groupsValues,
	})

	const summaryItems = filterGroups({
		dataType,
		group,
		groupsItems: getSummaryItems({
			data,
			unitsName: unitsNames[dataType].y,
		}),
	})

	loading(false)
	clearChart()

	const chart = createChart({
		groupsValues,
		summaryItems,
		width,
		height,
		axesTitles: axesTitles[dataType],
		unitsNames: unitsNames[dataType],
	})

	const main = document.querySelector('.main')

	main.append(chart)
}

export function init() {
	const dataPromise = getData()

	document.addEventListener(
		'DOMContentLoaded',
		onDomReady.bind(null, { dataPromise })
	)
}
