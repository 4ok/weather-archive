import { fetchJson } from '../../helpers/api.js'
import apiMethods from '../../api-methods/weather.js'
import logError from '../../helpers/logError.js'
import getWorkerResult from '../../helpers/getWorkerResult.js'

import {
	init as dbInit,
	get as dbGet,
	add as dbAdd,
	addList as dbAddList,
	getAll as dbGetAll,
} from '../../helpers/db.js'

const DB_NAME = 'weather'

const WORKERS_PATH = 'actions/weather/workers/'

const dbStores = [
	{
		name: 'lists',
		options: { keyPath: 'name' },
	},
	{
		name: 'temperature',
		options: { keyPath: [ 'y', 'm' ] },
	},
	{
		name: 'precipitation',
		options: { keyPath: [ 'y', 'm' ] },
	},
]

const fetchAborts = {}

const dbPromise = dbInit({
	name: DB_NAME,
	stores: dbStores,
})

function isEmpty(arr) {
	return !arr || arr.length === 0
}

function getActionWorkerResult(name, data) {
	return getWorkerResult(WORKERS_PATH + name, data)
}

function getFetchResult({ apiMethod, filter }) {

	if (fetchAborts[apiMethod]) {
		fetchAborts[apiMethod]()

		fetchAborts[apiMethod] = null
	}

	const { result, abort } = fetchJson({
		apiMethod: apiMethods[apiMethod],
		data: filter,
	})

	fetchAborts[apiMethod] = abort

	return result
}

function createDbList({ list }) {
	const groupsItems = list.reduce((result, item) => {
		const key = `${ item.y }-${ item.m }`

		if (!result[key]) {
			result[key] = []
		}

		result[key].push(item.v)

		return result
	}, {})

	return Object
		.keys(groupsItems)
		.map((key) => {
			const [ year, month ] = key.split('-')

			return {
				y: Number(year),
				m: Number(month),
				v: groupsItems[key],
			}
		})
}

function getQuery({ filter }) {
	const { yearFrom, yearTo } = filter
	let result

	if (yearFrom && yearTo) {
		result = window.IDBKeyRange.bound(
			[ yearFrom, 1 ],
			[ yearTo, 12 ]
		)
	}

	return result
}

function getAbsenceDbItemsFilter({ filter, dbYears }) {
	const dbYearFrom = dbYears[0]
	const dbYearTo = dbYears[dbYears.length - 1]
	let result

	const {
		yearFrom: filterYearFrom,
		yearTo: filterYearTo,
	} = filter

	if (dbYearFrom !== filterYearFrom && dbYearTo !== filterYearTo) {
		result = Object.assign({}, filter)
	} else if (dbYearFrom !== filterYearFrom) {
		result = {
			yearFrom: filterYearFrom,
			yearTo: dbYearFrom - 1,
		}
	} else if (dbYearTo !== filterYearTo) {
		result = {
			yearFrom: dbYearTo + 1,
			yearTo: filterYearTo,
		}
	}

	return result
}

async function getFetchResultAndSaveToStore({
	apiMethod,
	filter,
	db,
	store,
	dbYears,
}) {
	try {
		const apiList = await getFetchResult({
			apiMethod,
			filter,
		})

		const list = await getActionWorkerResult('parseApiList', {
			apiList,
			dbYears,
		})

		if (db) {
			dbAddList({
				db,
				store,
				list: createDbList({ list }),
			})
		}

		return list
	} catch (e) {
		logError(e)
	}

	return null
}

async function getResult({ apiMethod, filter, store }) {
	let db
	let list

	try {
		db = await dbPromise

		const dbList = await dbGetAll({
			db,
			store,
			query: getQuery({ filter }),
		})

		const [ dbYears, parsedDbList ] = await Promise.all([
			getActionWorkerResult('dbYears', { dbList }),
			getActionWorkerResult('parseDbList', { dbList }),
		])

		list = parsedDbList

		const absenceDbItemsFilter = getAbsenceDbItemsFilter({
			filter,
			dbYears,
		})

		if (absenceDbItemsFilter) {
			const additionalList = await getFetchResultAndSaveToStore({
				apiMethod,
				filter: absenceDbItemsFilter,
				db,
				store,
				dbYears,
			})

			Object.assign(list, additionalList)
		}
	} catch (e) {
		logError(e)
	}

	if (isEmpty(list)) {
		list = await getFetchResultAndSaveToStore({
			apiMethod,
			filter,
			db,
			store,
		})
	}

	if (isEmpty(list)) {
		throw new Error('Data error')
	}

	return list
}

export async function getYears() {
	let db
	let years

	try {
		db = await dbPromise
		const result = await dbGet({
			db,
			store: 'lists',
			key: 'years',
		}) || {}

		years = result.list
	} catch (e) {
		logError(e)
	}

	if (!years) {

		try {
			years = await getFetchResult({ apiMethod: 'years' })

			if (db) {
				dbAdd({
					db,
					store: 'lists',
					data: {
						name: 'years',
						list: years,
					},
				})
			}
		} catch (e) {
			logError(e)
		}
	}

	if (!years) {
		throw new Error('Data error')
	}

	return years
}

export function getTemperature({ yearFrom, yearTo }) {
	return getResult({
		apiMethod: 'temperature',
		filter: {
			yearFrom,
			yearTo,
		},
		store: 'temperature',
	})
}

export function getPrecipitation({ yearFrom, yearTo }) {
	return getResult({
		apiMethod: 'precipitation',
		filter: {
			yearFrom,
			yearTo,
		},
		store: 'precipitation',
	})
}
