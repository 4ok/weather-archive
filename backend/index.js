const url = require('url')

const startServer = require('./helpers/startServer')
const callController = require('./helpers/callController')

const responseHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
}

const API_PREFIX = '/api/v'

function parseUrlPath(path) {
	const [ version, controller, action ] = path
		.replace(API_PREFIX, '')
		.split('/')

	return {
		version,
		controller,
		action,
	}
}

function getError({
	error,
	version,
	controller,
	action,
}) {
	const debug = JSON.stringify({
		version,
		controller,
		action,
	})

	return `${ error.message }. ${ debug }`
}

function getResult({
	version,
	controller,
	action,
	params,
}) {
	let error = null
	let data = null

	try {
		data = callController({
			version,
			controller,
			action,
			params,
		})
	} catch (e) {
		error = getError({
			error: e,
			version,
			controller,
			action,
		})
	}

	return {
		success: !error,
		data,
		error,
	}
}

function sendResponse({ res, result }) {
	const statusCode = result.success ? 200 : 500

	res.writeHead(statusCode, responseHeaders)
	res.end(JSON.stringify(result))
}

function serverHandler(req, res) {
	const { pathname, query } = url.parse(req.url, true)
	const { version, controller, action } = parseUrlPath(pathname)

	sendResponse({
		res,
		result: getResult({
			version,
			controller,
			action,
			params: query,
		}),
	})
}

startServer({ handler: serverHandler })
