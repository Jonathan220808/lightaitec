/* ============================================================
   ACTIVE CHARACTERS — currently in play.
   Only these 15 characters can be matched. The 60-character pool
   in data.js (window.CHARACTERS) is kept as historical reference
   but is no longer used by the game.
   Each active character has an `image` field pointing to a real
   portrait illustration; the renderer prefers that over the
   generated SVG portrait from portraits.js.
   ============================================================ */

window.ACTIVE_CHARACTERS = [

  /* ============================================================ */
  /* ===                    男 · MALE (9)                     === */
  /* ============================================================ */

  {
    id: 'lunwenxu',
    image: 'portraits/倫.png',
    gender: 'male',
    role_type: '丑生 / 文生',
    name_cn: '伦文叙', name_en: 'Lun Wen-sui',
    play_cn: '《伦文叙智斗柳先开》', play_en: 'The Wit of Lun Wen-sui',
    traits: { '痴情': 3, '烈': 4, '飘逸': 6, '智慧': 10, '谐趣': 9, '决绝': 5 },
    quote_cn: '一支笔可以输给一支剑，但赢回来要等三十年。',
    quote_en: 'A pen can lose to a sword — and take thirty years to win back.',
    letter_cn: '你和伦文叙一样，是个用脑子赢的人。你看见别人看不见的破绽，又懂得不当场点破——这是岭南人很老的那种聪明。',
    letter_en: 'Like Lun Wen-sui, you win with your mind. You see the gap others miss, and you have the wit to not call it out in the moment — the old Lingnan kind of cleverness.',
    monologue_cn: '别急着输——再听一句。',
    monologue_en: 'Do not be in a rush to lose — hear one more line.',
    event_cn: '南国剧场 · 6 月 22 日', event_en: 'Nanguo Theatre · June 22'
  },

  {
    id: 'tangminghuang',
    image: 'portraits/唐明皇.png',
    gender: 'male',
    role_type: '武生',
    name_cn: '唐明皇', name_en: 'Emperor Xuanzong',
    play_cn: '《长生殿》', play_en: 'The Palace of Eternal Life',
    traits: { '痴情': 8, '烈': 5, '飘逸': 6, '智慧': 7, '谐趣': 4, '决绝': 5 },
    quote_cn: '在天愿作比翼鸟，在地愿为连理枝。',
    quote_en: 'In heaven, may we be twin-flying birds. On earth, branches that share one root.',
    letter_cn: '你和唐明皇一样，有过权力的人。对自己有过的时刻，你比谁都清楚——那不是权力给的，是另一个人。',
    letter_en: 'Like Emperor Xuanzong, you have once held power. And you know better than anyone — those moments that mattered, were not given by power. They were given by one other person.',
    monologue_cn: '高位不重要——可以并肩看月亮的那个人才重要。',
    monologue_en: 'High position is no matter. What matters is the one who could stand beside me to watch the moon.',
    event_cn: '广府大剧院 · 6 月 12 日', event_en: 'Guangfu Grand Theatre · June 12'
  },

  {
    id: 'sunwukong',
    image: 'portraits/孙悟空.png',
    gender: 'male',
    role_type: '武生 / 猴生',
    name_cn: '孙悟空', name_en: 'Sun Wukong',
    play_cn: '《大闹天宫》', play_en: 'Havoc in Heaven',
    traits: { '痴情': 2, '烈': 10, '飘逸': 9, '智慧': 8, '谐趣': 9, '决绝': 9 },
    quote_cn: '齐天大圣自家姓——天也敢闹，地也敢翻。',
    quote_en: 'Great Sage Equal to Heaven — I dare upset heaven, and overturn earth.',
    letter_cn: '你和孙悟空一样，是那种"先动手再讲规矩"的人。规矩不是你不懂——是你不服。但你最后会发现，自由不是闹出来的，是认下一个紧箍咒之后还在的那点东西。',
    letter_en: 'Like Sun Wukong, you act first and explain later. It is not that you do not know the rules — you simply do not bow to them. In the end you will learn: freedom is not what you make by fighting, but what remains in you after the headband tightens.',
    monologue_cn: '我跌过的跟头比谁都多——但没人能让我说一句"算了"。',
    monologue_en: 'I have fallen more times than anyone — but no one has yet made me say "let it go."',
    event_cn: '广府大剧院 · 7 月 5 日', event_en: 'Guangfu Grand Theatre · July 5'
  },

  {
    id: 'jiabaoyu',
    image: 'portraits/寶玉.png',
    gender: 'male',
    role_type: '文武生',
    name_cn: '贾宝玉', name_en: 'Jia Baoyu',
    play_cn: '《红楼梦·焚稿》', play_en: 'Dream of the Red Chamber',
    traits: { '痴情': 10, '烈': 4, '飘逸': 9, '智慧': 6, '谐趣': 5, '决绝': 4 },
    quote_cn: '女儿是水做的骨肉——我看见的时候就知道了。',
    quote_en: 'Girls are made of water. I knew the moment I saw.',
    letter_cn: '你和贾宝玉一样，认得"美"，也认得"不公平"。你会为了一个人写一首不能给别人看的诗。世界忙着分对错，你忙着分懂不懂。',
    letter_en: 'Like Jia Baoyu, you recognize beauty — and you recognize injustice. You will write a poem for one person that no one else will ever see. The world hurries to sort right from wrong; you sort who understands from who does not.',
    monologue_cn: '我从来不是来争什么的——我是来认一个人的。',
    monologue_en: 'I never came to contend for anything — I came to know one person.',
    event_cn: '广府大剧院 · 6 月 18 日', event_en: 'Guangfu Grand Theatre · June 18'
  },

  {
    id: 'liyi',
    image: 'portraits/李益.png',
    gender: 'male',
    role_type: '文武生',
    name_cn: '李益', name_en: 'Li Yi',
    play_cn: '《紫钗记》', play_en: 'The Purple Hairpin',
    traits: { '痴情': 7, '烈': 4, '飘逸': 7, '智慧': 8, '谐趣': 2, '决绝': 4 },
    quote_cn: '一钗在手，半生再寻。',
    quote_en: 'A hairpin in hand — half a life spent in the search.',
    letter_cn: '你和李益一样，会在事情过去很久之后才意识到自己有多在乎。世故不能消蚀的，是某些回忆里的清亮。',
    letter_en: 'Like Li Yi, you only realize how much you cared long after the moment has passed. The world dims much — but it cannot dull the brightness of certain memories.',
    monologue_cn: '我赶不及当年的雨——但我赶上了这一夜。',
    monologue_en: 'I could not catch the rain of that year — but I am here for this night.',
    event_cn: '南国剧场 · 6 月 1 日', event_en: 'Nanguo Theatre · June 1'
  },

  {
    id: 'sudongpo',
    image: 'portraits/東坡.png',
    gender: 'male',
    role_type: '文生 / 老生',
    name_cn: '苏东坡', name_en: 'Su Dongpo',
    play_cn: '《赤壁怀古》', play_en: 'Meditations on Red Cliff',
    traits: { '痴情': 5, '烈': 5, '飘逸': 10, '智慧': 10, '谐趣': 8, '决绝': 6 },
    quote_cn: '大江东去，浪淘尽——千古风流人物。',
    quote_en: 'The great river flows east; its waves wash away — a thousand years of brilliant men.',
    letter_cn: '你和苏东坡一样，在被贬的时候，比得意的人活得更宽。世界推过你几次，但你回头不是恨——是写了一首诗。',
    letter_en: 'Like Su Dongpo, you live more broadly in exile than others do in glory. The world has pushed you back more than once — and your answer is not bitterness, but a poem.',
    monologue_cn: '少年时怕风浪——后来才明白，风浪里写出来的字，最像我。',
    monologue_en: 'In youth I feared the storm. Only later did I learn — the words I write inside the storm are the ones that look most like me.',
    event_cn: '南国剧场 · 7 月 14 日', event_en: 'Nanguo Theatre · July 14'
  },

  {
    id: 'xuxian',
    image: 'portraits/許仙.png',
    gender: 'male',
    role_type: '小生',
    name_cn: '许仙', name_en: 'Xu Xian',
    play_cn: '《白蛇传·情》', play_en: 'Legend of the White Snake',
    traits: { '痴情': 8, '烈': 3, '飘逸': 5, '智慧': 4, '谐趣': 3, '决绝': 4 },
    quote_cn: '我不问你来路——只问你愿不愿意留下。',
    quote_en: 'I ask not where you came from — only whether you will stay.',
    letter_cn: '你和许仙一样，是会"先信任，再去想"的那种人。世故的人笑你"傻"，但真的可贵的事都是这样开始的：一个人先伸出手，另一个人才敢把伞撑给他。',
    letter_en: 'Like Xu Xian, you are one who trusts first and thinks later. The worldly call this foolish — but everything precious begins this way: one person reaches out, and only then does the other dare to share the umbrella.',
    monologue_cn: '我若早知道，就会更早地说"无论如何"。',
    monologue_en: 'Had I known earlier, I would have said "no matter what" sooner.',
    event_cn: '广府大剧院 · 6 月 5 日', event_en: 'Guangfu Grand Theatre · June 5'
  },

  {
    id: 'zhaoyun',
    image: 'portraits/赵云.png',
    gender: 'male',
    role_type: '武生',
    name_cn: '赵云', name_en: 'Zhao Yun',
    play_cn: '《长阪坡》', play_en: 'The Battle of Changban',
    traits: { '痴情': 5, '烈': 8, '飘逸': 5, '智慧': 7, '谐趣': 2, '决绝': 9 },
    quote_cn: '怀中阿斗一身白，万军不能挡。',
    quote_en: 'A child in my arms, my robe still white — and ten thousand cannot bar my way.',
    letter_cn: '你和赵云一样，是个能在乱军里把该护的人护到底的人。漂亮的不是你的招式——是你护着的那个人，从你身边走出来时的眼神。',
    letter_en: 'Like Zhao Yun, you are one who can shelter the one needing shelter through chaos itself. What is beautiful is not your skill — it is the look in the eyes of the one you protected, walking out from behind you.',
    monologue_cn: '我没什么传奇——我只是没把怀里那个人放下来。',
    monologue_en: 'I have no legend — I only failed to put down the child in my arms.',
    event_cn: '太和剧院 · 7 月 18 日', event_en: 'Taihe Theatre · July 18'
  },

  {
    id: 'zhongkui',
    image: 'portraits/钟馗.png',
    gender: 'male',
    role_type: '净 / 大花脸',
    name_cn: '钟馗', name_en: 'Zhong Kui',
    play_cn: '《钟馗嫁妹》', play_en: 'Zhong Kui Marries Off His Sister',
    traits: { '痴情': 3, '烈': 9, '飘逸': 4, '智慧': 7, '谐趣': 5, '决绝': 10 },
    quote_cn: '我相貌可怖，但心地比你们都干净。',
    quote_en: 'My face frightens you — but my heart is cleaner than yours.',
    letter_cn: '你和钟馗一样，被人看见的第一眼总是"硬"。但真见过你的人都知道——你的硬，是替亲近的人挡的。世界让你长出来一副凶相，是因为你护着的东西足够柔软。',
    letter_en: 'Like Zhong Kui, what people see first in you is the hardness. But those who know you understand — that hardness is shelter for the soft thing you guard. The world made you fierce because what you protect is fragile.',
    monologue_cn: '我吓走的不是我妹妹——是该来吓她的那些。',
    monologue_en: 'It is not my sister I drive away — it is what would have come to frighten her.',
    event_cn: '太和剧院 · 8 月 2 日', event_en: 'Taihe Theatre · August 2'
  },

  /* ============================================================ */
  /* ===                   女 · FEMALE (6)                    === */
  /* ============================================================ */

  {
    id: 'sanniang',
    image: 'portraits/三娘.png',
    gender: 'female',
    role_type: '正印花旦 / 苦旦',
    name_cn: '王春娥', name_en: 'Wang Chun-e (San-niang)',
    play_cn: '《三娘教子》', play_en: 'San-niang Teaches Her Son',
    traits: { '痴情': 7, '烈': 8, '飘逸': 3, '智慧': 8, '谐趣': 2, '决绝': 9 },
    quote_cn: '一织一断，一断一接——夫君不在，这家由我来撑。',
    quote_en: 'A weave, a snap. A snap, a mend. With my husband gone, this house I will hold up myself.',
    letter_cn: '你和三娘一样，没在意过"该不该是你"。该撑的就撑——把日子织成布，把孩子教成人。你不喊苦，因为喊苦的力气你都用来过日子了。',
    letter_en: 'Like San-niang, you have never wasted breath on whether it should have been you. What needs holding, you hold — weaving days into cloth, shaping the child into a person. You do not cry of hardship; the strength to cry, you spend on living.',
    monologue_cn: '我不想成什么模样——我只想这孩子，长成一个能挑的人。',
    monologue_en: 'I do not wish to become anything in particular — I only wish for this child to grow into one who can carry.',
    event_cn: '南国剧场 · 7 月 1 日', event_en: 'Nanguo Theatre · July 1'
  },

  {
    id: 'yangguifei',
    image: 'portraits/楊貴妃.png',
    gender: 'female',
    role_type: '正印花旦',
    name_cn: '杨贵妃', name_en: 'Yang Guifei',
    play_cn: '《长生殿》', play_en: 'The Palace of Eternal Life',
    traits: { '痴情': 9, '烈': 6, '飘逸': 8, '智慧': 5, '谐趣': 5, '决绝': 6 },
    quote_cn: '七月七日长生殿，夜半无人私语时。',
    quote_en: 'On the seventh of the seventh, in the Palace of Eternal Life — at midnight, when none could overhear, we spoke.',
    letter_cn: '你和杨贵妃一样，活得明亮、爱得明亮、连忧愁也是明亮的。世人爱你的明亮，但他们少有人耐心看你怎么暗下去。',
    letter_en: 'Like Yang Guifei, you live brightly, love brightly — even your sorrows are bright. The world loves your light, but few have the patience to see how it dims.',
    monologue_cn: '马嵬坡的事我已经走过了——你不必再问。',
    monologue_en: 'Mawei Slope is behind me. You need not ask of it again.',
    event_cn: '广府大剧院 · 6 月 12 日', event_en: 'Guangfu Grand Theatre · June 12'
  },

  {
    id: 'bainiangzi',
    image: 'portraits/白娘子.png',
    gender: 'female',
    role_type: '正印花旦',
    name_cn: '白娘子', name_en: 'Lady White (Bai Suzhen)',
    play_cn: '《白蛇传·情》', play_en: 'Legend of the White Snake',
    traits: { '痴情': 9, '烈': 8, '飘逸': 8, '智慧': 9, '谐趣': 2, '决绝': 9 },
    quote_cn: '千年修炼，只为这一场凡间。',
    quote_en: 'A thousand years of cultivation — for this single mortal life.',
    letter_cn: '你和白娘子一样，所有的智慧、修为、力量，都肯为一个人放下。但放下不是软弱——必要时你也会断桥之上，让天地都听见。',
    letter_en: 'Like Lady White, all your wisdom, all your power, you would set aside for one person. But setting aside is not weakness — when needed, you stand on the broken bridge and let heaven and earth hear you.',
    monologue_cn: '我不是来求情的——我来履约。',
    monologue_en: 'I have not come to plead — I have come to keep my word.',
    event_cn: '广府大剧院 · 6 月 5 日', event_en: 'Guangfu Grand Theatre · June 5'
  },

  {
    id: 'huaruifuren',
    image: 'portraits/花蕊夫人.png',
    gender: 'female',
    role_type: '正印花旦',
    name_cn: '花蕊夫人', name_en: 'Lady Huarui',
    play_cn: '《花蕊夫人》', play_en: 'Lady Huarui',
    traits: { '痴情': 6, '烈': 9, '飘逸': 7, '智慧': 9, '谐趣': 3, '决绝': 8 },
    quote_cn: '十四万人齐解甲——更无一个是男儿。',
    quote_en: 'A hundred and forty thousand laid down their armor — and not a single one was a man.',
    letter_cn: '你和花蕊夫人一样，亡了国之后还能写诗。比国土先丢的，是别人的骨气；比骨气后丢的，是你的笔。你写下来不是为了报复——是为了让后来人知道，有人记得。',
    letter_en: 'Like Lady Huarui, even after the kingdom fell you could still write a poem. What fell before the land was others\' spine; what falls last is your pen. You write not for revenge — but so that those after you will know: someone remembered.',
    monologue_cn: '宫墙塌了——但有一行字是塌不了的。',
    monologue_en: 'The palace walls have fallen — but a single line of writing cannot.',
    event_cn: '南国剧场 · 7 月 28 日', event_en: 'Nanguo Theatre · July 28'
  },

  {
    id: 'axiu',
    image: 'portraits/阿琇.png',
    gender: 'female',
    role_type: '二帮花旦',
    name_cn: '阿琇', name_en: 'A-xiu',
    play_cn: '《阿琇》', play_en: 'A-xiu',
    traits: { '痴情': 8, '烈': 5, '飘逸': 8, '智慧': 6, '谐趣': 5, '决绝': 4 },
    quote_cn: '你给我一支簪——我就敢说，这一夜是真的。',
    quote_en: 'You gave me one hairpin — and I dare to say, this one night is real.',
    letter_cn: '你和阿琇一样，不要那种轰轰烈烈的爱。一句"我看见你了"，已经够你记很久。世故的人觉得这种安静的喜欢"不够"——其实你才是知道喜欢是什么的人。',
    letter_en: 'Like A-xiu, you do not need a love that thunders. One sentence — "I saw you" — and you can carry it a long time. The worldly think this quiet kind of caring is "not enough." Truly, you are the one who knows what caring is.',
    monologue_cn: '你说我等了你太久——我没有等。我是在那里。',
    monologue_en: 'You say I waited too long for you — I did not wait. I was simply there.',
    event_cn: '南国剧场 · 6 月 26 日', event_en: 'Nanguo Theatre · June 26'
  },

  {
    id: 'lindaiyu',
    image: 'portraits/黛玉.png',
    gender: 'female',
    role_type: '正印花旦 / 文旦',
    name_cn: '林黛玉', name_en: 'Lin Daiyu',
    play_cn: '《红楼梦·葬花》', play_en: 'Dream of the Red Chamber',
    traits: { '痴情': 10, '烈': 3, '飘逸': 10, '智慧': 8, '谐趣': 2, '决绝': 5 },
    quote_cn: '花落人亡两不知——我葬的不是花，是我自己。',
    quote_en: 'The flowers fall and the person passes, neither knowing the other — I am not burying flowers, I am burying myself.',
    letter_cn: '你和林黛玉一样，是会因为一句话失眠的人。世界粗，你偏偏细。这不是脆弱——是你愿意把"在乎"留在身上，不甩开。',
    letter_en: 'Like Lin Daiyu, you are one who can lose sleep over a single sentence. The world is coarse — and you are deliberately fine. This is not fragility. It is your willingness to keep caring on your body, instead of shaking it off.',
    monologue_cn: '我不是不愿好起来——我是不愿假装好起来。',
    monologue_en: 'It is not that I will not be well — it is that I will not pretend to be well.',
    event_cn: '广府大剧院 · 6 月 18 日', event_en: 'Guangfu Grand Theatre · June 18'
  }

];
