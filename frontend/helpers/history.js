import { getUrl as getRouteUrl } from './route.js'

function toHistory({ type, routeName, state }) {
	const url = getRouteUrl({
		name: routeName,
		params: state,
	})

	window.history[type](state, '', url)
}

export function pushRoute(name, state) {
	toHistory({
		type: 'pushState',
		routeName: name,
		state,
	})
}

export function replaceRoute(name, state) {
	toHistory({
		type: 'replaceState',
		routeName: name,
		state,
	})
}
