export function getData({ name }) {
	const elements = [ ...document.forms[name].elements ]

	return elements.reduce((result, elem) => {
		result[elem.name] = elem.value

		return result
	}, {})
}
