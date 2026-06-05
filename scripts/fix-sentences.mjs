import fs from 'fs';

// Map of line number -> fixed message (for messages that got cut off mid-sentence)
const fixes = {
  1557: "hey its been a while. life mustve been good to u hm? meanwhile im still here. i miss u. i always will",
  1558: "ur the love of my life and im so scared to tell u bc what if u dont feel the same and i lose everything",
  1567: "u were one of the few ppl who were nice to me as a kid. ur individuality truly shaped who i am. thank u",
  1568: "im sorry i tried that approach ill stay by ur side forever dont u ever worry. i love u so much",
  1571: "i had to cover my arm in the changing room today. luckily nobody saw. no way i can pass this off",
  1572: "ILYSMMM UR SUCH A CUTIE ILL ALWAYS BE THERE FOR U AND I HOPE WE NEVER STOP BEING FRIENDS XOXO",
  1573: "to the creator of this site dude thank u so much. only 1 under hers. i miss her so dearly",
  1578: "i was reading the messages sent to u and one of them just says NARCISSIST thats NOT from me ok i love u",
  1579: "im sorry for asking u to be what u cant be i deeply love u and yearn for u dont let this upset u",
  1581: "i might seem confident but sometimes im really scared ull realize u deserve better and leave me. i promise il get better for u",
  1582: "i really hope these messages send in time order otherwise none of this will ever make sense to u lol",
  1584: "i miss u my sister i wish u were here with me pls come back ill buy u all the pizza u want. discord is open",
  1585: "hi i was gay and scared and a bad friend. i cared abt u deeply. i had a huge crush on u for the longest time",
  1588: "I had a crush on u. i cant tell u that but it was super obvious. im still impressed whenever u play games",
  1593: "its 2am and im on my bed listening to kagefumi thinking about u. my mind is wandering through realities where we were together",
  1600: "the last few days ive been really scared for our relationship but u throwing that away gave me a new lease on life. im proud of u",
  1604: "ill always use purple for u bc its ur favourite colour. we arent talking rn but im gonna miss u so much. take care",
  1605: "at least u know im not a liar and i did do everything i said i would. with or without u. miss u. love u",
  1606: "ive loved u for three years but ur my best friend. i cant let my feelings ruin this. im sorry ull never know",
  1607: "im so embarrassed. whats wrong with me? u left i should be mad. i just want u to be proud of me. come home",
  1608: "i never knew if u actually wanted us to be that way. we only kissed once or twice but i always think of it",
  1609: "i love u so much u dont even know it ive been waiting for 268 days now. i dream about u everyday. love u",
  1613: "i miss u and how much joy we used to bring each other. we couldve been great if we put the effort in. ily",
  1614: "u consume me i wish u knew u could tell me anything id never judge u. i really think im in love with u",
  1617: "anyway its been 8 months trying to move on from u. i secretly still visit ur acc and i saw u have a new bf",
  1621: "i cant believe u could commit so easy. i stopped talking to u not bc i dont care but bc i felt so disrespected",
  1622: "im so sorry for crashing out. i let so much of myself go into u and ignored parts i wouldnt agree with. im sorry",
  1623: "u lowk started w da games by bringing something sacred like love to the internet and not to me in person. play stupid games",
  1625: "ik u dgaf ab me dont worry i wont text i js idk im gonna go away for a long time. i doubt u care. love u",
  1626: "it hurts tho a lot. now that i think abt it. its not ur fault tho i still love u. i wish we talked like we used to",
  1627: "its been a year since it ended. every night ive thought why didnt i kiss her goodbye. ill never kiss u again",
  1628: "i miss u. i wish u liked me. ik u do but we dont really talk as much anymore. i get jealous. i want u happy tho",
  1630: "u still sending me mixed signals but i hope i can get enough courage to ask to hang out this summer",
  1631: "tuff guy huh tryna act cold. i just rant here cause we shared a lot and i randomly remember it. he moved on",
  1632: "u disrespected me so bad im sorry i made u think ill compromise everytime. i brought up everything that bothered me",
  1634: "i think about u every day i will never reach out again but ill wait. i hope someday we leave everyone else behind",
  1635: "u were the sun to my moon. my motivation my muse. i loved u for 7 years but i moved on. dont be a stranger",
  1637: "i hate it more than anything when my baby cries. i love u so so much my sweet baby i promise",
  1638: "i worry about u still. i hope ur okay. i hope u know i am here for u always. if it ever seems too much come find me",
  1639: "HI!! i had the bestest time with u that week. next time i need to stay longer i miss u so much. love u featherbutt",
  1640: "i wonder if we cross each others mind at the same time. i hope u think about me so i dont feel pathetic",
  1641: "idk what ive done to deserve u but im so so glad i have u in my life. i love u so so freaking much",
  1642: "why would u be this cruel? what did i ever do to u. even if ur love wasnt genuine why would u hurt me like this",
  1643: "its been over a year and i thought i was finally over u. but im not. i hate u but i miss u. - J",
  1644: "i dont mind that u left but i still wish u gave me a reason. id rather u say u hate me than go silent",
  1645: "loved my solitude but u made me love u more than that and now its hard to leave. i didnt want it to end bc of me",
  1646: "i remember everything about u. i cried when u tried to give me advice on how to move on. u made me hate love",
  1647: "im scared il mess up what we have and all these messages will be unread forever. then this really will be messages never seen",
  1648: "sometimes i wonder how ur still w me after all i do is make u upset. i really do love u tho i promise",
  1649: "i really hope i dont screw up our relationship its all i have and u mean the world to me. i love u baby",
  1650: "u gave up on me on a random tuesday cause u found out u can live without me. easy to leave huh",
  1653: "i decided im finally gonna give u a note with the other stuff. it feels wrong not to tell u this",
  1654: "ur full name is still ingrained into my brain. ur not contactable anymore and it hurts. i hope ur happy in poland",
  1655: "ily more than anything please i beg of u not to leave me after our break. i want to help u. i need u",
  1658: "its warm outside and its the last day of may and im so overwhelmed and nothing is right and i love u",
  1664: "hi i know u probably dont feel the same but at that party i was being fully honest. i truly think ur handsome",
  1668: "im sorry is all i can say. just forget me. i tried fixing it but after what i did it was beyond repair. im sorry",
  1669: "i regret allowing u back in just for u to try and play me again. funny part is i knew it was coming. im a dummy",
  1686: "i miss u so much i think about u every day. it was so stupid of me to let u go when we were younger. come back",
  1691: "i keep seeing u in my dreams even tho i havent seen u since sophomore year. i wish we could be friends again",
  1692: "i dont know if u truly like me or if ur just faking it. our friendship has gotten so much worse this year",
  1693: "u cared about me before and that was all i needed. i miss u even if it was one sided. u were my best friend",
  1694: "i dont think ill ever find someone who genuinely loves me. i want the type of love where u feel light and complete",
  1695: "im so sorry. i love u so much just not in the way u want me to. i hope u find someone better than me",
  1699: "doors always open tho even tho were probably totally different ppl by now. i miss u in any way. ur still home",
  1700: "i know u dont want me anymore but please hold me one last time and let me ask u silly questions. i miss u",
  1702: "im sorry i gave up on us. it just got so tiring watching u be the worst version of urself. i still love u",
  1703: "i see ur happy now. i love that uve moved on. i still wish u were my best friend. i will always love u",
  1704: "if i stay i lose myself. if i leave i lose u. if i wait itll never be me. if i move on itll never be u",
  1705: "im scared to crave for ur embrace longer than i had it. as long as im me its not possible for us. im just too much",
  1709: "i am still unlovable i hate to see myself in the mirror. is this bc of u? or maybe i really am ugly",
  1717: "dont look down on urself. idc if they do. keep striving to be the best u can be. if they dont like it shove it",
  1718: "its okay to not be perfect. we arent designed for that. u put too much pressure on urself. mistakes are part of life",
  1720: "honestly idk if ull ever see this but thank u for treating me the way u did so i could realize i deserved better",
  1721: "its been a year since we cut ties. i hope uve changed and found whatever happiness ur looking for",
  1722: "did all of this mean anything to u? i dont get how u can throw things away so easily. im still stuck here",
  1723: "in my head ive said many things to u but i can never find it within me to reach out. i miss u so much",
  1724: "ik ur confused about why we broke up but it wasnt easy for me either. i love u even if u hate me now",
  1727: "tomorrow it will be one month of no contact. from not being able to find peace without u to now this. i miss u sm",
  1728: "it pains me the way u behave. i want u in my life but i cant stand looking at u being happy with other ppl",
  1730: "its so unfair that im the one feeling bad and missing u after everything u did to me. i should be moving on",
  1731: "i know i cant tell u this in person but i miss u every day. so many things remind me of u",
  1732: "i cut u off bc i was scared that one day id wake up and see u on the news. i wish u peace",
  1735: "i kinda regret friend zoning u while we were crushing on each other. rn ur the only person i think about for the future",
  1736: "u wont probably ever see this but i miss u so so much and i feel like my soul is connected to urs somehow",
  1737: "my starlight my dear the closest thing to happiness ive felt in years. i adore u with all my heart. im so proud of u",
  1739: "i find myself comparing others to u. its been a few years but ur still my muse. hope ur doing well",
  1741: "i like u and i dont have the guts to confess it in person so im writing it here. u dont have to worry",
  1743: "there was a point where we were both little and loved each other. its not as fun being older now. childhood friends to lovers sucks",
  1748: "i just saw a video that said me and my bestie one day in italy and i remembered we planned that too",
  1752: "if i could go back i wouldve chosen to never have met u. ive never been so in love and in so much pain",
  1758: "please. i miss u so bad. please talk to me. it hasnt even been two weeks but it feels like forever",
  1760: "i know it annoys u that every time i drink too much i come spamming u. i wish ud hear me out. - red hair girl",
  1761: "something about u is perfect. u would make a great husband but i cant be myself with u without u being embarrassed",
  1762: "i used u to get over him fell for u which was a mistake. plot twist he healed my wounds u caused. thank u shitbag",
  1769: "i made sure u fell in love with urself. if i had some different personality i never wouldve. but im me. i love too hard",
  1770: "be a man. looking back every move of urs was calculated like u just wanted a girl to love u back. u were never in love",
  1777: "will i ever be enough for a good man not just the evil ones. i thought i could keep this one he was so sweet",
  1781: "hi. i miss u and honestly just wish ud try harder to have a relationship with me like u do with everyone else",
  1784: "i hope u call me one day out of the blue. i hope u show up at my door. i hope u learn to love urself",
  1785: "u never had ur hair up like that when we dated. u know i like it which makes it harder to let go. i miss u",
  1786: "i still think about u often. i wish i couldve understood u more. i dont think ill ever forget ur eyes full of life",
  1796: "idk why i even really try. it seems like all i do is upset u and i say sorry so many times but its never enough",
  1814: "i miss spending all day on call with u. i miss trolling our friends. that app sucked but u made it worth it",
  1819: "that last thing from me was kinda overdramatic im doing well actually really enjoying my hobby! starting to get why u liked it lol",
  1828: "i love u so much my sleepy baby i hope we can talk more tmr. i miss u more than ever my baby i love u",
  1855: "im sorry i hurt u. i wish i couldve changed for u faster. ill always be waiting for u even if we never talk again",
  1884: "oh how i miss u. i would let u lead me on again and again if it meant being by ur side one more time",
  1932: "to my brother: u annoy me more than any human on earth but id literally fight anyone for u. dont tell anyone",
};

