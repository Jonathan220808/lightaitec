import { data } from './data.js'
export { data }
export const $ = selector => document.querySelector(selector)
export const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
export const pick = list => list[Math.floor(Math.random() * list.length)]
export const sample = (list, count) => [...list].sort(() => Math.random() - .5).slice(0, count)
export const gameById = id => data.catalog.find(item => item.id === id)
export const img = id => `./web-assets/match/${Number(id)}.jpg`
export const cover = id => `./web-assets/home/${id}-v2.jpg`
export const offlineGames = ['soul','mailbox','parent']
export function route(view = '', game = '', room = '') {
  const url = new URL(location.href)
  if (view) url.searchParams.set('view', view); else url.searchParams.delete('view')
  if (game) url.searchParams.set('game', game); else url.searchParams.delete('game')
  if (room) url.searchParams.set('room', room); else url.searchParams.delete('room')
  history.pushState({}, '', url)
  dispatchEvent(new PopStateEvent('popstate'))
  dispatchEvent(new Event('relationship-route'))
}
export function currentRoute() {
  const params = new URLSearchParams(location.search)
  return { view: params.get('view') || 'home', game: params.get('game') || '', room: params.get('room') || '' }
}
export function getName() { return localStorage.getItem('relationship.web.name') || '' }
export function saveName(name) { localStorage.setItem('relationship.web.name', name.trim().slice(0,12)) }
export function toast(message) {
  let node = $('#toast')
  if (!node) { node = document.createElement('div'); node.id = 'toast'; document.body.append(node) }
  node.textContent = message
  node.style.cssText = 'position:fixed;z-index:30;bottom:26px;left:50%;transform:translateX(-50%);max-width:80vw;background:#294743;color:white;border-radius:6px;padding:12px 17px;text-align:center'
  clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => node.remove(), 2800)
}
