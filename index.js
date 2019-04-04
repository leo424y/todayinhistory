// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {
  dialogflow,
  Suggestions,
  BasicCard,
  Button,
  SimpleResponse
} = require('actions-on-google');

//process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// refer https://zh.wikipedia.org/wiki/Wikipedia:%E5%8E%86%E5%8F%B2%E4%B8%8A%E7%9A%84%E4%BB%8A%E5%A4%A9
var events = {
  '0328': [
    '2001年：中國第五次全國人口普查結果公布，總人口為12.9533億。',
    '2012年：台灣台北市士林區文林苑都更案，王家被強制拆除。',
  ],
  '0329': [
    '1974年：美國國家航空暨太空總署於1973年11月發射的太空探測器水手10號飛近水星，成為首個飛進水星附近的無人太空飛行器。',
  ],
  '0330': [
    '1981年：美國總統隆納·雷根在準備走出華盛頓哥倫比亞特區的酒店門前時，遭精神病患者約翰·欣克利開槍刺殺而受到重傷。',
    '2014年：臺灣50萬民眾湧入凱達格蘭大道及立法院周邊（圖），表達對政府欲簽訂《海峽兩岸服務貿易協定》的不滿',
  ],
  '0331': [
    '1889年：由法國工程師居斯塔夫·艾菲爾設計的艾菲爾鐵塔在巴黎戰神廣場建成，之後成為全球熟知的法國地標及建築結構。',
    '2001年：世嘉停止了Dreamcast的業務，退出了遊戲主機市場，並改組為純第三方遊戲發行商。',
    '2016年：法國發生了不眠之夜佔領運動，且在數日內擴散到比利時、德國及西班牙。',
  ],
  '0401': [
    '1976年：史蒂夫·賈伯斯和史蒂夫·沃茲尼克在美國成立蘋果公司，並且開始出售自行組裝的個人電腦Apple I',
    '2004年：Google對公眾啟動Gmail服務。',
  ],
  '0402': [
    '1513年：西班牙征服者暨航海家胡安·龐塞·德萊昂在佛羅里達地區登陸，成為首個抵達新大陸的歐洲人。',
    '1982年：阿根廷軍隊登陸福克蘭群島，向島上的英國駐軍發動攻擊，福克蘭群島戰爭爆發。',
  ],
  '0403': [
    '1948年：美國總統哈瑞·S·杜魯門簽署援助歐洲復興經濟的法案，由美國國務卿喬治·卡特萊特·馬歇爾主導的馬歇爾計劃開始進行。',
    '2007年：法國高速列車在法國高速鐵路東線行駛試驗中達到每小時574.8公里的紀錄，創下有軌鐵路行駛世界紀錄。'
  ],
  '0404': [
    '1968年：阿波羅計劃：NASA發射阿波羅6號。',
    '1975年：比爾·蓋茲和保羅·艾倫於美國新墨西哥州阿布奎基創立微軟公司，初期主要是發展並銷售BASIC直譯器等電腦程式。'
  ],
  '0405': [
    '1609年：日本薩摩藩入侵並且佔領由琉球國統治的沖繩島，最後使琉球成為薩摩藩的附庸國。',
    '1976年：中國北京天安門廣場上悼念周恩來逝世的民眾受到軍警的暴力驅散，四五天安門事件發生。',
  ],
  '0406': [
    '1896年：第一屆奧林匹克運動會（圖）在希臘雅典的帕那辛奈克體育場開幕，共有來自14個國家的241名運動員參與43種競賽項目。',
    '2004年：日本已故漫畫家臼井儀人的代表作蠟筆小新中的背景舞台春日部市，主人公的野原一家被予為春日部市的榮譽市民。',
  ],
  '0407': [
    '1948年：《世界衛生組織組織法》正式生效，聯合國旗下管理公共衛生的世界衛生組織宣告成立。'
  ],
  '0408': [
    '1904年：美國紐約曼哈頓的朗埃克廣場因為《紐約時報》總部大樓遷至附近而改名為時報廣場。',
    '1913年：巴西宣布承認中華民國，成為世界第一個承認中華民國的國家。',
  ],
  '0409': [
    '1967年：美國波音公司研發的波音737客機首次試飛，後來成為民航噴射客機史上最為廣泛使用的機種。',
    '2003年：美伊戰爭聯軍占領巴格達，薩達姆·海珊的政權解體。',
  ],
  '0410': [
    '1930年：台灣嘉南大圳通水啟用。',
    '1959年：日本皇太子明仁與美智子結婚，明仁成為首位迎娶平民的日本皇太子。',
  ],
  '0411': [
    '1909年：由66個猶太人家庭組成的住宅營造協會在雅法北面購買並分配土地，之後在此建立新城市特拉維夫。',
    '2009年：蘇珊大嬸（Susan Magdalane Boyle）參加第三季的英國達人競賽而受到大眾的注意。'
  ],
  '0412': [
    '1927年：中國國民黨在蔣中正命令下開始在上海市對中國共產黨成員展開大規模逮捕和處死，之後促成第一次國共內戰爆發。',
    '1981年：美國哥倫比亞號太空梭自佛羅里達州甘迺迪航天中心首次發射升空（圖），這也是世界上第一架正式服役的太空梭。'
  ],
  '0413': [
    '1742年：德國巴洛克音樂作曲家格奧爾格·弗里德里希·韓德爾（圖）創作的神劇《彌賽亞》在愛爾蘭都柏林首演。'
  ],
  '0414': [
    '1865年：美國總統亞伯拉罕·林肯在華盛頓哥倫比亞特區福特劇院觀劇時遭到美利堅邦聯支持者約翰·威爾克斯·布思刺殺，隔天凌晨身亡。',
    '1912年：英國奧林匹亞級郵輪鐵達尼號在處女航時於大西洋撞上冰山後沉沒（圖），造成至少1,490人死亡。'
  ],
  '0415': [
    '1755年：英國文學家塞繆爾·詹森編撰的《詹森字典》出版，成為第一部正式的英文辭典。',
    '1995年：124個國家和歐洲共同體代表在摩洛哥馬拉喀什召開的部長級會議上簽署馬拉喀什協定，從而建立世界貿易組織'
  ],
};
var today = '';
var items = [];

