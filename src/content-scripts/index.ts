import { qsStrict, sleep, waitForElm } from '@/lib/DOM'
import { sortIcon } from './helpers/sortIcon'
import './styles.css'

function sortTable(column: number, btn: HTMLButtonElement) {
	const rows = document.querySelectorAll('gf-stat-row')
	document
		.querySelectorAll<HTMLButtonElement>('button.sort-button')
		.forEach((btn) => (btn.disabled = true))
	const asc = btn.classList.contains('asc')
	const sortedGf = Array.from(rows).sort((a, b) => {
		const aEl = a.querySelector('ol')?.querySelectorAll('li.stat-row__cell')[
			column
		]
		const aVal = aEl?.textContent?.trim()
		const bEl = b.querySelector('ol')?.querySelectorAll('li.stat-row__cell')[
			column
		]
		const bVal = bEl?.textContent?.trim()
		if (!aVal || !bVal) return 0

		if (aEl?.className.includes('numeric')) {
			const aNum = Number(aVal.replace(/[^0-9\-]/g, ''))
			const bNum = Number(bVal.replace(/[^0-9\-]/g, ''))
			if (asc) {
				return aNum > bNum ? 1 : -1
			} else {
				return bNum > aNum ? 1 : -1
			}
		}
		if (asc) {
			return aVal.trim().localeCompare(bVal)
		} else {
			return bVal.trim().localeCompare(aVal)
		}
	})

	btn.classList.toggle('asc')

	rows.forEach((row) => row.remove())
	const table = qsStrict('.analytics__table')
	sortedGf.forEach((gf, i) => {
		table.appendChild(gf)
	})
	document
		.querySelectorAll<HTMLButtonElement>('.sort-button')
		.forEach((btn) => (btn.disabled = false))
}

waitForElm<HTMLOListElement>('ol.gmat-subtitle-2.stat-row').then(async (ol) => {
	const lis = ol.querySelectorAll<HTMLLIElement>('li')
	for (let idx = 0; idx < lis.length; idx++) {
		const li = lis[idx]
		li.classList.add('table-header')
		const btn = document.createElement('button')
		btn.innerHTML = sortIcon
		btn.classList.add('sort-button')
		btn.addEventListener('click', () => sortTable(idx, btn))

		li.insertAdjacentElement('beforeend', btn)
	}
})