const content = fs.readFileSync('d:/honey/scripts/generate-messages.mjs', 'utf8');
const lines = content.split('\n');

let fixCount = 0;
for (const [lineNum, newMsg] of Object.entries(fixes)) {
  const idx = parseInt(lineNum) - 1;
  const oldLine = lines[idx];
  const match = oldLine.match(/^(\s*)"(.+)"(,?\s*)$/);
  if (match) {
    // Verify word count
    const wc = newMsg.split(/\s+/).filter(w => w.length > 0).length;
    if (wc > 25) {
      console.log(`WARNING: Line ${lineNum} fix is ${wc} words: "${newMsg.substring(0, 60)}..."`);
    }
    lines[idx] = `${match[1]}"${newMsg}"${match[3]}`;
    fixCount++;
  } else {
    console.log(`SKIP: Line ${lineNum} didn't match pattern`);
  }
}

fs.writeFileSync('d:/honey/scripts/generate-messages.mjs', lines.join('\n'), 'utf8');
console.log(`Fixed ${fixCount} messages`);

// Final verify
const verify = fs.readFileSync('d:/honey/scripts/generate-messages.mjs', 'utf8');
const vLines = verify.split('\n');
let over25 = 0;
for (const l of vLines) {
  const m = l.match(/^\s*"(.+)"\s*,?\s*$/);
  if (m) {
    const wc = m[1].split(/\s+/).filter(w => w.length > 0).length;
    if (wc > 25) { over25++; console.log(`STILL OVER: ${wc} words: "${m[1].substring(0,60)}"`); }
  }
}
console.log(`Over 25 after fix: ${over25}`);
