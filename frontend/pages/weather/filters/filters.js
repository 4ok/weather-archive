import { render as renderPeriod } from '../period/period.js'
import { render as renderSeason } from '../season/season.js'
import { render as renderGroups } from '../groups/groups.js'

function getRootElem() {
	const form = document.createElement('form')

	form.name = 'filters'
	form.className = 'filters'

	return form
}

export function render({ onChange }) {
	const rootElem = getRootElem()

	const periodContainer = document.createElement('div')
	const seasonContainer = document.createElement('div')
	const groupsContainer = document.createElement('div')

	rootElem.append(periodContainer)
	rootElem.append(seasonContainer)
	rootElem.append(groupsContainer)

	renderPeriod({
		container: periodContainer,
		onChange,
	})

	renderSeason({
		container: seasonContainer,
		onChange,
	})

	renderGroups({
		container: groupsContainer,
		onChange,
	})

	document
		.querySelector('.main')
		.append(rootElem)
}
