import options from './chart-options.js'

const CIRCLE_RADIANS = Math.PI * 2

const chartMargins = {
	top: 10,
	right: 10,
	bottom: 40,
	left: 70,
}

function getChartY({
	value,
	min,
	maxDiff,
	height,
}) {
	return Math.round(
		(height - ((value - min) / maxDiff) * height)
		+ chartMargins.top
	)
}

function drawPoint({
	context,
	x,
	y,
	style,
}) {
	context.save()
	Object.assign(context, style)
	context.beginPath()

	context.arc(x, y, style.radius, 0, CIRCLE_RADIANS)
	context.stroke()
	context.fill()
	context.closePath()

	context.restore()
}

function drawPoints({
	context,
	coords,
	style,
	highlightStyle,
	extremum,
}) {
	const startCoord = coords[0]
	const getStyle = y => ((y === extremum) ? highlightStyle : style)

	context.moveTo(startCoord.x, startCoord.y)

	drawPoint({
		context,
		x: startCoord.x,
		y: startCoord.y,
		style: getStyle(startCoord.y),
	})

	coords.forEach(({ x, y }) => {
		drawPoint({
			context,
			x,
			y,
			style: getStyle(y),
		})
	})
}

function drawCurve({ context, coords, style }) {
	const startCoord = coords[0]

	context.save()
	Object.assign(context, style)
	context.beginPath()
	context.moveTo(startCoord.x, startCoord.y)

	coords.forEach(({ x, y }) => {
		context.lineTo(x, y)
	})

	context.stroke()
	context.closePath()
	context.restore()
}

function drawAxisXTitle({
	context,
	canvasWidth,
	canvasHeight,
	styles,
	title,
}) {
	context.save()
	Object.assign(context, styles.title)

	const { width: textWidth } = context.measureText(title)
	const titleX = (canvasWidth / 2) - (textWidth / 2)

	context.fillText(title, titleX, canvasHeight - 10)
	context.restore()
}

function drawAxisX({
	context,
	canvasWidth,
	canvasHeight,
	title,
}) {
	const styles = options.styles.scales.axisX

	drawAxisXTitle({
		context,
		canvasWidth,
		canvasHeight,
		styles,
		title,
	})
}

function drawScaleYTitle({
	context,
	chartHeight,
	styles,
	title,
}) {
	context.save()
	Object.assign(context, styles.title)

	const { width: textWidth } = context.measureText(title)
	const titleY = chartMargins.top + (chartHeight / 2) + (textWidth / 2)

	context.translate(20, titleY)
	context.rotate(-Math.PI / 2)
	context.fillText(title, 0, 0)
	context.restore()
}

function drawScaleYTicks({
	context,
	chartHeight,
	canvasWidth,
	min,
	maxDiff,
	numTicks,
	styles,
}) {
	const valueStep = maxDiff / (numTicks - 1)

	context.save()
	Object.assign(context, styles.ticks, styles.units)
	context.beginPath()

	for (let i = 0; i < numTicks; i++) {
		const value = Number((min + (valueStep * i)).toFixed(1))
		const y = getChartY({
			value,
			min,
			maxDiff,
			height: chartHeight,
		}) - (i === 0 ? 0.5 : -0.5)

		context.fillText(value, 55, y + 3)
		context.moveTo(chartMargins.left, y)
		context.lineTo(canvasWidth - chartMargins.right, y)
	}

	context.stroke()
	context.closePath()
	context.restore()
}

function drawAxisY({
	context,
	chartHeight,
	canvasWidth,
	min,
	maxDiff,
	numTicks,
	title,
}) {
	const styles = options.styles.scales.axisY

	drawScaleYTicks({
		context,
		canvasWidth,
		chartHeight,
		min,
		maxDiff,
		numTicks,
		styles,
	})

	drawScaleYTitle({
		context,
		chartHeight,
		styles,
		title,
	})
}

function drawAxes({
	context,
	canvasWidth,
	canvasHeight,
	chartHeight,
	min,
	maxDiff,
	numTicks,
	titles,
	unitsNames,
}) {
	drawAxisY({
		context,
		canvasWidth,
		canvasHeight,
		chartHeight,
		min,
		maxDiff,
		numTicks,
		title: `${ titles.y } ${ unitsNames.y }`,
	})

	drawAxisX({
		context,
		canvasWidth,
		canvasHeight,
		title: titles.x,
	})
}

