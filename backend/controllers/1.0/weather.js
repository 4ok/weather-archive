const years = require('../../data/years.json')
const temperature = require('../../data/temperature.json')
const precipitation = require('../../data/precipitation.json')

const getYear = value => Number(value.t.split('-', 1)[0])

function filterData({ data, yearFrom, yearTo }) {

	if (yearFrom && yearTo) {
		return data.filter((value) => {
			const year = getYear(value)

			return year >= yearFrom && year <= yearTo
		})
	}

	return data
}

function yearsAction() {
	return years
}

function temperatureAction({ yearFrom, yearTo }) {
	return filterData({
		data: temperature,
		yearFrom,
		yearTo,
	})
}

function precipitationAction({ yearFrom, yearTo }) {
	return filterData({
		data: precipitation,
		yearFrom,
		yearTo,
	})
}

module.exports = {
	yearsAction,
	temperatureAction,
	precipitationAction,
}
