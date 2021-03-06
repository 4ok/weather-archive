import { create as cretaePeriod } from '../../../blocks/period/period.js'
import { getYears } from '../../../actions/weather/weather.js'
import getStore from '../../../helpers/getStore.js'
import userError from '../../../helpers/userError.js'

const USER_ERROR = 'Period selects won\'t be displayed'

const names = {
	from: 'yearFrom',
	to: 'yearTo',
}

export async function render({ container, onChange }) {
	let years

	try {
		years = await getYears()
	} catch (e) {
		userError(`${ e.message }. ${ USER_ERROR }`)

		return
	}

	const { yearFrom, yearTo } = getStore()

	const period = cretaePeriod({
		names: Object.values(names),
		values: years,
		selectedValues: {
			[names.from]: yearFrom || years[years.length - 1],
			[names.to]: yearTo || years[0],
		},
		onChange,
	})

	container.append(period)
}
