import { data, esc, pick } from './core.js'
const state={soul:{mode:'easy',question:''},mailbox:{phase:'notice',question:''},parent:{phase:'notice',mode:'preschool',question:''}}
const used={}
function next(list,key){if(!used[key]){try{used[key]=new Set(JSON.parse(localStorage.getItem(`relationship.web.used.${key}`)||'[]'))}catch{used[key]=new Set()}}if(used[key].size>=list.length)used[key].clear();const left=list.map((q,i)=>({q,i})).filter(item=>!used[key].has(item.i));const item=pick(left);used[key].add(item.i);localStorage.setItem(`relationship.web.used.${key}`,JSON.stringify([...used[key]]));return item.q}
function draw(game){const s=state[game];const list=game==='soul'?data.chat[s.mode]:game==='mailbox'?data.mailbox:data.parent[s.mode];s.question=next(list,`${game}-${s.mode||'all'}`)}
const rule=(number,title,detail)=>`<div class="step"><b>${number}</b><span><strong>${title}</strong><br>${detail}</span></div>`
export function renderOffline(game){const s=state[game]
  if(game==='soul')return `<div class="eyebrow">关系游戏 · 04</div><h1 class="title">心灵奇旅</h1><p class="subtitle">从一个问题开始，慢慢聊。</p><div class="row wrap">${[['easy','轻松题'],['middle','深入题'],['hard','走心题']].map(([id,label])=>`<button class="${s.mode===id?'primary':'secondary'} small" data-action="mode" data-mode="${id}">${label}</button>`).join('')}</div>${s.question?`<div class="panel"><span class="eyebrow">这次聊聊</span><h2>${esc(s.question)}</h2></div>`:'<div class="notice">不用急着回答，先好好听对方说。</div>'}<button class="primary" data-action="draw-offline">${s.question?'换一题':'抽一题'}</button>`
  if(game==='mailbox')return `<div class="eyebrow">关系游戏 · 06</div><h1 class="title">心动信箱</h1><p class="subtitle">一封信，一个认真回答的问题。</p>${s.phase==='notice'?`<h2 class="section-title">开始之前，先做一个小小约定</h2><p class="lead">这些问题没有标准答案。我们先听完彼此的话，带着好奇靠近，也尊重对方不想回答的边界。</p>${rule('01','先听完，再回应','不打断，不急着解释或反驳。')}${rule('02','带着好奇靠近','愿意重新认识眼前这个人。')}${rule('03','表达感受，不攻击','可以坦诚，也可以温柔地说。')}${rule('04','允许跳过问题','每个人都能决定分享多少。')}<button class="primary" data-action="mailbox-start">我愿意认真倾听</button>`:`<div class="row between"><span class="eyebrow">打开一封信</span><button class="secondary small" data-action="mailbox-notice">查看约定</button></div><img class="cover" src="./web-assets/heart-envelope.jpg" alt=""><div class="panel"><h2>${esc(s.question||'今天，想和彼此聊些什么？')}</h2></div><button class="primary" data-action="draw-offline">${s.question?'再打开一封':'打开一封信'}</button>`}`
  if(s.phase==='notice')return `<div class="eyebrow">关系游戏 · 09</div><h1 class="title">亲子悄悄话</h1><p class="subtitle">先听见彼此，再慢慢靠近。</p><h2 class="section-title">开始之前的小约定</h2><p class="lead">这不是一场教育，也不需要立刻解决问题。先放下评判，听听孩子眼中的世界。</p>${rule('01','不随意打断','让孩子把话说完整。')}${rule('02','不急于评判','想法不同，也先试着理解。')}${rule('03','允许孩子说“不”','可以跳过问题，也可以暂时不分享。')}${rule('04','珍惜孩子的信任','不嘲笑、不外传，也不在争吵中引用。')}<button class="primary" data-action="parent-accept">我愿意先认真倾听</button>`
  if(s.phase==='age')return `<div class="eyebrow">亲子悄悄话</div><h1 class="title">孩子现在多大？</h1><p class="subtitle">选一个最接近的阶段，问题会更适合孩子表达。</p>${[['preschool','4–6 岁','从好玩、具体的日常开始'],['primary','7–12 岁','聊学校、朋友与自己的选择'],['teen','13–18 岁','留出尊重、边界和真实对话']].map(([id,label,detail])=>`<button class="card-choice" style="width:100%;text-align:left" data-action="parent-age" data-mode="${id}"><strong>${label}</strong><span class="helper">${detail} ›</span></button>`).join('')}`
  if(s.phase==='note')return `<div class="eyebrow">亲子悄悄话</div><h1 class="title">先说给孩子听</h1><p class="subtitle">开始抽题前，可以把下面这段话读给孩子听。</p><div class="notice">欢迎来到这场小小的对话。今天，你可以和爸爸妈妈分享自己的快乐、烦恼、梦想，还有那些平时不太容易说出口的心里话。这里没有标准答案，也没有必须说出来的秘密。你可以有自己的想法，可以和爸爸妈妈有不同的意见，也可以跳过任何不想回答的问题。你的感受很重要，你的声音值得被认真听见。</div><button class="primary" data-action="parent-start">开始对话</button>`
  return `<div class="row between"><span class="eyebrow">${{preschool:'4–6 岁',primary:'7–12 岁',teen:'13–18 岁'}[s.mode]}</span><button class="secondary small" data-action="parent-change">换年龄段</button></div><h1 class="title">亲子悄悄话</h1><div class="panel"><h2>${esc(s.question||'抽一个问题，慢慢聊')}</h2><p class="helper">可以跳过，也可以想一想再说。</p></div><button class="primary" data-action="draw-offline">${s.question?'换一个问题':'抽一个问题'}</button>`
}
export function offlineAction(action,target,render){const game=new URLSearchParams(location.search).get('game');const s=state[game];if(!s)return
  if(action==='mode'){s.mode=target.dataset.mode;draw(game);render()}
  if(action==='draw-offline'){draw(game);render()}
  if(action==='mailbox-start'){s.phase='play';render()}
  if(action==='mailbox-notice'){s.phase='notice';render()}
  if(action==='parent-accept'){s.phase='age';render()}
  if(action==='parent-age'){s.mode=target.dataset.mode;s.question='';s.phase='note';render()}
  if(action==='parent-start'){s.phase='play';render()}
  if(action==='parent-change'){s.phase='age';render()}
}
