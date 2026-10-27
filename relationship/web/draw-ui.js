import { data, esc, pick, toast } from './core.js'
const state={prompt:'',image:'',undo:[],color:'#1d302d',size:5,tool:'pen',gallery:0,round:0}
const draftKey=room=>`relationship.web.draw.draft.${room.code}.${room.roundNumber}`
const colors=['#1d302d','#ffffff','#697482','#c94b50','#f0796d','#e8c440','#73a765','#357c72','#4799a6','#458fc6','#7459aa','#b15b9d','#e39db3','#efc49c','#725f4d']
function btn(action,label,kind='primary',extra=''){return `<button class="${kind}" data-action="${action}" ${extra}>${label}</button>`}
export function renderDraw(room,client){if(state.round!==room.roundNumber){state.round=room.roundNumber;state.image=localStorage.getItem(draftKey(room))||'';state.undo=[];state.gallery=0}const host=room.hostId===client.playerId,submitted=room.players.find(p=>p.id===client.playerId)?.submitted;if(submitted)localStorage.removeItem(draftKey(room))
  if(room.phase==='drawing'){
    queueMicrotask(()=>{const canvas=document.querySelector('#draw-canvas');if(!canvas)return;const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);if(state.image){const image=new Image();image.onload=()=>ctx.drawImage(image,0,0,canvas.width,canvas.height);image.src=state.image}})
    return `<div class="row between"><div><span class="eyebrow">这次一起画</span><h2>${esc(room.prompt)}</h2></div></div><p class="helper">${room.players.filter(p=>p.submitted).length} / ${room.players.length} 人已完成</p>${submitted?'<div class="notice">画好了，等待大家完成后一起揭晓。</div>':`<div class="canvas-wrap"><canvas id="draw-canvas" width="520" height="470" aria-label="画布"></canvas></div><div class="swatches">${colors.map(color=>`<button class="swatch ${state.color===color?'active':''}" style="background:${color}" data-action="color" data-color="${color}" aria-label="颜色"></button>`).join('')}</div><div class="toolbar">${[3,6,10].map((size,i)=>`<button data-action="size" data-size="${size}">${['细','中','粗'][i]}</button>`).join('')}<button data-action="eraser">橡皮</button><button data-action="undo">撤销</button><button data-action="clear">清空</button></div>${btn('submit-art','画好了，完成')}`}${host&&room.players.some(p=>p.submitted)?btn('reveal-art','现在揭晓','secondary'):''}`
  }
  if(room.phase==='gallery'){const item=room.artworks[state.gallery]||room.artworks[0];return `<div class="eyebrow">一起来看大家画了什么</div><h2 class="section-title">${esc(room.prompt)}</h2>${item?`<div class="panel"><img class="gallery-img" src="${item.image}" alt="${esc(item.name)}的画"><p>${esc(item.name)} 的画</p></div><div class="row wrap">${room.artworks.map((art,i)=>`<button class="secondary small" data-action="gallery" data-index="${i}">${esc(art.name)}</button>`).join('')}</div>`:''}<p class="helper">看看同一个话题，在每个人心里是什么样子。</p>${btn('next-draw','再来一轮')}`}
  return `<div class="panel"><h2>${host?'选一个这次一起画的话题':'房主正在选话题'}</h2>${host?`<div class="row wrap">${Object.entries(data.drawPrompts).map(([id,list])=>`<button class="secondary small" data-action="prompt-sample" data-level="${id}">${{easy:'轻松',middle:'深入',deep:'走心'}[id]}</button>`).join('')}</div><textarea id="draw-prompt" class="textarea" maxlength="80" placeholder="抽一个话题，或者自己写">${esc(state.prompt)}</textarea>${btn('set-prompt','确定话题')}${btn('start-draw','开始画')}`:'<p class="helper">等房主定好话题，大家一起作画。</p>'}</div>`
}
export function drawAction(action,target,client,render){const room=client.room
  if(action==='prompt-sample'){state.prompt=pick(data.drawPrompts[target.dataset.level]);render()}
  if(action==='set-prompt'){const prompt=document.querySelector('#draw-prompt')?.value.trim();if(!prompt)return toast('请先选一个话题');state.prompt=prompt;client.send('set_prompt',{prompt})}
  if(action==='start-draw'){const prompt=document.querySelector('#draw-prompt')?.value.trim()||room.prompt;if(!prompt)return toast('请先选一个话题');if(prompt!==room.prompt){client.send('set_prompt',{prompt});setTimeout(()=>client.send('start_round'),120)}else client.send('start_round')}
  if(action==='color'){state.color=target.dataset.color;state.tool='pen';render()}
  if(action==='size'){state.size=Number(target.dataset.size);state.tool='pen';render()}
  if(action==='eraser'){state.tool='eraser';render()}
  if(action==='undo'){state.image=state.undo.pop()||'';localStorage.setItem(draftKey(room),state.image);render()}
  if(action==='clear'){if(!confirm('清空画布？'))return;state.undo.push(state.image);state.image='';localStorage.removeItem(draftKey(room));render()}
  if(action==='submit-art'){const canvas=document.querySelector('#draw-canvas');if(!canvas)return;const image=canvas.toDataURL('image/jpeg',.68);if(image.length>410000)return toast('画作太大，请先清空或减少细节');client.send('submit_art',{image})}
  if(action==='reveal-art')client.send('reveal')
  if(action==='gallery'){state.gallery=Number(target.dataset.index);render()}
  if(action==='next-draw')client.send('next_round',{fromResult:true,roundNumber:room.roundNumber})
}
export function drawInput(event){if(event.target.id==='draw-prompt')state.prompt=event.target.value}
export function drawPointer(event,client){if(event.target.id!=='draw-canvas')return
  const canvas=event.target,ctx=canvas.getContext('2d'),rect=canvas.getBoundingClientRect()
  const point=e=>({x:(e.clientX-rect.left)*canvas.width/rect.width,y:(e.clientY-rect.top)*canvas.height/rect.height})
  state.undo.push(state.image)
  canvas.setPointerCapture(event.pointerId);ctx.beginPath();const start=point(event);ctx.moveTo(start.x,start.y);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=state.tool==='eraser'?'#ffffff':state.color;ctx.lineWidth=state.tool==='eraser'?25:state.size
  const move=e=>{const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke()}
  const end=e=>{canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',end);canvas.removeEventListener('pointercancel',end);state.image=canvas.toDataURL('image/png');try{localStorage.setItem(draftKey(client.room),state.image)}catch{}}
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end)
}
