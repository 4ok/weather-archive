export default {

	// Weather
	weather: {
		defaultParams: { dataType: 'temperature' },

		getUrl({
			dataType,
			yearFrom,
			yearTo,
			season,
			group,
		}) {
			const result = `${ dataType }/${ yearFrom }-${ yearTo }/${ season }/${ group }`

			return `${ result }`
		},

		parseUrl({ params }) {
			const [
				dataType,
				years,
				season,
				group,
			] = params

			const result = {
				dataType,
				season,
				group,
			}

			if (years && /\d+-\d+/.test(years)) {
				const [ yearFrom, yearTo ] = years
					.split('-')
					.map(Number)
					.filter(year => year > 0)

				if (yearFrom && yearTo) {
					Object.assign(result, {
						yearFrom,
						yearTo,
					})
				}

			}

			return result
		},
	},
}
