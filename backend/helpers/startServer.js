const { createServer } = require('http')

const PORT = 3000

function listener(err) {

	if (err) {
		throw new Error(err)
	}

	// eslint-disable-next-line no-console
	console.info(`Server started on http://localhost:${ PORT }`)
}

function startServer({ handler }) {
	return createServer(handler).listen(PORT, listener)
}

module.exports = startServer
