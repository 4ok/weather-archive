export default {
	scales: { axisY: { numTicks: [ 6, 16 ] } },
	styles: {
		init: { fillStyle: '#fff' },
		scales: {
			axisY: {
				ticks: {
					lineWidth: 1,
					strokeStyle: '#eee',
				},
				units: {
					fillStyle: '#777',
					font: '12px Arial',
					textAlign: 'end',
				},
				title: {
					fillStyle: '#333',
					font: '14px sans-serif',
				},
			},
			axisX: {
				title: {
					fillStyle: '#333',
					font: '13px sans-serif',
				},
			},
		},
		chart: {
			curves: {
				min: {
					lineWidth: 3,
					strokeStyle: '#1890ff',
				},
				avg: {
					lineWidth: 3,
					strokeStyle: '#52c41a',
				},
				max: {
					lineWidth: 3,
					strokeStyle: '#f5222d',
				},
			},
			points: {
				min: {
					radius: 3,
					lineWidth: 3,
					strokeStyle: '#1890ff',
					fillStyle: '#fff',
				},
				avg: {
					radius: 3,
					lineWidth: 3,
					strokeStyle: '#52c41a',
					fillStyle: '#fff',
				},
				max: {
					radius: 3,
					lineWidth: 3,
					strokeStyle: '#f5222d',
					fillStyle: '#fff',
				},

			},
			highlightPoints: {
				min: {
					radius: 4,
					lineWidth: 3,
					strokeStyle: '#1890ff',
					fillStyle: '#91d5ff',
				},
				max: {
					radius: 4,
					lineWidth: 3,
					strokeStyle: '#f5222d',
					fillStyle: '#ffa39e',
				},
			},
		},
	},
}
