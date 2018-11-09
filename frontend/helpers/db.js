const DEFAULT_DB_VERSION = 1

function storeActionList({
	db,
	store,
	mode,
	method,
	list,
}) {
	const objectStore = db
		.transaction(store, mode)
		.objectStore(store)

	const lastIndex = list.length - 1

	return new Promise((resolve) => {
		const nextAction = (i = 0) => {

			if (i > lastIndex) {
				resolve()

				return
			}

			const item = list[i]
			const request =	objectStore[method](item)
			const addNext = nextAction.bind(null, i + 1)

			request.onsuccess = addNext
			request.onerror = addNext
		}

		nextAction()
	})
}

function storeAction({
	db,
	store,
	mode,
	method,
	args = [],
}) {
	const objectStore = db
		.transaction(store, mode)
		.objectStore(store)

	const request =	objectStore[method](...args)

	return new Promise((resolve, reject) => {
		request.onsuccess = (e) => {
			resolve(e.target.result)
		}

		request.onerror = reject
	})
}

export function init({ name: dbName, stores, version = DEFAULT_DB_VERSION }) {
	const request = window.indexedDB.open(dbName, version)

	request.onupgradeneeded = (e) => {
		const db = e.currentTarget.result

		stores.forEach(({ name: storeName, options: storeOptions, indexes }) => {
			const store = db.createObjectStore(storeName, storeOptions)

			if (indexes) {
				indexes.forEach(({ name: indexName, keyPath, options: indexOptions }) => {
					store.createIndex(indexName, keyPath, indexOptions)
				})
			}
		})
	}

	return new Promise((resolve, reject) => {
		request.onsuccess = (e) => {
			resolve(e.target.result)
		}

		request.onerror = reject
	})
}

export function add({ db, store, data }) {
	return storeAction({
		db,
		store,
		mode: 'readwrite',
		method: 'add',
		args: [ data ],
	})
}

export function get({ db, store, key }) {
	return storeAction({
		db,
		store,
		mode: 'readonly',
		method: 'get',
		args: [ key ],
	})
}

export function getAll({ db, store, query }) {
	return storeAction({
		db,
		store,
		mode: 'readonly',
		method: 'getAll',
		args: [ query ],
	})
}

export function addList({ db, store, list }) {
	return storeActionList({
		db,
		store,
		mode: 'readwrite',
		method: 'add',
		list,
	})
}
