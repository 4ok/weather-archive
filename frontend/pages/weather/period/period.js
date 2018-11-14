import { create as cretaePeriod } from '../../../blocks/period/period.js'
import { getYears } from '../../../actions/weather/weather.js'
import getStore from '../../../helpers/getStore.js'
import userError from '../../../helpers/userError.js'

const USER_ERROR = 'Period selects won\'t be displayed'

const names = {
	from: 'yearFrom',
	to: 'yearTo',
}

function onDomReady({ container, yearsPromise, onChange }) {
	render({
		container,
		yearsPromise,
		onChange,
	})
}

async function render({ container, yearsPromise, onChange }) {
	let years

	try {
		years = await yearsPromise
	} catch (e) {
		userError(`${ e.message }. ${ USER_ERROR }`)

		return
	}

	const {
		yearFrom = years[years.length - 1],
		yearTo = years[0],
	} = getStore()

	const period = cretaePeriod({
		names: Object.values(names),
		values: years,
		selectedValues: {
			[names.from]: yearFrom,
			[names.to]: yearTo,
		},
		onChange,
	})

	container.append(period)
}

export function init({ container, onChange }) {
	const yearsPromise = getYears()

	document.addEventListener('DOMContentLoaded', onDomReady.bind(null, {
		container,
		yearsPromise,
		onChange,
	}))
}
