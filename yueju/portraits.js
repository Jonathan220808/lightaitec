/* ========================================
   Portrait Generator — Cantonese Opera (粤剧)
   60 characters, each with a layered SVG portrait
   based on real stage imagery references.

   Stylized — not photographic — to fit our dark
   gold-accented page aesthetic.

   Layer stack (bottom → top):
     1. Background gradient + themed motif
     2. Costume / collar (per role type)
     3. Face base + skin shading
     4. Face paint (脸谱) for 净 / ghost / red-loyal types
     5. Cheek rouge (where applicable)
     6. Operatic eye makeup
     7. Eyebrow shape
     8. Forehead decoration (花钿 / 月牙 / 红痣)
     9. Lips
    10. Beard (if applicable)
    11. Headdress (凤冠 / 帅盔 / 状元巾 / etc.)
    12. Signature corner element
    13. Name strip

   Replace SVG with real stage photos in production.
   ======================================== */

/* ========================================
   COLOR HELPERS
   ======================================== */
function shadeC(hex, percent) {
  let R = parseInt(hex.slice(1, 3), 16);
  let G = parseInt(hex.slice(3, 5), 16);
  let B = parseInt(hex.slice(5, 7), 16);
  R = Math.min(255, Math.max(0, R + Math.floor(R * percent / 100)));
  G = Math.min(255, Math.max(0, G + Math.floor(G * percent / 100)));
  B = Math.min(255, Math.max(0, B + Math.floor(B * percent / 100)));
  return '#' + [R, G, B].map(n => n.toString(16).padStart(2, '0')).join('');
}

/* ========================================
   PER-CHARACTER VISUAL SPECS
   ======================================== */
