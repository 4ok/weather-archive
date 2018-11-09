const weather = require('../controllers/1.0/weather')

const controllers = { '1.0': { weather } }

const ACTION_SUFFIX = 'Action'

function callController({
	version,
	controller,
	action,
	params,
}) {
	const versionControllers = controllers[version] || {}
	const controllerClass = versionControllers[controller]
	const actionName = action + ACTION_SUFFIX

	if (!controllerClass) {
		throw new Error('Controller version not found')
	}

	if (!controllerClass[actionName]) {
		throw new Error('Controller action not found')
	}

	return controllerClass[actionName](params)
}

module.exports = callController
