import { route, toast } from './core.js'
const KEY = 'relationship.web.token.v1'
const LAST = 'relationship.web.room.v1'
export function roomUrl() {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return `ws://${location.hostname}:3005`
  return `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/relationship/web-room/ws`
}
export const lastRoom = () => { try { return JSON.parse(localStorage.getItem(LAST)) } catch { return null } }
export function forgetRoom() { localStorage.removeItem(LAST) }
function token() {
  let value = localStorage.getItem(KEY)
  if (!value) { value = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`; localStorage.setItem(KEY, value) }
  return value
}
export class RoomClient {
  constructor(onState, onConnection) { this.onState=onState; this.onConnection=onConnection; this.room=null; this.playerId=''; this.socket=null; this.closed=false; this.timer=null }
  connect(game, code, name, create=false) {
    this.game=game; this.code=code; this.name=name; this.create=create; this.closed=false
    if (this.socket && this.socket.readyState < 2) this.socket.close()
    this.onConnection('连接中')
    const socket = new WebSocket(roomUrl()); this.socket=socket
    socket.onopen=()=>{ if(this.socket!==socket)return; this.onConnection('已连接'); this.send(create?'create_room':'join_room',{game,code,token:token(),name}) }
    socket.onmessage=event=>{
      if(this.socket!==socket)return
      let msg; try{msg=JSON.parse(event.data)}catch{return}
      if(msg.type==='error'){toast(msg.message);if(!this.room){this.onConnection(msg.message);forgetRoom()}return}
      if(msg.type==='welcome'){this.playerId=msg.playerId;this.code=msg.room.code;this.create=false;localStorage.setItem(LAST,JSON.stringify({game,code:this.code}));const url=new URL(location.href);url.searchParams.set('view','room');url.searchParams.set('game',game);url.searchParams.set('room',this.code);history.replaceState({},'',url);dispatchEvent(new Event('relationship-route'))}
      if(msg.room){this.room=msg.room;this.onState(msg.room,this.playerId)}
      if(msg.type==='left'){this.close();forgetRoom();route('entry',game)}
    }
    socket.onerror=()=>{if(this.socket===socket)this.onConnection('连接失败，请检查网络或稍后重试')}
    socket.onclose=()=>{if(this.socket!==socket)return;this.socket=null;if(this.closed)return;this.onConnection('连接中断，正在重连');if(this.code)this.timer=setTimeout(()=>this.connect(this.game,this.code,this.name,false),1800)}
  }
  send(type,payload={}){if(this.socket?.readyState===1)this.socket.send(JSON.stringify({type,...payload}));else toast('正在连接房间')}
  leave(){this.closed=true;clearTimeout(this.timer);if(this.socket?.readyState===1)this.send('leave_room');forgetRoom();setTimeout(()=>{this.socket?.close();route('entry',this.game)},120)}
  close(){this.closed=true;clearTimeout(this.timer);this.socket?.close();this.socket=null}
}
