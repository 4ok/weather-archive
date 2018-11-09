import { create as createSelect } from '../select/select.js'

const SELECT_CLASS_NAME = 'period__select'

function getSelectedValues() {
	const selects = document.querySelectorAll(`.${ SELECT_CLASS_NAME }`)
	const selectFrom = selects[0]
	const selectTo = selects[1]

	const values = [
		selectFrom.value,
		selectTo.value,
	]

	return {
		[selectFrom.name]: Math.min(...values),
		[selectTo.name]: Math.max(...values),
	}
}

function onChangePeriod({ onChange }, e) {
	const data = getSelectedValues()

	onChange(e, data)
}

export function create({
	names,
	values,
	selectedValues,
	onChange,
}) {
	const period = document.createElement('div')

	period.className = 'period'

	names.forEach((name) => {
		const options = values.map(value => ({
			text: value,
			value,
			selected: (String(selectedValues[name]) === String(value)),
		}))

		const select = createSelect({
			name,
			options,
			className: SELECT_CLASS_NAME,
			onChange: onChangePeriod.bind(null, { onChange }),
		})

		period.append(select)
	})

	return period
}