window.CHARACTER_VISUALS = {

  /* ============== MALE 30 ============== */

  /* 唐涤生四大名剧 男主 */
  zhoushixian:    { bg:'misty-mountains',   bgTone:'#1a2a2a', costume:'scholar-red',     costumeColor:'#a01a1a', faceTone:'#e8d8c8', facePaint:'none',           eyes:'narrow-sheng', eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#7a2a2a', beard:'none',            headdress:'zhuangyuan-hat',  headdressColor:'#a01a1a', headdressAccent:'#d4a017', signature:'fan',         faceShape:'narrow' },
  liyi:           { bg:'rain-pearls',       bgTone:'#1a1a3a', costume:'scholar-blue',    costumeColor:'#3a4a7a', faceTone:'#e8d8c8', facePaint:'none',           eyes:'narrow-sheng', eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#7a2a2a', beard:'none',            headdress:'wensheng-jin',    headdressColor:'#1a1a3a', headdressAccent:'#d4a017', signature:'hairpin',     faceShape:'narrow' },
  liumengmei:     { bg:'peony',             bgTone:'#2a3a1a', costume:'scholar-green',   costumeColor:'#3a5a3a', faceTone:'#e8d8c8', facePaint:'none',           eyes:'narrow-sheng', eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#7a2a2a', beard:'none',            headdress:'wensheng-jin',    headdressColor:'#1a2a14', headdressAccent:'#d4a017', signature:'willow',      faceShape:'narrow' },
  peiyu:          { bg:'plum-blossoms',     bgTone:'#1a1a2a', costume:'scholar-blue',    costumeColor:'#2a3a5a', faceTone:'#e8d8c8', facePaint:'none',           eyes:'narrow-sheng', eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#7a2a2a', beard:'none',            headdress:'wensheng-jin',    headdressColor:'#1a1a2a', headdressAccent:'#d4a017', signature:'plum',        faceShape:'narrow' },

  /* 其他男主 */
  zhaoruzhou:     { bg:'butterflies',       bgTone:'#1a2a2a', costume:'scholar-grey',    costumeColor:'#5a5a5a', faceTone:'#e8d8c8', facePaint:'none',           eyes:'narrow-sheng', eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#7a2a2a', beard:'none',            headdress:'zhuangyuan-hat',  headdressColor:'#a01a1a', headdressAccent:'#d4a017', signature:'butterfly',   faceShape:'narrow' },
  jiangshilong:   { bg:'rain-pearls',       bgTone:'#1a2a3a', costume:'scholar-grey',    costumeColor:'#4a5a6a', faceTone:'#e8d8c8', facePaint:'none',           eyes:'narrow-sheng', eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#7a2a2a', beard:'none',            headdress:'fang-jin',        headdressColor:'#2a2a3a', headdressAccent:'#d4a017', signature:'umbrella',    faceShape:'narrow' },
  tangbohu:       { bg:'plum-blossoms',     bgTone:'#1a3a3a', costume:'scholar-bright',  costumeColor:'#3a8aa0', faceTone:'#e8d8c8', facePaint:'none',           eyes:'comic-bright', eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'smile-small', lipColor:'#7a2a2a', beard:'none',            headdress:'wensheng-jin',    headdressColor:'#1a3a3a', headdressAccent:'#d4a017', signature:'fan',         faceShape:'narrow' },
  jiangliuyun:    { bg:'cloud-warriors',    bgTone:'#1a1a3a', costume:'warrior-light',   costumeColor:'#c0c0d0', faceTone:'#e8d8c8', facePaint:'none',           eyes:'sharp-wu',     eyeAccent:'#1a0a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#7a2a2a', beard:'none',            headdress:'zijin-crown',     headdressColor:'#5a3a8a', headdressAccent:'#d4a017', signature:'sword-twin',  faceShape:'oval-strong' },
  wenpingsheng:   { bg:'snow',              bgTone:'#2a2a3a', costume:'mourning-white',  costumeColor:'#e0e0e0', faceTone:'#e8d8c8', facePaint:'none',           eyes:'sad-male',     eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#7a2a2a', beard:'none',            headdress:'mourning-band',   headdressColor:'#fafafa', headdressAccent:'#a01a1a', signature:'sword',       faceShape:'oval-strong' },

  /* 帝王 */
  chongzhen:      { bg:'imperial-dragon',   bgTone:'#3a1a14', costume:'imperial-yellow', costumeColor:'#c4a020', faceTone:'#e0c8a0', facePaint:'pale-aged',      eyes:'narrow-aged',  eyeAccent:'#3a1a0a', forehead:'red-line',     foreheadColor:'#a01a1a', lips:'small-male', lipColor:'#5a1a1a', beard:'long-grey-three', headdress:'imperial-mian',   headdressColor:'#1a1a1a', headdressAccent:'#d4a017', signature:'sword',       faceShape:'oval-strong' },
  shunzhi:        { bg:'imperial-dragon',   bgTone:'#1a3a1a', costume:'imperial-yellow', costumeColor:'#c4a020', faceTone:'#e0c8a0', facePaint:'none',           eyes:'narrow-sheng', eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#5a1a1a', beard:'long-black-thin', headdress:'qing-crown',      headdressColor:'#1a1a1a', headdressAccent:'#d4a017', signature:'dragon',      faceShape:'oval-strong' },
  lihouzhu:       { bg:'misty-mountains',   bgTone:'#2a2a2a', costume:'imperial-pale',   costumeColor:'#d8d4c0', faceTone:'#e8d8c8', facePaint:'none',           eyes:'sad-male',     eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#5a1a1a', beard:'none',            headdress:'pingtian-mian',   headdressColor:'#5a4a3a', headdressAccent:'#d4a017', signature:'flute',       faceShape:'narrow' },
  tangminghuang:  { bg:'imperial-dragon',   bgTone:'#3a2a14', costume:'imperial-yellow', costumeColor:'#c4a020', faceTone:'#e0c8a0', facePaint:'none',           eyes:'narrow-aged',  eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#5a1a1a', beard:'long-black-thin', headdress:'imperial-mian',   headdressColor:'#5a1a1a', headdressAccent:'#d4a017', signature:'dragon',      faceShape:'oval-strong' },

  /* 大花脸 */
  baozheng:       { bg:'plain-dark',        bgTone:'#0a0a14', costume:'official-black',  costumeColor:'#1a1a2a', faceTone:'#0a0a0a', facePaint:'black-with-moon',eyes:'wide-jing',    eyeAccent:'#fafafa', forehead:'crescent-moon', foreheadColor:'#fafafa', lips:'no-color',  lipColor:'#000',    beard:'long-black-full', headdress:'sha-mao-wide',    headdressColor:'#1a1a1a', headdressAccent:'#d4a017', signature:'gavel',       faceShape:'oval-strong' },
  jiasidao:       { bg:'plain-dark',        bgTone:'#1a0a1a', costume:'official-dark',   costumeColor:'#3a1a3a', faceTone:'#fafafa', facePaint:'white-treach',  eyes:'wide-jing',    eyeAccent:'#1a0a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#5a1a1a', beard:'mustache-thin',   headdress:'sha-mao-wide',    headdressColor:'#1a1a1a', headdressAccent:'#a01a1a', signature:'fan',         faceShape:'oval-strong' },
  lutaiwei:       { bg:'cloud-warriors',    bgTone:'#3a0a0a', costume:'warrior-armor',   costumeColor:'#a01a1a', faceTone:'#c41a1a', facePaint:'red-fierce',    eyes:'wide-jing',    eyeAccent:'#1a0a0a', forehead:'gold-pattern', foreheadColor:'#d4a017', lips:'small-male',lipColor:'#5a0a0a', beard:'long-black-full', headdress:'shuai-helmet',    headdressColor:'#d4a017', headdressAccent:'#a01a1a', signature:'baton',       faceShape:'oval-strong' },
  zhouzhong:      { bg:'plain-warm',        bgTone:'#2a2a3a', costume:'official-mid',    costumeColor:'#3a4a6a', faceTone:'#f0d8c0', facePaint:'comic-white',   eyes:'comic-bright', eyeAccent:'#1a0a0a', forehead:'none',         foreheadColor:'#000', lips:'smile-small', lipColor:'#7a2a2a', beard:'mustache-thin',   headdress:'sha-mao',         headdressColor:'#1a1a1a', headdressAccent:'#d4a017', signature:'fan',         faceShape:'narrow' },

  /* 武戏英雄 */
  guanyu:         { bg:'plain-warm',        bgTone:'#3a0a0a', costume:'warrior-green',   costumeColor:'#1a5a2a', faceTone:'#c41a1a', facePaint:'red-loyal',     eyes:'phoenix-eye',  eyeAccent:'#1a0a0a', forehead:'gold-pattern', foreheadColor:'#d4a017', lips:'small-male',lipColor:'#5a0a0a', beard:'long-black-five', headdress:'fuzi-helmet',     headdressColor:'#1a5a2a', headdressAccent:'#d4a017', signature:'guandao',     faceShape:'oval-strong' },
  zhaozilong:     { bg:'cloud-warriors',    bgTone:'#1a2a3a', costume:'warrior-white',   costumeColor:'#e8e8e8', faceTone:'#e8d8c8', facePaint:'none',           eyes:'sharp-wu',     eyeAccent:'#1a0a0a', forehead:'flower-mark', foreheadColor:'#a01a1a', lips:'small-male', lipColor:'#7a2a2a', beard:'none',            headdress:'da-ezi-helmet',   headdressColor:'#e8e8e8', headdressAccent:'#a01a1a', signature:'spear',       faceShape:'oval-strong' },
  lübu:           { bg:'cloud-warriors',    bgTone:'#3a2a3a', costume:'warrior-pink',    costumeColor:'#c8709a', faceTone:'#e8d8c8', facePaint:'none',           eyes:'sharp-wu',     eyeAccent:'#1a0a0a', forehead:'flower-mark', foreheadColor:'#a01a1a', lips:'small-male', lipColor:'#7a2a2a', beard:'none',            headdress:'zijin-crown-tall',headdressColor:'#5a3a8a', headdressAccent:'#d4a017', signature:'halberd',     faceShape:'oval-strong' },
  zhouyu:         { bg:'cloud-warriors',    bgTone:'#1a1a3a', costume:'warrior-pink',    costumeColor:'#c47090', faceTone:'#e8d8c8', facePaint:'none',           eyes:'sharp-wu',     eyeAccent:'#1a1a3a', forehead:'flower-mark', foreheadColor:'#a01a3a', lips:'small-male', lipColor:'#5a1a3a', beard:'none',            headdress:'zijin-crown-tall',headdressColor:'#3a3a8a', headdressAccent:'#d4a017', signature:'fan-feather', faceShape:'narrow' },
  luocheng:       { bg:'cloud-warriors',    bgTone:'#2a2a3a', costume:'warrior-silver',  costumeColor:'#c8c8d8', faceTone:'#e8d8c8', facePaint:'none',           eyes:'sharp-wu',     eyeAccent:'#1a0a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male', lipColor:'#7a2a2a', beard:'none',            headdress:'silver-helmet',   headdressColor:'#c8c8d8', headdressAccent:'#a01a1a', signature:'spear-silver',faceShape:'oval-strong' },
  linchong:       { bg:'snow',              bgTone:'#2a2a3a', costume:'warrior-snow',    costumeColor:'#5a6a8a', faceTone:'#e0d0c0', facePaint:'none',           eyes:'sharp-wu',     eyeAccent:'#1a0a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male', lipColor:'#5a1a1a', beard:'none',            headdress:'luo-mao-snow',    headdressColor:'#3a3a4a', headdressAccent:'#a01a1a', signature:'spear-snake', faceShape:'oval-strong' },
  wusong:         { bg:'plain-warm',        bgTone:'#3a1a14', costume:'short-fight-red', costumeColor:'#a01a1a', faceTone:'#e8d4b0', facePaint:'none',           eyes:'sharp-wu',     eyeAccent:'#1a0a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male', lipColor:'#7a2a2a', beard:'none',            headdress:'hero-band',       headdressColor:'#a01a1a', headdressAccent:'#d4a017', signature:'tiger',       faceShape:'oval-strong' },
  yangliulang:    { bg:'cloud-warriors',    bgTone:'#1a2a2a', costume:'warrior-white',   costumeColor:'#e0e0e0', faceTone:'#e0c8a0', facePaint:'none',           eyes:'narrow-aged',  eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male', lipColor:'#5a1a1a', beard:'long-black-three',headdress:'shuai-helmet-w',  headdressColor:'#e0e0e0', headdressAccent:'#a01a1a', signature:'spear',       faceShape:'oval-strong' },

  /* 老生 / 智者 */
  kouzhun:        { bg:'plain-warm',        bgTone:'#3a1a0a', costume:'official-red',    costumeColor:'#a01a1a', faceTone:'#e0c8a0', facePaint:'pale-aged',      eyes:'narrow-aged',  eyeAccent:'#3a1a0a', forehead:'red-line',     foreheadColor:'#a01a1a', lips:'small-male', lipColor:'#5a1a1a', beard:'long-grey-full',  headdress:'xiang-sha',       headdressColor:'#1a1a1a', headdressAccent:'#d4a017', signature:'tablet',      faceShape:'oval-strong' },
  xiebao:         { bg:'misty-mountains',   bgTone:'#1a2a2a', costume:'scholar-grey',    costumeColor:'#4a4a4a', faceTone:'#d8c0a0', facePaint:'pale-aged',      eyes:'narrow-aged',  eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#5a1a1a', beard:'long-grey-three', headdress:'fang-jin',        headdressColor:'#2a2a2a', headdressAccent:'#d4a017', signature:'scroll',      faceShape:'narrow' },
  guanhanqing:    { bg:'plain-dark',        bgTone:'#1a1a2a', costume:'scholar-indigo',  costumeColor:'#1a2a4a', faceTone:'#e0d0c0', facePaint:'none',           eyes:'narrow-sheng', eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#5a1a1a', beard:'none',            headdress:'wensheng-jin',    headdressColor:'#1a1a2a', headdressAccent:'#d4a017', signature:'brush',       faceShape:'narrow' },
  guoai:          { bg:'plain-warm',        bgTone:'#3a1a14', costume:'fuma-robe',       costumeColor:'#a01a3a', faceTone:'#e8d8c8', facePaint:'none',           eyes:'comic-bright', eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small-male',  lipColor:'#7a2a2a', beard:'none',            headdress:'fuma-hat',        headdressColor:'#a01a3a', headdressAccent:'#d4a017', signature:'wine',        faceShape:'narrow' },
  huangshanke:    { bg:'plain-warm',        bgTone:'#3a2a14', costume:'imperial-yellow', costumeColor:'#d4a017', faceTone:'#e0c8a0', facePaint:'none',           eyes:'sharp-wu',     eyeAccent:'#1a0a0a', forehead:'gold-pattern', foreheadColor:'#a01a1a', lips:'small-male',lipColor:'#5a1a1a', beard:'none',            headdress:'yuanwai-jin',     headdressColor:'#d4a017', headdressAccent:'#a01a1a', signature:'sword',       faceShape:'oval-strong' },

  /* ============== FEMALE 30 ============== */

  /* 唐涤生四大名剧 女主 */
  changping:      { bg:'falling-petals',    bgTone:'#3a1a2e', costume:'royal-bridal',    costumeColor:'#7a1a3a', faceTone:'#f5e0d4', facePaint:'none',           eyes:'soft-dan',     eyeAccent:'#b8336a', forehead:'flower-mark',  foreheadColor:'#b8336a', lips:'small',     lipColor:'#c4243a', cheekRouge:true, headdress:'phoenix-crown',    headdressColor:'#d4a017', headdressAccent:'#b8336a', signature:'peony',       faceShape:'oval' },
  huoxiaoyu:      { bg:'rain-pearls',       bgTone:'#2a1a3a', costume:'lavender-pei',    costumeColor:'#8a5aa0', faceTone:'#f5e0d4', facePaint:'none',           eyes:'sad-dan',      eyeAccent:'#7a4a8a', forehead:'flower-mark',  foreheadColor:'#a060a0', lips:'small',     lipColor:'#a04060', cheekRouge:true, headdress:'pearl-curtain',    headdressColor:'#d4a017', headdressAccent:'#c0a0c0', signature:'hairpin',     faceShape:'oval' },
  duliniang:      { bg:'peony',             bgTone:'#1a3a1a', costume:'spring-green-pei',costumeColor:'#3a7a5a', faceTone:'#f8e6dc', facePaint:'none',           eyes:'soft-dan',     eyeAccent:'#b8336a', forehead:'flower-mark',  foreheadColor:'#c44060', lips:'small',     lipColor:'#c4243a', cheekRouge:true, headdress:'flower-pin-peony', headdressColor:'#d4a017', headdressAccent:'#c44060', signature:'peony',       faceShape:'oval' },
  lihuiniang:     { bg:'plum-blossoms',     bgTone:'#1a0a1a', costume:'ghost-flowing',   costumeColor:'#6a2a4a', faceTone:'#f0e0e0', facePaint:'pale-ghost',    eyes:'sad-ghost',    eyeAccent:'#5a1a3a', forehead:'red-dot',      foreheadColor:'#a01a3a', lips:'small-pale',lipColor:'#a0334a', headdress:'ghost-veil',       headdressColor:'#d4a017', headdressAccent:'#a01a3a', signature:'plum',        faceShape:'oval' },
  luzhaorong:     { bg:'plum-blossoms',     bgTone:'#3a1a2a', costume:'peach-pei',       costumeColor:'#e890a0', faceTone:'#f8e6dc', facePaint:'none',           eyes:'soft-dan',     eyeAccent:'#b8336a', forehead:'flower-mark',  foreheadColor:'#c44060', lips:'small',     lipColor:'#c4243a', cheekRouge:true, headdress:'flower-pin-pink',  headdressColor:'#d4a017', headdressAccent:'#c44060', signature:'plum',        faceShape:'oval' },

  /* 其他女主 */
  xiesuqiu:       { bg:'butterflies',       bgTone:'#1a3a3a', costume:'rosy-pei',        costumeColor:'#c47090', faceTone:'#f5e0d4', facePaint:'none',           eyes:'soft-dan',     eyeAccent:'#4a8a7a', forehead:'flower-mark',  foreheadColor:'#5a8a7a', lips:'small',     lipColor:'#b8336a', cheekRouge:true, headdress:'butterfly-wings',  headdressColor:'#d4a017', headdressAccent:'#5a8a7a', signature:'butterfly',   faceShape:'oval' },
  wangruilan:     { bg:'rain-pearls',       bgTone:'#1a2a3a', costume:'sky-blue-pei',    costumeColor:'#5a7aa0', faceTone:'#f8e6dc', facePaint:'none',           eyes:'soft-dan',     eyeAccent:'#5a8aa0', forehead:'flower-mark',  foreheadColor:'#5a8aa0', lips:'small',     lipColor:'#a04060', cheekRouge:true, headdress:'flower-pin-blue',  headdressColor:'#d4a017', headdressAccent:'#5a8aa0', signature:'umbrella',    faceShape:'oval' },
  qiuxiang:       { bg:'plum-blossoms',     bgTone:'#1a3a3a', costume:'maid-apricot',    costumeColor:'#d4a060', faceTone:'#f8e6dc', facePaint:'none',           eyes:'comic-bright', eyeAccent:'#a04030', forehead:'red-dot',      foreheadColor:'#c4243a', lips:'smile-small', lipColor:'#c4243a', cheekRouge:true, headdress:'maid-bun',         headdressColor:'#d4a017', headdressAccent:'#a04030', signature:'fan-twin',    faceShape:'oval' },
  baihuagongzhu:  { bg:'cloud-warriors',    bgTone:'#3a1a2a', costume:'warrior-female',  costumeColor:'#a01a3a', faceTone:'#f5e0d4', facePaint:'none',           eyes:'sharp-wu-female',eyeAccent:'#a01a3a', forehead:'gold-pattern', foreheadColor:'#d4a017', lips:'small',     lipColor:'#a01a3a', headdress:'phoenix-helm',     headdressColor:'#d4a017', headdressAccent:'#a01a3a', signature:'sword-twin',  faceShape:'oval' },
  zhaopinniang:   { bg:'snow',              bgTone:'#1a1a2a', costume:'mourning-pei',    costumeColor:'#c8c8d8', faceTone:'#f0e0d8', facePaint:'pale-weath',    eyes:'sad-dan',      eyeAccent:'#7a5a4a', forehead:'flower-mark',  foreheadColor:'#a06070', lips:'small-pale',lipColor:'#7a3a3a', headdress:'mourning-pin',     headdressColor:'#a08060', headdressAccent:'#fafafa', signature:'medicine',    faceShape:'oval' },

  /* 帝王后妃 */
  yangguifei:     { bg:'peony',             bgTone:'#3a1a14', costume:'imperial-female', costumeColor:'#c4a020', faceTone:'#f8e6dc', facePaint:'drunken-rouge', eyes:'soft-dan',     eyeAccent:'#a04020', forehead:'flower-mark',  foreheadColor:'#c4243a', lips:'small',     lipColor:'#c4243a', cheekRouge:true, headdress:'tang-tiara',       headdressColor:'#d4a017', headdressAccent:'#c4243a', signature:'lychee',      faceShape:'oval' },
  wangzhaojun:    { bg:'snow',              bgTone:'#1a2a3a', costume:'frontier-fur',    costumeColor:'#a01a1a', faceTone:'#f0d8c8', facePaint:'none',           eyes:'sad-dan',      eyeAccent:'#5a3a3a', forehead:'flower-mark',  foreheadColor:'#a01a3a', lips:'small',     lipColor:'#a04060', cheekRouge:false,headdress:'fur-hat',          headdressColor:'#5a4030', headdressAccent:'#d4a017', signature:'pipa',        faceShape:'oval' },
  hongluan:       { bg:'cloud-warriors',    bgTone:'#3a1a3a', costume:'royal-bridal',    costumeColor:'#c0506a', faceTone:'#f8e6dc', facePaint:'none',           eyes:'sharp-wu-female',eyeAccent:'#a01a3a', forehead:'gold-pattern', foreheadColor:'#d4a017', lips:'small',     lipColor:'#c4243a', cheekRouge:true, headdress:'phoenix-crown',    headdressColor:'#d4a017', headdressAccent:'#c4243a', signature:'scroll',      faceShape:'oval' },
  shengping:      { bg:'imperial-dragon',   bgTone:'#3a2a14', costume:'imperial-female', costumeColor:'#c4a020', faceTone:'#f8e6dc', facePaint:'none',           eyes:'soft-dan',     eyeAccent:'#a04020', forehead:'flower-mark',  foreheadColor:'#c4243a', lips:'small',     lipColor:'#c4243a', cheekRouge:true, headdress:'tang-tiara',       headdressColor:'#d4a017', headdressAccent:'#c4243a', signature:'ruyi',        faceShape:'oval' },

  /* 武旦 */
  muguiying:      { bg:'cloud-warriors',    bgTone:'#3a1a14', costume:'warrior-female-r',costumeColor:'#a01a1a', faceTone:'#f5e0d4', facePaint:'none',           eyes:'sharp-wu-female',eyeAccent:'#a01a1a', forehead:'flower-mark',  foreheadColor:'#a01a1a', lips:'small',     lipColor:'#a01a1a', headdress:'phoenix-helm',     headdressColor:'#d4a017', headdressAccent:'#a01a1a', signature:'spear',       faceShape:'oval' },
  fanlihua:       { bg:'cloud-warriors',    bgTone:'#1a2a2a', costume:'warrior-female-w',costumeColor:'#e0e0e0', faceTone:'#f5e0d4', facePaint:'none',           eyes:'sharp-wu-female',eyeAccent:'#3a1a0a', forehead:'flower-mark',  foreheadColor:'#a01a1a', lips:'small',     lipColor:'#a01a3a', headdress:'silver-helm-fem',  headdressColor:'#c0c0c0', headdressAccent:'#a01a1a', signature:'mirror',      faceShape:'oval' },
  shetaijun:      { bg:'cloud-warriors',    bgTone:'#1a1a1a', costume:'matriarch-grey',  costumeColor:'#5a5a4a', faceTone:'#d8c0a0', facePaint:'pale-aged',      eyes:'narrow-aged',  eyeAccent:'#3a1a0a', forehead:'gold-pattern', foreheadColor:'#d4a017', lips:'small',     lipColor:'#7a3a3a', headdress:'aged-tiara',       headdressColor:'#d4a017', headdressAccent:'#a01a1a', signature:'cane-dragon', faceShape:'oval-strong' },
  baisuzhen:      { bg:'water-waves',       bgTone:'#1a3a3a', costume:'snake-white',     costumeColor:'#e8e8e8', faceTone:'#fafafa', facePaint:'pale-elegant',  eyes:'phoenix-eye',  eyeAccent:'#1a3a3a', forehead:'gold-pattern', foreheadColor:'#d4a017', lips:'small',     lipColor:'#a01a3a', cheekRouge:false,headdress:'phoenix-crown',    headdressColor:'#d4a017', headdressAccent:'#80c0c0', signature:'umbrella-jade',faceShape:'oval' },

  /* 悲剧 */
  jiaoguiying:    { bg:'plain-dark',        bgTone:'#1a0a1a', costume:'ghost-flowing',   costumeColor:'#fafafa', faceTone:'#f0e0e0', facePaint:'pale-ghost',    eyes:'sad-ghost',    eyeAccent:'#3a1a3a', forehead:'red-dot',      foreheadColor:'#c4243a', lips:'small-pale',lipColor:'#5a1a3a', headdress:'loose-hair-ghost', headdressColor:'#1a1a1a', headdressAccent:'#a01a1a', signature:'incense',     faceShape:'oval' },
  qinxianglian:   { bg:'snow',              bgTone:'#1a2a3a', costume:'mourning-grey',   costumeColor:'#5a5a5a', faceTone:'#e8d0c0', facePaint:'pale-weath',    eyes:'sad-dan',      eyeAccent:'#5a3a3a', forehead:'flower-mark',  foreheadColor:'#fafafa', lips:'small-pale',lipColor:'#7a3a3a', headdress:'mourning-pin',     headdressColor:'#a08060', headdressAccent:'#fafafa', signature:'petition',    faceShape:'oval' },
  zhulianxiu:     { bg:'butterflies',       bgTone:'#2a1a3a', costume:'purple-pei',      costumeColor:'#5a3a7a', faceTone:'#f5e0d4', facePaint:'none',           eyes:'soft-dan',     eyeAccent:'#5a3a7a', forehead:'flower-mark',  foreheadColor:'#a060a0', lips:'small',     lipColor:'#c4243a', cheekRouge:true, headdress:'butterfly-wings',  headdressColor:'#d4a017', headdressAccent:'#a060a0', signature:'fan-round',   faceShape:'oval' },
  doue:           { bg:'snow',              bgTone:'#1a1a1a', costume:'execution-white', costumeColor:'#e8e8e8', faceTone:'#f0d8c8', facePaint:'pale-ghost',    eyes:'sad-ghost',    eyeAccent:'#5a1a1a', forehead:'red-dot',      foreheadColor:'#c4243a', lips:'small-pale',lipColor:'#a01a3a', headdress:'execution-band',   headdressColor:'#a01a1a', headdressAccent:'#fafafa', signature:'red-ribbon',  faceShape:'oval' },

  /* 闺秀 / 灵动 */
  hongniang:      { bg:'plain-warm',        bgTone:'#3a1a14', costume:'maid-cherry',     costumeColor:'#c41a3a', faceTone:'#f8e6dc', facePaint:'none',           eyes:'comic-bright', eyeAccent:'#a04030', forehead:'red-dot',      foreheadColor:'#c4243a', lips:'smile-small', lipColor:'#c4243a', cheekRouge:true, headdress:'maid-bun',         headdressColor:'#d4a017', headdressAccent:'#c41a3a', signature:'letter',      faceShape:'oval' },
  cuiyingying:    { bg:'lotus',             bgTone:'#1a3a2a', costume:'celadon-pei',     costumeColor:'#5a8a7a', faceTone:'#f8e6dc', facePaint:'none',           eyes:'soft-dan',     eyeAccent:'#5a8a7a', forehead:'red-dot',      foreheadColor:'#c4243a', lips:'small',     lipColor:'#c4243a', cheekRouge:true, headdress:'flower-pin-jade',  headdressColor:'#d4a017', headdressAccent:'#5a8a7a', signature:'lotus',       faceShape:'oval' },
  cuilian:        { bg:'plum-blossoms',     bgTone:'#1a2a3a', costume:'maid-indigo',     costumeColor:'#1a3a5a', faceTone:'#f5e0d4', facePaint:'none',           eyes:'sharp-wu-female',eyeAccent:'#1a3a5a', forehead:'flower-mark',  foreheadColor:'#c4243a', lips:'small',     lipColor:'#c4243a', cheekRouge:true, headdress:'maid-bun',         headdressColor:'#d4a017', headdressAccent:'#c41a3a', signature:'kite',        faceShape:'oval' },

  /* 喜剧 / 老旦 */
  laoguopo:       { bg:'plain-warm',        bgTone:'#3a1a3a', costume:'comic-clash',     costumeColor:'#5a3a7a', faceTone:'#f8e0c8', facePaint:'comic-rouge',   eyes:'comic-bright', eyeAccent:'#1a0a0a', forehead:'red-dot',      foreheadColor:'#c4243a', lips:'big-red',   lipColor:'#c4243a', cheekRouge:true, headdress:'lopsided-bun',     headdressColor:'#a01a3a', headdressAccent:'#d4a017', signature:'cane',        faceShape:'oval' },
  caipo:          { bg:'plain-cool',        bgTone:'#1a2a2a', costume:'matriarch-olive', costumeColor:'#5a5a3a', faceTone:'#d8c0a0', facePaint:'pale-aged',      eyes:'narrow-aged',  eyeAccent:'#3a1a0a', forehead:'none',         foreheadColor:'#000', lips:'small',     lipColor:'#7a3a3a', headdress:'aged-low-bun',     headdressColor:'#5a5a4a', headdressAccent:'#d4a017', signature:'cane',        faceShape:'oval' },
  aqingsao:       { bg:'plain-cool',        bgTone:'#1a3a3a', costume:'modern-qipao',    costumeColor:'#3a6a6a', faceTone:'#e8d0c0', facePaint:'modern-light',  eyes:'comic-bright', eyeAccent:'#1a0a0a', forehead:'none',         foreheadColor:'#000', lips:'smile-small', lipColor:'#a01a3a', cheekRouge:false,headdress:'modern-bun',       headdressColor:'#1a1a1a', headdressAccent:'#d4a017', signature:'teapot',      faceShape:'oval' },

  /* 神仙 */
  qixiannv:       { bg:'cloud-fairy',       bgTone:'#1a2a4a', costume:'fairy-rainbow',   costumeColor:'#80b0e0', faceTone:'#f8e6dc', facePaint:'none',           eyes:'soft-dan',     eyeAccent:'#5060a0', forehead:'gold-pattern', foreheadColor:'#d4a017', lips:'small',     lipColor:'#c4243a', cheekRouge:true, headdress:'fairy-tiara',      headdressColor:'#d4a017', headdressAccent:'#80c0e0', signature:'cloud-streamer',faceShape:'oval' },
  zhinv:          { bg:'cloud-fairy',       bgTone:'#1a1a3a', costume:'starlight',       costumeColor:'#5070a0', faceTone:'#f8e6dc', facePaint:'none',           eyes:'soft-dan',     eyeAccent:'#5070a0', forehead:'gold-pattern', foreheadColor:'#d4a017', lips:'small',     lipColor:'#a01a3a', cheekRouge:true, headdress:'star-tiara',       headdressColor:'#d4a017', headdressAccent:'#a0b0d0', signature:'shuttle',     faceShape:'oval' }
};

/* ========================================
   BACKGROUND MOTIFS
   ======================================== */

function bgGradient(id, baseTone) {
  return `<defs>
    <radialGradient id="bg-${id}" cx="50%" cy="35%" r="70%">
      <stop offset="0%" stop-color="${shadeC(baseTone, 25)}" />
      <stop offset="60%" stop-color="${baseTone}" />
      <stop offset="100%" stop-color="#0a0a10" />
    </radialGradient>
    <linearGradient id="face-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.06)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.20)" />
    </linearGradient>
  </defs>
  <rect width="240" height="320" fill="url(#bg-${id})" />`;
}

const BG_MOTIFS = {

  'falling-petals': () => {
    const ps = [[42,60,14,25,'#b8336a'], [180,90,18,-30,'#d4a017'], [60,200,11,45,'#b8336a'], [200,220,14,-20,'#d4a017'], [30,280,12,60,'#a01a3a'], [210,35,10,15,'#b8336a'], [120,30,9,-45,'#d4a017'], [170,270,12,30,'#a01a3a']];
    return ps.map(([x,y,s,r,c]) => `<g transform="rotate(${r} ${x} ${y})" opacity="0.5"><ellipse cx="${x}" cy="${y}" rx="${s}" ry="${s*0.4}" fill="${c}" /><ellipse cx="${x}" cy="${y}" rx="${s*0.5}" ry="${s*0.2}" fill="${shadeC(c,30)}" /></g>`).join('');
  },

  'plum-blossoms': () => {
    function plum(x, y, size, c, op) {
      let p = '';
      for (let i = 0; i < 5; i++) {
        const a = (i*72)*Math.PI/180;
        p += `<circle cx="${x+Math.cos(a)*size*0.5}" cy="${y+Math.sin(a)*size*0.5}" r="${size*0.5}" fill="${c}" opacity="${op}" />`;
      }
      p += `<circle cx="${x}" cy="${y}" r="${size*0.2}" fill="${shadeC(c,-40)}" opacity="${op}" />`;
      return p;
    }
    return plum(40,50,8,'#c4243a',0.5)+plum(195,75,10,'#a01a3a',0.45)+plum(48,235,9,'#b8336a',0.4)+plum(200,250,8,'#a01a3a',0.45)+plum(140,30,7,'#c4243a',0.55)+plum(20,160,6,'#a01a3a',0.4)+
      `<path d="M 30 120 Q 80 100 130 130" stroke="#3a1a0a" stroke-width="1.5" fill="none" opacity="0.5" /><path d="M 200 180 Q 220 200 230 240" stroke="#3a1a0a" stroke-width="1.5" fill="none" opacity="0.5" />`;
  },

  'butterflies': () => {
    function bfly(x, y, s, c, op) {
      return `<g transform="translate(${x} ${y})" opacity="${op}">
        <ellipse cx="${-s*0.5}" cy="0" rx="${s*0.6}" ry="${s*0.4}" fill="${c}" transform="rotate(-30)" />
        <ellipse cx="${s*0.5}" cy="0" rx="${s*0.6}" ry="${s*0.4}" fill="${c}" transform="rotate(30)" />
        <ellipse cx="${-s*0.4}" cy="${s*0.3}" rx="${s*0.4}" ry="${s*0.3}" fill="${shadeC(c,-20)}" transform="rotate(20)" />
        <ellipse cx="${s*0.4}" cy="${s*0.3}" rx="${s*0.4}" ry="${s*0.3}" fill="${shadeC(c,-20)}" transform="rotate(-20)" />
        <line x1="0" y1="${-s*0.4}" x2="0" y2="${s*0.5}" stroke="#1a1a1a" stroke-width="1" />
      </g>`;
    }
    return bfly(50,55,15,'#d4a017',0.55)+bfly(195,90,17,'#b8336a',0.5)+bfly(40,225,13,'#d4a017',0.45)+bfly(200,235,15,'#b8336a',0.55)+bfly(140,28,11,'#d4a017',0.5);
  },

  'peony': () => {
    function peony(x, y, s, c, op) {
      let l = '';
      for (let r = 0; r < 8; r++) {
        const a = (r*45)*Math.PI/180;
        const px = x+Math.cos(a)*s*0.4, py = y+Math.sin(a)*s*0.4;
        l += `<ellipse cx="${px}" cy="${py}" rx="${s*0.45}" ry="${s*0.25}" fill="${c}" opacity="${op}" transform="rotate(${r*45} ${px} ${py})" />`;
      }
      l += `<circle cx="${x}" cy="${y}" r="${s*0.3}" fill="${shadeC(c,20)}" opacity="${op}" />`;
      l += `<circle cx="${x}" cy="${y}" r="${s*0.13}" fill="#d4a017" opacity="${op}" />`;
      return l;
    }
    return peony(35,240,28,'#a01a3a',0.5)+peony(205,55,22,'#b8336a',0.4)+peony(195,255,17,'#a01a3a',0.45);
  },

  'lotus': () => {
    function lotus(x, y, s, c, op) {
      let p = '';
      for (let i = 0; i < 6; i++) {
        const a = (i*60-90)*Math.PI/180;
        const px = x+Math.cos(a)*s*0.3, py = y+Math.sin(a)*s*0.3;
        p += `<ellipse cx="${px}" cy="${py}" rx="${s*0.25}" ry="${s*0.6}" fill="${c}" opacity="${op}" transform="rotate(${i*60-90} ${px} ${py})" />`;
      }
      return p;
    }
    return lotus(45,250,30,'#e890b0',0.45)+lotus(195,60,24,'#c4708a',0.4)+
      `<path d="M 0 290 Q 60 260 120 290 Q 180 260 240 290" stroke="#5a8aa0" stroke-width="1.5" fill="none" opacity="0.4" />`;
  },

  'water-waves': () => {
    let w = '';
    for (let i = 0; i < 7; i++) {
      const y = 25 + i*44;
      w += `<path d="M 0 ${y} Q 60 ${y-10} 120 ${y} T 240 ${y}" stroke="#80c0c0" stroke-width="1.5" fill="none" opacity="${0.5-i*0.04}" />`;
      w += `<path d="M 0 ${y+7} Q 60 ${y-3} 120 ${y+7} T 240 ${y+7}" stroke="#a0d0d0" stroke-width="0.8" fill="none" opacity="${0.35-i*0.04}" />`;
    }
    return w;
  },

  'misty-mountains': () => `
    <path d="M 0 220 Q 50 180 100 200 Q 150 170 200 195 Q 220 180 240 200 L 240 320 L 0 320 Z" fill="#0a1a1a" opacity="0.6" />
    <path d="M 0 250 Q 60 210 120 230 Q 180 200 240 225 L 240 320 L 0 320 Z" fill="#1a2a2a" opacity="0.5" />
    <circle cx="200" cy="40" r="14" fill="none" stroke="#d4a017" stroke-width="0.8" opacity="0.4" />
    <path d="M -10 30 Q 30 50 60 40" stroke="#d4a017" stroke-width="0.8" fill="none" opacity="0.3" />
  `,

  'cloud-warriors': () => `
    <path d="M -20 50 Q 30 30 60 50 Q 90 30 120 50 Q 150 30 180 50 Q 210 30 260 50 L 260 90 L -20 90 Z" fill="#3a3a4a" opacity="0.5" />
    <path d="M -20 80 Q 40 60 80 75 Q 120 60 160 75 Q 200 60 260 75 L 260 100 L -20 100 Z" fill="#2a2a3a" opacity="0.45" />
    <path d="M 30 270 L 50 295 L 30 295 Z" fill="#d4a017" opacity="0.55" />
    <path d="M 200 260 L 220 295 L 200 295 Z" fill="#d4a017" opacity="0.55" />
    <line x1="20" y1="298" x2="60" y2="298" stroke="#d4a017" stroke-width="0.8" opacity="0.55" />
    <line x1="190" y1="300" x2="225" y2="300" stroke="#d4a017" stroke-width="0.8" opacity="0.55" />
  `,

  'imperial-dragon': () => `
    <path d="M 30 30 Q 50 60 30 90 Q 50 120 30 150 Q 50 180 30 210" stroke="#d4a017" stroke-width="1.4" fill="none" opacity="0.45" />
    <path d="M 210 30 Q 190 60 210 90 Q 190 120 210 150 Q 190 180 210 210" stroke="#d4a017" stroke-width="1.4" fill="none" opacity="0.45" />
    <circle cx="40" cy="60" r="3" fill="#d4a017" opacity="0.55" />
    <circle cx="200" cy="120" r="3" fill="#d4a017" opacity="0.55" />
    <circle cx="40" cy="180" r="3" fill="#d4a017" opacity="0.55" />
    <path d="M 0 285 Q 60 260 120 275 Q 180 260 240 285 L 240 320 L 0 320 Z" fill="#5a3a0a" opacity="0.5" />
  `,

  'rain-pearls': () => {
    let d = '';
    for (let i = 0; i < 18; i++) {
      const x = 14 + (i*13)%220, y = 25 + (i*23)%250;
      d += `<line x1="${x}" y1="${y}" x2="${x-2}" y2="${y+13}" stroke="#c0a0c0" stroke-width="1" opacity="0.5" />`;
      d += `<circle cx="${x}" cy="${y+14}" r="1" fill="#d0c0d0" opacity="0.65" />`;
    }
    return d;
  },

  'snow': () => {
    let s = '';
    const seeds = [[20,30],[50,60],[90,40],[130,75],[170,30],[210,60],[40,120],[80,150],[120,140],[160,170],[200,140],[30,200],[70,230],[110,260],[150,240],[190,270],[225,200],[60,290],[180,300]];
    seeds.forEach(([x,y]) => {
      s += `<circle cx="${x}" cy="${y}" r="2" fill="#fafafa" opacity="0.7" />`;
      s += `<circle cx="${x+1}" cy="${y+1}" r="0.6" fill="#ffffff" opacity="0.9" />`;
    });
    return s + `<path d="M 0 290 Q 60 280 120 285 Q 180 280 240 290 L 240 320 L 0 320 Z" fill="#3a3a4a" opacity="0.4" />`;
  },

  'cloud-fairy': () => `
    <path d="M -10 70 Q 40 50 80 65 Q 120 50 160 65 Q 200 50 250 70 L 250 100 L -10 100 Z" fill="#a0c0e0" opacity="0.3" />
    <path d="M -10 150 Q 50 130 100 145 Q 150 130 200 145 Q 230 135 250 145 L 250 175 L -10 175 Z" fill="#80a0c0" opacity="0.25" />
    <circle cx="40" cy="40" r="2" fill="#fafafa" opacity="0.85" />
    <circle cx="80" cy="60" r="1.5" fill="#fafafa" opacity="0.85" />
    <circle cx="180" cy="50" r="1.8" fill="#fafafa" opacity="0.85" />
    <circle cx="220" cy="80" r="2" fill="#fafafa" opacity="0.85" />
    <circle cx="120" cy="35" r="1.2" fill="#fafafa" opacity="0.85" />
  `,

  'plain-dark': () => '',
  'plain-warm': () => `<path d="M 0 285 Q 60 265 120 275 Q 180 265 240 280 L 240 320 L 0 320 Z" fill="#5a3a14" opacity="0.4" />`,
  'plain-cool': () => `<path d="M 0 290 Q 60 270 120 280 Q 180 270 240 285 L 240 320 L 0 320 Z" fill="#3a4a6a" opacity="0.4" />`
};

function getBg(motif, id, baseTone) {
  const fn = BG_MOTIFS[motif] || BG_MOTIFS['plain-dark'];
  return bgGradient(id, baseTone) + fn();
}

/* ========================================
   COSTUME / SHOULDERS / COLLAR
   ======================================== */

function shoulderShape(color, accentColor, style) {
  const dark = shadeC(color, -35);
  const light = shadeC(color, 25);
  switch (style) {

    case 'royal-bridal':
      return `
        <path d="M 0 320 L 0 265 Q 30 240 80 235 L 120 262 L 160 235 Q 210 240 240 265 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <path d="M 80 235 L 120 262 L 160 235" stroke="${accentColor}" stroke-width="2.5" fill="none" />
        <path d="M 100 264 L 120 290 L 140 264 Z" fill="${dark}" />
        <line x1="40" y1="290" x2="80" y2="280" stroke="${accentColor}" stroke-width="1" />
        <line x1="160" y1="280" x2="200" y2="290" stroke="${accentColor}" stroke-width="1" />
        <circle cx="60" cy="295" r="2" fill="${accentColor}" />
        <circle cx="180" cy="295" r="2" fill="${accentColor}" />
      `;

    case 'lavender-pei':
    case 'spring-green-pei':
    case 'peach-pei':
    case 'rosy-pei':
    case 'sky-blue-pei':
    case 'celadon-pei':
    case 'purple-pei':
      return `
        <path d="M 0 320 L 0 270 Q 35 250 90 248 L 120 270 L 150 248 Q 205 250 240 270 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <path d="M 90 248 L 120 270 L 150 248" stroke="${shadeC(color, 30)}" stroke-width="1.5" fill="none" />
        <path d="M 110 270 L 120 285 L 130 270" fill="${dark}" />
      `;

    case 'mourning-pei':
    case 'mourning-grey':
    case 'mourning-white':
      return `
        <path d="M 0 320 L 0 275 Q 40 260 90 258 L 120 278 L 150 258 Q 200 260 240 275 L 240 320 Z" fill="${color}" />
        <path d="M 0 320 L 0 295 Q 40 285 90 283 L 120 295 L 150 283 Q 200 285 240 295 L 240 320 Z" fill="${shadeC(color,-15)}" />
      `;

    case 'ghost-flowing':
      return `
        <path d="M 0 320 L 0 280 Q 40 258 80 252 L 120 275 L 160 252 Q 200 258 240 280 L 240 320 Z" fill="${color}" stroke="#0a0a10" stroke-width="0.5" opacity="0.85" />
        <path d="M 30 295 Q 60 285 90 295 Q 120 285 150 295 Q 180 285 210 295" stroke="${light}" stroke-width="0.5" fill="none" opacity="0.6" />
      `;

    case 'execution-white':
      return `
        <path d="M 0 320 L 0 275 Q 40 258 90 256 L 120 275 L 150 256 Q 200 258 240 275 L 240 320 Z" fill="${color}" />
        <path d="M 100 280 L 120 290 L 140 280 Z" fill="#a01a1a" />
        <line x1="60" y1="295" x2="180" y2="295" stroke="#a01a1a" stroke-width="1.5" />
      `;

    case 'imperial-yellow':
    case 'imperial-female':
      return `
        <path d="M 0 320 L 0 265 Q 30 240 80 235 L 120 260 L 160 235 Q 210 240 240 265 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <path d="M 80 235 L 120 260 L 160 235" stroke="${accentColor}" stroke-width="2.5" fill="none" />
        <path d="M 100 262 L 120 290 L 140 262 Z" fill="${dark}" />
        <circle cx="100" cy="295" r="3" fill="${accentColor}" stroke="#000" stroke-width="0.5" />
        <circle cx="140" cy="295" r="3" fill="${accentColor}" stroke="#000" stroke-width="0.5" />
      `;

    case 'imperial-pale':
      return `
        <path d="M 0 320 L 0 270 Q 30 250 80 245 L 120 268 L 160 245 Q 210 250 240 270 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <path d="M 80 245 L 120 268 L 160 245" stroke="${shadeC(color,-30)}" stroke-width="1.5" fill="none" />
        <path d="M 100 270 L 120 290 L 140 270" fill="${shadeC(color,-25)}" />
      `;

    case 'official-black':
    case 'official-dark':
    case 'official-mid':
    case 'official-red':
      return `
        <path d="M 0 320 L 0 268 Q 30 245 80 240 L 120 265 L 160 240 Q 210 245 240 268 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <rect x="100" y="265" width="40" height="30" fill="${dark}" stroke="${accentColor}" stroke-width="1.5" />
        <rect x="105" y="270" width="30" height="20" fill="${shadeC(color,-50)}" />
        <circle cx="120" cy="280" r="4" fill="${accentColor}" />
      `;

    case 'warrior-armor':
    case 'warrior-green':
    case 'warrior-white':
    case 'warrior-pink':
    case 'warrior-silver':
    case 'warrior-snow':
    case 'warrior-light':
    case 'warrior-female':
    case 'warrior-female-r':
    case 'warrior-female-w':
      return `
        <path d="M 0 320 L 0 258 Q 30 232 80 228 L 120 248 L 160 228 Q 210 232 240 258 L 240 320 Z" fill="${color}" stroke="#0a0a10" stroke-width="1.5" />
        <rect x="35" y="262" width="30" height="22" fill="${light}" stroke="${dark}" stroke-width="1" rx="3" />
        <rect x="175" y="262" width="30" height="22" fill="${light}" stroke="${dark}" stroke-width="1" rx="3" />
        <path d="M 80 228 L 120 248 L 160 228" stroke="${accentColor || '#d4a017'}" stroke-width="2.5" fill="none" />
        <circle cx="120" cy="262" r="7" fill="${accentColor || '#d4a017'}" />
        <rect x="60" y="295" width="120" height="6" fill="${dark}" />
        <rect x="80" y="301" width="80" height="3" fill="${accentColor || '#d4a017'}" />
        <rect x="50" y="225" width="6" height="20" fill="${accentColor || '#d4a017'}" />
        <rect x="184" y="225" width="6" height="20" fill="${accentColor || '#d4a017'}" />
      `;

    case 'short-fight-red':
      return `
        <path d="M 0 320 L 0 270 Q 30 248 80 244 L 120 265 L 160 244 Q 210 248 240 270 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <path d="M 100 265 L 120 295 L 140 265 Z" fill="#1a1a1a" />
        <line x1="60" y1="290" x2="180" y2="290" stroke="#d4a017" stroke-width="3" />
        <line x1="65" y1="294" x2="175" y2="294" stroke="#d4a017" stroke-width="1" opacity="0.7" />
      `;

    case 'scholar-red':
    case 'scholar-blue':
    case 'scholar-green':
    case 'scholar-grey':
    case 'scholar-bright':
    case 'scholar-indigo':
      return `
        <path d="M 0 320 L 0 273 Q 40 254 90 252 L 120 273 L 150 252 Q 200 254 240 273 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <path d="M 90 252 L 120 273 L 150 252" stroke="${shadeC(color, 25)}" stroke-width="1.5" fill="none" />
        <circle cx="105" cy="295" r="2" fill="${accentColor || '#d4a017'}" opacity="0.7" />
        <circle cx="135" cy="295" r="2" fill="${accentColor || '#d4a017'}" opacity="0.7" />
      `;

    case 'fuma-robe':
      return `
        <path d="M 0 320 L 0 265 Q 30 240 80 235 L 120 262 L 160 235 Q 210 240 240 265 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <path d="M 80 235 L 120 262 L 160 235" stroke="#d4a017" stroke-width="2" fill="none" />
        <rect x="105" y="265" width="30" height="22" fill="${dark}" stroke="#d4a017" />
        <text x="120" y="282" text-anchor="middle" font-family="serif" font-size="10" fill="#d4a017">㊋</text>
      `;

    case 'frontier-fur':
      return `
        <path d="M 0 320 L 0 268 Q 30 246 80 240 L 120 264 L 160 240 Q 210 246 240 268 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <path d="M 30 268 Q 60 260 90 268 Q 120 260 150 268 Q 180 260 210 268" stroke="#fafafa" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.95" />
        <path d="M 0 268 Q 30 270 60 263 Q 80 270 120 264 Q 160 270 180 263 Q 210 270 240 268" stroke="#e0e0e0" stroke-width="3" fill="none" opacity="0.8" />
      `;

    case 'snake-white':
      return `
        <path d="M 0 320 L 0 268 Q 35 248 85 244 L 120 265 L 155 244 Q 205 248 240 268 L 240 320 Z" fill="${color}" stroke="#80c0c0" stroke-width="1" />
        <path d="M 30 290 Q 60 285 90 290 Q 120 285 150 290 Q 180 285 210 290" stroke="#80c0c0" stroke-width="0.5" fill="none" opacity="0.7" />
        <path d="M 30 300 Q 60 296 90 300 Q 120 296 150 300 Q 180 296 210 300" stroke="#a0d0d0" stroke-width="0.4" fill="none" opacity="0.6" />
        <circle cx="60" cy="295" r="1" fill="#80c0c0" />
        <circle cx="120" cy="285" r="1" fill="#80c0c0" />
        <circle cx="180" cy="295" r="1" fill="#80c0c0" />
      `;

    case 'maid-cherry':
    case 'maid-apricot':
    case 'maid-indigo':
      return `
        <path d="M 0 320 L 0 275 Q 40 260 90 258 L 120 275 L 150 258 Q 200 260 240 275 L 240 320 Z" fill="${color}" />
        <rect x="60" y="285" width="120" height="6" fill="${shadeC(color,-30)}" />
        <rect x="80" y="295" width="80" height="3" fill="#fafafa" opacity="0.7" />
      `;

    case 'matriarch-grey':
    case 'matriarch-olive':
      return `
        <path d="M 0 320 L 0 270 Q 35 250 90 248 L 120 270 L 150 248 Q 205 250 240 270 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <text x="120" y="290" text-anchor="middle" font-family="serif" font-size="14" fill="${accentColor || '#d4a017'}" opacity="0.6">寿</text>
      `;

    case 'modern-qipao':
      return `
        <path d="M 0 320 L 0 268 Q 60 250 120 248 Q 180 250 240 268 L 240 320 Z" fill="${color}" />
        <path d="M 60 252 Q 120 268 180 252" stroke="${shadeC(color, 25)}" stroke-width="1.5" fill="none" />
        <circle cx="120" cy="265" r="3" fill="${accentColor || '#d4a017'}" />
        <circle cx="160" cy="278" r="3" fill="${accentColor || '#d4a017'}" />
        <circle cx="200" cy="290" r="3" fill="${accentColor || '#d4a017'}" />
      `;

    case 'fairy-rainbow':
      return `
        <path d="M 0 320 L 0 270 Q 30 250 80 245 L 120 268 L 160 245 Q 210 250 240 270 L 240 320 Z" fill="${color}" />
        <path d="M 0 290 Q 60 270 120 285 Q 180 270 240 290 L 240 305 Q 180 285 120 300 Q 60 285 0 305 Z" fill="${shadeC(color,15)}" opacity="0.8" />
        <path d="M 0 305 Q 60 285 120 300 Q 180 285 240 305 L 240 320 L 0 320 Z" fill="${shadeC(color,30)}" opacity="0.7" />
      `;

    case 'starlight':
      return `
        <path d="M 0 320 L 0 270 Q 30 250 80 245 L 120 268 L 160 245 Q 210 250 240 270 L 240 320 Z" fill="${color}" />
        <circle cx="40" cy="285" r="1.5" fill="#fafafa" />
        <circle cx="80" cy="295" r="1.5" fill="#fafafa" />
        <circle cx="120" cy="285" r="1.8" fill="#fafafa" />
        <circle cx="160" cy="295" r="1.5" fill="#fafafa" />
        <circle cx="200" cy="285" r="1.5" fill="#fafafa" />
      `;

    case 'comic-clash':
      return `
        <path d="M 0 320 L 0 270 Q 35 250 90 248 L 120 270 L 150 248 Q 205 250 240 270 L 240 320 Z" fill="${color}" stroke="#0a0a10" />
        <path d="M 30 290 L 60 280 L 50 305 L 30 305 Z" fill="#3a8a3a" opacity="0.8" />
        <path d="M 200 285 L 220 290 L 215 305 L 195 305 Z" fill="#d4a017" opacity="0.9" />
      `;

    default:
      return `<path d="M 0 320 L 0 275 Q 50 260 90 258 L 120 275 L 150 258 Q 190 260 240 275 L 240 320 Z" fill="${color}" />`;
  }
}

/* ========================================
   FACE BASE
   ======================================== */
function drawFace(faceTone, shape, id) {
  const rx = shape === 'narrow' ? 48 : shape === 'oval-strong' ? 56 : 52;
  const ry = shape === 'narrow' ? 72 : shape === 'oval-strong' ? 68 : 70;
  return `
    <ellipse cx="120" cy="${175+4}" rx="${rx+2}" ry="${ry+2}" fill="#1a0a0a" opacity="0.45" />
    <ellipse cx="120" cy="175" rx="${rx}" ry="${ry}" fill="${faceTone}" stroke="${shadeC(faceTone, -45)}" stroke-width="1.5" />
    <ellipse cx="120" cy="175" rx="${rx}" ry="${ry}" fill="url(#face-${id})" />
  `;
}

/* ========================================
   FACE PAINT
   ======================================== */
function drawFacePaint(paint, faceTone, shape) {
  const rx = shape === 'narrow' ? 48 : shape === 'oval-strong' ? 56 : 52;
  const ry = shape === 'narrow' ? 72 : shape === 'oval-strong' ? 68 : 70;
  switch (paint) {
    case 'pale-ghost':
      return `<ellipse cx="120" cy="175" rx="${rx-1}" ry="${ry-1}" fill="#fafafa" opacity="0.5" />
        <path d="M 100 200 Q 120 235 140 200" stroke="#a08090" stroke-width="0.6" fill="none" opacity="0.55" />`;
    case 'pale-elegant':
      return `<ellipse cx="120" cy="175" rx="${rx-2}" ry="${ry-2}" fill="#fafafa" opacity="0.32" />`;
    case 'pale-aged':
      return `<path d="M 80 165 Q 100 162 105 175" stroke="#8a7060" stroke-width="0.7" fill="none" opacity="0.55" />
        <path d="M 160 165 Q 140 162 135 175" stroke="#8a7060" stroke-width="0.7" fill="none" opacity="0.55" />
        <path d="M 90 200 Q 105 205 115 200" stroke="#8a7060" stroke-width="0.4" fill="none" opacity="0.5" />
        <path d="M 125 200 Q 135 205 150 200" stroke="#8a7060" stroke-width="0.4" fill="none" opacity="0.5" />`;
    case 'pale-weath':
      return `<ellipse cx="120" cy="175" rx="${rx-1}" ry="${ry-1}" fill="#fafafa" opacity="0.18" />
        <path d="M 90 195 Q 105 200 115 195" stroke="#7a5a4a" stroke-width="0.5" fill="none" opacity="0.4" />`;
    case 'red-loyal':
      /* 关羽 — solid red face */
      return `<ellipse cx="120" cy="175" rx="${rx}" ry="${ry}" fill="#c41a1a" />
        <path d="M 95 165 Q 100 160 110 165" stroke="#1a0a0a" stroke-width="1.5" fill="none" />
        <path d="M 130 165 Q 140 160 145 165" stroke="#1a0a0a" stroke-width="1.5" fill="none" />`;
    case 'red-fierce':
      return `<ellipse cx="120" cy="175" rx="${rx}" ry="${ry}" fill="#c41a1a" />
        <path d="M 80 145 L 116 142 L 110 158 L 85 160 Z" fill="#d4a017" opacity="0.85" />
        <path d="M 160 145 L 124 142 L 130 158 L 155 160 Z" fill="#d4a017" opacity="0.85" />`;
    case 'black-with-moon':
      /* 包拯 — full black face. Moon drawn separately in forehead. */
      return `<ellipse cx="120" cy="175" rx="${rx}" ry="${ry}" fill="#0a0a0a" />`;
    case 'white-treach':
      /* 贾似道 — white face with sharp triangular eye patches */
      return `<ellipse cx="120" cy="175" rx="${rx}" ry="${ry}" fill="#f5f0e8" />
        <path d="M 76 158 L 106 152 L 110 168 L 80 170 Z" fill="#3a1a1a" opacity="0.85" />
        <path d="M 164 158 L 134 152 L 130 168 L 160 170 Z" fill="#3a1a1a" opacity="0.85" />`;
    case 'comic-white':
      /* 周钟 — comic white nose-square */
      return `<rect x="108" y="172" width="24" height="28" fill="#f5f0e8" stroke="#3a1a1a" stroke-width="0.5" />`;
    case 'comic-rouge':
      /* 老姑婆 — exaggerated heavy rouge */
      return `<ellipse cx="86" cy="195" rx="20" ry="12" fill="#e070a0" opacity="0.7" />
        <ellipse cx="154" cy="195" rx="20" ry="12" fill="#e070a0" opacity="0.7" />
        <circle cx="155" cy="225" r="3" fill="#3a1a1a" />`;
    case 'drunken-rouge':
      /* 杨贵妃 醉酒 — flushed cheeks */
      return `<ellipse cx="86" cy="190" rx="16" ry="10" fill="#e0506a" opacity="0.55" />
        <ellipse cx="154" cy="190" rx="16" ry="10" fill="#e0506a" opacity="0.55" />`;
    case 'modern-light':
      /* 阿庆嫂 — modern realist no painted face */
      return `<ellipse cx="86" cy="190" rx="11" ry="6" fill="#c47080" opacity="0.25" />
        <ellipse cx="154" cy="190" rx="11" ry="6" fill="#c47080" opacity="0.25" />`;
    case 'tiger-cross':
      /* 张飞-style for any future use */
      return `<ellipse cx="120" cy="175" rx="${rx}" ry="${ry}" fill="#fafafa" />
        <path d="M 110 130 L 130 130 L 132 240 L 108 240 Z" fill="#0a0a0a" />
        <path d="M 70 170 L 170 170 L 168 192 L 72 192 Z" fill="#0a0a0a" />`;
    default:
      return '';
  }
}

/* ========================================
   CHEEK ROUGE
   ======================================== */
function drawCheekRouge(active, accent) {
  if (!active) return '';
  return `<ellipse cx="86" cy="200" rx="14" ry="8" fill="${accent}" opacity="0.32" />
    <ellipse cx="154" cy="200" rx="14" ry="8" fill="${accent}" opacity="0.32" />`;
}

/* ========================================
   EYES
   ======================================== */
function drawEyes(style, accent, faceTone) {
  switch (style) {
    case 'soft-dan':
      return `
        <path d="M 86 168 Q 100 158 112 168 Q 100 175 86 168 Z" fill="#1a0a14" />
        <path d="M 128 168 Q 140 158 154 168 Q 140 175 128 168 Z" fill="#1a0a14" />
        <path d="M 86 168 Q 76 165 68 172" stroke="${accent}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M 154 168 Q 164 165 172 172" stroke="${accent}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M 76 152 Q 100 142 114 154" stroke="#1a0a14" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M 126 154 Q 140 142 164 152" stroke="#1a0a14" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <circle cx="100" cy="166" r="1.5" fill="${faceTone}" opacity="0.85" />
        <circle cx="140" cy="166" r="1.5" fill="${faceTone}" opacity="0.85" />`;

    case 'sad-dan':
      return `
        <path d="M 86 170 Q 100 161 112 170 Q 100 176 86 170 Z" fill="#1a0a14" />
        <path d="M 128 170 Q 140 161 154 170 Q 140 176 128 170 Z" fill="#1a0a14" />
        <path d="M 86 170 Q 76 170 68 178" stroke="${accent}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M 154 170 Q 164 170 172 178" stroke="${accent}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M 78 156 Q 100 150 114 158" stroke="#1a0a14" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <path d="M 126 158 Q 140 150 162 156" stroke="#1a0a14" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <circle cx="78" cy="180" r="1" fill="${accent}" opacity="0.7" />`;

    case 'sad-male':
      return `
        <line x1="84" y1="170" x2="114" y2="171" stroke="#1a0a14" stroke-width="2.5" stroke-linecap="round" />
        <line x1="126" y1="171" x2="156" y2="170" stroke="#1a0a14" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 78 158 Q 100 154 114 162" stroke="#1a0a14" stroke-width="1.8" fill="none" />
        <path d="M 126 162 Q 140 154 162 158" stroke="#1a0a14" stroke-width="1.8" fill="none" />`;

    case 'sad-ghost':
      return `
        <path d="M 80 174 Q 100 162 114 170 Q 100 180 80 174 Z" fill="#3a1a3a" />
        <path d="M 126 170 Q 140 162 160 174 Q 140 180 126 170 Z" fill="#3a1a3a" />
        <path d="M 80 174 Q 70 178 64 188" stroke="${accent}" stroke-width="2" fill="none" />
        <path d="M 160 174 Q 170 178 176 188" stroke="${accent}" stroke-width="2" fill="none" />
        <path d="M 78 158 Q 100 154 114 162" stroke="#1a0a14" stroke-width="1.5" fill="none" />
        <path d="M 126 162 Q 140 154 162 158" stroke="#1a0a14" stroke-width="1.5" fill="none" />
        <line x1="80" y1="180" x2="74" y2="200" stroke="${accent}" stroke-width="0.8" opacity="0.7" />`;

    case 'sharp-wu':
      return `
        <path d="M 78 168 L 114 158 L 110 174 L 80 176 Z" fill="#1a0a14" />
        <path d="M 162 168 L 126 158 L 130 174 L 160 176 Z" fill="#1a0a14" />
        <path d="M 78 168 Q 70 166 62 173" stroke="${accent}" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M 162 168 Q 170 166 178 173" stroke="${accent}" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M 75 145 L 116 145 L 110 154 L 80 154 Z" fill="#1a0a14" />
        <path d="M 165 145 L 124 145 L 130 154 L 160 154 Z" fill="#1a0a14" />`;

    case 'sharp-wu-female':
      return `
        <path d="M 80 168 L 114 156 L 110 174 L 82 176 Z" fill="#1a0a14" />
        <path d="M 160 168 L 126 156 L 130 174 L 158 176 Z" fill="#1a0a14" />
        <path d="M 80 168 Q 68 166 60 175" stroke="${accent}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M 160 168 Q 172 166 180 175" stroke="${accent}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M 76 148 Q 100 138 116 152" stroke="#1a0a14" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M 124 152 Q 140 138 164 148" stroke="#1a0a14" stroke-width="2.5" fill="none" stroke-linecap="round" />`;

    case 'phoenix-eye':
      /* 关羽's iconic eye */
      return `
        <path d="M 70 168 Q 100 158 116 172 Q 100 178 70 168 Z" fill="#1a0a14" />
        <path d="M 170 168 Q 140 158 124 172 Q 140 178 170 168 Z" fill="#1a0a14" />
        <path d="M 116 172 L 126 175 Q 124 168 116 172 Z" fill="${accent}" />
        <path d="M 124 172 L 114 175 Q 116 168 124 172 Z" fill="${accent}" />
        <path d="M 76 152 Q 100 142 116 156" stroke="#1a0a14" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M 124 156 Q 140 142 164 152" stroke="#1a0a14" stroke-width="2.5" fill="none" stroke-linecap="round" />`;

    case 'narrow-sheng':
      return `
        <line x1="82" y1="168" x2="114" y2="166" stroke="#1a0a14" stroke-width="3" stroke-linecap="round" />
        <line x1="126" y1="166" x2="158" y2="168" stroke="#1a0a14" stroke-width="3" stroke-linecap="round" />
        <path d="M 80 152 Q 100 144 114 154" stroke="#1a0a14" stroke-width="2" fill="none" />
        <path d="M 126 154 Q 140 144 160 152" stroke="#1a0a14" stroke-width="2" fill="none" />`;

    case 'narrow-aged':
      return `
        <line x1="84" y1="168" x2="114" y2="167" stroke="#1a0a14" stroke-width="2.5" stroke-linecap="round" />
        <line x1="126" y1="167" x2="156" y2="168" stroke="#1a0a14" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 82 152 Q 100 148 114 158" stroke="#1a0a14" stroke-width="1.8" fill="none" />
        <path d="M 126 158 Q 140 148 158 152" stroke="#1a0a14" stroke-width="1.8" fill="none" />
        <path d="M 76 174 Q 90 178 100 174" stroke="${accent}" stroke-width="0.8" fill="none" opacity="0.6" />
        <path d="M 140 174 Q 150 178 164 174" stroke="${accent}" stroke-width="0.8" fill="none" opacity="0.6" />`;

    case 'wide-jing':
      /* 净 painted-face exaggerated */
      return `
        <ellipse cx="98" cy="168" rx="15" ry="10" fill="#fafafa" stroke="#0a0a0a" stroke-width="2.5" />
        <circle cx="98" cy="168" r="6" fill="${accent === '#fafafa' ? '#0a0a0a' : '#0a0a0a'}" />
        <ellipse cx="142" cy="168" rx="15" ry="10" fill="#fafafa" stroke="#0a0a0a" stroke-width="2.5" />
        <circle cx="142" cy="168" r="6" fill="${accent === '#fafafa' ? '#0a0a0a' : '#0a0a0a'}" />
        <path d="M 78 144 L 116 144 L 116 156 L 80 160 Z" fill="${accent === '#fafafa' ? '#fafafa' : accent}" />
        <path d="M 162 144 L 124 144 L 124 156 L 160 160 Z" fill="${accent === '#fafafa' ? '#fafafa' : accent}" />`;

    case 'comic-bright':
      return `
        <circle cx="98" cy="168" r="3.5" fill="#1a0a14" />
        <circle cx="142" cy="168" r="3.5" fill="#1a0a14" />
        <circle cx="99" cy="167" r="1" fill="#fff" opacity="0.85" />
        <circle cx="143" cy="167" r="1" fill="#fff" opacity="0.85" />
        <path d="M 84 158 Q 100 150 114 162" stroke="#1a0a14" stroke-width="2.2" fill="none" />
        <path d="M 126 162 Q 140 150 156 158" stroke="#1a0a14" stroke-width="2.2" fill="none" />`;

    default:
      return `<ellipse cx="100" cy="168" rx="9" ry="3.5" fill="#1a0a14" /><ellipse cx="140" cy="168" rx="9" ry="3.5" fill="#1a0a14" />`;
  }
}

/* ========================================
   FOREHEAD
   ======================================== */
function drawForehead(style, color) {
  switch (style) {
    case 'flower-mark':
      return `<g transform="translate(120 130)">
        <path d="M 0 -8 Q -6 -3 0 1 Q 6 -3 0 -8 Z" fill="${color}" />
        <path d="M -8 0 Q -3 -6 1 0 Q -3 6 -8 0 Z" fill="${color}" />
        <path d="M 8 0 Q 3 -6 -1 0 Q 3 6 8 0 Z" fill="${color}" />
        <path d="M 0 8 Q -6 3 0 -1 Q 6 3 0 8 Z" fill="${color}" />
        <circle cx="0" cy="0" r="2" fill="#d4a017" />
      </g>`;
    case 'red-dot':
      return `<circle cx="120" cy="132" r="4" fill="${color}" />`;
    case 'crescent-moon':
      /* 包拯 white crescent moon — very iconic */
      return `<path d="M 105 128 Q 120 105 135 128 Q 130 122 120 122 Q 110 122 105 128 Z" fill="${color}" />
        <path d="M 110 130 Q 120 122 130 130" stroke="#a01a1a" stroke-width="0.8" fill="none" />`;
    case 'gold-pattern':
      return `<path d="M 100 128 Q 120 122 140 128" stroke="${color}" stroke-width="2" fill="none" />
        <path d="M 105 134 Q 120 130 135 134" stroke="${color}" stroke-width="1.2" fill="none" />
        <circle cx="120" cy="124" r="2.5" fill="${color}" />`;
    case 'red-line':
      return `<path d="M 108 130 L 132 130" stroke="${color}" stroke-width="2.5" />
        <path d="M 112 135 L 128 135" stroke="${color}" stroke-width="1.5" />`;
    default:
      return '';
  }
}

/* ========================================
   LIPS
   ======================================== */
function drawLips(style, color) {
  switch (style) {
    case 'small':
      return `<path d="M 113 218 Q 120 213 127 218 Q 120 223 113 218 Z" fill="${color}" />
        <path d="M 116 215 Q 120 213 124 215" stroke="${shadeC(color, 25)}" stroke-width="0.5" fill="none" />`;
    case 'small-male':
      return `<path d="M 110 217 L 130 217 L 128 220 L 112 220 Z" fill="${color}" />`;
    case 'small-pale':
      return `<path d="M 113 217 Q 120 213 127 217 Q 120 222 113 217 Z" fill="${color}" opacity="0.85" />`;
    case 'smile-small':
      return `<path d="M 110 215 Q 120 222 130 215 Q 120 220 110 215 Z" fill="${color}" />`;
    case 'big-red':
      return `<path d="M 105 215 Q 120 226 135 215 Q 120 222 105 215 Z" fill="${color}" />`;
    case 'no-color':
      return '';
    default:
      return `<path d="M 113 218 Q 120 213 127 218 Q 120 222 113 218 Z" fill="${color}" />`;
  }
}

/* ========================================
   BEARD
   ======================================== */
function drawBeard(style) {
  switch (style) {
    case 'long-black-five':
      /* 关羽's iconic long flowing beard reaching well past chin */
      return `<path d="M 80 220 Q 75 280 90 295" stroke="#0a0a0a" stroke-width="3" fill="none" />
        <path d="M 95 222 Q 92 290 105 305" stroke="#0a0a0a" stroke-width="3" fill="none" />
        <path d="M 110 225 Q 113 300 120 320" stroke="#0a0a0a" stroke-width="4" fill="none" />
        <path d="M 145 222 Q 148 290 135 305" stroke="#0a0a0a" stroke-width="3" fill="none" />
        <path d="M 160 220 Q 165 280 150 295" stroke="#0a0a0a" stroke-width="3" fill="none" />`;
    case 'long-black-three':
      return `<path d="M 90 225 Q 88 270 100 285" stroke="#0a0a0a" stroke-width="3.5" fill="none" />
        <path d="M 110 228 Q 115 280 120 295" stroke="#0a0a0a" stroke-width="4" fill="none" />
        <path d="M 130 228 Q 132 280 120 295" stroke="#0a0a0a" stroke-width="4" fill="none" />
        <path d="M 150 225 Q 152 270 140 285" stroke="#0a0a0a" stroke-width="3.5" fill="none" />`;
    case 'long-black-full':
      return `<path d="M 80 220 Q 100 285 140 285 Q 160 285 160 220 Q 140 235 120 235 Q 100 235 80 220 Z" fill="#0a0a0a" />`;
    case 'long-grey-three':
      return `<path d="M 90 225 Q 88 270 100 285" stroke="#a0a0a0" stroke-width="3" fill="none" />
        <path d="M 110 228 Q 115 280 120 290" stroke="#a0a0a0" stroke-width="3.5" fill="none" />
        <path d="M 130 228 Q 132 280 120 290" stroke="#a0a0a0" stroke-width="3.5" fill="none" />
        <path d="M 150 225 Q 152 270 140 285" stroke="#a0a0a0" stroke-width="3" fill="none" />`;
    case 'long-grey-full':
      return `<path d="M 80 220 Q 100 290 140 290 Q 160 290 160 220 Q 140 235 120 235 Q 100 235 80 220 Z" fill="#bababa" />`;
    case 'long-black-thin':
      return `<path d="M 105 225 Q 100 275 115 290 L 125 290 Q 140 275 135 225 Z" fill="#0a0a0a" opacity="0.85" />`;
    case 'mustache-thin':
      return `<path d="M 95 218 Q 110 224 120 222 Q 130 224 145 218" stroke="#0a0a0a" stroke-width="2.5" fill="none" />`;
    default:
      return '';
  }
}

/* ========================================
   HEADDRESS — many variations
   ======================================== */
function drawHeaddress(style, color, accent) {
  const dark = shadeC(color, -40);
  switch (style) {

    /* 凤冠 — phoenix crown for princess/bride */
    case 'phoenix-crown':
      return `
        <path d="M 50 88 Q 90 50 120 45 Q 150 50 190 88 L 195 110 Q 145 75 120 75 Q 95 75 45 110 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <!-- phoenix on top -->
        <path d="M 95 60 Q 80 25 100 22 Q 105 35 110 50 Q 115 55 120 50 Q 125 55 130 50 Q 135 35 140 22 Q 160 25 145 60 Z" fill="${accent}" stroke="${dark}" stroke-width="1" />
        <circle cx="120" cy="48" r="6" fill="#a01a3a" stroke="${color}" />
        <circle cx="120" cy="35" r="2.5" fill="${color}" />
        <!-- side beaded strings -->
        <line x1="60" y1="100" x2="58" y2="135" stroke="${color}" />
        <circle cx="58" cy="105" r="2" fill="${accent}" />
        <circle cx="58" cy="115" r="2" fill="${accent}" />
        <circle cx="58" cy="125" r="2" fill="${accent}" />
        <circle cx="58" cy="135" r="2" fill="${accent}" />
        <line x1="180" y1="100" x2="182" y2="135" stroke="${color}" />
        <circle cx="182" cy="105" r="2" fill="${accent}" />
        <circle cx="182" cy="115" r="2" fill="${accent}" />
        <circle cx="182" cy="125" r="2" fill="${accent}" />
        <circle cx="182" cy="135" r="2" fill="${accent}" />
        <line x1="80" y1="105" x2="78" y2="125" stroke="${color}" opacity="0.8" />
        <circle cx="78" cy="127" r="1.5" fill="${accent}" />
        <line x1="160" y1="105" x2="162" y2="125" stroke="${color}" opacity="0.8" />
        <circle cx="162" cy="127" r="1.5" fill="${accent}" />
      `;

    /* 珠帘 / 珠冠 — pearl-curtain for concubine */
    case 'pearl-curtain':
      return `
        <path d="M 55 95 Q 95 55 120 50 Q 145 55 185 95 L 190 110 Q 145 78 120 78 Q 95 78 50 110 Z" fill="${color}" stroke="${dark}" />
        <circle cx="120" cy="58" r="5" fill="${accent}" stroke="${dark}" />
        <line x1="120" y1="63" x2="120" y2="72" stroke="${dark}" stroke-width="0.5" />
        <line x1="60" y1="100" x2="60" y2="142" stroke="${color}" />
        <circle cx="60" cy="106" r="2" fill="${accent}" />
        <circle cx="60" cy="114" r="2" fill="${accent}" />
        <circle cx="60" cy="122" r="2" fill="${accent}" />
        <circle cx="60" cy="130" r="2" fill="${accent}" />
        <circle cx="60" cy="138" r="2" fill="${accent}" />
        <line x1="180" y1="100" x2="180" y2="142" stroke="${color}" />
        <circle cx="180" cy="106" r="2" fill="${accent}" />
        <circle cx="180" cy="114" r="2" fill="${accent}" />
        <circle cx="180" cy="122" r="2" fill="${accent}" />
        <circle cx="180" cy="130" r="2" fill="${accent}" />
        <circle cx="180" cy="138" r="2" fill="${accent}" />
      `;

    /* 帝冠 / 王帽 (Tang style) — flat-top crown */
    case 'imperial-mian':
    case 'pingtian-mian':
      return `
        <path d="M 55 95 Q 80 60 120 55 Q 160 60 185 95 L 190 110 Q 145 80 120 80 Q 95 80 50 110 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <rect x="70" y="34" width="100" height="20" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <rect x="70" y="30" width="100" height="6" fill="${accent}" />
        <line x1="80" y1="54" x2="80" y2="80" stroke="${accent}" stroke-width="1.5" />
        <circle cx="80" cy="60" r="2" fill="${accent}" />
        <circle cx="80" cy="68" r="2" fill="${accent}" />
        <circle cx="80" cy="76" r="2" fill="${accent}" />
        <line x1="160" y1="54" x2="160" y2="80" stroke="${accent}" stroke-width="1.5" />
        <circle cx="160" cy="60" r="2" fill="${accent}" />
        <circle cx="160" cy="68" r="2" fill="${accent}" />
        <circle cx="160" cy="76" r="2" fill="${accent}" />
      `;

    /* Qing dynasty crown */
    case 'qing-crown':
      return `
        <path d="M 55 92 Q 85 50 120 42 Q 155 50 185 92 L 190 110 Q 145 78 120 78 Q 95 78 50 110 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <circle cx="120" cy="35" r="6" fill="#a01a1a" stroke="${color}" stroke-width="1" />
        <line x1="120" y1="40" x2="120" y2="48" stroke="${dark}" />
        <line x1="60" y1="100" x2="60" y2="135" stroke="${dark}" />
        <line x1="180" y1="100" x2="180" y2="135" stroke="${dark}" />
        <circle cx="60" cy="135" r="2" fill="${accent}" />
        <circle cx="180" cy="135" r="2" fill="${accent}" />
      `;

    /* 状元帽 — red graduate scholar cap */
    case 'zhuangyuan-hat':
      return `
        <path d="M 55 95 Q 85 60 120 55 Q 155 60 185 95 L 185 110 Q 145 80 120 80 Q 95 80 55 110 Z" fill="${color}" stroke="${dark}" />
        <rect x="100" y="38" width="40" height="22" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <circle cx="120" cy="34" r="5" fill="${accent}" />
        <path d="M 50 100 L 30 130 L 50 122 Z" fill="${color}" />
        <path d="M 190 100 L 210 130 L 190 122 Z" fill="${color}" />
      `;

    /* 文生巾 — square scholar kerchief */
    case 'wensheng-jin':
      return `
        <path d="M 60 95 Q 85 65 120 60 Q 155 65 180 95 L 180 110 Q 145 85 120 85 Q 95 85 60 110 Z" fill="${color}" stroke="${dark}" />
        <rect x="108" y="55" width="24" height="14" fill="${accent}" stroke="${dark}" />
        <circle cx="120" cy="62" r="2" fill="${color}" />
        <line x1="60" y1="105" x2="48" y2="125" stroke="${color}" stroke-width="3" />
        <line x1="180" y1="105" x2="192" y2="125" stroke="${color}" stroke-width="3" />
      `;

    /* 方巾 — square soft cap */
    case 'fang-jin':
      return `
        <path d="M 60 100 Q 85 75 120 70 Q 155 75 180 100 L 180 112 Q 145 90 120 90 Q 95 90 60 112 Z" fill="${color}" stroke="${dark}" />
        <rect x="105" y="68" width="30" height="16" fill="${shadeC(color,-25)}" stroke="${dark}" />
        <circle cx="120" cy="76" r="2" fill="${accent}" />
      `;

    /* 紫金冠 — purple-gold crown for warrior small-male (吕布) */
    case 'zijin-crown':
    case 'zijin-crown-tall':
      return `
        <path d="M 55 92 Q 85 55 120 48 Q 155 55 185 92 L 190 108 Q 145 78 120 78 Q 95 78 50 108 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <rect x="98" y="32" width="44" height="20" fill="${accent}" stroke="${dark}" stroke-width="1.5" />
        <circle cx="120" cy="42" r="3" fill="${color}" />
        <!-- twin pheasant feathers (翎子) -->
        <path d="M 100 32 Q 70 -5 60 5 Q 80 25 95 50" fill="${accent}" stroke="${dark}" stroke-width="0.8" opacity="0.92" />
        <path d="M 95 38 Q 65 5 60 12" stroke="${dark}" stroke-width="0.5" fill="none" opacity="0.8" />
        <path d="M 140 32 Q 170 -5 180 5 Q 160 25 145 50" fill="${accent}" stroke="${dark}" stroke-width="0.8" opacity="0.92" />
        <path d="M 145 38 Q 175 5 180 12" stroke="${dark}" stroke-width="0.5" fill="none" opacity="0.8" />
      `;

    /* 帅盔 — general's helmet with red pom */
    case 'shuai-helmet':
    case 'shuai-helmet-w':
      return `
        <path d="M 45 95 Q 80 45 120 35 Q 160 45 195 95 L 200 110 Q 145 78 120 78 Q 95 78 40 110 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <path d="M 120 38 L 110 12 L 130 12 Z" fill="${accent}" stroke="${dark}" />
        <circle cx="120" cy="22" r="4" fill="${accent === '#d4a017' ? '#a01a1a' : accent}" />
        <rect x="113" y="48" width="14" height="6" fill="${accent}" stroke="${dark}" />
        <path d="M 50 100 L 38 132 L 52 124 Z" fill="${accent}" />
        <path d="M 190 100 L 202 132 L 188 124 Z" fill="${accent}" />
      `;

    /* 夫子盔 — Confucian helmet for 关羽 */
    case 'fuzi-helmet':
      return `
        <path d="M 45 95 Q 80 45 120 35 Q 160 45 195 95 L 200 110 Q 145 78 120 78 Q 95 78 40 110 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <rect x="100" y="22" width="40" height="20" fill="${color}" stroke="${dark}" />
        <rect x="100" y="20" width="40" height="6" fill="#a01a1a" />
        <circle cx="120" cy="32" r="3" fill="#d4a017" />
        <circle cx="108" cy="32" r="2" fill="#d4a017" />
        <circle cx="132" cy="32" r="2" fill="#d4a017" />
        <!-- red pom -->
        <circle cx="120" cy="14" r="6" fill="#a01a1a" />
        <line x1="120" y1="20" x2="120" y2="22" stroke="${dark}" />
        <path d="M 50 105 L 35 135 L 52 128 Z" fill="${accent}" />
        <path d="M 190 105 L 205 135 L 188 128 Z" fill="${accent}" />
      `;

    /* 大额子 — 武生 head adornment with pheasant feathers */
    case 'da-ezi-helmet':
      return `
        <path d="M 50 95 Q 80 50 120 38 Q 160 50 190 95 L 195 110 Q 145 78 120 78 Q 95 78 45 110 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <rect x="95" y="38" width="50" height="14" fill="${accent}" stroke="${dark}" />
        <circle cx="120" cy="45" r="4" fill="${color}" />
        <!-- twin feathers + fox tails -->
        <path d="M 95 40 Q 70 0 65 8 Q 80 25 90 50" fill="${accent}" stroke="${dark}" stroke-width="0.8" />
        <path d="M 145 40 Q 170 0 175 8 Q 160 25 150 50" fill="${accent}" stroke="${dark}" stroke-width="0.8" />
        <path d="M 50 105 L 35 145 L 50 138 Z" fill="${accent}" opacity="0.85" />
        <path d="M 190 105 L 205 145 L 190 138 Z" fill="${accent}" opacity="0.85" />
      `;

    /* Silver helmet for 罗成 */
    case 'silver-helmet':
      return `
        <path d="M 50 95 Q 80 50 120 38 Q 160 50 190 95 L 195 110 Q 145 78 120 78 Q 95 78 45 110 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <path d="M 120 40 L 112 10 L 128 10 Z" fill="${accent}" />
        <circle cx="120" cy="20" r="4" fill="#fafafa" />
        <rect x="113" y="48" width="14" height="6" fill="${shadeC(color,-30)}" />
        <path d="M 50 100 L 35 130 L 52 122 Z" fill="${accent}" />
        <path d="M 190 100 L 205 130 L 188 122 Z" fill="${accent}" />
      `;

    /* 罗帽 with snow — 林冲 风雪 */
    case 'luo-mao-snow':
      return `
        <path d="M 60 100 Q 85 70 120 65 Q 155 70 180 100 L 180 112 Q 145 88 120 88 Q 95 88 60 112 Z" fill="${color}" stroke="${dark}" />
        <ellipse cx="120" cy="60" rx="35" ry="14" fill="${color}" stroke="${dark}" />
        <!-- snow accumulation -->
        <path d="M 90 55 Q 110 50 120 52 Q 135 50 150 55 Q 145 60 120 58 Q 95 60 90 55 Z" fill="#fafafa" opacity="0.9" />
        <circle cx="100" cy="58" r="1.5" fill="#fafafa" />
        <circle cx="140" cy="58" r="1.5" fill="#fafafa" />
      `;

    /* Hero band 武松 — red headband */
    case 'hero-band':
      return `
        <path d="M 60 105 Q 90 90 120 85 Q 150 90 180 105 L 180 115 Q 145 100 120 100 Q 95 100 60 115 Z" fill="${shadeC(color,-30)}" />
        <rect x="50" y="105" width="140" height="18" fill="${color}" stroke="${dark}" />
        <path d="M 50 105 L 30 95 L 30 130 Z" fill="${color}" stroke="${dark}" />
        <path d="M 190 105 L 210 95 L 210 130 Z" fill="${color}" stroke="${dark}" />
        <circle cx="120" cy="113" r="3" fill="${accent}" />
      `;

    /* 相纱 — prime minister's gauze hat with horizontal wings */
    case 'sha-mao':
    case 'sha-mao-wide':
    case 'xiang-sha':
      return `
        <path d="M 50 95 Q 80 55 120 48 Q 160 55 190 95 L 195 108 Q 145 78 120 78 Q 95 78 45 108 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <rect x="98" y="32" width="44" height="20" fill="${color}" stroke="${dark}" />
        <rect x="103" y="30" width="34" height="4" fill="${accent}" />
        <!-- wide horizontal wings -->
        <path d="M 50 95 L 18 100 L 48 110 Z" fill="${color}" stroke="${dark}" stroke-width="1" />
        <path d="M 190 95 L 222 100 L 192 110 Z" fill="${color}" stroke="${dark}" stroke-width="1" />
      `;

    /* 驸马帽 (prince consort) */
    case 'fuma-hat':
      return `
        <path d="M 55 95 Q 85 60 120 55 Q 155 60 185 95 L 185 108 Q 145 78 120 78 Q 95 78 55 108 Z" fill="${color}" stroke="${dark}" />
        <rect x="100" y="36" width="40" height="20" fill="${color}" stroke="${dark}" />
        <circle cx="120" cy="46" r="4" fill="${accent}" />
        <!-- floral wings on either side -->
        <path d="M 55 100 Q 30 95 25 110 Q 40 105 60 105 Z" fill="${accent}" stroke="${dark}" />
        <path d="M 185 100 Q 210 95 215 110 Q 200 105 180 105 Z" fill="${accent}" stroke="${dark}" />
      `;

    /* 员外巾 */
    case 'yuanwai-jin':
      return `
        <path d="M 55 95 Q 85 60 120 55 Q 155 60 185 95 L 185 110 Q 145 80 120 80 Q 95 80 55 110 Z" fill="${color}" stroke="${dark}" />
        <rect x="105" y="50" width="30" height="14" fill="${shadeC(color,15)}" stroke="${dark}" />
        <circle cx="120" cy="57" r="3" fill="${accent}" />
      `;

    /* Mourning band for 文萍生 */
    case 'mourning-band':
      return `
        <path d="M 60 100 Q 90 75 120 70 Q 150 75 180 100 L 180 110 Q 145 85 120 85 Q 95 85 60 110 Z" fill="${color}" />
        <rect x="55" y="100" width="130" height="10" fill="#fafafa" />
        <path d="M 110 105 L 130 105 L 128 130 L 112 130 Z" fill="#fafafa" />
        <circle cx="120" cy="115" r="2" fill="#a01a1a" />
      `;

    /* 道姑帽 / mourning pin etc */
    case 'mourning-pin':
      return `
        <path d="M 60 100 Q 85 78 120 73 Q 155 78 180 100 L 180 110 Q 145 88 120 88 Q 95 88 60 110 Z" fill="${color}" />
        <ellipse cx="120" cy="78" rx="14" ry="10" fill="${color}" stroke="${shadeC(color,-30)}" />
        <path d="M 105 80 Q 120 70 135 80" stroke="#fafafa" stroke-width="1" fill="none" />
      `;

    /* Female warrior helmet with phoenix */
    case 'phoenix-helm':
      return `
        <path d="M 50 95 Q 85 50 120 40 Q 155 50 190 95 L 195 110 Q 145 78 120 78 Q 95 78 45 110 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <!-- phoenix shape on top -->
        <path d="M 95 50 Q 80 18 100 18 Q 110 35 120 38 Q 130 35 140 18 Q 160 18 145 50 Z" fill="${accent}" stroke="${dark}" />
        <circle cx="120" cy="40" r="4" fill="${color}" />
        <!-- twin feathers -->
        <path d="M 90 50 Q 60 0 55 8 Q 75 25 88 60" fill="${accent}" stroke="${dark}" stroke-width="0.8" opacity="0.92" />
        <path d="M 150 50 Q 180 0 185 8 Q 165 25 152 60" fill="${accent}" stroke="${dark}" stroke-width="0.8" opacity="0.92" />
        <!-- side beads -->
        <line x1="60" y1="100" x2="60" y2="130" stroke="${color}" />
        <circle cx="60" cy="108" r="2" fill="${accent}" />
        <circle cx="60" cy="118" r="2" fill="${accent}" />
        <circle cx="60" cy="128" r="2" fill="${accent}" />
        <line x1="180" y1="100" x2="180" y2="130" stroke="${color}" />
        <circle cx="180" cy="108" r="2" fill="${accent}" />
        <circle cx="180" cy="118" r="2" fill="${accent}" />
        <circle cx="180" cy="128" r="2" fill="${accent}" />
      `;

    /* Silver female warrior helmet for 樊梨花 */
    case 'silver-helm-fem':
      return `
        <path d="M 50 95 Q 85 55 120 45 Q 155 55 190 95 L 195 110 Q 145 78 120 78 Q 95 78 45 110 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <path d="M 120 48 L 105 18 L 135 18 Z" fill="${accent}" stroke="${dark}" />
        <circle cx="120" cy="28" r="4" fill="${color}" />
        <path d="M 95 60 Q 75 25 70 32 Q 80 50 95 70" fill="${accent}" stroke="${dark}" stroke-width="0.7" opacity="0.9" />
        <path d="M 145 60 Q 165 25 170 32 Q 160 50 145 70" fill="${accent}" stroke="${dark}" stroke-width="0.7" opacity="0.9" />
      `;

    /* Aged tiara / matron */
    case 'aged-tiara':
      return `
        <path d="M 55 95 Q 85 60 120 55 Q 155 60 185 95 L 185 108 Q 145 78 120 78 Q 95 78 55 108 Z" fill="${color}" stroke="${dark}" />
        <rect x="100" y="40" width="40" height="14" fill="${accent}" />
        <text x="120" y="51" text-anchor="middle" font-family="serif" font-size="9" fill="${shadeC(color,-30)}">寿</text>
      `;

    /* 蝴蝶头面 — butterfly wings hair pieces */
    case 'butterfly-wings':
      return `
        <path d="M 55 100 Q 90 70 120 65 Q 150 70 185 100 L 185 110 Q 145 82 120 82 Q 95 82 55 110 Z" fill="${color}" stroke="${dark}" />
        <path d="M 70 80 Q 45 45 32 60 Q 45 80 65 95 Z" fill="${accent}" opacity="0.92" stroke="${dark}" />
        <path d="M 170 80 Q 195 45 208 60 Q 195 80 175 95 Z" fill="${accent}" opacity="0.92" stroke="${dark}" />
        <circle cx="50" cy="62" r="2" fill="${color}" />
        <circle cx="190" cy="62" r="2" fill="${color}" />
        <line x1="120" y1="58" x2="120" y2="80" stroke="${dark}" stroke-width="1" />
      `;

    /* Flower pin variations */
    case 'flower-pin-peony':
      return `
        <path d="M 60 100 Q 90 70 120 65 Q 150 70 180 100 L 180 110 Q 145 82 120 82 Q 95 82 60 110 Z" fill="${color}" stroke="${dark}" />
        <g transform="translate(85 65)">
          <ellipse cx="0" cy="-3" rx="6" ry="4" fill="${accent}" transform="rotate(-30)" />
          <ellipse cx="-5" cy="0" rx="6" ry="4" fill="${accent}" transform="rotate(60)" />
          <ellipse cx="5" cy="0" rx="6" ry="4" fill="${accent}" transform="rotate(-60)" />
          <circle cx="0" cy="0" r="3" fill="${shadeC(accent,30)}" />
          <circle cx="0" cy="0" r="1.5" fill="#d4a017" />
        </g>
        <g transform="translate(155 65)">
          <ellipse cx="0" cy="-3" rx="6" ry="4" fill="${accent}" transform="rotate(-30)" />
          <ellipse cx="-5" cy="0" rx="6" ry="4" fill="${accent}" transform="rotate(60)" />
          <ellipse cx="5" cy="0" rx="6" ry="4" fill="${accent}" transform="rotate(-60)" />
          <circle cx="0" cy="0" r="3" fill="${shadeC(accent,30)}" />
          <circle cx="0" cy="0" r="1.5" fill="#d4a017" />
        </g>
        <circle cx="120" cy="58" r="4" fill="${accent}" />
      `;
    case 'flower-pin-blue':
    case 'flower-pin-pink':
    case 'flower-pin-jade':
      return `
        <path d="M 65 100 Q 90 75 120 70 Q 150 75 175 100 L 175 110 Q 145 85 120 85 Q 95 85 65 110 Z" fill="${color}" stroke="${dark}" />
        <circle cx="100" cy="75" r="6" fill="${accent}" stroke="${dark}" />
        <circle cx="100" cy="75" r="2" fill="#d4a017" />
        <circle cx="140" cy="75" r="6" fill="${accent}" stroke="${dark}" />
        <circle cx="140" cy="75" r="2" fill="#d4a017" />
      `;

    /* Maid bun */
    case 'maid-bun':
      return `
        <path d="M 70 105 Q 90 85 120 80 Q 150 85 170 105 L 170 115 Q 145 95 120 95 Q 95 95 70 115 Z" fill="${color}" />
        <circle cx="120" cy="78" r="14" fill="${color}" stroke="${shadeC(color,-30)}" />
        <circle cx="120" cy="76" r="3" fill="${accent}" />
      `;

    case 'lopsided-bun':
      return `
        <path d="M 70 105 Q 90 85 120 80 Q 150 85 170 105 L 170 115 Q 145 95 120 95 Q 95 95 70 115 Z" fill="${color}" />
        <ellipse cx="105" cy="76" rx="16" ry="13" fill="${color}" stroke="${shadeC(color,-30)}" />
        <ellipse cx="100" cy="74" rx="6" ry="4" fill="${accent}" />
      `;

    case 'aged-low-bun':
      return `
        <path d="M 70 105 Q 90 90 120 85 Q 150 90 170 105 L 170 115 Q 145 95 120 95 Q 95 95 70 115 Z" fill="${color}" />
        <ellipse cx="120" cy="90" rx="14" ry="10" fill="${color}" stroke="${shadeC(color,-30)}" />
      `;

    /* Tang dynasty tiara */
    case 'tang-tiara':
      return `
        <path d="M 50 92 Q 90 55 120 48 Q 150 55 190 92 L 195 108 Q 145 75 120 75 Q 95 75 45 108 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <path d="M 90 75 L 85 32 L 100 38 L 110 25 L 120 35 L 130 25 L 140 38 L 155 32 L 150 75 Z" fill="${accent}" stroke="${dark}" stroke-width="1" />
        <circle cx="120" cy="32" r="5" fill="${color}" />
        <circle cx="105" cy="46" r="2.5" fill="${color}" />
        <circle cx="135" cy="46" r="2.5" fill="${color}" />
        <line x1="68" y1="100" x2="60" y2="138" stroke="${color}" />
        <circle cx="60" cy="108" r="2" fill="${accent}" />
        <circle cx="60" cy="120" r="2" fill="${accent}" />
        <circle cx="60" cy="132" r="2" fill="${accent}" />
        <line x1="172" y1="100" x2="180" y2="138" stroke="${color}" />
        <circle cx="180" cy="108" r="2" fill="${accent}" />
        <circle cx="180" cy="120" r="2" fill="${accent}" />
        <circle cx="180" cy="132" r="2" fill="${accent}" />
      `;

    /* Wang Zhaojun fur hat */
    case 'fur-hat':
      return `
        <path d="M 45 100 Q 80 65 120 60 Q 160 65 195 100 L 195 115 Q 145 88 120 88 Q 95 88 45 115 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <path d="M 50 65 Q 60 50 65 60 Q 80 45 90 60 Q 100 50 110 60 Q 120 45 130 60 Q 140 50 150 60 Q 160 45 170 60 Q 180 50 190 65 Q 175 80 165 75 Q 145 85 120 80 Q 95 85 75 75 Q 65 80 50 65 Z" fill="#5a4030" />
        <ellipse cx="120" cy="58" rx="18" ry="10" fill="${color}" stroke="${dark}" />
        <circle cx="120" cy="58" r="4" fill="${accent}" />
      `;

    /* Ghost veil */
    case 'ghost-veil':
      return `
        <path d="M 35 95 Q 85 55 120 50 Q 155 55 205 95 L 200 130 Q 160 95 120 95 Q 80 95 40 130 Z" fill="${color}" opacity="0.7" stroke="${dark}" stroke-width="0.6" />
        <line x1="60" y1="105" x2="55" y2="155" stroke="${color}" stroke-width="0.6" opacity="0.75" />
        <line x1="80" y1="110" x2="78" y2="158" stroke="${color}" stroke-width="0.5" opacity="0.6" />
        <line x1="160" y1="110" x2="162" y2="158" stroke="${color}" stroke-width="0.5" opacity="0.6" />
        <line x1="180" y1="105" x2="185" y2="155" stroke="${color}" stroke-width="0.6" opacity="0.75" />
        <circle cx="120" cy="62" r="4" fill="${accent}" />
      `;

    /* Loose hair (wronged ghost) */
    case 'loose-hair-ghost':
      return `
        <path d="M 50 105 Q 90 80 120 75 Q 150 80 190 105" stroke="${color}" stroke-width="6" fill="none" />
        <path d="M 60 110 Q 50 200 40 240 Q 65 220 75 165" stroke="${color}" stroke-width="3" fill="none" opacity="0.85" />
        <path d="M 180 110 Q 190 200 200 240 Q 175 220 165 165" stroke="${color}" stroke-width="3" fill="none" opacity="0.85" />
        <path d="M 80 105 Q 78 175 86 220" stroke="${color}" stroke-width="2" fill="none" opacity="0.7" />
        <path d="M 160 105 Q 162 175 154 220" stroke="${color}" stroke-width="2" fill="none" opacity="0.7" />
        <circle cx="120" cy="80" r="4" fill="${accent}" />
      `;

    /* Execution band — red ribbon */
    case 'execution-band':
      return `
        <path d="M 60 100 Q 90 80 120 75 Q 150 80 180 100 L 180 110 Q 145 90 120 90 Q 95 90 60 110 Z" fill="#3a3a3a" />
        <rect x="50" y="100" width="140" height="14" fill="${color}" />
        <path d="M 50 100 Q 30 90 20 110 L 35 130 L 50 114 Z" fill="${color}" />
        <path d="M 190 100 Q 210 90 220 110 L 205 130 L 190 114 Z" fill="${color}" />
        <text x="120" y="111" text-anchor="middle" font-family="serif" font-size="9" fill="${accent}">冤</text>
      `;

    /* Modern bun for 阿庆嫂 */
    case 'modern-bun':
      return `
        <path d="M 60 100 Q 90 78 120 72 Q 150 78 180 100 L 180 112 Q 145 88 120 88 Q 95 88 60 112 Z" fill="${color}" />
        <ellipse cx="120" cy="78" rx="22" ry="13" fill="${color}" />
        <line x1="98" y1="78" x2="142" y2="78" stroke="${shadeC(color,-30)}" stroke-width="0.5" />
      `;

    /* Fairy tiara */
    case 'fairy-tiara':
      return `
        <path d="M 50 95 Q 85 55 120 45 Q 155 55 190 95 L 195 108 Q 145 75 120 75 Q 95 75 45 108 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <!-- cloud-pattern fairy hair piece -->
        <path d="M 88 60 Q 70 30 90 25 Q 100 35 105 50 Q 110 35 120 30 Q 130 35 135 50 Q 140 35 150 25 Q 170 30 152 60 Z" fill="${accent}" stroke="${dark}" />
        <circle cx="120" cy="35" r="5" fill="${color}" />
        <!-- small stars/pearls -->
        <circle cx="95" cy="50" r="2" fill="#fafafa" />
        <circle cx="145" cy="50" r="2" fill="#fafafa" />
        <circle cx="120" cy="20" r="2.5" fill="#fafafa" />
        <!-- flowing ribbons -->
        <path d="M 60 100 Q 50 130 60 160" stroke="${accent}" stroke-width="2" fill="none" opacity="0.7" />
        <path d="M 180 100 Q 190 130 180 160" stroke="${accent}" stroke-width="2" fill="none" opacity="0.7" />
      `;

    case 'star-tiara':
      return `
        <path d="M 55 95 Q 90 58 120 50 Q 150 58 185 95 L 190 108 Q 145 78 120 78 Q 95 78 50 108 Z" fill="${color}" stroke="${dark}" stroke-width="1.5" />
        <path d="M 95 60 Q 85 35 95 30 L 105 50 Q 110 35 120 30 L 120 50 Q 130 35 135 30 L 145 50 Q 155 35 145 60 Z" fill="${accent}" stroke="${dark}" />
        <circle cx="98" cy="42" r="1.5" fill="#fafafa" />
        <circle cx="112" cy="36" r="1.5" fill="#fafafa" />
        <circle cx="120" cy="32" r="2" fill="#fafafa" />
        <circle cx="128" cy="36" r="1.5" fill="#fafafa" />
        <circle cx="142" cy="42" r="1.5" fill="#fafafa" />
        <circle cx="105" cy="52" r="1.2" fill="#fafafa" />
        <circle cx="135" cy="52" r="1.2" fill="#fafafa" />
      `;

    default:
      return `<path d="M 60 100 Q 90 78 120 73 Q 150 78 180 100 L 180 110 Q 145 88 120 88 Q 95 88 60 110 Z" fill="${color}" />`;
  }
}

/* ========================================
   SIGNATURE CORNER ELEMENTS
   ======================================== */
function drawSignature(type) {
  const positions = `transform="translate(212 290)"`;
  switch (type) {
    case 'peony':
      return `<g ${positions} opacity="0.75">
        <ellipse cx="0" cy="-3" rx="8" ry="5" fill="#a01a3a" transform="rotate(-30)" />
        <ellipse cx="-6" cy="0" rx="8" ry="5" fill="#c4243a" transform="rotate(60)" />
        <ellipse cx="6" cy="0" rx="8" ry="5" fill="#c4243a" transform="rotate(-60)" />
        <circle cx="0" cy="0" r="4" fill="#d4506a" />
        <circle cx="0" cy="0" r="2" fill="#d4a017" />
      </g>`;
    case 'plum':
      return `<g ${positions} opacity="0.85">
        <path d="M 0 0 Q -10 -10 -18 -8" stroke="#3a1a0a" stroke-width="1.5" fill="none" />
        <circle cx="-3" cy="-2" r="3.5" fill="#c4243a" />
        <circle cx="-9" cy="-7" r="3.5" fill="#c4243a" />
        <circle cx="-15" cy="-9" r="2.5" fill="#a01a3a" />
        <circle cx="-3" cy="-2" r="0.7" fill="#d4a017" />
      </g>`;
    case 'butterfly':
      return `<g ${positions} opacity="0.85">
        <ellipse cx="-6" cy="0" rx="7" ry="5" fill="#d4a017" transform="rotate(-25)" />
        <ellipse cx="6" cy="0" rx="7" ry="5" fill="#d4a017" transform="rotate(25)" />
        <ellipse cx="-5" cy="3" rx="4" ry="3" fill="#a01a3a" transform="rotate(20)" />
        <ellipse cx="5" cy="3" rx="4" ry="3" fill="#a01a3a" transform="rotate(-20)" />
        <line x1="0" y1="-5" x2="0" y2="7" stroke="#1a1a1a" stroke-width="1.2" />
      </g>`;
    case 'sword':
      return `<g ${positions} opacity="0.85">
        <line x1="0" y1="-13" x2="0" y2="11" stroke="#c0c0c0" stroke-width="3" />
        <line x1="-5" y1="-11" x2="5" y2="-11" stroke="#d4a017" stroke-width="2" />
        <circle cx="0" cy="-13" r="2" fill="#d4a017" />
      </g>`;
    case 'sword-twin':
      return `<g ${positions} opacity="0.85">
        <line x1="-3" y1="-12" x2="-3" y2="10" stroke="#c0c0c0" stroke-width="2" />
        <line x1="3" y1="-12" x2="3" y2="10" stroke="#c0c0c0" stroke-width="2" />
        <line x1="-7" y1="-10" x2="-1" y2="-10" stroke="#d4a017" stroke-width="1.5" />
        <line x1="1" y1="-10" x2="7" y2="-10" stroke="#d4a017" stroke-width="1.5" />
      </g>`;
    case 'sword-silver':
      return `<g ${positions} opacity="0.9">
        <line x1="0" y1="-14" x2="0" y2="12" stroke="#e0e0e0" stroke-width="3.5" />
        <line x1="-6" y1="-12" x2="6" y2="-12" stroke="#a0a0a0" stroke-width="2" />
        <circle cx="0" cy="-14" r="2.5" fill="#a0a0a0" />
      </g>`;
    case 'spear':
      return `<g ${positions} opacity="0.85">
        <line x1="0" y1="-13" x2="0" y2="13" stroke="#3a1a0a" stroke-width="2" />
        <path d="M 0 -13 L -3 -8 L 0 -3 L 3 -8 Z" fill="#c0c0c0" />
        <path d="M -3 -2 L 3 -2 L 0 1 Z" fill="#a01a1a" />
      </g>`;
    case 'spear-silver':
      return `<g ${positions} opacity="0.9">
        <line x1="0" y1="-13" x2="0" y2="13" stroke="#1a1a1a" stroke-width="1.5" />
        <path d="M 0 -13 L -2.5 -8 L 0 -3 L 2.5 -8 Z" fill="#e0e0e0" />
      </g>`;
    case 'spear-snake':
      return `<g ${positions} opacity="0.85">
        <line x1="0" y1="-13" x2="0" y2="13" stroke="#3a1a0a" stroke-width="1.8" />
        <path d="M 0 -13 Q -3 -10 0 -7 Q 3 -10 0 -13 Z" fill="#c0c0c0" />
        <path d="M -2 -8 Q 0 -5 2 -8" stroke="#c0c0c0" stroke-width="1" fill="none" />
      </g>`;
    case 'guandao':
      /* 关羽's iconic 青龙偃月刀 */
      return `<g ${positions} opacity="0.9">
        <line x1="0" y1="-14" x2="0" y2="14" stroke="#3a1a0a" stroke-width="2" />
        <path d="M 0 -14 Q 7 -12 9 -5 Q 6 -2 0 -3 Z" fill="#1a5a1a" stroke="#0a3a0a" stroke-width="1" />
        <line x1="0" y1="-14" x2="-1" y2="-9" stroke="#a01a1a" stroke-width="0.8" />
      </g>`;
    case 'halberd':
      return `<g ${positions} opacity="0.9">
        <line x1="0" y1="-14" x2="0" y2="14" stroke="#3a1a0a" stroke-width="2" />
        <path d="M 0 -14 L -7 -10 L 0 -4 L 7 -10 Z" fill="#c0c0c0" />
        <path d="M 6 -11 L 13 -9 L 8 -4 Z" fill="#d4a017" />
      </g>`;
    case 'fan':
      return `<g ${positions} opacity="0.85">
        <path d="M 0 0 L -10 -11 L -8 -13 L 0 -8 L 8 -13 L 10 -11 Z" fill="#d4a017" stroke="#3a1a0a" stroke-width="0.5" />
        <line x1="-9" y1="-11" x2="0" y2="-2" stroke="#3a1a0a" stroke-width="0.4" />
        <line x1="0" y1="-8" x2="0" y2="-2" stroke="#3a1a0a" stroke-width="0.4" />
        <line x1="9" y1="-11" x2="0" y2="-2" stroke="#3a1a0a" stroke-width="0.4" />
      </g>`;
    case 'fan-feather':
      return `<g ${positions} opacity="0.85">
        <path d="M 0 0 Q -8 -10 -10 -8 Q -3 -2 0 0 Z" fill="#fafafa" stroke="#3a1a0a" />
        <path d="M -5 -3 L -8 -8" stroke="#3a1a0a" stroke-width="0.4" />
        <path d="M -2 -1 L -4 -8" stroke="#3a1a0a" stroke-width="0.4" />
      </g>`;
    case 'fan-twin':
      return `<g ${positions} opacity="0.85">
        <path d="M -2 0 L -10 -10 L -10 -2 Z" fill="#d4a017" stroke="#3a1a0a" stroke-width="0.5" />
        <path d="M 2 0 L 10 -10 L 10 -2 Z" fill="#d4a017" stroke="#3a1a0a" stroke-width="0.5" />
      </g>`;
    case 'fan-round':
      return `<g ${positions} opacity="0.85">
        <circle cx="0" cy="-3" r="9" fill="#d4a017" stroke="#3a1a0a" />
        <line x1="0" y1="-12" x2="0" y2="6" stroke="#3a1a0a" stroke-width="0.5" />
        <ellipse cx="-3" cy="-4" rx="3" ry="2" fill="#a01a3a" opacity="0.6" />
      </g>`;
    case 'scroll':
      return `<g ${positions} opacity="0.85">
        <rect x="-10" y="-3" width="20" height="7" fill="#f0e0c0" stroke="#5a3a1a" />
        <circle cx="-10" cy="0.5" r="3" fill="#a04020" />
        <circle cx="10" cy="0.5" r="3" fill="#a04020" />
        <line x1="-5" y1="-1" x2="5" y2="-1" stroke="#3a1a0a" stroke-width="0.4" />
        <line x1="-5" y1="1" x2="3" y2="1" stroke="#3a1a0a" stroke-width="0.4" />
      </g>`;
    case 'lychee':
      return `<g ${positions} opacity="0.9">
        <circle cx="-4" cy="0" r="4" fill="#a01a1a" />
        <circle cx="4" cy="-2" r="4" fill="#c4243a" />
        <circle cx="0" cy="6" r="4" fill="#a01a1a" />
        <line x1="-4" y1="-4" x2="-2" y2="-12" stroke="#3a1a0a" stroke-width="1" />
        <line x1="4" y1="-6" x2="2" y2="-12" stroke="#3a1a0a" stroke-width="1" />
        <ellipse cx="-2" cy="-13" rx="4" ry="2" fill="#3a5a3a" />
      </g>`;
    case 'umbrella':
      return `<g ${positions} opacity="0.9">
        <path d="M -13 0 Q 0 -16 13 0 Z" fill="#a08080" stroke="#3a1a0a" />
        <line x1="-13" y1="0" x2="13" y2="0" stroke="#3a1a0a" stroke-width="0.4" />
        <line x1="-7" y1="-12" x2="-7" y2="0" stroke="#3a1a0a" stroke-width="0.3" />
        <line x1="7" y1="-12" x2="7" y2="0" stroke="#3a1a0a" stroke-width="0.3" />
        <line x1="0" y1="-16" x2="0" y2="14" stroke="#3a1a0a" stroke-width="1" />
      </g>`;
    case 'umbrella-jade':
      return `<g ${positions} opacity="0.85">
        <path d="M -10 0 Q 0 -14 10 0 Z" fill="#80c0c0" stroke="#3a3a3a" />
        <line x1="0" y1="-14" x2="0" y2="12" stroke="#3a3a3a" stroke-width="0.8" />
      </g>`;
    case 'water-drops':
      return `<g ${positions} opacity="0.85">
        <ellipse cx="-5" cy="-3" rx="2" ry="4" fill="#80c0c0" />
        <ellipse cx="3" cy="2" rx="2" ry="4" fill="#80c0c0" />
        <ellipse cx="-2" cy="6" rx="1.5" ry="3" fill="#a0d0d0" />
      </g>`;
    case 'hairpin':
      return `<g ${positions} opacity="0.9">
        <line x1="-10" y1="-8" x2="6" y2="8" stroke="#a060a0" stroke-width="2" />
        <ellipse cx="-10" cy="-8" rx="4" ry="3" fill="#a060a0" stroke="#3a1a3a" />
        <circle cx="-10" cy="-8" r="1.5" fill="#d4a017" />
      </g>`;
    case 'willow':
      return `<g ${positions} opacity="0.85">
        <path d="M 0 -14 Q 5 -8 0 0 Q -5 8 0 14" stroke="#5a8a4a" stroke-width="1" fill="none" />
        <ellipse cx="-2" cy="-8" rx="1.5" ry="3" fill="#5a8a4a" transform="rotate(-30)" />
        <ellipse cx="3" cy="-2" rx="1.5" ry="3" fill="#5a8a4a" transform="rotate(40)" />
        <ellipse cx="-3" cy="4" rx="1.5" ry="3" fill="#5a8a4a" transform="rotate(-30)" />
        <ellipse cx="2" cy="10" rx="1.5" ry="3" fill="#5a8a4a" transform="rotate(40)" />
      </g>`;
    case 'lotus':
      return `<g ${positions} opacity="0.9">
        <ellipse cx="0" cy="2" rx="3" ry="6" fill="#e890b0" />
        <ellipse cx="-5" cy="0" rx="3" ry="6" fill="#e890b0" transform="rotate(-50)" />
        <ellipse cx="5" cy="0" rx="3" ry="6" fill="#e890b0" transform="rotate(50)" />
        <ellipse cx="-3" cy="-3" rx="2" ry="5" fill="#fab0c8" transform="rotate(-25)" />
        <ellipse cx="3" cy="-3" rx="2" ry="5" fill="#fab0c8" transform="rotate(25)" />
        <circle cx="0" cy="0" r="2" fill="#d4a017" />
      </g>`;
    case 'gavel':
      return `<g ${positions} opacity="0.85">
        <rect x="-10" y="-3" width="20" height="6" fill="#5a3a1a" stroke="#1a0a0a" />
        <line x1="0" y1="3" x2="0" y2="13" stroke="#5a3a1a" stroke-width="2.5" />
        <circle cx="0" cy="0" r="1" fill="#d4a017" />
      </g>`;
    case 'baton':
      return `<g ${positions} opacity="0.85">
        <line x1="0" y1="-13" x2="0" y2="13" stroke="#5a3a1a" stroke-width="3" />
        <rect x="-3" y="-13" width="6" height="6" fill="#d4a017" />
      </g>`;
    case 'tablet':
      return `<g ${positions} opacity="0.85">
        <rect x="-5" y="-12" width="10" height="22" fill="#f0e0c0" stroke="#3a1a0a" />
        <line x1="-3" y1="-8" x2="3" y2="-8" stroke="#3a1a0a" stroke-width="0.4" />
        <line x1="-3" y1="-4" x2="3" y2="-4" stroke="#3a1a0a" stroke-width="0.4" />
        <line x1="-3" y1="0" x2="3" y2="0" stroke="#3a1a0a" stroke-width="0.4" />
        <line x1="-3" y1="4" x2="3" y2="4" stroke="#3a1a0a" stroke-width="0.4" />
      </g>`;
    case 'wine':
      return `<g ${positions} opacity="0.9">
        <path d="M -7 -10 L 7 -10 L 5 0 Q 4 8 -4 8 Q -5 8 -5 0 Z" fill="#5a3a1a" stroke="#1a0a0a" />
        <ellipse cx="0" cy="-10" rx="7" ry="2.5" fill="#a01a1a" />
        <line x1="0" y1="8" x2="0" y2="14" stroke="#3a1a0a" stroke-width="1" />
      </g>`;
    case 'tiger':
      return `<g ${positions} opacity="0.8">
        <ellipse cx="0" cy="0" rx="11" ry="7" fill="#d4a017" stroke="#3a1a0a" />
        <circle cx="-4" cy="-1" r="1.5" fill="#1a1a1a" />
        <circle cx="4" cy="-1" r="1.5" fill="#1a1a1a" />
        <text x="0" y="3" text-anchor="middle" font-family="serif" font-size="6" fill="#1a1a1a">王</text>
      </g>`;
    case 'cane':
      return `<g ${positions} opacity="0.85">
        <line x1="0" y1="-12" x2="0" y2="14" stroke="#5a3a1a" stroke-width="2.5" />
        <path d="M 0 -12 Q 4 -14 6 -10" stroke="#5a3a1a" stroke-width="2.5" fill="none" />
      </g>`;
    case 'cane-dragon':
      return `<g ${positions} opacity="0.85">
        <line x1="0" y1="-10" x2="0" y2="14" stroke="#5a3a1a" stroke-width="3" />
        <circle cx="0" cy="-12" r="4" fill="#d4a017" stroke="#3a1a0a" />
        <circle cx="-1" cy="-12" r="0.8" fill="#0a0a0a" />
      </g>`;
    case 'pipa':
      return `<g ${positions} opacity="0.9">
        <ellipse cx="0" cy="3" rx="7" ry="9" fill="#d4a017" stroke="#5a3a1a" />
        <line x1="0" y1="-5" x2="0" y2="-13" stroke="#5a3a1a" stroke-width="2" />
        <line x1="-4" y1="-2" x2="-4" y2="9" stroke="#1a1a1a" stroke-width="0.4" />
        <line x1="0" y1="-2" x2="0" y2="9" stroke="#1a1a1a" stroke-width="0.4" />
        <line x1="4" y1="-2" x2="4" y2="9" stroke="#1a1a1a" stroke-width="0.4" />
      </g>`;
    case 'flute':
      return `<g ${positions} opacity="0.85">
        <line x1="-12" y1="6" x2="12" y2="-6" stroke="#5a3a1a" stroke-width="3" />
        <circle cx="-6" cy="3" r="0.8" fill="#1a0a0a" />
        <circle cx="-2" cy="1" r="0.8" fill="#1a0a0a" />
        <circle cx="2" cy="-1" r="0.8" fill="#1a0a0a" />
        <circle cx="6" cy="-3" r="0.8" fill="#1a0a0a" />
      </g>`;
    case 'brush':
      return `<g ${positions} opacity="0.9">
        <line x1="0" y1="-12" x2="0" y2="6" stroke="#5a3a1a" stroke-width="2" />
        <path d="M 0 6 Q -2 14 0 14 Q 2 14 0 6 Z" fill="#1a1a1a" />
        <circle cx="0" cy="-12" r="2" fill="#a01a1a" />
      </g>`;
    case 'mirror':
      return `<g ${positions} opacity="0.9">
        <circle cx="0" cy="-3" r="9" fill="#e0e0e0" stroke="#3a1a0a" stroke-width="1.5" />
        <circle cx="0" cy="-3" r="6" fill="#fafafa" />
        <line x1="0" y1="6" x2="0" y2="14" stroke="#3a1a0a" stroke-width="1.5" />
      </g>`;
    case 'medicine':
      return `<g ${positions} opacity="0.85">
        <rect x="-7" y="-2" width="14" height="9" fill="#5a3a1a" stroke="#1a0a0a" />
        <ellipse cx="0" cy="-2" rx="7" ry="2" fill="#a04020" />
        <text x="0" y="5" text-anchor="middle" font-family="serif" font-size="6" fill="#d4a017">药</text>
      </g>`;
    case 'kite':
      return `<g ${positions} opacity="0.85">
        <path d="M 0 -10 L 8 0 L 0 10 L -8 0 Z" fill="#a01a3a" stroke="#3a1a0a" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#3a1a0a" stroke-width="0.4" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#3a1a0a" stroke-width="0.4" />
        <path d="M 0 10 Q -2 14 0 18 Q 2 14 0 10 Z" fill="#d4a017" />
      </g>`;
    case 'letter':
      return `<g ${positions} opacity="0.9">
        <rect x="-9" y="-6" width="18" height="13" fill="#f0e0c0" stroke="#3a1a0a" />
        <path d="M -9 -6 L 0 0 L 9 -6" stroke="#3a1a0a" fill="none" stroke-width="1" />
        <circle cx="0" cy="0" r="2" fill="#a01a1a" />
      </g>`;
    case 'incense':
      return `<g ${positions} opacity="0.85">
        <line x1="0" y1="-2" x2="0" y2="14" stroke="#5a3a1a" stroke-width="1.5" />
        <circle cx="0" cy="-2" r="1.5" fill="#a01a1a" />
        <path d="M 0 -2 Q -3 -8 0 -12 Q 3 -8 0 -4" stroke="#a08090" stroke-width="0.8" fill="none" opacity="0.7" />
      </g>`;
    case 'petition':
      return `<g ${positions} opacity="0.85">
        <rect x="-7" y="-10" width="14" height="20" fill="#f0e0c0" stroke="#3a1a0a" />
        <line x1="-4" y1="-7" x2="4" y2="-7" stroke="#3a1a0a" stroke-width="0.4" />
        <line x1="-4" y1="-3" x2="4" y2="-3" stroke="#3a1a0a" stroke-width="0.4" />
        <line x1="-4" y1="1" x2="4" y2="1" stroke="#3a1a0a" stroke-width="0.4" />
        <text x="0" y="8" text-anchor="middle" font-family="serif" font-size="6" fill="#a01a1a">冤</text>
      </g>`;
    case 'red-ribbon':
      return `<g ${positions} opacity="0.9">
        <path d="M -10 -10 Q -5 0 -10 10" stroke="#a01a1a" stroke-width="3" fill="none" />
        <path d="M 0 -10 Q 5 0 0 10" stroke="#a01a1a" stroke-width="3" fill="none" />
        <path d="M 10 -10 Q 5 0 10 10" stroke="#a01a1a" stroke-width="3" fill="none" />
      </g>`;
    case 'teapot':
      return `<g ${positions} opacity="0.9">
        <ellipse cx="0" cy="2" rx="9" ry="6" fill="#5a3a1a" stroke="#1a0a0a" />
        <path d="M 9 0 Q 14 -2 13 4 Q 11 4 9 4 Z" fill="#5a3a1a" stroke="#1a0a0a" />
        <path d="M -9 -1 Q -13 -4 -10 4 Q -11 4 -9 4 Z" fill="#5a3a1a" stroke="#1a0a0a" />
        <circle cx="0" cy="-4" r="1.8" fill="#d4a017" />
      </g>`;
    case 'shuttle':
      return `<g ${positions} opacity="0.9">
        <ellipse cx="0" cy="0" rx="11" ry="3.5" fill="#5a3a1a" stroke="#1a0a0a" />
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#fafafa" stroke-width="0.4" />
      </g>`;
    case 'cloud-streamer':
      return `<g ${positions} opacity="0.85">
        <path d="M -12 0 Q -6 -8 0 -3 Q 6 -8 12 0 Q 6 4 0 -1 Q -6 4 -12 0 Z" fill="#a0c0e0" />
        <circle cx="-6" cy="-3" r="1" fill="#fafafa" />
        <circle cx="6" cy="-3" r="1" fill="#fafafa" />
      </g>`;
    case 'dragon':
      return `<g ${positions} opacity="0.8">
        <path d="M -10 6 Q -2 -8 5 -4 Q 12 6 5 10" stroke="#d4a017" stroke-width="2" fill="none" />
        <circle cx="-10" cy="6" r="3" fill="#d4a017" />
        <line x1="-12" y1="4" x2="-12" y2="2" stroke="#d4a017" stroke-width="1" />
      </g>`;
    case 'ruyi':
      return `<g ${positions} opacity="0.85">
        <line x1="-6" y1="6" x2="8" y2="-8" stroke="#d4a017" stroke-width="2" />
        <path d="M 8 -8 Q 12 -8 14 -4 Q 10 -2 8 -8 Z" fill="#d4a017" />
        <path d="M -6 6 Q -10 6 -10 10 Q -6 10 -6 6 Z" fill="#d4a017" />
      </g>`;
    default:
      return '';
  }
}

/* ========================================
   NAME STRIP
   ======================================== */
function drawNameStrip(character) {
  return `<line x1="40" y1="312" x2="200" y2="312" stroke="#d4a017" stroke-width="0.4" opacity="0.45" />
    <text x="120" y="306" text-anchor="middle" font-family="serif" font-size="9.5" fill="#d4a017" opacity="0.6" letter-spacing="3">${character.name_cn}</text>`;
}

/* ========================================
   MAIN GENERATOR
   ======================================== */
window.generatePortrait = function(character) {
  const v = window.CHARACTER_VISUALS[character.id];
  if (!v) {
    /* Fallback portrait if a character has no visual spec */
    return `<svg viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      ${bgGradient(character.id, '#2a2a2a')}
      <ellipse cx="120" cy="175" rx="52" ry="70" fill="#e8d8c8" />
      <text x="120" y="306" text-anchor="middle" font-family="serif" font-size="10" fill="#d4a017" opacity="0.6">${character.name_cn}</text>
    </svg>`;
  }

  return `<svg viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
    ${getBg(v.bg, character.id, v.bgTone)}
    ${shoulderShape(v.costumeColor, v.headdressAccent || '#d4a017', v.costume)}
    ${drawFace(v.faceTone, v.faceShape, character.id)}
    ${drawFacePaint(v.facePaint, v.faceTone, v.faceShape)}
    ${drawCheekRouge(v.cheekRouge, v.eyeAccent)}
    ${drawEyes(v.eyes, v.eyeAccent, v.faceTone)}
    ${drawForehead(v.forehead, v.foreheadColor)}
    ${drawLips(v.lips, v.lipColor)}
    ${drawBeard(v.beard)}
    ${drawHeaddress(v.headdress, v.headdressColor, v.headdressAccent)}
    ${drawSignature(v.signature)}
    ${drawNameStrip(character)}
  </svg>`;
};
