import {
	getTemperature,
	getPrecipitation,
} from '../../../actions/weather/weather.js'

export default {
	temperature({ yearFrom, yearTo }) {
		return getTemperature({
			yearFrom,
			yearTo,
		})
	},

	precipitation({ yearFrom, yearTo }) {
		return getPrecipitation({
			yearFrom,
			yearTo,
		})
	},
}
