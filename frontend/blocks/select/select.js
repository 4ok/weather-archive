function onChangeSelect({ onChange }, e) {
	const { target } = e
	const data = { [target.name]: target.value }

	onChange(e, data)
}

export function create({
	name,
	options,
	className,
	onChange,
}) {
	const select = document.createElement('select')

	select.name = name

	if (className) {
		select.className = className
	}

	options.forEach(({
		text,
		value,
		selected,
		disabled,
		className: itemClassName,
	}) => {
		const option = document.createElement('option')

		option.textContent = text
		option.value = value
		option.selected = selected
		option.disabled = disabled

		if (itemClassName) {
			option.className = itemClassName
		}

		select.append(option)
	})

	select.addEventListener(
		'change',
		onChangeSelect.bind(null, { onChange })
	)

	return select
}
