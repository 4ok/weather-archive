import config from '../configs/common.js'
import { restoreState } from './route.js'

const { defaultRoute } = config

export default function getStore() {
	return window.history.state
		|| restoreState({ routeName: defaultRoute })
		|| {}
}
