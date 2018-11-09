import apiConfig from '../configs/api.js'

const dataTypes = { json: 'json' }

const restMethods = {
	get: 'get',
	post: 'post',
}

const dataTypesHeaders = { [dataTypes.json]: { 'Content-Type': 'application/json' } }

const commonHeaders = { Accept: 'application/json' }

const errors = { internal: 'Internal error. Please try again later.' }

function getBody(type, data) {

	switch (type) {
		case dataTypes.json: {
			return JSON.stringify(data)
		}
		default: {
			return null
		}
	}
}

export function fetchDataType({ apiMethod, data, dataType }) {
	const {
		method = restMethods.get,
		path,
		version,
	} = apiMethod

	if (!path) {
		throw new Error('Api method path isn\'t specified')
	}

	if (!version) {
		throw new Error('Api method version isn\'t specified')
	}

	const { host, port, pathPrefix } = apiConfig

	const url = new URL(
		`http://${ host }:${ port }/${ pathPrefix }${ version }/${ path }`,
		window.location.origin
	)

	const abortController = new AbortController()
	const { signal } = abortController

	const options = {
		method: method.toUpperCase(),
		headers: Object.assign(commonHeaders, dataTypesHeaders[dataType]),
		mode: 'cors',
		signal,
	}

	if (data) {
		const notEmptyParams = Object
			.keys(data)
			.filter(key => data[key])
			.reduce((result, key) => {
				result[key] = data[key]

				return result
			}, {})

		if (method === restMethods.post) {
			options.body = getBody(dataType, notEmptyParams)
		} else {
			url.search = new URLSearchParams(notEmptyParams)
		}
	}

	return {
		result: fetch(url, options),
		abort: abortController.abort.bind(abortController),
	}
}

export function fetchJson({ apiMethod, data }) {
	const { result: promise, abort } = fetchDataType({
		apiMethod,
		data,
		dataType: dataTypes.json,
	})

	const result = promise
		.then(response => response.json())
		.then((json) => {

			if (!json.success) {
				const error = json.error || errors.internal

				throw new Error(error)
			}

			return json.data
		})

	return {
		result,
		abort,
	}
}
