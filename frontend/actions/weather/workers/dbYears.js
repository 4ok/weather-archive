onmessage = function dbYears({ data: { dbList } }) {
	const result = [ ...dbList.reduce(
		(acc, { y }) => acc.add(y),
		new Set()
	) ]

	postMessage(result)
}
