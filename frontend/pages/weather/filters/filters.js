import { init as initPeriod } from '../period/period.js'
import { init as initSeason } from '../season/season.js'
import { init as initGroups } from '../groups/groups.js'

function getRootElem() {
	const form = document.createElement('form')

	form.name = 'filters'
	form.className = 'filters'

	return form
}

function onDomReady({ rootElem }) {
	document
		.querySelector('.main')
		.append(rootElem)
}

export function init({ onChange }) {
	const rootElem = getRootElem()

	const periodContainer = document.createElement('div')
	const seasonContainer = document.createElement('div')
	const groupsContainer = document.createElement('div')

	rootElem.append(periodContainer)
	rootElem.append(seasonContainer)
	rootElem.append(groupsContainer)

	initPeriod({
		container: periodContainer,
		onChange,
	})

	initSeason({
		container: seasonContainer,
		onChange,
	})

	initGroups({
		container: groupsContainer,
		onChange,
	})

	document.addEventListener(
		'DOMContentLoaded',
		onDomReady.bind(null, { rootElem })
	)
}
