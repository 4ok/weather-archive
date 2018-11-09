onmessage = function parseApiList({ data: { apiList, dbYears } }) {
	let result = apiList.map(({ t, v }) => {
		const [ y, m, d ] = t.split('-').map(Number)

		return {
			y,
			m,
			d,
			v,
		}
	})

	if (dbYears) {
		result = result.filter(item => !dbYears.includes(item.y))
	}

	postMessage(result)
}
