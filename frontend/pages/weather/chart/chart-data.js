import getStore from '../../../helpers/getStore.js'

import {
	getTemperature,
	getPrecipitation,
} from '../../../actions/weather/weather.js'

export default {
	get temperature() {
		const { yearFrom, yearTo } = getStore()

		return getTemperature({
			yearFrom,
			yearTo,
		})
	},

	get precipitation() {
		const { yearFrom, yearTo } = getStore()

		return getPrecipitation({
			yearFrom,
			yearTo,
		})
	},
}
