import routes from '../routes.js'

const URL_PREFIX = '#/'

export function getUrl({ name, params }) {
	const route = routes[name].getUrl(params)

	return `/${ URL_PREFIX }${ route }/`
}

function getParams() {
	const params = document.location.hash
		.replace(URL_PREFIX, '')
		.split('/')
		.filter(v => v)

	return (params.length > 0) ? params : null
}

export function restoreState({ routeName }) {
	const params = getParams()

	if (!params) {
		return null
	}

	return routes[routeName].parseUrl({ params })
}
