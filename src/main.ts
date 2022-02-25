import './dexdata'
import { html2table } from './dexdata'

const pagesource = document.querySelector("#pagesource") as HTMLTextAreaElement
const result = document.querySelector("#result") as HTMLTextAreaElement

document.querySelector('form')!
  .addEventListener('submit', (e) => {
  e.preventDefault()
  e.stopPropagation()
  result.value = html2table(pagesource.value)
})