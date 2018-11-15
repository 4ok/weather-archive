const seasonsMonths = {
	winter: [ 12, 1, 2 ],
	spring: [ 3, 4, 5 ],
	summer: [ 6, 7, 8 ],
	autumn: [ 9, 10, 11 ],
}

onmessage = function filterData({ data: { data, season } }) {
	const seasonMonths = seasonsMonths[season]
	const result = (seasonMonths)
		? data.filter(item => seasonMonths.includes(item.m))
		: data

	postMessage(result)
}
