onmessage = function parseDbList({ data: { dbList } }) {
	const result = dbList.reduce((acc, { y, m, v: vals }) => {
		vals.forEach((v, d) => {
			acc.push({
				y,
				m,
				d: d + 1,
				v,
			})
		})

		return acc
	}, [])

	postMessage(result)
}
