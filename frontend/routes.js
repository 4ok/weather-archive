export default {

	// Weather
	weather: {
		defaultParams: {
			dataType: 'temperature',
			yearFrom: 'min',
			yearTo: 'max',
		},

		getUrl({
			dataType,
			yearFrom,
			yearTo,
			season,
			group,
		}) {
			const def = this.defaultParams

			return [
				dataType || def.dataType,
				`${ yearFrom || def.yearFrom }-${ yearTo || def.yearTo }`,
				season,
				group,
			].join('/')
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
