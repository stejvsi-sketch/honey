#!/usr/bin/env node
// =============================================================
// generate-messages.mjs (v11 — strict emotional coherence)
// =============================================================

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CARD_COLORS = [
  'parchment','rose-dust','sage-whisper','lavender-haze',
  'honey-gold','ocean-mist','blush-coral','dusty-mauve',
  'faded-denim','ivory-ash',
];

function R(a) { return a[Math.floor(Math.random() * a.length)]; }
function wc(s) { return s.split(/\s+/).filter(w => w.length > 0).length; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const NAMES = [
'James','Liam','Noah','Ethan','Mason','Logan','Lucas','Aiden','Jackson','Sebastian',
'Jack','Owen','Daniel','Matthew','Henry','Alexander','William','Benjamin','Elijah','Ryan',
'Nathan','Caleb','Dylan','Luke','Connor','Max','Cole','Tyler','Hunter','Wyatt',
'Carter','Asher','Leo','Ezra','Landon','Adrian','Nolan','Gavin','Miles','Elliot',
'Jasper','Silas','Oscar','Hudson','Declan','Colton','Parker','Brody','Brooks','Grayson',
'Dominic','Spencer','Grant','Graham','Tate','Brock','Reid','Garrett','Trevor','Chase',
'Preston','Maxwell','Bennett','Wesley','Dawson','Everett','Felix','Griffin','Hayes','Knox',
'Levi','Maddox','Micah','Orion','Pierce','Rhett','Sterling','Thatcher','Waylon','Zane',
'Emma','Olivia','Ava','Sophia','Isabella','Mia','Charlotte','Amelia','Harper','Evelyn',
'Abigail','Emily','Ella','Scarlett','Grace','Lily','Chloe','Zoey','Penelope','Layla',
'Riley','Nora','Hannah','Aria','Ellie','Stella','Violet','Aurora','Savannah','Audrey',
'Claire','Sadie','Piper','Paisley','Hazel','Lydia','Madeline','Natalie','Anna','Alice',
'Autumn','Bella','Caroline','Clara','Daisy','Eleanor','Fiona','Georgia','Holly','Isla',
'Jade','Kate','Leah','Luna','Margot','Naomi','Paige','Rose','Serena','Vivian',
'Willow','Brooke','Celeste','Diana','Eden','Faith','Gemma','Hope','Ivy','Joy',
'Kennedy','Lucia','Molly','Nicole','Olive','Pearl','Rachel','Sienna','Tessa','Uma',
'Santiago','Mateo','Diego','Alejandro','Carlos','Miguel','Andres','Pablo','Rafael','Fernando',
'Javier','Luis','Eduardo','Roberto','Manuel','Jorge','Marco','Emilio','Rodrigo','Hector',
'Sergio','Raul','Arturo','Enrique','Cesar','Victor','Alberto','Ignacio','Tomas',
'Angel','Cristian','Francisco','Gonzalo','Ivan','Julian','Lorenzo','Martin','Ricardo','Salvador',
'Valentina','Camila','Valeria','Mariana','Daniela','Sofia','Gabriela','Lucia','Elena','Natalia',
'Maria','Carmen','Rosa','Adriana','Alicia','Julieta','Catalina','Ximena','Renata',
'Fernanda','Alejandra','Ana','Beatriz','Carolina','Dolores','Esperanza','Flora','Gloria','Ines',
'Jimena','Karla','Laura','Marisol','Nadia','Paloma','Regina','Silvia','Teresa','Yolanda',
'Arjun','Rohan','Aditya','Vikram','Karan','Rahul','Aarav','Siddharth','Varun','Arnav',
'Dhruv','Kabir','Shiv','Dev','Nikhil','Vivek','Akash','Manish','Raj','Sahil',
'Aman','Ankit','Deepak','Gaurav','Harsh','Ishaan','Jay','Kunal','Lakshman','Mohan',
'Naveen','Om','Pranav','Rishi','Suresh','Tanmay','Utkarsh','Veer','Yash','Aryan',
'Krishna','Sagar','Amar','Ajay','Kartik','Neel','Parth','Rishabh','Sameer','Vishal',
'Priya','Ananya','Ishita','Neha','Shreya','Pooja','Kavya','Aisha','Divya','Riya',
'Meera','Tara','Anika','Sana','Nisha','Simran','Aditi','Trisha','Kiara','Zara',
'Aaradhya','Bhavya','Charvi','Diya','Esha','Fatima','Gauri','Harini','Isha','Jaya',
'Khushi','Lavanya','Mahi','Nandini','Oviya','Payal','Radhika','Sakshi','Tanvi','Urmi',
'Vaishnavi','Anushka','Swara','Saanvi','Mahika','Myra','Pihu','Riddhi','Siya','Vedika',
'Angelo','Joshua','Carl','Jericho','Kenneth','Renz','Paolo','Tristan','Cedric','Vince',
'Gelo','Mark','Jayden','Jerome','Francis','Enzo','Darren','Gabriel',
'Andre','Benedict','Christian','Ian','Jed','Kyle','Lance',
'Neil','Patrick','Ray','Sean','Theo','Warren','Aldrin','Bryan','Cyrus','Dennis',
'Jasmine','Althea','Keziah','Bea','Francine','Marian','Shaira','Aimee','Katrina','Rica',
'Janelle','Princess','Nina','Angelica','Chelsea','Denise','Erica','Faye','Gia',
'Iris','Julie','Kim','Lara','Mae','Nadine','Patrice','Rhea','Trixie',
'Andrea','Bianca','Carla','Dawn','Gwen','Hailey','Joanna','Kristine',
'Omar','Yusuf','Adam','Hassan','Khalid','Tariq','Samir','Ibrahim','Zain','Faisal',
'Karim','Rami','Ali','Hamza','Bilal','Sami','Nabil','Amir','Rashid','Jamal',
'Ahmed','Basil','Daoud','Ehab','Farid','Ghazi','Hadi','Ismail','Jawad','Kareem',
'Latif','Majid','Nasir','Qasim','Rafiq','Said','Tahir','Wahid','Yasser','Zayd',
'Amira','Noura','Hana','Yasmin','Leila','Mariam','Sara','Noor',
'Dina','Salma','Reem','Jana','Maha','Lina','Dalal','Rania','Huda','Lamia',
'Amal','Basma','Duaa','Esra','Farida','Ghada','Hayat','Inas','Jumana','Khadija',
'Lubna','Muna','Najwa','Ola','Rawia','Samira','Tahani','Wafa','Yara','Zahra',
'Jimin','Minho','Taehyung','Seojun','Jaehyun','Donghyuk','Sunwoo','Woojin','Hyun',
'Siwoo','Hajun','Jiho','Doyun','Junseo','Yejun','Eunwoo','Hyunjin','Taemin','Changmin',
'Junwoo','Minseok','Seungho','Yoongi','Jinhyuk','Kyungsoo','Sangwoo','Dongwoo','Hoseok','Inhyuk',
'Sora','Yuna','Jihye','Eunji','Minji','Sooyoung','Haeun','Chaewon','Dahyun','Soojin',
'Jiwon','Seoyeon','Hayeon','Subin','Nayeon','Yeji','Ryujin','Chaeyoung','Seulgi','Jihyo',
'Miyeon','Shuhua','Yuqi','Minnie','Jisoo','Jennie','Yeri','Irene','Wendy','Tzuyu',
'Haruto','Yuto','Sota','Ren','Kaito','Riku','Hayato','Hinata','Takumi',
'Yuma','Asahi','Minato','Shota','Akira','Daiki','Eiji','Fumiya','Genki','Hikaru',
'Itsuki','Jiro','Kenji','Makoto','Naoki','Ryo','Shinji','Taro','Yuki','Kenta',
'Sakura','Hina','Yui','Aoi','Mio','Rin','Koharu','Mei','Akari','Honoka',
'Nana','Saki','Misaki','Ayaka','Chihiro','Emi','Fumiko',
'Kanon','Mana','Natsuki','Riko','Sayuri','Tomoko','Wakana','Yoko','Chiaki','Kana',
'Hugo','Louis','Jules','Antoine','Pierre','Maxime','Alexandre','Nicolas',
'Baptiste','Clement','Damien','Etienne','Florian','Guillaume','Hadrien','Jean','Laurent','Mathieu',
'Olivier','Philippe','Quentin','Romain','Sylvain','Thierry','Valentin','Xavier','Yann','Fabien',
'Lea','Manon','Camille','Juliette','Elise','Lucie','Marie','Sophie',
'Amelie','Brigitte','Delphine','Elodie','Fleur','Genevieve','Helene',
'Laure','Madeleine','Nathalie','Oceane','Pauline','Roxane','Sandrine','Colette','Vivienne','Adele',
'Kwame','Kofi','Tendai','Chidi','Emeka','Oluwaseun','Jabari','Amare','Obinna','Sekou',
'Tunde','Jelani','Nnamdi','Dayo','Idris','Kojo','Ayoub','Boubacar','Cedrick','Diallo',
'Ekon','Faraji','Gideon','Hamidi','Issa','Jomo','Kamau','Lekan','Musa','Nkosi',
'Olu','Pape','Rashidi','Simba','Thabo','Uche','Wole','Yaw','Zuberi','Adewale',
'Amara','Nia','Zuri','Ayanda','Thandiwe','Abena','Ife','Nala','Adaeze','Imani',
'Chioma','Akosua','Aminata','Fatou','Nkechi','Ayana','Binta','Chiamaka','Efua',
'Folake','Gifty','Hadiza','Iyabo','Jamila','Keza','Lira','Makena','Nandi','Omolara',
'Palesa','Rashida','Sade','Temi','Uju','Wangari','Yetunde','Zanele','Chinwe',
'Thiago','Gustavo','Bruno','Felipe','Leonardo','Guilherme','Caio','Vitor','Pedro','Henrique',
'Arthur','Bernardo','Igor','Joao','Kaique','Luan','Matheus',
'Otavio','Paulo','Samuel','Tiago','Vinicius','Wagner','Yago',
'Larissa','Amanda','Juliana','Leticia','Bruna','Isabela','Rafaela',
'Flavia','Helena','Ingrid','Jessica','Kelly',
'Livia','Marina','Patricia','Renata','Sabrina','Tatiana','Vanessa','Aline',
'Nikolai','Mikhail','Dmitri','Sergei','Aleksei','Andrei','Maxim','Viktor','Boris',
'Anton','Bogdan','Cyril','Denis','Evgeni','Fyodor','Grigori','Kirill','Leonid',
'Matvei','Oleg','Pavel','Roman','Stanislav','Timur','Vadim','Vladislav','Yaroslav','Zakhar',
'Anya','Katya','Natasha','Olga','Mila','Irina','Daria','Svetlana','Polina','Vera',
'Alina','Anastasia','Ekaterina','Galina','Ksenia','Lada',
'Yelena','Zoya','Larisa','Tamara','Raisa',
'Erik','Lars','Sven','Axel','Magnus','Nils','Leif','Bjorn','Odin','Gunnar',
'Anders','Emil','Filip','Gustaf','Henrik','Johan','Karl','Lukas','Niklas',
'Oskar','Per','Rasmus','Sigurd','Torsten','Ulrik','Wilhelm','Arne','Dag',
'Freya','Astrid','Saga','Elsa','Sigrid','Linnea','Thea','Maja','Liv',
'Alma','Britta','Dagny','Elin','Frida','Greta','Hedda','Idun','Johanna','Karin',
'Lovisa','Matilda','Oda','Petra','Ragnhild','Signe','Tilda','Ulla','Vigga',
'Emre','Burak','Cem','Alp','Baris','Mert','Kaan','Arda','Deniz','Onur',
'Ahmet','Berat','Cihan','Doruk','Efe','Furkan','Gokhan','Halil','Ilker','Kerem',
'Levent','Murat','Necip','Oguz','Polat','Recep','Serkan','Taner','Umut','Volkan',
'Elif','Defne','Zeynep','Yagmur','Selin','Ebru','Nazli','Tugba','Ceren','Asli',
'Aylin','Buse','Cansu','Damla','Ezgi','Fulya','Gulnur','Hazal','Ipek','Kardelen',
'Melis','Neslihan','Ozge','Pelin','Reyhan','Sevgi','Tulay','Yeliz','Zeliha','Bahar',
'Wei','Jin','Hao','Chen','Liang','Feng','Ming','Jun','Bo','Lei',
'Yong','Tao','Kai','Rui','Jie','Cheng','Peng','Sheng','Zhi','Gang',
'Qiang','Xin','Hong','Shan','Long','Hua','Guang','Dong','Nan','Yang',
'Mei','Xiao','Ying','Fang','Hui','Yan','Li','Na','Ting','Xue',
'Yue','Jing','Qian','Shu','Wen','Lan','Min','Ping','Rong','Zhen',
'Ai','Bao','Cui','Dan','En','Fei','Ge','Han','Juan','Kun',
'Anh','Minh','Duc','Thanh','Phong','Tuan','Hieu','Dung','Hung',
'Cuong','Dat','Giang','Huy','Khoa','Loc','Nam','Phat','Quang',
'Linh','Thao','Mai','Hoa','Trang','Ngoc','Hanh','Phuong','Tuyet',
'Bich','Chi','Dao','Ha','Kieu','Lien','My','Nhu','Oanh',
'Chai','Krit','Prem','Somchai','Tanawat','Nat','Pong','Sak','Ton','Win',
'Aran','Bank','Chart','Dej','Ek','Gun','Jett','Kan','Nai','Pat',
'Ploy','Fah','Nong','Pim','Som','Lek','Bua',
'Aom','Bee','Gam','Ice','Kwan','Noi','Opal','Pang','Rung',
'Nikos','Yannis','Dimitri','Kostas','Stavros','Petros','Giorgos','Alexis','Andreas','Vasilis',
'Christos','Elias','Fotis','Ilias','Kosmas','Leonidas','Marios','Panos','Sotiris','Thanasis',
'Athena','Katerina','Daphne','Penelope','Thalia','Zoe',
'Ariadne','Calliope','Demetra','Evangelia','Fotini','Ioanna','Konstantina',
'Jakub','Mateusz','Szymon','Kacper','Wojciech','Bartek','Dawid','Piotr','Tomasz',
'Aleksander','Bartosz','Cezary','Grzegorz','Hubert','Jan','Konrad',
'Zuzanna','Lena','Julia','Maja','Aleksandra','Wiktoria','Oliwia',
'Agnieszka','Barbara','Celina','Dorota','Ewa','Izabela','Karolina','Magdalena','Patrycja',
'Arash','Darius','Farhad','Kaveh','Mehdi','Navid','Omid','Reza','Saman','Behnam',
'Ehsan','Hossein','Iman','Javad','Kian','Milad','Nima','Payam',
'Shirin','Parisa','Maryam','Narges','Setareh','Azadeh','Darya','Elham','Fatemeh',
'Ghazal','Hasti','Kimia','Laleh','Mahsa','Nasrin','Parastoo','Roxana','Sahar','Tina',
'Adi','Budi','Dimas','Farhan','Haris','Irfan','Johan','Rizal','Syafiq','Yusof',
'Arief','Bagus','Cahya','Eko','Fajar','Galih','Hafiz','Iwan','Lukman','Nugroho',
'Putri','Siti','Dewi','Rani','Fitri','Laila','Maya','Wulan','Ratna','Ayu',
'Bunga','Citra','Dian','Eka','Gita','Indah','Kartini','Lestari','Melati','Nirmala',
'Alex','Sam','Jordan','Taylor','Morgan','Casey','Quinn','Avery','Cameron','Jesse',
'Jamie','Robin','Charlie','Drew','Sage','Eden','Skyler','River','Phoenix','Blake',
'Reese','Dakota','Rowan','Emery','Finley','Marlowe','Lennox','Haven','Nico','Mika',
'June','Ruby','Ace','Kit','Wren','Clay','Nash','Lane','Jude','Beau',
'Heath','Troy','Dean','Noa','Ada','Eve','Mara',
'Arlo','Blair','Corey','Dallas','Ellis','Flynn','Harley','Jess','Kerry','Lee',
'Marley','Noel','Shay','Toni','Val','Winter','Ashton','Bay',
];
const UNAMES = [...new Set(NAMES)];

// ═══════════════════════════════════════════════════════════════
// NEW ARCHITECTURE: STRICT EMOTION SILOS
// ═══════════════════════════════════════════════════════════════

const EMOTIONS = {
  ANGRY: {
    INDEPENDENT: [
      "i hate you", "you're terrible", "i hope she breaks your heart",
      "i never want to see you again", "delete my number", "we're done",
      "im blocking you", "you ruined my life", "you played me so hard",
      "everyone warned me about you", "my friends were right about you",
      "youre toxic", "give me my stuff back", "you owe me an apology",
      "stay far away from me", "youre a narcissist", "i deserve better",
      "hes better than you", "i was happier before i met you",
      "biggest regret of my life", "you were a waste of time",
      "three years down the drain", "you sucked the joy out of everything",
      "you made me question my sanity", "grow up", "take some responsibility",
      "stop playing the victim", "everyone knows the truth", "the truth will come out",
      "im done covering for you", "im so done", "we are never getting back together",
      "youre dead to me", "you owe me so much", "you brought out the worst in me",
      "you were a walking red flag", "you need serious help", "youre so toxic",
      "never speak to me again", "im not your friend", "i dont care",
      "im taking my power back", "you mean nothing", "im thriving without you",
      "you held me back", "youre a child", "you never grew up", "deal with your own issues",
      "game over", "have fun being single", "enjoy your miserable life",
      "im shaking im so angry", "you give me the ick", "never again", "hard lesson learned",
      "your karma is coming", "compulsive liar", "youre delusional",
      "sucks to be you", "you lost", "you fumbled the bag", "my gain", "im better off",
      "you never loved me", "you have no heart", "ice cold",
      "i hope you get exactly what you deserve", "you played me for a fool",
      "im done being your backup plan", "you only wanted me when it was convenient",
      "you never took me seriously", "im so tired of your excuses",
      "you ruined everything good we had", "i cant believe i defended you",
      "you are incredibly selfish", "i refuse to let you manipulate me anymore"
    ],
    THEM_PAST: [
      "you lied to my face", "you cheated on me", "you left me", "you walked away",
      "you gave up on us", "you stopped trying", "you stopped caring", "you stopped loving me",
      "you chose her", "you chose him", "you broke my trust", "you ruined everything",
      "you destroyed us", "you threw it all away", "you threw me away", "you treated me like garbage",
      "you made me feel worthless", "you gaslit me", "you manipulated me", "you used me",
      "you took advantage of me", "you played with my feelings", "you broke my heart",
      "you shattered my heart", "you tore me apart", "we fell apart", "we broke up",
      "we drifted apart", "we lost each other", "you dragged me through the mud",
      "you completely blindsided me", "you threw me under the bus", "you made me hate myself",
      "you stole my peace", "you took my happiness", "you drained me",
      "you played me like a fool", "you lied about everything", "you played the victim so well",
      "you isolated me from everyone", "you broke every single promise", "you faked the whole thing",
      "you replaced me in a week", "you moved on so fast", "you erased me from your life",
      "you gave up at the first sign of trouble", "you shut me out", "you ghosted me after everything",
      "you turned into someone i don't even know", "you betrayed me in the worst way",
      "you tore me down to build yourself up", "you crushed my spirit",
      "you made everything my fault", "you never took responsibility",
      "you showed your true colors"
    ],
    ME_PAST: [
      "i tried my absolute hardest", "i ignored all the warning signs",
      "i gave you way too many chances", "i made a mistake trusting you",
      "i compromised everything for you", "i lost myself loving you",
      "i gave you everything", "i bent over backwards for you"
    ],
    OPENER_PAST: [
      "i cant believe", "it sucks that", "i hate that", "im so mad that",
      "it kills me that", "the worst part is", "the hardest part is", "funny how", "its crazy how",
      "wild how", "sometimes i cant believe", "every night i think about how",
      "you have no idea how much it angers me that", "its actually insane how", "i will never understand why",
      "its beyond me why", "i still cant believe", "it blows my mind how",
      "i am still in shock that", "it honestly scares me how", "i finally realized that",
      "it took me this long to realize", "i just cant accept that", "its hard to accept that",
      "what hurts the most is", "the worst feeling is",
      "it makes me sick that", "it physically hurts that",
      "im so disgusted by how", "how do you even justify how", "i will never forgive you for how",
      "im never going to forget how"
    ],
    ME_PRESENT: [
      "i hope you get what you deserve", "im never speaking to you again",
      "i hope karma gets you", "im so done with you", "i want nothing to do with you",
      "i hope you end up alone", "i finally see who you really are",
      "im so angry every time i think of you"
    ],
    Q_START: [
      "why did you", "how could you", "when did you decide to",
      "were you ever going to", "what made you", "why didn't you", "how did you",
      "why would you", "what possessed you to", "how long did it take you to",
      "how did you find it so easy to", "did you even hesitate to", "did it hurt you to",
      "did it bother you to", "how on earth could you", "why the hell did you",
      "did you ever plan to", "was it your goal to", "was it fun for you to",
      "how could you ever", "why is it so hard to", "do you ever regret trying to",
      "what made you decide to",
      "did it ever cross your mind to", "were you even trying to", "did you even care when you"
    ],
    THEM_BASE: [
      "lie to me", "walk away", "give up on us", "choose them", "choose yourself",
      "stop loving me", "stop caring", "throw it all away", "ghost me",
      "hurt me like that", "break my heart", "ruin everything", "betray me",
      "stab me in the back", "lead me on", "use me", "take advantage of me",
      "make me feel crazy", "gaslight me", "make me feel worthless", "replace me",
      "forget about me", "erase me from your life", "move on", "leave me crying",
      "walk out without a word", "shut me out", "give up without trying",
      "throw me under the bus", "drain me of everything i had", "replace me in a week",
      "run away when things got hard", "cross every line",
      "walk away from everything we built", "stop trying to fix us",
      "give up when things got hard", "let me go so easily",
      "pretend like we meant nothing", "push me away when i tried to help",
      "make me feel so special just to leave", "act like a completely different person",
      "throw away years of history", "break every promise we made", "give up on all our plans"
    ],
    P3_TIME: [
      "sometimes", "late at night", "when i wake up", "randomly",
      "when i see your friends", "out of nowhere",
      "in the middle of the night", "when i'm alone",
      "every morning", "every single day", "when i'm driving alone",
      "when someone mentions your name"
    ],
    P3_MEMORY_PREFIX: [
      "i remember how", "i think about how",
      "i can't stop thinking about how", "my mind goes back to how",
      "i get a flashback to how", "i recall exactly how", "i start replaying how"
    ],
    P3_FEELING: [
      "and it ruins my day",
      "and i just feel completely empty", "and it still hurts",
      "and i wish i could forget",
      "and it makes me so angry", "and it makes me want to scream",
      "and i get so mad at myself", "and i realize how stupid i was",
      "and i realize how much you hurt me", "and i feel so numb",
      "and it breaks my heart all over again",
      "and i wish i never met you", "and i just feel so pathetic",
      "and it reminds me why we ended", "and it reminds me that you're gone"
    ],
    P4_CONFESSION: [
      "i never told you but", "i have a confession:", "secretly,", "truth is,",
      "i act like i don't care but",
      "i tell everyone i'm over you but", "i pretend i'm fine but",
      "i try to act tough but", "nobody knows this but", "i've been hiding that",
      "i hate to admit it but", "i promised myself i wouldn't say this but",
      "i swore i was done but", "i know it's pathetic but", "to be totally honest,",
      "if im being completely honest,", "the hard truth is",
      "i never admitted this but"
    ],
    PAST_ENDINGS: [
      "and i hate you for it", "and ill never forgive you",
      "and ill never forget it", "and it still hurts",
      "and it hurts so much", "and im still bleeding",
      "and im still broken", "and im still putting the pieces back together",
      "and im still healing", "and im still trying to move on",
      "and im still trying to forget you", "and i cant seem to let you go",
      "and i dont know how to move forward",
      "and i dont know what to do now", "and i dont know who i am without you",
      "and im so angry", "and im so bitter", "and im so resentful",
      "and i feel nothing but apathy", "and i just feel numb",
      "and i wish i never met you", "and i wish we never happened",
      "and i regret everything", "and i regret ever loving you",
      "and i regret giving you so much of myself",
      "and i hope karma gets you",
      "and i hope she does to you what you did to me",
      "and i hope he breaks your heart",
      "and i hope you get what you deserve",
      "and i hope you're miserable",
      "and i hope you think of me and it ruins your day",
      "and i hope you regret it", "and i hope you realize what you lost",
      "and i hope you realize you messed up",
      "and i hope you know you ruined a good thing",
      "and i honestly don't care anymore", "and i'm finally done caring",
      "and i'm finally moving on", "and i'm finally over you",
      "and i'm finally happy without you", "and i'm finally choosing myself",
      "and i'm better off without you", "and i deserve so much better",
      "and i know i deserve better", "and you didn't deserve me",
      "and you never deserved me", "and you were never good enough for me",
      "and you were always the problem", "and it was all your fault",
      "and im done taking the blame", "and im done making excuses for you",
      "and im done waiting for you to change",
      "and im done waiting for you to come back",
      "and quite frankly i'm exhausted", "and i'm just so tired",
      "and i literally can't do this anymore", "and i'm at my breaking point",
      "and i just want it all to stop",
      "and honestly good riddance", "and i wouldn't take you back if you begged",
      "and please don't ever contact me again",
      "and i feel nothing for you anymore", "and i honestly pity you",
      "and i feel sorry for whoever comes next", "and i hope she sees through you too",
      "and i hope he realizes what you are", "and you're going to end up alone",
      "and you threw away the best thing you ever had",
      "and you're going to regret this for the rest of your life",
      "and one day you'll realize what you did", "and by the time you realize, i'll be gone",
      "and i'm never looking back", "and i'm so done with your games",
      "and i can't believe i wasted so much time on you",
      "and you took years of my life i'll never get back", "and i hate myself for staying so long",
      "and i should have walked away years ago", "and everyone was right about you",
      "and my mom was right about you from the start", "and my friends warned me about you",
      "and i was so blind to not see it", "and i feel so stupid for trusting you",
      "and i'll never trust anyone again because of you", "and you ruined my ability to love",
      "and you left me with so much trauma",
      "and i'm still trying to unlearn all your toxic habits",
      "and i'm finally starting to heal", "and i'm finally finding myself again",
      "and i'm doing so much better without you", "and i've never been happier",
      "and my life is so much better now", "and you're just a bad memory now",
      "and i don't even recognize you anymore", "and you're dead to me",
      "and you mean absolutely nothing to me",
      "and don't ever reach out to me again", "and lose my number",
      "and keep away from me", "and i never want to hear your name again",
      "and just stay out of my life", "and please just leave me alone",
      "and don't you dare try to come back", "and it's way too late for apologies",
      "and your apologies mean nothing to me", "and you can shove your apologies",
      "and you're not sorry, you're just sorry you got caught",
      "and i'm never going to let you hurt me again", "and i'm finally free of you",
      "and i finally cut the cord", "and good riddance",
      "and i wouldn't wish you on my worst enemy",
      "and you're going to get exactly what's coming to you", "and karma never forgets",
      "and the universe will make you pay for it", "and i can't wait to see you get your karma",
      "and i'm just waiting for the day you get what you deserve",
      "and just go away",
      "and it makes absolutely no sense",
      "and im just so confused", "and i just want the truth",
      "and i cant wrap my head around it", "and i just need to know why",
      "and i cant find peace without knowing", "and it drives me crazy"
    ]
  },
  
  SAD: {
    INDEPENDENT: [
      "i miss you", "im sorry", "im so sorry", "please come back", "i need you",
      "just one more chance", "i promise ill change", "i cant live without you",
      "why wasn't i enough", "what did she have that i didnt", "was any of it real",
      "i hate that i miss you", "i hate that i still love you", "im crying right now",
      "you broke my heart", "you ruined me", "i trusted you", "you promised",
      "you said forever", "i feel so stupid", "it hurts so much", "im so numb",
      "i feel nothing anymore", "why cant i let you go", "how do i move on",
      "im dying inside", "i cant stop thinking about you", "i cant sleep",
      "its 3am and im crying over you", "i want my hoodie back", "she told me everything",
      "i saw the texts", "im exhausted", "im so tired of crying", "i have nothing left to give",
      "you left me with nothing", "i hate who i became with you", "i regret everything",
      "i wish we never crossed paths", "why cant you let me go", "i belong to me now",
      "i feel so light without you", "im out of tears", "im just so sad",
      "i feel so empty", "my heart literally aches", "im so incredibly lonely",
      "i would do anything to fix us", "i just cant do this alone",
      "nothing feels right without you", "please just give me a sign", "im so lost without you",
      "i still look for your car when i drive", "i saved all our polaroids",
      "i cant bring myself to delete our texts", "every love song reminds me of you",
      "my heart drops every time my phone vibrates", "i still smell your perfume on my jacket",
      "the silence in my room is deafening without you", "i keep rereading our old conversations",
      "im terrified ill never feel this way again", "i dont even know who i am anymore"
    ],
    THEM_PAST: [
      "you left me", "you walked away", "you gave up on us", "you stopped trying", 
      "you stopped caring", "you stopped loving me", "you broke my trust", "you ruined everything",
      "you destroyed us", "you broke my heart", "you shattered my heart", "you tore me apart", 
      "we fell apart", "we broke up", "we drifted apart", "we lost each other", 
      "you completely blindsided me", "you stole my peace", "you took my happiness", 
      "you left without saying goodbye", "you forgot all our promises"
    ],
    ME_PAST: [
      "i lost you", "i let you go", "i pushed you away", "i gave up",
      "i stopped trying", "i walked away", "i ruined it",
      "i messed it up", "i made a mistake", "i made the biggest mistake",
      "i loved you", "i loved you so much",
      "i gave you everything", "i gave you my all", "i tried so hard",
      "i couldn't save you", "i couldn't fix us",
      "i gave you my whole heart", "i never wanted to say goodbye",
      "i poured all my energy into us", "i made you the center of my universe"
    ],
    OPENER_PAST: [
      "it kills me that", "the hardest part is", "every night i think about how",
      "you have no idea how much it hurts that", "i am still in shock that",
      "i just cant accept that", "its hard to accept that",
      "what hurts the most is", "the worst feeling is", "i hate waking up and remembering how",
      "i hate going to sleep knowing that", "it breaks my heart that"
    ],
    ME_PRESENT: [
      "i still love you", "i need you in my life", "i miss holding you",
      "i still wait for your text", "i look for you everywhere", "i still think about our future",
      "i cant picture my life without you", "i still wear the shirt you gave me",
      "i cant delete your pictures", "im holding onto the memories", "i still reread our old messages",
      "i cant sleep without you here", "i cant stop thinking about you", "i just really miss you",
      "i want to hear your voice", "im looking at our old photos", "i need to talk to you",
      "im craving your touch", "i wish you were here with me", "i just need you right now",
      "i still talk to my friends about you", "i still dream about you"
    ],
    Q_START: [
      "why did you", "how could you", "when did you decide to",
      "what made you", "why didn't you", "how did you",
      "how did you find it so easy to", "did you even hesitate to",
      "why is it so hard to"
    ],
    THEM_BASE: [
      "walk away", "give up on us", "choose them", "choose yourself",
      "stop loving me", "stop caring", "throw it all away", "ghost me",
      "hurt me like that", "break my heart", "ruin everything",
      "forget about me", "erase me from your life", "move on", "leave me crying",
      "walk out without a word", "shut me out", "give up without trying",
      "run away when things got hard",
      "walk away from everything we built", "stop trying to fix us",
      "give up when things got hard", "let me go so easily",
      "throw away years of history", "break every promise we made", "give up on all our plans"
    ],
    P3_TIME: [
      "late at night", "when i wake up",
      "every time i drive past your house", "when our song plays",
      "when i look at old photos", "in the middle of the night", "when i'm alone", "when it rains",
      "every single day", "when i'm driving alone",
      "every time it snows", "when i smell your cologne", "when i smell your perfume",
      "when i pass our spot", "on your birthday", "on our anniversary",
      "when i see someone who looks like you", "when im having a bad day",
      "when i watch our favorite movie", "first thing in the morning",
      "right before i fall asleep", "when i hear that one song on the radio",
      "every time i walk through the park"
    ],
    P3_MEMORY_PREFIX: [
      "i remember how", "i think about how",
      "i can't stop thinking about how", "my mind goes back to how",
      "i get a flashback to how", "i picture how",
      "i catch myself thinking about how",
      "i start replaying how", "i reminisce about how",
      "my heart aches remembering how", "i tear up thinking about how",
      "i get so emotional remembering how"
    ],
    P3_FEELING: [
      "and it ruins my day", "and i just start crying",
      "and i just feel completely empty", "and it still hurts", "and i miss it",
      "and i hate that i miss it", "and i wish i could forget",
      "and i feel so numb",
      "and it breaks my heart all over again", "and i just want to sleep forever",
      "and i just feel so pathetic",
      "and it reminds me that you're gone",
      "and it breaks me down", "and i just cant stop crying",
      "and it hurts more than ever", "and i wish we could go back",
      "and it reminds me of everything i lost", "and i realize i still love you"
    ],
    P4_CONFESSION: [
      "i never told you but", "i have a confession:", "secretly,", "truth is,",
      "i act like i don't care but",
      "i tell everyone i'm over you but", "i pretend i'm fine but",
      "nobody knows this but", "i've been hiding that",
      "i hate to admit it but", "i promised myself i wouldn't say this but",
      "i know it's pathetic but", "to be totally honest,",
      "if im being completely honest,", "deep down,", "the hard truth is",
      "even after all this time,", "i know i shouldn't say this but"
    ],
    PAST_ENDINGS: [
      "and it still hurts",
      "and it hurts so much", "and im still bleeding",
      "and im still broken", "and im still putting the pieces back together",
      "and im still healing", "and im still trying to move on",
      "and im still trying to forget you", "and i cant seem to let you go",
      "and i cant seem to get over it", "and i dont know how to move forward",
      "and i dont know what to do now", "and i dont know who i am without you",
      "and im so lost without you", "and im so empty now",
      "and i just feel numb",
      "and i regret everything", 
      "but part of me still wants you back", "but part of me still loves you",
      "but i still miss you", "but i still love you", "but i still care",
      "but i still think about you", "but i still dream about you",
      "but i still cry over you", "but i still check your social media",
      "but i still look for you in crowds", "but i still hope you'll call",
      "but i still wish you were here", "but i still wish we could try again",
      "and maybe one day we can", "and maybe in another life",
      "and maybe our timing was just wrong",
      "and maybe we'll find each other again",
      "and i've completely lost my mind",
      "and i cant believe i wasted so much time on you",
      "and i'm still picking up the pieces", 
      "and i dont know how to live without you", "and im begging you to come back",
      "and i just want one more chance", "and please just answer me",
      "and i miss you more than anything", "and i still love you so much",
      "and my heart literally aches for you", "and im so incredibly lonely",
      "and i would do anything to fix us", "and i just cant do this alone",
      "and it hurts more every single day", "and im just praying you'll come back",
      "and nothing feels right without you", "and please just give me a sign",
      "and im so lost without you",
      "and it keeps me up at night", 
      "and i know i shouldn't be saying this", "and please just ignore this",
      "and im sorry for bothering you", "and i'll probably regret this tomorrow",
      "and please just text me back", "and i just had to tell you", "and ugh i miss you",
      "and i hate that i still care", "and just tell me you miss me too", "and i wish you were awake",
      "and i just wish things were different", "and i'll never understand why it had to end",
      "and i still wait for you to come back", "and i wonder if you think of me too"
    ]
  },
  
  LOVE_NOSTALGIA: {
    INDEPENDENT: [
      "i will always love you", "you were the best thing that ever happened to me",
      "i still think you're my soulmate", "nobody will ever compare to you",
      "i would do it all over again just to see you smile",
      "i just want you to be happy", "im so proud of everything you've accomplished",
      "i smile every time i think of you", "you made me a better person",
      "i still get butterflies thinking about our first date",
      "you will always have a piece of my heart", "i truly wanted it to be you",
      "my life is better because you were in it", "i still pray for you every night",
      "you were my favorite chapter", "i hope you find exactly what you're looking for",
      "i cherish every memory we made", "i wouldn't trade our time together for anything",
      "you taught me how to love", "i still remember the exact moment i fell for you",
      "part of me will always belong to you", "i will always root for you from afar",
      "you brought out the best in me", "i still count my lucky stars that i met you",
      "you were my safe place", "no matter what happens i will always care about you",
      "you are the most beautiful soul i have ever known", "i will never regret loving you",
      "i still go to our favorite coffee shop", "i drove past your old house today",
      "i found that mixtape you made me", "i wore your favorite shirt today",
      "that road trip we took still feels like yesterday",
      "i keep remembering our late night conversations",
      "i still have the ticket stub from our first movie",
      "it feels like just yesterday we were inseparable",
      "i miss our midnight drives", "i miss the way we used to laugh until we couldn't breathe",
      "do you ever think about that summer we spent together", 
      "i stumbled upon your old letters in my drawer", "i played our playlist today",
      "everything around this city reminds me of you", "i walked past the park where we first met",
      "sometimes i just close my eyes and remember your laugh"
    ],
    THEM_PAST: [
      "you made me feel so special", "you showed me what love actually is",
      "you always knew how to make me laugh", "you held my hand when i was scared",
      "you promised it would be okay", "you made me feel safe",
      "you kissed my forehead", "you looked at me like i was the only person in the room",
      "you taught me how to trust again", "you brought so much light into my life",
      "you completely changed my perspective on love", "you believed in me when no one else did"
    ],
    ME_PAST: [
      "i fell for you instantly", "i knew from day one",
      "i loved you", "i loved you so much",
      "i tried my absolute hardest", 
      "i romanticized everything about you"
    ],
    OPENER_PAST: [
      "im so grateful that", "it makes me smile that", "i love that",
      "i will always cherish how", "i smile when i remember how",
      "i still remember the exact moment that", "it means everything to me that",
      "i will never forget how", "it comforts me to know that", "i find peace in the fact that",
      "it honestly warms my heart that", "im forever thankful that"
    ],
    ME_PRESENT: [
      "i hope you're doing well", "i just want the best for you",
      "i miss your laugh", "i miss how we used to be", "i still believe in us",
      "i still get butterflies", 
      "i wonder if you're happy now", "i hope someone is treating you right",
      "i check your spotify to see what you're listening to",
      "i still catch myself smiling when someone mentions your name",
      "i pray for your happiness every single day", "i still wonder what could have been",
      "i find myself looking for you in crowds", "i keep hoping we'll bump into each other"
    ],
    Q_START: [
      "do you ever regret trying to",
      "when did you first realize you wanted to",
      "did it ever cross your mind to"
    ],
    THEM_BASE: [
      "make me feel so special", "show me what love is",
      "be there for me when no one else was", "change my life completely"
    ],
    P3_TIME: [
      "sometimes", "randomly",
      "when our song plays",
      "when i see your friends", "when i look at old photos", 
      "when i go to that restaurant", "when i wear that shirt",
      "every time it snows", "when i smell your cologne", "when i smell your perfume",
      "when i pass our spot", "on your birthday", "on our anniversary",
      "when i watch our favorite movie", 
      "when i hear that one song on the radio",
      "every time i walk through the park"
    ],
    P3_MEMORY_PREFIX: [
      "i remember how", "i think about how",
      "my mind goes back to how",
      "i get a flashback to how", "i picture how",
      "i recall exactly how", "i catch myself thinking about how",
      "i reminisce about how",
      "i smile thinking about how", "i find peace knowing how",
      "i get chills remembering how"
    ],
    P3_FEELING: [
      "and it makes me smile", "and i wouldn't change a thing",
      "and it fills me with so much warmth", "and i still feel so lucky",
      "and it makes me hope you're doing okay", "and i pray that you're happy",
      "and it reminds me how beautiful life can be", "and i feel grateful we happened at all"
    ],
    P4_CONFESSION: [
      "i never told you but", "i have a confession:", "secretly,", "truth is,",
      "nobody knows this but", 
      "to be totally honest,", "if im being completely honest,", "deep down,", 
      "i never admitted this but", "i still havent told anyone but",
      "even after all this time,", 
      "i was too scared to say this before but", "i always wanted to tell you that"
    ],
    PAST_ENDINGS: [
      "and i will always be grateful", "and i wouldn't change a single thing",
      "and you made my life so much better", "and i will never stop loving you",
      "and i hope you're doing well", "and i wish you nothing but the best",
      "and i hope you found your happiness", "and i'll always root for you",
      "and i hope someone loves you right", "and you will always be special to me",
      "and it was the best time of my life", "and i miss those days so much",
      "and i would do it all over again", "and i still believe we were meant to be",
      "and i wonder if you think of me too",
      "and it warms my heart every time i think of it", "and i feel so lucky to have had you",
      "and i will carry those memories with me forever", "and my life is forever changed because of you"
    ]
  }
};

// =============================================================
// HELPER FUNCTIONS
// =============================================================

function applyCasing(msg) {
  const c = Math.random();
  if (c < 0.6) return msg.toLowerCase();
  if (c < 0.9) return msg.charAt(0).toUpperCase() + msg.slice(1);
  return msg.toUpperCase();
}

function applyPunctuation(msg) {
  const rand = Math.random();
  if (rand < 0.15) msg += '...';
  else if (rand < 0.35) msg += '.';
  else if (rand < 0.45) msg += '!';
  else if (rand < 0.55) msg += '?!';
  else if (rand < 0.65) msg += '?!?';
  return msg;
}

function generate() {
  const pool = [];
  const seen = new Set();
  
  const trigramCounts = {}; 
  const firstTwoWords = {}; 
  const nameUsage = {};
  
  function getName() {
    const shuffled = shuffle(UNAMES);
    for (const n of shuffled) {
      if ((nameUsage[n] || 0) < 12) return n;
    }
    return R(UNAMES);
  }
  
  function getTrigrams(text) {
    const words = text.toLowerCase().split(/\s+/);
    const grams = [];
    for (let i = 0; i <= words.length - 3; i++) {
      grams.push(words.slice(i, i + 3).join(' '));
    }
    return grams;
  }
  
  function canAdd(msg) {
    const key = msg.toLowerCase().trim();
    if (seen.has(key)) return false;
    if (!msg || msg.length < 2 || msg.length > 250) return false;
    
    const words = wc(msg);
    if (words < 1 || words > 30) return false;
    
    const opening = msg.toLowerCase().split(/\s+/).slice(0, 2).join(' ');
    if ((firstTwoWords[opening] || 0) >= 200) return false; // Stricter variety
    
    const trigrams = getTrigrams(msg);
    for (const gram of trigrams) {
      if ((trigramCounts[gram] || 0) >= 40) return false; // Stricter variety
    }
    
    return true;
  }
  
  function addMessage(msg) {
    const key = msg.toLowerCase().trim();
    seen.add(key);
    
    const opening = msg.toLowerCase().split(/\s+/).slice(0, 2).join(' ');
    firstTwoWords[opening] = (firstTwoWords[opening] || 0) + 1;
    
    const trigrams = getTrigrams(msg);
    for (const gram of trigrams) {
      trigramCounts[gram] = (trigramCounts[gram] || 0) + 1;
    }
    
    const name = getName();
    nameUsage[name] = (nameUsage[name] || 0) + 1;
    pool.push({ name, message: msg, color_id: R(CARD_COLORS) });
  }

  // 1. Add base independent sentences first (from all emotions)
  console.log("Phase 1: Adding base independent messages");
  for (const emotionKey in EMOTIONS) {
      for (let msg of EMOTIONS[emotionKey].INDEPENDENT) {
          let finalMsg = applyCasing(msg);
          finalMsg = applyPunctuation(finalMsg);
          if (canAdd(finalMsg)) addMessage(finalMsg);
      }
  }
  
  console.log(`Phase 1 total: ${pool.length}`);
  
  let attempts = 0;
  console.log("Phase 2: Generating combos with STRICT EMOTIONAL MATCHING");
  
  const emotionKeys = Object.keys(EMOTIONS);
  
  while (pool.length < 10000 && attempts < 5000000) {
      attempts++;
      
      // Pick ONE emotional category for this sentence so parts don't mismatch!
      const currentEmotion = R(emotionKeys);
      const E = EMOTIONS[currentEmotion];
      
      let msg = "";
      let structureType = Math.random();
      
      const pastClauses = [...E.THEM_PAST, ...E.ME_PAST];
      
      if (structureType < 0.20) {
          // Template 1: Opener + Past Clause + (Optional) Ending
          if (Math.random() < 0.5) {
              msg = R(E.OPENER_PAST) + " " + R(pastClauses);
          } else {
              msg = R(E.OPENER_PAST) + " " + R(pastClauses) + " " + R(E.PAST_ENDINGS);
          }
      } else if (structureType < 0.40) {
          // Template 2: Past Clause + (Optional) Ending / Me Present
          if (Math.random() < 0.6) {
              msg = R(pastClauses) + " " + R(E.PAST_ENDINGS);
          } else {
              msg = R(E.THEM_PAST) + " and " + R(E.ME_PRESENT);
          }
      } else if (structureType < 0.55) {
          // Template 3: Questions
          msg = R(E.Q_START) + " " + R(E.THEM_BASE);
      } else if (structureType < 0.70) {
          // Template 4: Memories
          if (Math.random() < 0.5) {
              msg = R(E.P3_TIME) + " " + R(E.P3_MEMORY_PREFIX) + " " + R(E.THEM_PAST);
          } else {
              msg = R(E.P3_TIME) + " " + R(E.P3_MEMORY_PREFIX) + " " + R(E.THEM_PAST) + " " + R(E.P3_FEELING);
          }
      } else if (structureType < 0.85) {
          // Template 5: Confessions + Independent
          msg = R(E.P4_CONFESSION) + " " + R(E.INDEPENDENT);
      } else {
          // Template 6: Double Independent (Sentences separated by punctuation)
          let msg1 = R(E.INDEPENDENT);
          let msg2 = R(E.INDEPENDENT);
          while(msg1 === msg2) msg2 = R(E.INDEPENDENT);
          
          let sep = Math.random() < 0.5 ? ". " : "... ";
          msg = msg1 + sep + msg2;
      }
      
      // Some random textspeak mutations for extra spice
      if (Math.random() < 0.15) msg = msg.replace(/\byou\b/gi, 'u');
      if (Math.random() < 0.15) msg = msg.replace(/\byour\b/gi, 'ur');
      
      msg = applyCasing(msg);
      msg = applyPunctuation(msg);
      
      if (canAdd(msg)) addMessage(msg);
  }
  
  console.log(`Phase 2 total: ${pool.length} (in ${attempts} attempts)`);
  return shuffle(pool).slice(0, 10000);
}

// =============================================================
// VALIDATION & RUN
// =============================================================

function validate(pool) {
  let errors = 0;
  const messageSet = new Set();
  
  for (let i = 0; i < pool.length; i++) {
    const e = pool[i];
    const words = wc(e.message);
    
    if (words > 30) { console.error(`[${i}] Over 30 words (${words}): "${e.message}"`); errors++; }
    if (words < 1) { console.error(`[${i}] Empty`); errors++; }
    if (e.message.length > 250) { console.error(`[${i}] Over 250 chars (${e.message.length})`); errors++; }
    if (!CARD_COLORS.includes(e.color_id)) { console.error(`[${i}] Bad color: "${e.color_id}"`); errors++; }
    
    const key = e.message.toLowerCase().trim();
    if (messageSet.has(key)) { console.error(`[${i}] Duplicate: "${e.message.substring(0,50)}"`); errors++; }
    messageSet.add(key);
  }
  
  return errors;
}

console.log('Generating 10,000 unique RAW texts with STRICT EMOTION SILOS...\n');
const pool = generate();

console.log(`\nValidating ${pool.length} entries...`);
const errors = validate(pool);

if (errors > 0) {
  console.error(`\n❌ ${errors} validation errors!`);
  process.exit(1);
}
if (pool.length < 10000) {
  console.warn(`\n⚠ Only ${pool.length} entries (target: 10,000)`);
}

console.log(`\n✅ ${pool.length} entries generated and validated!`);

const outPath = join(__dirname, 'seed-messages.json');
writeFileSync(outPath, JSON.stringify(pool, null, 2));
console.log(`Written to: ${outPath}`);

// Stats
const firstWords = {};
pool.forEach(e => {
  const fw = e.message.split(/\s+/)[0].toLowerCase();
  firstWords[fw] = (firstWords[fw] || 0) + 1;
});
const topFW = Object.entries(firstWords).sort((a,b) => b[1]-a[1]).slice(0,20);
console.log('\nTop 20 first words:');
topFW.forEach(([w,n]) => console.log(`  "${w}": ${n}`));

const lengths = pool.map(e => wc(e.message));
const avg = lengths.reduce((a,b) => a+b, 0) / lengths.length;
console.log('\nMessage length distribution:');
console.log(`  Short (1-3 words): ${lengths.filter(l => l <= 3).length} (${(lengths.filter(l => l <= 3).length/100).toFixed(1)}%)`);
console.log(`  Medium (4-12 words): ${lengths.filter(l => l > 3 && l <= 12).length} (${(lengths.filter(l => l > 3 && l <= 12).length/100).toFixed(1)}%)`);
console.log(`  Long (13-30 words): ${lengths.filter(l => l > 12).length} (${(lengths.filter(l => l > 12).length/100).toFixed(1)}%)`);
console.log(`  Average: ${avg.toFixed(1)} words`);

console.log('\n── Sample messages ──');
const samples = shuffle(pool).slice(0, 20);
samples.forEach(m => {
  console.log(`  To: ${m.name} → "${m.message}"`);
});
