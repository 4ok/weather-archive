const PATH_PREFIX = 'weather/'

export default {
	years: {
		method: 'get',
		version: '1.0',
		path: `${ PATH_PREFIX }years1`,
	},
	temperature: {
		method: 'get',
		version: '1.0',
		path: `${ PATH_PREFIX }temperature`,
	},
	precipitation: {
		method: 'get',
		version: '1.0',
		path: `${ PATH_PREFIX }precipitation`,
	},
}
