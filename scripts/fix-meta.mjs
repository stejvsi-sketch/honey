import fs from 'fs';

const filePath = 'd:/honey/scripts/generate-messages.mjs';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let startLine = -1, endLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const RAW_MESSAGES = [')) startLine = i;
  if (startLine >= 0 && endLine < 0 && lines[i].trim() === '];') endLine = i;
}

const metaPatterns = [
  /^to whoever/i, /^to everyone/i, /^to the person who/i, /^to the person reading/i,
  /^to the person working/i, /^to whoever runs/i, /^to whoever made/i, /^to whoever created/i,
  /^to whoever invented/i, /^to whoever is/i, /^to whoever else/i, /^to whoever just/i,
  /^to whoever keeps/i, /^to whoever needs/i, /^to whoever lost/i, /^to whoever submitted/i,
  /^to whoever submits/i, /^to whoever posts/i, /^to whoever writes/i, /^to whoever left/i,
  /^to whoever hurt/i, /^to whoever found/i, /^to whoever got/i, /^to whoever reads/i,
  /^to the stranger/i, /^to the random person/i, /^to the barista/i, /^to the server/i,
  /^to the uber/i, /^to the nurse/i, /^to the bus driver/i, /^to the mailman/i,
  /^to the delivery/i, /^to the security guard/i, /^to the crossing guard/i, /^to the janitor/i,
  /^to the old man/i, /^to the girl at the gym/i, /^to the girl who held/i, /^to the girl in my math/i,
  /^to the girl from camp/i, /^to the boy at the coffee/i, /^to the person at the pharmacy/i,
  /^to the person i accidentally/i, /^to the kid who smiled/i, /^to anyone whos afraid/i,
  /^to anyone reading/i, /^to the universe/i, /^hey u\. yeah u reading/i, /^hey admin/i,
  /^hey just checking in on everyone/i, /^hey does anyone else/i, /^hey to everyone who/i,
  /^hey to the person/i, /^hey to the one/i, /^hey to whoever/i, /^hey if u need a sign/i,
  /^imagine explaining this website/i, /^can someone pls tell me why i keep coming back/i,
  /^shoutout to everyone/i, /this website knows more/i, /this site has heard/i,
  /^ok im actually going to bed/i, /^lol jk im still here/i, /^ok NOW im going/i,
  /^im gonna stop coming to this website/i, /^im done now for real/i, /^note to self/i,
  /^dear future me/i, /^dear god if/i, /^to my future self/i, /^to my future partner/i,
  /^to my future kid/i, /^this is my \d+th time on this site/i, /^im on this site so often/i,
  /^im at \d+ messages/i, /^this is message number/i, /^im on message who/i,
  /^i wrote u \d+ messages tonight/i, /^im adding this to the pile/i,
  /^to the person who always likes/i, /^to the person who always holds/i,
  /^to the person who lets/i, /^im convinced this website/i,
  /^hey to whoever is also eating/i, /^to the person reading these to/i,
];

