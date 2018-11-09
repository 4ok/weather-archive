const workers = {}

export default function getWorkerResult(path, data) {

	if (workers[path]) {
		workers[path].terminate()

		workers[path] = null
	}

	const worker = new Worker(`${ path }.js`)

	workers[path] = worker

	worker.postMessage(data)

	return new Promise((resolve, reject) => {
		worker.onmessage = function onmessage(e) {
			resolve(e.data)
		}

		worker.onerror = reject
	})
}
