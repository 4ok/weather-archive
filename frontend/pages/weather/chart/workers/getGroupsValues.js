onmessage = function getGroupsValues({ data: { data, width, stepX } }) {
	const dataStep = Math.ceil((data.length / width) * stepX)
	const result = {
		min: [],
		avg: [],
		max: [],
	}

	for (let i = 0; i < data.length; i += dataStep) {
		const chunk = data.slice(i, i + dataStep)
		const values = chunk.map(item => item.v)

		const min = Math.min(...values)
		const avg = values.reduce((agg, value) => agg + value, 0) / values.length
		const max = Math.max(...values)

		result.min.push(min)
		result.avg.push(avg)
		result.max.push(max)
	}

	postMessage(result)
}