// Replacements — all directed at a specific person (ex, crush, friend, parent, sibling)
const replacements = [
  "i cant believe u made me watch that movie 3 times and i pretended to like it every time for u",
  "u always got the hiccups after laughing too hard and i miss that so much rn",
  "i wish u wouldve told me what was wrong instead of just slowly pulling away from me",
  "remember when u burnt the cookies and set off the smoke alarm and we had to open every window at 2am",
  "u gave me butterflies every single time even after 2 years like my stomach never got used to u",
  "i wish i was the one u talked about when ur eyes lit up but it was always someone else",
  "u owe me 3 birthdays and 2 christmases worth of presents and honestly i want the presents still",
  "u always knew when something was wrong even when i said nothing and now nobody notices anything",
  "i wish u knew how many times i almost drove to ur house just to see if ur lights were on",
  "u were the only person i could eat in front without feeling weird about it",
  "remember when we skipped class together and got caught and u took all the blame for me",
  "i hate that u were right about him bc now i cant even be mad at u properly about it",
  "u used to steal my fries every time and i used to pretend to be annoyed but secretly i loved it",
  "i wonder if u still have that scar from when we were kids and u fell off the fence trying to impress me",
  "u made me try sushi for the first time and i spit it out and u laughed so hard u cried",
  "im still mad at u for not telling me about her before i had to find out from everyone else",
  "u always left exactly one sip of milk in the carton and put it back like thats an acceptable amount",
  "i think about the way u looked at me that night at the lake and wonder if u felt it too",
  "remember when we got stuck in traffic for 3 hours and just talked the entire time about nothing",
  "u borrowed my charger 47 times and never once brought ur own and i let u every single time",
  "u once told me i make u feel calm and i think thats the best compliment ive ever gotten from anyone",
  "i keep almost saying something funny u wouldve laughed at and then i remember u wont hear it",
  "u left and now nobody argues with me about what to watch and i hate having full control of the remote",
  "remember when u tried to cook for me and almost burned down the kitchen and we ordered pizza instead",
  "i found the polaroid of us from that road trip and ur making that dumb face and i miss that face",
  "u always texted me when u got home safe and now nobody does and i didnt realize how much that mattered",
  "i wish i couldve been what u needed instead of what u had to get away from",
  "u once fell asleep on my lap and i sat there for 3 hours without moving bc i didnt want to wake u",
  "remember when u surprised me at work with lunch and my coworkers were so jealous and now they ask about u",
  "i hate that im still the one who remembers all the small stuff while u probably forgot by now",
  "u wore my shirt to bed once and it looked better on u than it ever did on me and i told u to keep it",
  "i wonder if u kept any of the drawings i made for u or if they went in the trash with everything else",
  "u always said bless u before i even finished sneezing like u were psychic about my allergies or something",
  "remember when we danced in ur kitchen at 3am with no music and it was the happiest ive ever been",
  "u snore so loud it used to keep me awake and now silence keeps me awake instead funny how that works",
  "i wish i hadnt checked ur phone that night bc some things u cant unknow and that was one of them",
  "u introduced me to ur favorite band and now every time they come on i have to change the song or ill cry",
  "remember when u held my hand during the scary movie even tho u pretended u werent scared either",
  "u used to tuck my hair behind my ear when it fell in my face and nobody has done that since",
  "i keep finding ur bobby pins in random places like my car and between couch cushions its been months",
  "u always made me laugh when i was trying to be serious and it was infuriating and also the best thing ever",
  "remember when we got matching tattoos and u chickened out at the last second and i went alone",
  "u were the only person i trusted with my secrets and now theyre just floating out there unprotected",
  "i wish i told u i was proud of u more often bc i was and i dont think u knew that",
  "u used to sing in the shower so loud the neighbors complained and now its too quiet in here",
  "remember when u beat me at mario kart 12 times in a row and i threw the controller and u laughed",
  "i miss the way u said good morning all sleepy and half awake like the words werent ready yet either",
  "u once brought me soup when i was sick and sat with me for 5 hours just watching reality tv together",
  "i think about how u always ordered extra napkins everywhere we went bc u knew id spill something",
  "u left and now i have nobody to share memes with at 2am and my camera roll is just piling up",
  "remember when we got lost hiking and u pretended to know the way and we ended up going in circles",
  "u used to put ur cold feet on me in bed and i hated it so much but id give anything to feel that rn",
  "i wish u knew that the last thing i think about every night before falling asleep is still ur voice",
  "u always picked the worst movies but the best snacks and honestly the snacks made up for everything",
  "remember when we tried to build that shelf together and it fell twice and we just left it crooked",
  "i keep wearing the perfume u said u liked even tho nobodys smelling it anymore i just like knowing",
  "u taught me how to parallel park and i still do it the way u showed me every single time",
  "i wonder if u ever eat at our spot alone the way i do or if u found a new spot with new ppl",
  "u always left the lights on and i always turned them off after u and now theyre just always off",
  "remember when u tried to teach me guitar and i was so bad u said maybe stick to singing and i cant sing either",
  "u used to doodle on my notes during class and i kept every single one of those notebooks",
  "i hate that i still know ur coffee order by heart grande oat milk latte extra shot no foam",
  "u left ur jacket at my place 8 months ago and its still on the hook by the door where u put it",
  "remember when we stayed up all night talking about space and u said u wanted to be an astronaut",
  "u always hummed when u cooked and it was the most peaceful sound ive ever heard in any kitchen",
  "i wish id appreciated the boring tuesdays with u more bc those turned out to be the best days",
  "u had this laugh that started silent and then got so loud everyone stared and i loved that about u",
  "remember when u carried me home from the party bc i twisted my ankle and u complained the whole way but still did it",
  "u used to text me song lyrics with no context and id spend all day figuring out what u meant",
  "i think about ur hands a lot and how they fit in mine perfectly and nothing else has fit since",
  "u once ate my entire lunch without asking and then said oh were u gonna eat that and yes i was",
  "remember when we drove 4 hours for ice cream bc someone online said it was the best and it wasnt",
  "u always said id forget about u and every day i wake up proving u wrong and im tired",
  "i found the playlist u made me called late nights and every song is a gut punch but i listen anyway",
  "u left and now i overcook the pasta every time bc u were the one who knew when it was done",
  "remember when u tried to impress me by cooking and the fire alarm went off and we ordered chinese",
  "u used to play with my rings when u were nervous and now they just sit on my fingers doing nothing",
  "i wish i couldve been the person u needed me to be instead of the person i was at the time",
  "u always said i was the smart one but u were the brave one and i think bravery matters more",
  "remember when we snuck out to see the meteor shower and saw exactly zero meteors but it was still perfect",
  "u used to write ur initials on my wrist in pen and i would trace them all day at school",
  "i hate that u got to move on first like u had a head start on healing and i was still at the starting line",
  "u always made fun of how i pronounced certain words and now i catch myself saying them ur way",
  "remember when we tried to learn sign language together and only learned how to say i love u and pizza",
  "u were the only person who would watch that terrible show with me without complaining about it once",
  "i wish u knew that i kept every letter u ever wrote me even the ones that were just grocery lists",
  "u used to scratch my back when i couldnt sleep and now i just lay there staring at the ceiling",
  "remember when we adopted that plant together and u named it gerald and im sorry gerald died last month",
  "u always showed up early to things which is insane bc nobody does that but u did it for everything",
  "i hate that hearing ur name still makes my chest tight like my body hasnt caught up with my brain yet",
  "u used to leave voicemails instead of texting bc u said hearing someones voice matters more",
  "remember when we got caught in the rain and u gave me ur jacket even tho u were shivering too",
  "u always drank straight from the carton and it drove me crazy and now the carton lasts too long",
  "i wish u knew how many things i see every day that i want to show u but cant",
  "u had this way of making the worst situations funny and i dont laugh at anything the same way anymore",
  "remember when u tried to surprise me and i accidentally scared u and u screamed so loud the dog barked",
  "u used to count my freckles when we were bored and u said u found a new one every time",
  "i keep setting two alarms in the morning even tho its just me bc u always needed the second one",
  "u always sat on the left side and now i sit in the middle bc neither side feels right without u",
  "remember when we built a blanket fort at 23 and watched cartoons and u said we should do this every weekend",
  "u were the only person who ever told me i looked good in yellow and ive been wearing it ever since",
  "i hate that u took the cat bc that cat liked me better and we all know it including the cat",
  "u left ur water bottle at my place and its been sitting on the counter for 4 months and i use it daily",
  "remember when u wrote my name in the snow and it was all crooked and u said the snow was uneven",
  "u always held doors for everyone not just me and that made me like u even more bc u were just kind",
  "i wish i told u how much those random tuesday night dinners meant to me bc they were everything",
  "u had this way of looking at me when i talked like i was the only person in the room and nobody looks at me like that",
  "remember when we got food poisoning from that sketchy taco place and were sick together for 3 days straight",
  "u used to put sticky notes on my mirror before exams that said u got this and i still need those notes",
  "i wish u were here to see the sunset tonight bc its the exact shade of orange u always pointed out",
  "u once carried 7 grocery bags in one trip to prove u could and dropped 3 of them and i laughed for hours",
];

// Identify meta lines and replace them
let replIdx = 0;
let replCount = 0;

for (let i = startLine; i <= endLine; i++) {
  const match = lines[i].match(/^(\s*)"(.+)"(,?\s*)$/);
  if (!match) continue;
  
  const msg = match[2];
  let isMeta = false;
  
  for (const pattern of metaPatterns) {
    if (pattern.test(msg)) { isMeta = true; break; }
  }
  
  if (isMeta && replIdx < replacements.length) {
    lines[i] = `${match[1]}"${replacements[replIdx]}"${match[3]}`;
    replIdx++;
    replCount++;
  } else if (isMeta) {
    // Remove the line if we run out of replacements
    lines[i] = '';
    replCount++;
  }
}

// Clean empty lines
const cleaned = lines.filter((l, idx) => {
  if (l === '' && idx > startLine && idx < endLine) return false;
  return true;
});

fs.writeFileSync(filePath, cleaned.join('\n'), 'utf8');
console.log(`Replaced ${replCount} meta messages (${replIdx} with new content, ${replCount - replIdx} removed)`);