function getCoords({
	values,
	min,
	maxDiff,
	chartWidth,
	chartHeight,
}) {
	const stepX = chartWidth / (values.length - 1)
	const result = [{
		x: chartMargins.left,
		y: getChartY({
			value: values.shift(),
			min,
			maxDiff,
			height: chartHeight,
		}),
	}]

	values.forEach((value, index) => {
		result.push({
			x: result[index].x + stepX,
			y: getChartY({
				value,
				min,
				maxDiff,
				height: chartHeight,
			}),
		})
	})

	return result
}

function getChartParams({
	min,
	max,
	minNumTicks,
	maxNumTicks,
}) {
	const maxDiff = max - min
	let numTicks = maxNumTicks

	if (maxDiff < minNumTicks) {
		return {
			min,
			max: (maxDiff > 0) ? max : max + 1,
			numTicks: minNumTicks,
		}
	}
	while (maxDiff % (numTicks - 1) !== 0) {
		numTicks -= 1

		if (numTicks < minNumTicks) {
			max += 1

			return getChartParams({
				min,
				max,
				minNumTicks,
				maxNumTicks,
			})
		}
	}

	return {
		min,
		max,
		numTicks,
	}
}

function initCanvas({ width, height }) {
	const canvas = document.createElement('canvas')

	canvas.className = 'chart__canvas'
	canvas.width = width
	canvas.height = height

	const context = canvas.getContext('2d')

	Object.assign(context, options.styles.init)
	context.fillRect(0, 0, width, height)

	return {
		canvas,
		context,
	}
}

function getSummary({ items }) {
	const summary = document.createElement('div')

	summary.className = 'chart__summary'

	Object
		.keys(items)
		.forEach((name) => {
			const elem = document.createElement('div')
			const item = items[name]
			const text = `${ item.name } ${ item.value } ${ item.unitsName }${ item.date ? `. ${ item.date }` : '' }`

			elem.className = `chart__summary-item chart__summary-${ name }`
			elem.textContent = text

			summary.append(elem)
		})

	return summary
}

export function create({
	groupsValues,
	summaryItems,
	width,
	height,
	axesTitles,
	unitsNames,
}) {
	const chart = document.createElement('div')
	const { canvas, context } = initCanvas({
		width,
		height,
	})

	chart.className = 'chart'
	chart.append(canvas)

	const values = Object
		.keys(groupsValues)
		.reduce((result, key) => result.concat(groupsValues[key]), [])

	const minValue = Math.min(...values)
	const maxValue = Math.max(...values)

	const [ minNumTicks, maxNumTicks ] = options.scales.axisY.numTicks

	const { min, max, numTicks } = getChartParams({
		min: Math.floor(minValue),
		max: Math.ceil(maxValue),
		minNumTicks,
		maxNumTicks,
	})

	const canvasWidth = width
	const canvasHeight = height
	const maxDiff = max - min
	const chartWidth = canvasWidth - chartMargins.left - chartMargins.right
	const chartHeight = canvasHeight - (chartMargins.top + chartMargins.bottom)

	drawAxes({
		context,
		canvasWidth,
		canvasHeight,
		chartHeight,
		min,
		maxDiff,
		numTicks,
		titles: axesTitles,
		unitsNames,
	})

	const groupsCoords = Object
		.keys(groupsValues)
		.reduce((result, key) => {
			result[key] = getCoords({
				values: groupsValues[key],
				min,
				maxDiff,
				chartWidth,
				chartHeight,
			})

			return result
		}, {})

	const {
		curves: curvesStyles,
		points: pointsStyles,
		highlightPoints: highlightPointsStyles,
	} = options.styles.chart

	Object
		.keys(groupsCoords)
		.forEach((key) => {
			drawCurve({
				context,
				coords: groupsCoords[key],
				style: curvesStyles[key],
			})
		})

	Object
		.keys(groupsCoords)
		.forEach((key) => {
			const coords = groupsCoords[key]
			const params = {
				context,
				coords,
				style: pointsStyles[key],
				highlightStyle: highlightPointsStyles[key],
			}

			if ([ 'min', 'max' ].includes(key)) {
				const yCoords = coords.map(coord => coord.y)
				const method = (key === 'min') ? 'max' : 'min'

				params.extremum = Math[method](...yCoords)
			}

			drawPoints(params)
		})

	const summary = getSummary({ items: summaryItems })

	chart.prepend(summary)

	return chart
}
