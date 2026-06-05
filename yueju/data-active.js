/* ============================================================
   ACTIVE CHARACTERS — currently in play.
   12 characters (6 male + 6 female) as of 5th Jun update.
   The 60-character pool in data.js is kept as historical
   reference but is no longer used by the game.
   Each character has:
     image       — portrait illustration path
     coffee_cn   — coffee flavor signature (粤剧咖啡 product tie-in)
     quote_cn/en — famous literary line shown on result screen
     letter_cn/en— personalised letter to the user
     monologue_cn/en — classic 粤剧 aria / signature line
   ============================================================ */

window.ACTIVE_CHARACTERS = [

  /* ============================================================ */
  /* ===                    男 · MALE (6)                     === */
  /* ============================================================ */

  {
    id: 'lunwenxu',
    image: 'portraits/倫.png',
    gender: 'male',
    role_type: '文生',
    name_cn: '伦文叙', name_en: 'Lun Wen-sui',
    play_cn: '《伦文叙》', play_en: 'The Wit of Lun Wen-sui',
    traits: { '痴情': 3, '烈': 4, '飘逸': 6, '智慧': 10, '谐趣': 9, '决绝': 5 },
    coffee_cn: '比利时传统厚巧克力为基调，层次带来如地中海岩礁飘送的海盐味 · 哥伦比亚',
    quote_cn: '一支笔可以输给一支剑，但赢回来要等三十年。',
    quote_en: 'A pen can lose to a sword — and take thirty years to win back.',
    letter_cn: '你和伦文叙一样，是个用脑子赢的人。你看见别人看不到的破绽，又懂得不当场点破——这是岭南智慧。',
    letter_en: 'Like Lun Wen-sui, you win with your mind. You see the gap others miss, and you have the wit to not call it out in the moment — the old Lingnan kind of cleverness.',
    monologue_cn: '書生氣傲，居貧亦自好。',
    monologue_en: 'A scholar keeps his pride — even poverty cannot diminish him.',
    event_cn: '南国剧场 · 6 月 22 日', event_en: 'Nanguo Theatre · June 22'
  },

  {
    id: 'tangminghuang',
    image: 'portraits/唐明皇.png',
    gender: 'male',
    role_type: '小生',
    name_cn: '唐明皇', name_en: 'Emperor Xuanzong',
    play_cn: '《唐宫香梦证前盟》', play_en: 'The Palace of Eternal Life',
    traits: { '痴情': 8, '烈': 5, '飘逸': 6, '智慧': 7, '谐趣': 4, '决绝': 5 },
    coffee_cn: '锡兰红茶般浓郁开场，草莓果酱的甜美随后铺开，像盛唐夜宴最后一盏未凉的宫灯 · 埃塞俄比亚',
    quote_cn: '在天愿作比翼鸟，在地愿为连理枝。',
    quote_en: 'In heaven, may we be twin-flying birds. On earth, branches that share one root.',
    letter_cn: '你和唐明皇一样，有过权力的人。对自己有过的时刻，你比谁都清楚——那不是权力给的，是另一个人。',
    letter_en: 'Like Emperor Xuanzong, you have once held power. And you know better than anyone — those moments that mattered, were not given by power. They were given by one other person.',
    monologue_cn: '高位不重要——可以并肩看月亮的那个人才重要。',
    monologue_en: 'High position is no matter. What matters is the one who could stand beside me to watch the moon.',
    event_cn: '广府大剧院 · 6 月 12 日', event_en: 'Guangfu Grand Theatre · June 12'
  },

  {
    id: 'jiabaoyu',
    image: 'portraits/寶玉.png',
    gender: 'male',
    role_type: '小生',
    name_cn: '贾宝玉', name_en: 'Jia Baoyu',
    play_cn: '《红楼梦》', play_en: 'Dream of the Red Chamber',
    traits: { '痴情': 10, '烈': 4, '飘逸': 9, '智慧': 6, '谐趣': 5, '决绝': 4 },
    coffee_cn: '白桃与花蜜香气缓缓舒展，不肯向世俗妥协的清甜里藏着一点孤傲的苦涩 · 巴拿马',
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
    role_type: '小生',
    name_cn: '李益', name_en: 'Li Yi',
    play_cn: '《紫钗记》', play_en: 'The Purple Hairpin',
    traits: { '痴情': 7, '烈': 4, '飘逸': 7, '智慧': 8, '谐趣': 2, '决绝': 4 },
    coffee_cn: '中深烘焙的坚果与可可气息缓慢沉淀，尾韵浮现雨后石板路般的微凉清新 · 危地马拉',
    quote_cn: '一钗在手，半生再寻。',
    quote_en: 'A hairpin in hand — half a life spent in the search.',
    letter_cn: '你和李益一样，会在事情过去很久之后才意识到自己有多在乎。世故不能消蚀的，是某些回忆里的清亮。',
    letter_en: 'Like Li Yi, you only realize how much you cared long after the moment has passed. The world dims much — but it cannot dull the brightness of certain memories.',
    monologue_cn: '一钗在手，半生再寻。',
    monologue_en: 'A hairpin in hand — half a life spent in the search.',
    event_cn: '南国剧场 · 6 月 1 日', event_en: 'Nanguo Theatre · June 1'
  },

  {
    id: 'xuxian',
    image: 'portraits/許仙.png',
    gender: 'male',
    role_type: '小生',
    name_cn: '许仙', name_en: 'Xu Xian',
    play_cn: '《白蛇传·情》', play_en: 'The Fairy Tale of The White Snake',
    traits: { '痴情': 8, '烈': 3, '飘逸': 5, '智慧': 4, '谐趣': 3, '决绝': 4 },
    coffee_cn: '雪莉桶熟果香轻轻展开，威士忌般清醒而克制，像西湖细雨中的一把旧纸伞 · 印度尼西亚',
    quote_cn: '我不问你来路——只问你愿不愿意留下。',
    quote_en: 'I ask not where you came from — only whether you will stay.',
    letter_cn: '你和许仙一样，是会"先信任，再去想"的那种人。世故的人笑你"傻"，但真的可贵的事都是这样开始的：一个人先伸出手，另一个人才敢把伞撑给他。',
    letter_en: 'Like Xu Xian, you are one who trusts first and thinks later. The worldly call this foolish — but everything precious begins this way: one person reaches out, and only then does the other dare to share the umbrella.',
    monologue_cn: '人若無情不如妖，只要有情妖亦人。',
    monologue_en: 'Without love, a person is less than a demon — but with love, even a demon becomes human.',
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
    coffee_cn: '黑巧克力与烘烤坚果构成利落骨架，收尾带着山风般干净的草本气息 · 肯尼亚',
    quote_cn: '怀中阿斗一身白，万军不能挡。',
    quote_en: 'A child in my arms, my robe still white — and ten thousand cannot bar my way.',
    letter_cn: '你和赵云一样，是个能在乱军里把该护的人护到底的人。漂亮的不是你的招式——是你护着的那个人，从你身边走出来时的眼神。',
    letter_en: 'Like Zhao Yun, you are one who can shelter the one needing shelter through chaos itself. What is beautiful is not your skill — it is the look in the eyes of the one you protected, walking out from behind you.',
    monologue_cn: '我没什么传奇——我只是没把怀里那个人放下来。',
    monologue_en: 'I have no legend — I only failed to put down the child in my arms.',
    event_cn: '太和剧院 · 7 月 18 日', event_en: 'Taihe Theatre · July 18'
  },

  /* ============================================================ */
  /* ===                   女 · FEMALE (6)                    === */
  /* ============================================================ */

  {
    id: 'longnvsanniang',
    image: 'portraits/三娘.png',
    gender: 'female',
    role_type: '正印花旦',
    name_cn: '龙女三娘', name_en: 'Long Nu San-niang',
    play_cn: '《柳毅传书》', play_en: 'The Dragon Girl\'s Letter',
    traits: { '痴情': 8, '烈': 4, '飘逸': 9, '智慧': 7, '谐趣': 3, '决绝': 6 },
    coffee_cn: '柑橘与白花香明亮绽放，如晨光映照海面时最纯净的一阵微风 · 哥斯达黎加',
    quote_cn: '世人爭羨游仙夢，誰識仙宮有苦衷。',
    quote_en: 'The world envies immortal dreams — but who understands the burdens within the heavenly palace.',
    letter_cn: '龙女三娘源于唐代李朝威的《柳毅传》，至今仍是粤剧"春班"最常演的经典。善良是她的本色，善缘是她的命运，善终是她的花好月圆。',
    letter_en: 'Long Nu San-niang originates from Li Chaowei\'s Tang dynasty tale. To this day, she remains one of the most beloved figures in Cantonese opera. Kindness is her nature, providence is her fortune, and a tender ending is the flower that blooms for her.',
    monologue_cn: '世人爭羨游仙夢。',
    monologue_en: 'The world envies the immortal dream.',
    event_cn: '南国剧场 · 7 月 1 日', event_en: 'Nanguo Theatre · July 1'
  },

  {
    id: 'yangguifei',
    image: 'portraits/楊貴妃.png',
    gender: 'female',
    role_type: '正印花旦',
    name_cn: '杨贵妃', name_en: 'Yang Guifei',
    play_cn: '《贵妃醉酒》', play_en: 'The Drunken Beauty',
    traits: { '痴情': 9, '烈': 6, '飘逸': 8, '智慧': 5, '谐趣': 5, '决绝': 6 },
    coffee_cn: '荔枝花香与莓果酸甜交织层叠，仿佛长安春夜盛开的千树繁花 · 埃塞俄比亚',
    quote_cn: '七月七日长生殿，夜半无人私语时。',
    quote_en: 'On the seventh of the seventh, in the Palace of Eternal Life — at midnight, when none could overhear, we spoke.',
    letter_cn: '你和杨贵妃一样，活得明亮、爱得明亮、连忧愁也是明亮的。世人爱你的明亮，但他们少有人耐心看你怎么暗下去。',
    letter_en: 'Like Yang Guifei, you live brightly, love brightly — even your sorrows are bright. The world loves your light, but few have the patience to see how it dims.',
    monologue_cn: '马嵬坡的事我已经走过了——你不必再问。',
    monologue_en: 'Mawei Slope is behind me. You need not ask of it again.',
    event_cn: '广府大剧院 · 6 月 12 日', event_en: 'Guangfu Grand Theatre · June 12'
  },

  {
    id: 'baisuzhen',
    image: 'portraits/白娘子.png',
    gender: 'female',
    role_type: '正印花旦',
    name_cn: '白素貞', name_en: 'Bai Suzhen',
    play_cn: '《白蛇传·情》', play_en: 'The Fairy Tale of The White Snake',
    traits: { '痴情': 9, '烈': 8, '飘逸': 8, '智慧': 9, '谐趣': 2, '决绝': 9 },
    coffee_cn: '茉莉与蜜桃气息温柔相依，柔软之下藏着如断桥春水般悠长的力量 · 牙买加',
    quote_cn: '千年修炼，只为这一场凡间。',
    quote_en: 'A thousand years of cultivation — for this single mortal life.',
    letter_cn: '你和白素贞一样，所有的智慧、修为、力量，都肯为一个人放下。但放下不是软弱——必要时你也会断桥之上，让天地都听见。',
    letter_en: 'Like Bai Suzhen, all your wisdom, all your power, you would set aside for one person. But setting aside is not weakness — when needed, you stand on the broken bridge and let heaven and earth hear you.',
    monologue_cn: '誰的掛牽，永駐斷橋邊。',
    monologue_en: 'Whose longing lingers forever at the broken bridge.',
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
    coffee_cn: '成熟热带水果的丰沛甜感徐徐展开，蜂蜜般华贵却不失锋芒 · 巴西',
    quote_cn: '十四万人齐解甲——更无一个是男儿。',
    quote_en: 'A hundred and forty thousand laid down their armor — and not a single one was a man.',
    letter_cn: '被誉为"蜀中才女"花蕊夫人。新版粤剧表演者增加人物内心独白的唱段，更灵活自然地雕细出花蕊夫人的贵气、刚烈不屈与柔情。',
    letter_en: 'Celebrated as the literary talent of Shu, Lady Huarui\'s Cantonese opera retelling adds interior monologue arias — carving out her aristocratic bearing, fierce pride, and tender feeling with greater nuance.',
    monologue_cn: '十四万人齐解甲——更无一个是男儿。',
    monologue_en: 'A hundred and forty thousand laid down their armor — and not a single one was a man.',
    event_cn: '南国剧场 · 7 月 28 日', event_en: 'Nanguo Theatre · July 28'
  },

  {
    id: 'axiu',
    image: 'portraits/阿琇.png',
    gender: 'female',
    role_type: '花旦',
    name_cn: '阿琇', name_en: 'A-xiu',
    play_cn: '《阿琇》', play_en: 'A-xiu',
    traits: { '痴情': 8, '烈': 5, '飘逸': 8, '智慧': 6, '谐趣': 5, '决绝': 4 },
    coffee_cn: '云南小粒咖啡特有的坚果香缓缓升起，像旧时南音唱腔里的温柔回响 · 中国',
    quote_cn: '你给我一支簪——我就敢说，这一夜是真的。',
    quote_en: 'You gave me one hairpin — and I dare to say, this one night is real.',
    letter_cn: '阿琇是广东民间传说中，为"鬼才"状元伦文叙的理想化伴侣形象。粤剧表演中阿琇演绎的南音唱段，便是诉说阿琇的身世和对伦文叙的真情。',
    letter_en: 'A-xiu is the idealized companion of the brilliant scholar Lun Wen-sui in Cantonese folk legend. In Cantonese opera, her Nanyin arias tell of her origins and the depth of her feeling for him.',
    monologue_cn: '是幻，是夢，是真？',
    monologue_en: 'Is it illusion, is it dream, is it real?',
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
    coffee_cn: '红醋栗与莓果酸香层层递进，细腻而绵长，如花瓣落入水面荡开的轻愁 · 卢旺达',
    quote_cn: '花落人亡两不知——我葬的不是花，是我自己。',
    quote_en: 'The flowers fall and the person passes, neither knowing the other — I am not burying flowers, I am burying myself.',
    letter_cn: '你和林黛玉一样，是会因为一句话失眠的人。世界粗，你偏偏细。这不是脆弱——是你愿意把"在乎"留在身上，不甩开。',
    letter_en: 'Like Lin Daiyu, you are one who can lose sleep over a single sentence. The world is coarse — and you are deliberately fine. This is not fragility. It is your willingness to keep caring on your body, instead of shaking it off.',
    monologue_cn: '我不是不愿好起来——我是不愿假装好起来。',
    monologue_en: 'It is not that I will not be well — it is that I will not pretend to be well.',
    event_cn: '广府大剧院 · 6 月 18 日', event_en: 'Guangfu Grand Theatre · June 18'
  }

];
