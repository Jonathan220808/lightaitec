import { $, data, esc, gameById, cover, offlineGames, currentRoute, route, getName, saveName, toast } from './core.js'
import { RoomClient, lastRoom } from './room-client.js'
import { renderRoom, roomAction, roomInput, roomPointer } from './room-ui.js'
import { renderOffline, offlineAction } from './offline.js'

const app = $('#app')
let connection = '', roomClient = null, latestRoom = null, currentGame = ''
function button(action, label, style='primary', extra='') { return `<button class="${style}" data-action="${action}" ${extra}>${label}</button>` }
function header(back, title) { return `<header class="topbar">${back ? '<button class="back" data-action="back" aria-label="返回">‹</button>' : '<span class="back" aria-hidden="true"></span>'}<span class="brand">${esc(title || '关系奇旅')}</span><span class="top-actions">${back ? '' : `<button class="nickname" data-action="name">${esc(getName() || '设置昵称')} ✎</button>`}</span></header>` }
function home() {
  const recent=lastRoom()
  return `${header(false,'关系奇旅')}<main class="page"><div class="eyebrow">一起玩，一起更懂彼此</div><h1 class="title">关系奇旅</h1><p class="subtitle">从一个问题、一张卡片或一幅画开始，发现彼此心里的世界。</p><section class="hero"><strong>在玩的过程中，<br>慢慢靠近一点。</strong><p>挑一款现在想玩的游戏吧</p></section>${recent&&gameById(recent.game)?`<div class="notice">上次的房间 ${esc(recent.code)} 还在？${button('resume','重新进入房间','secondary small')}</div>`:''}<h2 class="section-title">十种靠近彼此的方式</h2>${data.catalog.map(game=>`<a class="game-card" href="?view=guide&game=${game.id}" data-link><img src="${cover(game.id)}" alt="${esc(game.name)}"><div class="game-meta"><small>关系游戏 · ${game.number}　${esc(game.players)}</small><h3>${esc(game.name)}</h3><p>${esc(game.detail)}</p></div></a>`).join('')}<p class="helper">有的游戏各用一台手机进同一房间，也有适合面对面同屏玩的抽题游戏。</p></main>`
}
function guide(game) {
  const info=data.guides[game.id] || {}
  return `${header(true,game.name)}<main class="page"><div class="eyebrow">关系游戏 · ${game.number}</div><h1 class="title">${esc(game.name)}</h1><p class="subtitle">${esc(game.detail)}</p><img class="cover" src="${cover(game.id)}" alt=""><p class="lead">${esc(info.lead || game.homeCopy)}</p>${(info.steps||[]).map((step,i)=>`<div class="step"><b>0${i+1}</b><span>${esc(step)}</span></div>`).join('')}<div class="notice">${esc(info.mode||'用你们舒服的方式一起玩。')}</div>${button('play','开始游戏')}</main>`
}
function entry(game) {
  return `${header(true,game.name)}<main class="page"><div class="eyebrow">创建或加入房间</div><h1 class="title">${esc(game.name)}</h1><p class="subtitle">各用一台手机进入同一房间，面对面也可以玩。</p><img class="cover" src="${cover(game.id)}" alt=""><div class="panel"><h2>创建新房间</h2><p class="helper">创建后把六位房间号告诉朋友。</p>${button('create','创建房间')}</div><div class="panel"><h2>加入朋友的房间</h2><label class="helper" for="room-code">输入六位房间号</label><input class="input" id="room-code" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="房间号">${button('join','加入房间','secondary')}</div></main>`
}
function frame(body) { app.innerHTML=`<div class="shell">${body}</div>` }
function render() {
  const {view,game:gameId,room:code}=currentRoute();const game=gameById(gameId)
  currentGame=gameId
  if(view==='home'||!game) return frame(home())
  if(view==='guide') return frame(guide(game))
  if(view==='entry') return frame(entry(game))
  if(view==='offline'&&offlineGames.includes(gameId)) return frame(`${header(true,game.name)}<main class="page">${renderOffline(gameId)}</main>`)
  if(view==='room'){
    if(latestRoom?.code===code&&latestRoom.game===gameId) return frame(`${header(true,game.name)}<main class="page">${renderRoom(latestRoom,roomClient)}</main>`)
    frame(`${header(true,game.name)}<main class="page"><h1 class="title">${connection&&!['连接中','已连接','连接中断，正在重连'].includes(connection)?'暂时没能进入房间':'正在进入房间'}</h1><div class="status">${esc(connection||'连接中')}</div>${button('retry','重新连接','secondary')}${button('entry','返回游戏入口','soft')}</main>`)
    if(!roomClient||roomClient.code!==code||roomClient.game!==gameId){roomClient?.close();roomClient=new RoomClient(onRoom,onConnection);roomClient.connect(gameId,code,getName()||'玩家',false)}
  }
}
function onRoom(room){latestRoom=room;render()}
function onConnection(value){connection=value;const routeNow=currentRoute();if(routeNow.view==='room'&&!latestRoom)render();else if(value==='已连接'&&latestRoom)render()}
function startRoom(game,code,create=false){const name=getName()||'玩家';roomClient?.close();latestRoom=null;roomClient=new RoomClient(onRoom,onConnection);roomClient.connect(game,code,name,create);if(create)frame(`${header(true,gameById(game).name)}<main class="page"><h1 class="title">正在创建房间</h1><p class="status">连接中</p></main>`)}
window.addEventListener('popstate',()=>{const now=currentRoute();if(now.view!=='room'&&roomClient){roomClient.close();roomClient=null;latestRoom=null}render()})
document.addEventListener('click',event=>{
  const link=event.target.closest('[data-link]');if(link){event.preventDefault();history.pushState({},'',link.href);render();dispatchEvent(new Event('relationship-route'));return}
  const target=event.target.closest('[data-action]');if(!target)return
  const action=target.dataset.action;const game=currentRoute().game
  if(action==='back'){if(currentRoute().view==='room')route('entry',game);else if(currentRoute().view==='entry'||currentRoute().view==='offline')route('guide',game);else route();return}
  if(action==='name'){const value=prompt('游戏昵称',getName())?.trim().slice(0,12);if(value){saveName(value);render()}return}
  if(action==='play'){route(offlineGames.includes(game)?'offline':'entry',game);return}
  if(action==='create'){startRoom(game,'',true);return}
  if(action==='join'){const code=$('#room-code')?.value.trim();if(!/^\d{6}$/.test(code))return toast('请输入六位房间号');route('room',game,code);return}
  if(action==='resume'){const last=lastRoom();if(last)route('room',last.game,last.code);return}
  if(action==='retry'){roomClient?.connect(game,currentRoute().room,getName()||'玩家');return}
  if(action==='entry'){route('entry',game);return}
  if(currentRoute().view==='offline')return offlineAction(action,target,render)
  if(currentRoute().view==='room'&&roomClient)return roomAction(action,target,roomClient,render)
})
document.addEventListener('input',event=>{if(currentRoute().view==='room')roomInput(event,roomClient,render)})
document.addEventListener('pointerdown',event=>{if(currentRoute().view==='room')roomPointer(event,roomClient,render)})
render()
