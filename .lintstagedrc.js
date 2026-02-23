module.exports = {
    '**/*.{css,md,json}': 'prettier --write',
    '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
}