// Create an app instance
const app = dialogflow({
  debug: false,
});

const fallback = agent => {
  agent.add(`\n 請試著問問看: 歷史上的今天`);
  agent.add(new Suggestions(`歷史上的今天`));
};

app.intent('Default Welcome Intent', fallback);
app.intent('Default Fallback Intent', fallback);

app.intent('TodayInHistoryIntent', (agent, { date: rawdate }) => {
  let [, month, date] = rawdate.split('T')[0].split('-');
    let timedex = `${month}${date}`;
    //console.log('Current timedex ', timedex);
    if (today !== timedex) {
      today = timedex;
      items = events[today];
    }
    if (items) {
      const msg = `歷史上的${parseInt(month, 10)}月${parseInt(date, 10)}日，${items[Math.floor(Math.random()*items.length)]}`;
      agent.close(msg);
      /*agent.ask(new BasicCard({
        title: `歷史上的${parseInt(month, 10)}月${parseInt(date, 10)}日`,
        formattedText: `${items[Math.floor(Math.random()*items.length)]}`,
        buttons: new Button({
          title: '查看更多',
          url: `https://zh.wikipedia.org/wiki/${parseInt(month, 10)}%E6%9C%88${parseInt(date, 10)}%E6%97%A5`,
    	}),
      }));*/
    } else {
      const msgFail = `抱歉，目前尚未提供${parseInt(month, 10)}月${parseInt(date, 10)}日的歷史資料`;
      agent.ask(msgFail);
      agent.ask(new Suggestions(`歷史上的今天`));
    }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
