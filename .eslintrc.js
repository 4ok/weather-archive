const OFF = 0
const ERROR = 2

module.exports = {
	root: true,
	extends: 'airbnb-base',
	env: { browser: true },
	plugins: [
		'json',
	],
	rules: {
		'import/prefer-default-export': OFF,
		'import/extensions': [ ERROR, { js: 'always' }],
		'arrow-body-style': OFF,
		'no-continue': OFF,
		'no-use-before-define': OFF,
		'comma-dangle': [ ERROR, {
			arrays: 'always-multiline',
			objects: 'always-multiline',
			imports: 'always-multiline',
			exports: 'always-multiline',
			functions: 'never',
		}],
		'no-tabs': OFF,
		indent: [ ERROR, 'tab', { SwitchCase: 1 }],
		'newline-after-var': ERROR,
		'newline-before-return': ERROR,
		'no-param-reassign': OFF,
		'no-underscore-dangle': [ ERROR, { allowAfterThis: true }],
		'padded-blocks': OFF,
		'no-plusplus': [ ERROR, { allowForLoopAfterthoughts: true }],
		'template-curly-spacing': [ ERROR, 'always' ],
		'array-bracket-spacing': [ ERROR, 'always', {
			objectsInArrays: false,
			arraysInArrays: false,
		}],
		'newline-per-chained-call': [ ERROR, { ignoreChainWithDepth: ERROR }],
		semi: [ ERROR, 'never' ],
		'object-curly-newline': [ ERROR, {
			ObjectExpression: {
				multiline: true,
				minProperties: ERROR,
			},
			ObjectPattern: {
				multiline: true,
				minProperties: 4,
			},
		}],
		'object-property-newline': [ ERROR, { allowAllPropertiesOnSameLine: false }],
	},
}
