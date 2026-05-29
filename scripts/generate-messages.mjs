#!/usr/bin/env node
// =============================================================
// generate-messages.mjs  (v3 — raw human rewrite)
// Produces scripts/seed-messages.json with 10,000 unique messages
// that sound like REAL humans on the Unsent Project.
//
// v3 changes from v2:
//   • Every template rewritten to match real screenshot energy
//   • No metaphors, no poetry, no literary language
//   • Typos built in (alot, more then, ur, etc.)
//   • Abbreviations in body (ily, ilysm, ly, sm, w)
//   • ALL CAPS excited messages (~5%)
//   • Name-in-message feature (~8%)
//   • Super short messages (3-7 words) = 40%
//   • Comma splices, run-ons, missing articles = real human writing
//   • 25 word limit strictly enforced
//
// 🧹 CLEANUP (after ~4 months / Oct 2026):
//   Delete these files:
//     - scripts/generate-messages.mjs  (this file)
//     - scripts/seed-messages.json
//     - scripts/seed-submissions.mjs
//     - .github/workflows/seed-submissions.yml
//   Also remove GitHub Secrets:
//     - SUPABASE_SERVICE_ROLE_KEY (if not used elsewhere)
// =============================================================

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── CARD COLORS (must match lib/constants.ts) ──────────────
const CARD_COLORS = [
  'parchment', 'rose-dust', 'sage-whisper', 'lavender-haze',
  'honey-gold', 'ocean-mist', 'blush-coral', 'dusty-mauve',
  'faded-denim', 'ivory-ash',
];

// ─── HELPERS ────────────────────────────────────────────────
function R(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand() { return Math.random(); }
function wc(s) { return s.split(/\s+/).filter(w => w.length > 0).length; }
function clean(s) {
  return s.replace(/\s+/g, ' ').replace(/\.\./g,'.').replace(/,,/g,',').trim();
}

// ─── 1700+ INTERNATIONAL FIRST NAMES ────────────────────────
const NAMES = [
  // English (Male)
  'James','Liam','Noah','Ethan','Mason','Logan','Lucas','Aiden','Jackson','Sebastian',
  'Jack','Owen','Daniel','Matthew','Henry','Alexander','William','Benjamin','Elijah','Ryan',
  'Nathan','Caleb','Dylan','Luke','Connor','Max','Cole','Tyler','Hunter','Wyatt',
  'Carter','Asher','Leo','Ezra','Landon','Adrian','Nolan','Gavin','Miles','Elliot',
  'Jasper','Silas','Oscar','Hudson','Declan','Colton','Parker','Brody','Brooks','Grayson',
  'Dominic','Spencer','Grant','Graham','Tate','Brock','Reid','Garrett','Trevor','Chase',
  'Preston','Maxwell','Bennett','Wesley','Dawson','Everett','Felix','Griffin','Hayes','Knox',
  'Levi','Maddox','Micah','Orion','Pierce','Rhett','Sterling','Thatcher','Waylon','Zane',
  // English (Female)
  'Emma','Olivia','Ava','Sophia','Isabella','Mia','Charlotte','Amelia','Harper','Evelyn',
  'Abigail','Emily','Ella','Scarlett','Grace','Lily','Chloe','Zoey','Penelope','Layla',
  'Riley','Nora','Hannah','Aria','Ellie','Stella','Violet','Aurora','Savannah','Audrey',
  'Claire','Sadie','Piper','Paisley','Hazel','Lydia','Madeline','Natalie','Anna','Alice',
  'Autumn','Bella','Caroline','Clara','Daisy','Eleanor','Fiona','Georgia','Holly','Isla',
  'Jade','Kate','Leah','Luna','Margot','Naomi','Paige','Rose','Serena','Vivian',
  'Willow','Brooke','Celeste','Diana','Eden','Faith','Gemma','Hope','Ivy','Joy',
  'Kennedy','Lucia','Molly','Nicole','Olive','Pearl','Rachel','Sienna','Tessa','Uma',
  // Spanish / Latin
  'Santiago','Mateo','Diego','Alejandro','Carlos','Miguel','Andres','Pablo','Rafael','Fernando',
  'Javier','Luis','Eduardo','Roberto','Manuel','Jorge','Marco','Emilio','Rodrigo','Hector',
  'Sergio','Raul','Arturo','Enrique','Cesar','Victor','Alberto','Ignacio','Tomas',
  'Angel','Cristian','Francisco','Gonzalo','Ivan','Julian','Lorenzo','Martin','Ricardo','Salvador',
  'Valentina','Camila','Valeria','Mariana','Daniela','Sofia','Gabriela','Lucia','Elena','Natalia',
  'Maria','Carmen','Rosa','Adriana','Alicia','Julieta','Catalina','Ximena','Renata',
  'Fernanda','Alejandra','Ana','Beatriz','Carolina','Dolores','Esperanza','Flora','Gloria','Ines',
  'Jimena','Karla','Laura','Marisol','Nadia','Paloma','Regina','Silvia','Teresa','Yolanda',
  // Indian
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
  // Filipino
  'Angelo','Joshua','Carl','Jericho','Kenneth','Renz','Paolo','Tristan','Cedric','Vince',
  'Gelo','Mark','Jayden','Rafael','Jerome','Francis','Enzo','Darren','Gabriel',
  'Andre','Benedict','Christian','Ian','Jed','Kyle','Lance',
  'Neil','Patrick','Ray','Sean','Theo','Warren','Aldrin','Bryan','Cyrus','Dennis',
  'Jasmine','Althea','Keziah','Bea','Francine','Marian','Shaira','Aimee','Katrina','Rica',
  'Janelle','Princess','Nina','Angelica','Chelsea','Denise','Erica','Faye','Gia',
  'Iris','Julie','Kim','Lara','Mae','Nadine','Patrice','Rhea','Trixie',
  'Andrea','Bianca','Carla','Dawn','Gwen','Hailey','Joanna','Kristine',
  // Arabic / Middle Eastern
  'Omar','Yusuf','Adam','Hassan','Khalid','Tariq','Samir','Ibrahim','Zain','Faisal',
  'Karim','Rami','Ali','Hamza','Bilal','Sami','Nabil','Amir','Rashid','Jamal',
  'Ahmed','Basil','Daoud','Ehab','Farid','Ghazi','Hadi','Ismail','Jawad','Kareem',
  'Latif','Majid','Nasir','Qasim','Rafiq','Said','Tahir','Wahid','Yasser','Zayd',
  'Amira','Noura','Hana','Yasmin','Leila','Mariam','Sara','Noor',
  'Dina','Salma','Reem','Jana','Maha','Lina','Dalal','Rania','Huda','Lamia',
  'Amal','Basma','Duaa','Esra','Farida','Ghada','Hayat','Inas','Jumana','Khadija',
  'Lubna','Muna','Najwa','Ola','Rawia','Samira','Tahani','Wafa','Yara','Zahra',
  // Korean
  'Jimin','Minho','Jungkook','Taehyung','Seojun','Jaehyun','Donghyuk','Sunwoo','Woojin','Hyun',
  'Siwoo','Hajun','Jiho','Doyun','Junseo','Yejun','Eunwoo','Hyunjin','Taemin','Changmin',
  'Junwoo','Minseok','Seungho','Yoongi','Jinhyuk','Kyungsoo','Sangwoo','Dongwoo','Hoseok','Inhyuk',
  'Sora','Yuna','Jihye','Eunji','Minji','Sooyoung','Haeun','Chaewon','Dahyun','Soojin',
  'Jiwon','Seoyeon','Hayeon','Subin','Nayeon','Yeji','Ryujin','Chaeyoung','Seulgi','Jihyo',
  'Miyeon','Shuhua','Yuqi','Minnie','Jisoo','Jennie','Yeri','Irene','Wendy','Tzuyu',
  // Japanese
  'Haruto','Yuto','Sota','Ren','Kaito','Riku','Hayato','Hinata','Takumi',
  'Yuma','Asahi','Minato','Shota','Akira','Daiki','Eiji','Fumiya','Genki','Hikaru',
  'Itsuki','Jiro','Kenji','Makoto','Naoki','Ryo','Shinji','Taro','Yuki','Kenta',
  'Sakura','Hina','Yui','Aoi','Mio','Rin','Koharu','Mei','Akari','Honoka',
  'Nana','Saki','Misaki','Ayaka','Chihiro','Emi','Fumiko',
  'Kanon','Mana','Natsuki','Riko','Sayuri','Tomoko','Wakana','Yoko','Chiaki','Kana',
  // French
  'Hugo','Louis','Raphael','Jules','Antoine','Pierre','Maxime','Alexandre','Nicolas',
  'Baptiste','Clement','Damien','Etienne','Florian','Guillaume','Hadrien','Jean','Laurent','Mathieu',
  'Olivier','Philippe','Quentin','Romain','Sylvain','Thierry','Valentin','Xavier','Yann','Fabien',
  'Lea','Manon','Camille','Juliette','Elise','Lucie','Marie','Sophie',
  'Amelie','Brigitte','Delphine','Elodie','Fleur','Genevieve','Helene',
  'Laure','Madeleine','Nathalie','Oceane','Pauline','Roxane','Sandrine','Colette','Vivienne','Adele',
  // African
  'Kwame','Kofi','Tendai','Chidi','Emeka','Oluwaseun','Jabari','Amare','Obinna','Sekou',
  'Tunde','Jelani','Nnamdi','Dayo','Idris','Kojo','Ayoub','Boubacar','Cedrick','Diallo',
  'Ekon','Faraji','Gideon','Hamidi','Issa','Jomo','Kamau','Lekan','Musa','Nkosi',
  'Olu','Pape','Rashidi','Simba','Thabo','Uche','Wole','Yaw','Zuberi','Adewale',
  'Amara','Nia','Zuri','Ayanda','Thandiwe','Abena','Ife','Nala','Adaeze','Imani',
  'Chioma','Akosua','Aminata','Fatou','Nkechi','Ayana','Binta','Chiamaka','Dahlia','Efua',
  'Folake','Gifty','Hadiza','Iyabo','Jamila','Keza','Lira','Makena','Nandi','Omolara',
  'Palesa','Rashida','Sade','Temi','Uju','Wangari','Yetunde','Zanele','Chinwe',
  // Brazilian / Portuguese
  'Thiago','Gustavo','Bruno','Felipe','Leonardo','Guilherme','Caio','Vitor','Pedro','Henrique',
  'Arthur','Bernardo','Eduardo','Igor','Joao','Kaique','Luan','Matheus',
  'Otavio','Paulo','Samuel','Tiago','Vinicius','Wagner','Yago',
  'Larissa','Amanda','Juliana','Leticia','Bruna','Isabela','Rafaela',
  'Flavia','Helena','Ingrid','Jessica','Kelly',
  'Livia','Marina','Patricia','Renata','Sabrina','Tatiana','Vanessa','Aline',
  // Eastern European / Slavic
  'Nikolai','Mikhail','Dmitri','Sergei','Aleksei','Andrei','Maxim','Viktor','Boris',
  'Anton','Bogdan','Cyril','Denis','Evgeni','Fyodor','Grigori','Igor','Kirill','Leonid',
  'Matvei','Oleg','Pavel','Roman','Stanislav','Timur','Vadim','Vladislav','Yaroslav','Zakhar',
  'Anya','Katya','Natasha','Olga','Mila','Irina','Daria','Svetlana','Polina','Vera',
  'Alina','Anastasia','Ekaterina','Galina','Ksenia','Lada',
  'Tatiana','Yelena','Zoya','Larisa','Tamara','Raisa',
  // Nordic / Scandinavian
  'Erik','Lars','Sven','Axel','Magnus','Nils','Leif','Bjorn','Odin','Gunnar',
  'Anders','Emil','Filip','Gustaf','Henrik','Johan','Karl','Lukas','Niklas',
  'Oskar','Per','Rasmus','Sigurd','Torsten','Ulrik','Wilhelm','Arne','Dag',
  'Freya','Astrid','Ingrid','Saga','Elsa','Sigrid','Linnea','Thea','Maja','Liv',
  'Alma','Britta','Dagny','Elin','Frida','Greta','Hedda','Idun','Johanna','Karin',
  'Lovisa','Matilda','Oda','Petra','Ragnhild','Signe','Tilda','Ulla','Vigga',
  // Turkish
  'Emre','Burak','Cem','Alp','Baris','Mert','Kaan','Arda','Deniz','Onur',
  'Ahmet','Berat','Cihan','Doruk','Efe','Furkan','Gokhan','Halil','Ilker','Kerem',
  'Levent','Murat','Necip','Oguz','Polat','Recep','Serkan','Taner','Umut','Volkan',
  'Elif','Defne','Zeynep','Yagmur','Selin','Ebru','Nazli','Tugba','Ceren','Asli',
  'Aylin','Buse','Cansu','Damla','Ezgi','Fulya','Gulnur','Hazal','Ipek','Kardelen',
  'Melis','Neslihan','Ozge','Pelin','Reyhan','Sevgi','Tulay','Yeliz','Zeliha','Bahar',
  // Chinese
  'Wei','Jin','Hao','Chen','Liang','Feng','Ming','Jun','Bo','Lei',
  'Yong','Tao','Kai','Rui','Jie','Cheng','Peng','Sheng','Zhi','Gang',
  'Qiang','Xin','Hong','Shan','Long','Hua','Guang','Dong','Nan','Yang',
  'Mei','Xiao','Ying','Fang','Hui','Yan','Li','Na','Ting','Xue',
  'Yue','Jing','Qian','Shu','Wen','Lan','Min','Ping','Rong','Zhen',
  'Ai','Bao','Cui','Dan','En','Fei','Ge','Han','Juan','Kun',
  // Vietnamese
  'Anh','Minh','Duc','Thanh','Phong','Tuan','Hieu','Dung','Hung',
  'Cuong','Dat','Giang','Huy','Khoa','Loc','Nam','Phat','Quang',
  'Linh','Thao','Mai','Hoa','Trang','Ngoc','Hanh','Phuong','Tuyet',
  'Bich','Chi','Dao','Ha','Kieu','Lien','My','Nhu','Oanh',
  // Thai
  'Chai','Krit','Prem','Somchai','Tanawat','Nat','Pong','Sak','Ton','Win',
  'Aran','Bank','Chart','Dej','Ek','Gun','Jett','Kan','Nai','Pat',
  'Ploy','Fah','Nong','Pim','Som','Lek','Bua',
  'Aom','Bee','Gam','Ice','Kwan','Noi','Opal','Pang','Rung',
  // Greek
  'Nikos','Yannis','Dimitri','Kostas','Stavros','Petros','Giorgos','Alexis','Andreas','Vasilis',
  'Christos','Elias','Fotis','Ilias','Kosmas','Leonidas','Marios','Panos','Sotiris','Thanasis',
  'Athena','Katerina','Daphne','Irene','Penelope','Thalia','Zoe',
  'Ariadne','Calliope','Demetra','Evangelia','Fotini','Ioanna','Konstantina',
  // Polish
  'Jakub','Mateusz','Szymon','Kacper','Wojciech','Bartek','Dawid','Piotr','Tomasz',
  'Aleksander','Bartosz','Cezary','Grzegorz','Hubert','Jan','Konrad',
  'Zuzanna','Lena','Julia','Maja','Hanna','Aleksandra','Wiktoria','Oliwia',
  'Agnieszka','Barbara','Celina','Dorota','Ewa','Izabela','Karolina','Magdalena','Patrycja',
  // Persian / Iranian
  'Arash','Darius','Farhad','Kaveh','Mehdi','Navid','Omid','Reza','Saman','Behnam',
  'Cyrus','Ehsan','Hossein','Iman','Javad','Kian','Milad','Nima','Payam',
  'Shirin','Parisa','Maryam','Narges','Setareh','Azadeh','Darya','Elham','Fatemeh',
  'Ghazal','Hasti','Kimia','Laleh','Mahsa','Nasrin','Parastoo','Roxana','Sahar','Tina',
  // Malay / Indonesian
  'Adi','Budi','Dimas','Farhan','Haris','Irfan','Johan','Rizal','Syafiq','Yusof',
  'Arief','Bagus','Cahya','Eko','Fajar','Galih','Hafiz','Iwan','Lukman','Nugroho',
  'Putri','Siti','Dewi','Rani','Fitri','Laila','Maya','Wulan','Ratna','Ayu',
  'Bunga','Citra','Dian','Eka','Gita','Indah','Kartini','Lestari','Melati','Nirmala',
  // Gender-neutral / Universal
  'Alex','Sam','Jordan','Taylor','Morgan','Casey','Quinn','Avery','Cameron','Jesse',
  'Jamie','Robin','Charlie','Drew','Sage','Eden','Skyler','River','Phoenix','Blake',
  'Reese','Dakota','Rowan','Emery','Finley','Marlowe','Lennox','Haven','Nico','Mika',
  'June','Ruby','Ace','Kit','Wren','Clay','Nash','Lane','Jude','Beau',
  'Heath','Troy','Dean','Noa','Ada','Eve','Mara',
  'Arlo','Blair','Corey','Dallas','Ellis','Flynn','Harley','Jess','Kerry','Lee',
  'Marley','Noel','Shay','Toni','Val','Winter','Ashton','Bay',
];

const UNIQUE_NAMES = [...new Set(NAMES)];

// ─── DETAIL POOLS (for {X} injection) ───────────────────────
const PLACES = ['that coffee shop','the park','the beach','that bench','the parking lot','the library','the hallway','the bus stop','the lake','the pier','the balcony','the kitchen','the backseat','that restaurant','the train station','the rooftop','your doorstep','the playground','the mall','target','walmart','the movies','the gas station','the gym','school','the dorms','the cafeteria','church','the hospital','the airport'];
const TIMES = ['that night','that summer','last december','3am','prom night','graduation','that tuesday','last winter','that weekend','christmas','valentines','that morning','october','that friday night','new years','sophomore year','8th grade','middle school','high school','that one time','junior year','last spring','february','that wednesday','last month','august','senior year'];
const OBJECTS = ['your hoodie','that playlist','our photos','your old texts','that letter','your ring','the bracelet','our song','your jacket','that polaroid','your perfume','the necklace','those flowers','that voicemail','your birthday card','your sweatshirt','the stuffed animal you gave me','that note you wrote me','the blanket','your pillow','your t shirt','the earrings'];
const SCHOOL_WORK = ['in class','at lunch','in the hallway','at the library','at practice','on the bus','at work','at the party','at prom','at the game','in study hall','at orientation','at the cafeteria','in homeroom','at recess','in the parking lot','at the dance','during assembly'];

// ─── TEMPLATES ──────────────────────────────────────────────
// Written to match REAL unsent project submissions.
// Rules: no metaphors, no poetry, no literary language.
// Just raw, messy, direct, emotional human text messages.
// {P} = place, {T} = time, {O} = object, {S} = school/work
// {N} = will be replaced with the recipient's name

const TPL = [];

// ──── SUPER SHORT (3-7 words) ─── ~35% of total ────────────
const SHORT = [
  "i love you",
  "i miss you",
  "i miss u",
  "come back",
  "please come back",
  "i hate you",
  "i still love you",
  "i love you so much",
  "you are so special to me",
  "your smile is so cute",
  "i think i love you",
  "i still love you baby",
  "youre a really good person",
  "i hope youre the one",
  "i miss you alot",
  "i love you and i wish i didnt",
  "i hope we can be together",
  "i miss u sm",
  "im sorry",
  "please forgive me",
  "i need you",
  "come home",
  "dont leave",
  "stay",
  "why did you leave",
  "i hate this",
  "it hurts",
  "i cant do this anymore",
  "youre beautiful",
  "youre so pretty",
  "i like you alot",
  "i have a crush on you",
  "do you think about me",
  "i think about you alot",
  "i wish you knew",
  "you changed me",
  "thank you for everything",
  "i forgive you",
  "its okay",
  "i understand now",
  "im proud of you",
  "you deserve better",
  "you deserve the world",
  "i wish i was enough",
  "was i not enough",
  "why wasnt i enough",
  "i loved you first",
  "youll always be my person",
  "i still care about you",
  "please be happy",
  "i hope youre okay",
  "are you happy now",
  "do you miss me",
  "do you ever think about me",
  "i want you back",
  "take me back",
  "i was wrong",
  "you were right",
  "im sorry for everything",
  "i should have stayed",
  "i should have tried harder",
  "you make me so happy",
  "youre my best friend",
  "i miss my best friend",
  "i miss us",
  "what happened to us",
  "we were so good together",
  "remember when we were happy",
  "i wish things were different",
  "things could have been different",
  "i still dream about you",
  "you were my everything",
  "youre still my everything",
  "nobody compares to you",
  "i cant stop thinking about you",
  "youre always on my mind",
  "i never stopped loving you",
  "i tried to forget you",
  "i cant forget you",
  "its been years and i still care",
  "i lied when i said i was fine",
  "im not over you",
  "im not okay",
  "you broke me",
  "you ruined me",
  "i trusted you",
  "how could you",
  "you promised",
  "you lied to me",
  "i believed you",
  "i wish we never met",
  "actually no i dont regret us",
  "i would do it all again",
  "i miss your laugh",
  "i miss your voice",
  "i miss your hugs",
  "i miss your face",
  "i miss your hands",
  "i miss how you smell",
  "i miss everything about you",
  "ily",
  "ilysm",
  "ily so much it hurts",
  "i love u more then u know",
  "i love u sm",
  "love you forever",
  "always and forever",
  "forever yours",
  "youre my person",
  "please dont forget me",
  "dont forget about me",
  "remember me",
  "i wont forget you",
  "hi i miss you",
  "hey i love you",
  "hey stranger",
  "i hope you read this",
  "this is for you",
  "you know who you are",
  "happy birthday i guess",
  "merry christmas i miss you",
  "happy new years without you sucks",
  "its your birthday today and i almost texted you",
  "i almost called you today",
  "i almost texted you",
  "i typed a message and deleted it",
  "i wrote this for you",
  "youre an idiot but i love you",
  "i hate that i love you",
  "i hate that i miss you",
  "i hate how much i care",
  "why do i still care",
  "stop making me feel things",
  "get out of my head",
  "leave my dreams alone",
  "you have no right to be in my dreams",
  "i dreamt about you last night",
  "i had a dream about you",
  "you were in my dream again",
  "cant sleep thinking about you",
  "3am and im thinking about you",
  "its late and i miss you",
  "cant sleep",
  "i hate nights like this",
  "goodnight i love you",
  "good morning i wish u were here",
  "wish you were here",
  "i wish i was with you rn",
  "be safe please",
  "take care of yourself",
  "eat something today okay",
  "drink water dummy",
  "please take care of yourself",
  "i worry about you",
  "i pray for you everyday",
  "God please protect them",
  "im rooting for you always",
  "i believe in you",
  "youre gonna be okay",
  "everything will be fine",
  "you got this",
  "im here for you always",
  "ill always be here",
  "ill wait for you",
  "i would wait forever",
  "forever is a long time but id do it",
  "my heart hurts",
  "this hurts so bad",
  "crying rn",
  "im literally crying writing this",
  "lol im crying",
  "why am i like this",
  "i need to move on",
  "i need to let you go",
  "letting go is so hard",
  "i dont wanna let go",
  "i cant let go",
  "youre the one that got away",
  "wrong person wrong time",
  "right person wrong time",
  "maybe in another life",
  "see you in another life",
  "i hope i find you again",
  "find me again please",
  "we'll meet again",
  "until next time",
  "goodbye for now",
  "this isnt goodbye",
  "i dont want to say goodbye",
  "bye i love you",
  "i never got to say goodbye",
  "you left without saying goodbye",
  "you didnt even say bye",
  "i hate goodbyes",
  "i love you {N}",
  "i miss you {N}",
  "{N} i love you",
  "{N} please come back",
  "{N} im sorry",
  "hey {N} i miss you",
  "happy birthday {N}",
  "thinking of you {N}",
];
TPL.push(...SHORT);

// ──── MEDIUM DIRECT (8-18 words) ─── ~40% of total ─────────
const MEDIUM = [
  // Missing you / love
  "i miss you a lot and i love you",
  "i miss you so much and i dont know what to do about it",
  "i love you more then anything in this world",
  "i love you and i dont think ill ever stop",
  "i still think about you all the time and it makes me sad",
  "its been {T} and i still think about you",
  "is it wrong to love you like i do? i miss you alot",
  "i miss u so much more than words can say",
  "youll always have a special place in my heart",
  "youre the only person who ever made me feel like this",
  "i would give anything to talk to you one more time",
  "i just want to hear your voice one more time",
  "i wish i could hug you right now",
  "i miss you more everyday and i hate it",
  "not a day goes by where i dont think about you",
  "every day without you is harder then the last",
  "you have no idea how much you mean to me",
  "i didnt know it was possible to miss someone this much",
  "i still get butterflies when i think about you",
  "you make my heart do that stupid thing",
  "everything reminds me of you and its annoying",
  "i hear our song and i think of you everytime",
  "i still listen to the playlist you made me",
  "i kept {O} and i look at it all the time",
  "i found {O} the other day and i just started crying",
  "i drove past {P} and thought of you",
  "i went to {P} today and wished you were there",
  "i was at {P} and i swear i saw you",
  "i cant go to {P} anymore because of you",
  "every time i pass {P} i think about {T}",
  "remember {T}? i think about it all the time",
  "i still remember {T} like it was yesterday",
  "that day at {P} changed my whole life and you dont even know",
  "i remember exactly what you were wearing {T}",

  // Sorry / regret
  "im sorry for how i treated you, i really am",
  "im sorry i didnt show how i felt i ruined us",
  "i wish i tried harder for you, i wish i couldve been better",
  "im sorry for everything i put you through. you didnt deserve that",
  "i should have fought harder for us and i regret it everyday",
  "i messed up and i know it. im so sorry",
  "i was so stupid to let you go",
  "leaving you was the biggest mistake of my life",
  "i should have told you how i felt when i had the chance",
  "i regret not saying i love you when i could",
  "i took you for granted and i hate myself for it",
  "im sorry i wasnt the person you needed me to be",
  "im sorry im not the kid you wanted me to be",
  "i wish i could take back everything i said that night",
  "i didnt mean what i said i was just angry",
  "i was scared and i pushed you away. im sorry",
  "i self sabotaged the best thing that ever happened to me",
  "i was too young to know what i had. im sorry",

  // Hurt / angry
  "you ruined me with what you did and i hope you know that",
  "you hurt me and i dont think you even care",
  "you broke my heart and you didnt even notice",
  "i hope it weighs on your conscience forever",
  "you treated me like i was nothing",
  "i gave you everything and you threw it away",
  "you made me feel crazy for having normal feelings",
  "you chose everyone else over me and it destroyed me",
  "you moved on in weeks. it took me months to feel normal again",
  "you made promises you never planned to keep",
  "how do you just stop caring about someone like that",
  "you didnt even have the decency to break up with me properly",
  "i found out from someone else. do you know how that feels",
  "you pretended to love me and i actually believed you",
  "you said forever but you didnt even last the year",
  "everyone warned me about you and i didnt listen",
  "congratulations you turned me into someone i dont recognize",
  "i hope shes worth it",
  "i hope hes worth it",
  "you lost someone who actually cared about you. good luck",
  "the worst part is i still love you after everything you did",
  "you dont deserve my tears but here i am crying over you",

  // Crush / confession
  "i have crush on you and you love another girl",
  "i have the biggest crush on you and you have no idea",
  "i like you so much and i dont know what to do about it",
  "i like u. alot. more then i should probably",
  "youre so cute and you dont even know it",
  "your smile makes my whole day better",
  "i get so nervous around you its embarrassing",
  "every time you look at me i forget how to talk",
  "you looked at me {T} and my heart literally stopped",
  "i think about you way more then i should",
  "do you like me back or am i being delusional",
  "just tell me if you like me back please",
  "i wish i had the guts to tell you how i feel",
  "im so scared to tell you i like you",
  "i wrote this because i cant say it to your face",
  "i am so in love with you can you not tell",
  "i dont think ive ever liked someone the way i like you",
  "you have the prettiest eyes ive ever seen",
  "youre literally the most beautiful person i know",
  "i think youre one of the most beautiful girls ive ever seen",
  "i stare at you when youre not looking and i know thats weird",
  "every time you laugh i fall a little more",
  "sitting next to you {S} is the best part of my day",
  "i only go to {S} to see you",
  "i changed my whole schedule just to have a class with you",
  "i look for you everywhere i go",
  "you changed my whole perspective on love :)",
  "i didnt believe in love until i met you. thats so corny but its true",
  "you make me want to be a better person",

  // Friendship
  "i miss u sm, u were the coolest friend i ever had",
  "youre one of the strongest people i know and i hope you know it too. ily",
  "you ll always be my brother and i ll always love you",
  "i miss my best friend so much it hurts",
  "we used to talk every day now we dont talk at all",
  "i dont know what happened to us but i miss you",
  "you were my ride or die and now we're strangers",
  "i miss when we used to be close",
  "remember when we would stay up all night talking about nothing",
  "you were the only person who really understood me",
  "i miss having someone who actually gets me",
  "thank you for being there when no one else was",
  "you saved me and you dont even know it",
  "i wouldnt be here without you. literally",
  "youre more then a friend to me. youre family",
  "im sorry our friendship ended like that",
  "i wish we could go back to how things were",
  "i dont have friends like you anymore",

  // Family
  "i wish you could see who ive become. you'd be proud",
  "i miss you mom. every single day",
  "i miss you dad. i need your advice right now",
  "i wish you were here to see me graduate",
  "you would have loved my kids. i wish they met you",
  "i talk to you even though youre gone. i hope you hear me",
  "i light a candle for you every year. i always will",
  "happy birthday in heaven. i miss you so much",
  "i see you in everything. the sky, the flowers, the rain",
  "grandma i miss your cooking and your hugs",
  "i still hear your voice in my head giving me advice",
  "thank you for sacrificing everything for our family",
  "i wish i told you i loved you more when i had the chance",
  "im trying to make you proud. i hope im doing okay",

  // Moving on / healing
  "im happy now but sometimes i still think about you",
  "i cant shake the feeling that something is missing and i think its you",
  "im doing better but some days are still really hard",
  "i finally stopped crying over you. took me long enough",
  "i deleted your number today. it was the hardest thing ive ever done",
  "i donated your clothes last month. i cried the whole time",
  "i drove past your house and didnt stop. thats progress i guess",
  "i saw you with her today. i smiled but it hurt so bad inside",
  "i hope youre happy. i mean it even though it hurts to say",
  "im learning to be okay without you",
  "some days are good and some days i miss you so bad i cant breathe",
  "i havent talked about you in months. doesnt mean i dont think about you",
  "im finally at peace with what happened between us",
  "i dont hate you. i just wish things ended differently",
  "i forgive you but i wont forget what you did",
  "i needed to lose you to find myself",
  "you leaving was the worst and best thing that happened to me",

  // Specific / quirky
  "i still use your netflix and you havent noticed",
  "you still owe me $20 from that time at {P}",
  "i kept the receipt from our first date. its in my wallet",
  "your dog likes me more then you and we both know it",
  "you always ordered for me because you knew what i wanted",
  "you used to save me the window seat. every single time",
  "i wear your hoodie to sleep every night. dont judge me",
  "the way your gums show when you smile. i love that",
  "you always tucked my hair behind my ear and i miss that so much",
  "you used to draw little hearts on my notes. i saved all of them",
  "i still have the voicemail you left me. i play it sometimes",
  "remember when we got lost driving to the beach? best day ever",
  "i still laugh about that time we {S}",
  "that stupid inside joke we had. i still laugh about it",
  "you always made me try your food even when i didnt want to",
  "you would hate the music i listen to now lol",
  "i named a star after you. i know its cheesy but i did it",
  "i brought your favorite flowers to your grave today",
  "i still sit in your spot at {P}",

  // Gratitude / positive
  "thank you for making me feel like home even when im far from one",
  "thank you for teaching me so much about love",
  "thank you for being patient with me when i was difficult",
  "youve filled my days with so much love and joy",
  "i am so grateful for that random {T}",
  "you believed in me when i didnt believe in myself",
  "you were the first person to ever make me feel safe",
  "i wouldnt be the person i am today without you",
  "you showed me what real love looks like",
  "meeting you was the best thing that ever happened to me",
  "you made the bad days so much better just by being there",
  "i love how you always know exactly what to say",
  "you make me laugh harder then anyone else",
  "i love you with everything i have. never forget that",
  "youre the reason i smile so much",
  "everything is better when youre around",
  "i love you with sun and moon and all",

  // Uncertainty / complicated
  "i dont know what we are but i dont want to lose you",
  "are we friends or is this something more because im confused",
  "i wish you would just tell me how you feel",
  "mixed signals are killing me please just be honest",
  "one day youre all over me the next you act like i dont exist",
  "you flirt with me then act like nothing happened",
  "i dont know if you like me or if youre just being nice",
  "every time i try to move on you pull me back in",
  "stop giving me hope if youre not gonna follow through",
  "i wish you knew how confused you make me",
  "make up your mind please im begging you",
  "i cant keep being your maybe. i deserve a yes or a no",
  "youre the only person who can make me feel everything and nothing at once",

  // Self reflection
  "i wish i wasnt so difficult to love",
  "i know im alot but you handled it so well",
  "i push people away and then wonder why im alone",
  "i wish i loved myself the way you loved me",
  "i need to stop falling for people who dont care about me",
  "why do i always love the people who hurt me the most",
  "i give too much and receive nothing back and its my own fault",
  "i need to learn to put myself first for once",
  "i keep choosing the wrong people",
  "im so tired of being the one who cares more",
  "i always love harder and it always backfires",

  // Long distance / waiting
  "the distance is killing me but i would wait forever for you",
  "i cant wait to finally see you again",
  "counting down the days until i can hug you",
  "i wish you didnt live so far away",
  "facetime isnt the same as being next to you",
  "i would drive all night just to see you for five minutes",
  "one day the distance wont matter anymore",

  // Pet loss / loss
  "i miss you boy. you were the best dog anyone could ask for",
  "you were such a good girl. i miss you every day",
  "the house is so quiet without you",
  "i still look for you when i come home",
  "i kept your collar. i cant let go of it",

  // With abbreviations naturally
  "ilysm and i dont say that to just anyone",
  "ily more then you will ever know fr",
  "i love u so much it scares me sometimes",
  "ur the best thing thats ever happened to me fr fr",
  "miss u so much rn it hurts",
  "cant believe ur gone. doesnt feel real",
  "ur so beautiful and u dont even see it",
  "u deserve so much better then what i gave u",
  "i think about u literally all the time lol",
  "pls come back i miss u sm",
  "ly always no matter what",
  "ur my whole heart and u dont even know",
  "u were the coolest person ive ever met and i always looked up to u",
  "brb crying over u again",
  "nvm ill never tell u how i feel",
  "wanna be w u forever ngl",

  // Emotional dump / run-on style
  "i miss you, i still feel you on my skin, i dont want you to move on from me ever",
  "i love you so much, im sorry im so scared, but i want to be with you for as long as possible",
  "im sorry for how ive treated you, ill always love you more then anything even if i dont show it",
  "im happy now but i cant shake the feeling that something is missing and i think its you",
  "a day hasnt gone by when i havent thought about you, and im terrified one never will",
  "i wish you knew how i felt, i want to move on but ilysm",
  "i cant wait to finally move into our own place and finally start our life together",
  "i still think youre one of the most beautiful girls ive ever seen. i really loved you back then",
  "even though we dont talk anymore, i still remember your voice in my heart",
  "everything was real. everything IS real, at least still for me",
  "you were my first and only true love. i wish you would have listened",
  "using your favorite color. i miss you. youve moved on and i can tell, and im happy for you",
  "i love you so much more then youll ever know and i hope one day i can tell you that",
  "thank you for teaching me so much, ill love you always even if youre not in my life anymore",
  "youve filled my days with so much love and joy i cant imagine one without you in it. forever yours",
  "i miss you so much even though i shouldnt and i know it wasnt the right time for us",
  "im sorry i didnt show how i felt, i ruined us and youve moved on while i still love you",
  "you were my first and so far the only person i feel safe with",
  "i love you so much it scares me, i dont want to lose you, please dont leave me",
  "everything is going to be fine! trust and breathe. you got this",

  // With name in message
  "i miss you so much {N} please come home",
  "{N} im yearning for you. i hope you will change ur mind someday",
  "sure i like him alot but {N} i LOVE you",
  "hey {N}! i hope the best for you! good luck with everything in life <3",
  "{N} you are my world and i love you more than anything",
  "happy birthday {N}!! i hope all your wishes come true. love you always",
  "i miss you {N}. every day gets harder without you",
  "{N} please talk to me. i cant take the silence anymore",
  "dear {N}, i never got to tell you how much you mean to me",
  "to {N}: you changed my life. thank you",
  "{N} if youre reading this just know i still love you",
  "i still love you {N} and i probably always will",
  "thinking about you today {N}. hope youre doing okay",
  "{N} im so proud of you. you have no idea",
  "miss u {N} <3",
  "{N} you deserve the whole world and more",

  // ALL CAPS excited / emotional (will be uppercased in generation)
  "BESTIE I LOVE YOU SO MUCH NEVER CHANGE",
  "I MISS YOU SO MUCH IT HURTS",
  "YOU ARE THE BEST PERSON IVE EVER MET",
  "WHY DID YOU LEAVE ME",
  "COME BACK PLEASE I NEED YOU",
  "I LOVE YOU I LOVE YOU I LOVE YOU",
  "YOURE SO BEAUTIFUL AND IM SO MAD ABOUT IT",
  "IM SO PROUD OF YOU",
  "HAPPY BIRTHDAY I LOVE YOU SO MUCH",
  "I CANT BELIEVE YOU DID THAT TO ME",
  "STOP BEING SO PERFECT ITS NOT FAIR",
  "I LITERALLY CANNOT STOP THINKING ABOUT YOU",
  "BESTIEEE ILYSM YOURE THE BEST THING IN MY LIFE",
  "IM SO IN LOVE WITH YOU ITS EMBARRASSING",
  "YOURE MY FAVORITE PERSON IN THE WHOLE WORLD",
];
TPL.push(...MEDIUM);

// ──── LONGER RAW MESSAGES (15-25 words) ─── ~25% ──────────
const LONGER = [
  "i had a dream about you for the first time in ages. i was surprised because its been so long",
  "you hurt me. your love for me was never real, i was too young and naive to realise it",
  "i wish we could meet again for the first time",
  "you ll always be my brother and i ll always ly. im sorry our friendship ended like this",
  "the days we used to spend together are burnt into my memory as some of the happiest",
  "i hope you knew. what you did shattered my heart. it haunts me everyday",
  "your smile is cute. the way your gums show when you laugh. i miss you so much",
  "i would have loved to have a nap with you on the couch. thats all i wanted",
  "thank you for making me feel home even when im far from one. i love you with everything",
  "i dont know if you remember me but you literally changed my whole life without even trying",
  "remember that time at {P}? i replay it in my head like a movie i cant stop watching",
  "i saw you at {P} the other day and my heart dropped. you looked happy. im glad",
  "i keep your picture in my phone and i look at it when i miss you which is always",
  "you deserve someone who loves you out loud. im sorry i could only love you in secret",
  "i know you probably dont care anymore but i think about you every single day without fail",
  "the hardest part isnt losing you its pretending it doesnt hurt every time someone says your name",
  "you probably forgot about me by now and honestly thats okay. i just hope you know i cared",
  "i wrote you so many letters i never sent. this is the closest ill ever get to sending one",
  "im sorry i couldnt be what you needed. i tried so hard but it wasnt enough",
  "i catch myself almost telling people about you and then i remember were not friends anymore",
  "i still check your social media even though i know i shouldnt. old habits i guess",
  "you were the only person who could make me feel better without even saying anything",
  "i loved you in a way i didnt think i was capable of. you showed me i could feel that",
  "if i could go back to {T} i would do everything different. i would hold on tighter",
  "the worst part about losing you is that the world kept going like nothing happened",
  "i kept everything you ever gave me. every note, every gift, every stupid little thing",
  "people ask me why im single and i cant exactly say because im still in love with someone else",
  "you walked out of my life like it was easy and i spent months trying to figure out what i did wrong",
  "i think the reason i cant move on is because we never really got a proper ending",
  "i pray for you every night. i dont even know if you believe in that stuff but i do it anyway",
  "you were the first person i ever truly loved and no matter what happens you always will be",
  "i see couples doing normal things and i think about how that couldve been us",
  "im not mad at you anymore. im just sad. and tired. and i miss you",
  "the fact that you exist in the same city as me and i cant see you is crazy",
  "you made me feel insane for having completely normal feelings and i hate you for that",
  "i pretend im okay when people ask about you but honestly im still a mess",
  "i wonder if you know how many times i almost reached out. i always chicken out at the last second",
  "you were my safe place and when you left i didnt know where to go",
  "i miss the version of me that existed when i was with you. she was happier",
  "i miss the version of us that existed before everything got complicated",
  "sometimes i type your name into my phone just to look at our old conversations",
  "you taught me that love isnt always enough and thats the saddest lesson ive ever learned",
  "i think about what you said to me {T} and it still hurts just as much as it did then",
  "i miss sitting with you doing nothing. those were some of the best moments of my life",
  "i stopped going to {P} because its ours and going alone feels wrong",
  "i found {O} while cleaning my room and i just sat there and cried for like twenty minutes",
  "the last time i saw you you were wearing that green jacket. i think about it alot",
  "i picked up the phone so many times today but i never pressed call",
  "i wish i could tell you how proud i am of who youve become. youve grown so much",
  "you asked if i was okay and i said yes. that was the biggest lie of my life",
  "i never told you this but i cried the whole drive home after you left",
  "im starting to forget the sound of your laugh and it scares me more then anything",
  "you always walked me home even when it was out of your way. no one does that anymore",
  "i saved the last text you sent me. it just says goodnight. i read it all the time",
  "i lied when i said i dont love you anymore. i just said it because i was tired of getting hurt",
  "some nights i still reach for you in my sleep and wake up to an empty bed",
  "i want to hate you so bad but every time i try i just end up missing you more",
  "i told everyone i was over you. i even almost believed it myself. but i lied",
  "you were the first person i wanted to call when something good happened and now i cant",
  "i keep finding excuses to bring up your name in conversation and its pathetic honestly",
  "you made me feel like the most important person in the world and then you just stopped",
  "i sometimes wonder what would happen if i just showed up at your door. would you let me in",
  "i know its over between us but my heart didnt get the message",
  "you promised you would never leave and i was dumb enough to believe it",
  "im doing everything you said i couldnt. i wish you could see me now",
  "you were my favorite hello and my hardest goodbye",
  "i love you and i hate you and i miss you all at the same time and its exhausting",
  "the truth is i think about you way more then i should and way more then youll ever know",
  "remember when you said youd always be there? yeah me too",
  "i have so much i want to say to you but i know none of it matters anymore",
  "you are the one person i compare everyone else to and nobody ever comes close",
  "i think about our last conversation alot. i wish id said something different",
  "the worst part is i cant even be mad because the time we had together was so good",
  "i hope one day you realize what you had. not for my sake but for yours",
  "you didnt just break my heart you broke my ability to trust anyone after you",
  "i miss being able to tell you everything. you were the only person who ever listened for real",
  "i know we cant go back to what we had but god i wish we could",
  "every time i hear our song i have to change it or ill cry in public like an idiot",
];
TPL.push(...LONGER);

console.log(`Total templates: ${TPL.length}`);

// ─── DETAIL INJECTION ───────────────────────────────────────
function injectDetails(msg) {
  let s = msg;
  if (s.includes('{P}')) s = s.replace('{P}', R(PLACES));
  if (s.includes('{T}')) s = s.replace('{T}', R(TIMES));
  if (s.includes('{O}')) s = s.replace('{O}', R(OBJECTS));
  if (s.includes('{S}')) s = s.replace('{S}', R(SCHOOL_WORK));
  // {N} is handled separately in generation — inject recipient name
  return s;
}

// ─── LIGHT VARIATION ────────────────────────────────────────
// Unlike v2, this does NOT do heavy synonym replacement.
// Just light tweaks that real humans naturally vary.

const LIGHT_SWAPS = [
  [/\byou\b/g, 'u'],
  [/\byour\b/g, 'ur'],
  [/\bare\b/g, 'r'],
  [/\bplease\b/g, 'pls'],
  [/\bprobably\b/g, 'prolly'],
  [/\bbecause\b/g, 'bc'],
  [/\bbecause\b/g, 'cuz'],
  [/\bthough\b/g, 'tho'],
  [/\bthrough\b/g, 'thru'],
  [/\bpeople\b/g, 'ppl'],
  [/\bwithout\b/g, 'w/o'],
  [/\bwith\b/g, 'w'],
  [/\bright now\b/g, 'rn'],
  [/\bto be honest\b/g, 'tbh'],
  [/\bfor real\b/g, 'fr'],
  [/\bi dont know\b/g, 'idk'],
  [/\bi love you\b/g, 'ily'],
  [/\bi love you so much\b/g, 'ilysm'],
  [/\blove you\b/g, 'ly'],
  [/\bso much\b/g, 'sm'],
  [/\bwant to\b/g, 'wanna'],
  [/\bgoing to\b/g, 'gonna'],
  [/\bgot to\b/g, 'gotta'],
  [/\bkind of\b/g, 'kinda'],
  [/\bsort of\b/g, 'sorta'],
];

function applyLightAbbrevs(msg) {
  // Only apply 0-2 swaps randomly, not all at once
  const numSwaps = Math.floor(rand() * 3);
  let s = msg;
  for (let i = 0; i < numSwaps; i++) {
    const [pattern, replacement] = R(LIGHT_SWAPS);
    if (rand() < 0.4) {
      s = s.replace(pattern, replacement);
    }
  }
  return s;
}

// ─── CASING ─────────────────────────────────────────────────
function applyCasing(msg) {
  const r = rand();
  if (r < 0.65) return msg.toLowerCase(); // most are lowercase
  if (r < 0.85) {
    // Sentence case — capitalize first letter only
    return msg.charAt(0).toUpperCase() + msg.slice(1).toLowerCase();
  }
  if (r < 0.92) {
    // Mixed — capitalize first letter of each sentence
    return msg.replace(/(^|[.!?]\s+)([a-z])/g, (_, pre, c) => pre + c.toUpperCase());
  }
  // ~8% ALL CAPS for excited/emotional messages
  return msg.toUpperCase();
}

// ─── PUNCTUATION TWEAKS ─────────────────────────────────────
function tweakPunctuation(msg) {
  let s = msg;
  const r = rand();

  // Sometimes add emoticons
  if (r < 0.04) s = s + ' <3';
  else if (r < 0.07) s = s + ' :(';
  else if (r < 0.09) s = s + ' :)';
  else if (r < 0.10) s = s + ' </3';
  else if (r < 0.11) s = s + ' x';
  else if (r < 0.12) s = s + ' lol';
  else if (r < 0.13) s = s + ' haha';
  else if (r < 0.135) s = s + ' :/';
  else if (r < 0.14) s = s + ' :33';

  // Sometimes strip trailing period for casualness
  if (rand() < 0.3 && s.endsWith('.')) s = s.slice(0, -1);

  // Sometimes add multiple periods
  if (rand() < 0.05 && !s.endsWith('..')) s = s + '..';
  
  // Sometimes add exclamation
  if (rand() < 0.03 && !s.endsWith('!')) s = s + '!';

  return s;
}

// ─── NATURAL TAILS ──────────────────────────────────────────
const TAILS = [
  '. always','. forever','. i mean it','. please',
  '. i swear','. truly','. somehow','. always and forever',
  '. no matter what','. thats all','. yeah','. idk',
  '. whatever','. its fine','. i guess','. but still',
  '. honestly','. seriously','. for real',
];
function maybeTail(msg) {
  if (rand() < 0.04) return msg + R(TAILS);
  return msg;
}

// ─── NEAR-DUPLICATE DETECTION ───────────────────────────────
function tokenize(msg) {
  return msg.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 0);
}

function jaccard(tokA, tokB) {
  const a = new Set(tokA);
  const b = new Set(tokB);
  let inter = 0;
  for (const w of a) { if (b.has(w)) inter++; }
  return inter / (a.size + b.size - inter);
}

// ─── MAIN GENERATION ─────────────────────────────────────────
function generatePool() {
  const usedMessages = new Set();
  const nameUsage = {};
  const MAX_NAME_USAGE = 8;
  const pool = [];
  
  // Track structural patterns (first 3 words)
  const openingPatterns = {};
  const MAX_PATTERN_USAGE = 15;
  
  // Keep recent tokenizations for near-dup detection
  const recentTokens = [];
  const WINDOW_SIZE = 100;
  const MAX_SIMILARITY = 0.70;

  function pickName() {
    for (let i = 0; i < 50; i++) {
      const name = R(UNIQUE_NAMES);
      if ((nameUsage[name] || 0) < MAX_NAME_USAGE) return name;
    }
    const avail = UNIQUE_NAMES.filter(n => (nameUsage[n] || 0) < MAX_NAME_USAGE);
    return avail.length > 0 ? R(avail) : R(UNIQUE_NAMES);
  }

  function tryAdd(msg, forceName) {
    msg = clean(msg);
    const words = wc(msg);
    if (words > 25 || msg.length > 250) return false;
    if (words < 2 || msg.length < 5) return false;

    const key = msg.toLowerCase().trim();
    if (usedMessages.has(key)) return false;

    // Structural diversity check
    const tokens = tokenize(msg);
    const pattern = tokens.slice(0, 3).join(' ');
    if ((openingPatterns[pattern] || 0) >= MAX_PATTERN_USAGE) return false;

    // Near-duplicate check against recent messages
    for (const recent of recentTokens) {
      if (jaccard(tokens, recent) > MAX_SIMILARITY) return false;
    }

    // All checks passed — add it
    usedMessages.add(key);
    openingPatterns[pattern] = (openingPatterns[pattern] || 0) + 1;

    // Update sliding window
    recentTokens.push(tokens);
    if (recentTokens.length > WINDOW_SIZE) recentTokens.shift();

    const name = forceName || pickName();
    nameUsage[name] = (nameUsage[name] || 0) + 1;

    pool.push({
      name,
      message: msg,
      color_id: R(CARD_COLORS),
    });
    return true;
  }

  // Helper to process a template: inject name + details
  function processTemplate(tpl) {
    const name = pickName();
    const hasName = tpl.includes('{N}');
    let msg = hasName ? tpl.replace(/\{N\}/g, name) : tpl;
    msg = injectDetails(msg); // always inject {P},{T},{O},{S}
    return { msg, name, hasName };
  }

  // Phase 1: Use each template once with detail injection
  console.log('Phase 1: Original templates...');
  const shuffled1 = [...TPL].sort(() => rand() - 0.5);
  for (const tpl of shuffled1) {
    let { msg, name, hasName } = processTemplate(tpl);
    msg = applyCasing(msg);
    msg = tweakPunctuation(msg);
    tryAdd(msg, hasName ? name : undefined);
  }
  console.log(`  After Phase 1: ${pool.length} entries`);

  // Phase 2: Variations — re-inject details + light abbreviations
  console.log('Phase 2: Variations...');
  let attempts = 0;
  let lastLog = 0;
  const maxAttempts = 500000;
  while (pool.length < 7000 && attempts < maxAttempts) {
    attempts++;
    const tpl = R(TPL);
    let { msg, name, hasName } = processTemplate(tpl);
    msg = applyLightAbbrevs(msg);
    msg = applyCasing(msg);
    msg = tweakPunctuation(msg);
    msg = maybeTail(msg);
    tryAdd(msg, hasName ? name : undefined);
    
    if (pool.length >= lastLog + 1000) {
      lastLog = pool.length;
      console.log(`  Phase 2: ${pool.length} entries (${attempts} attempts)`);
    }
  }
  console.log(`  After Phase 2: ${pool.length} entries (${attempts} attempts)`);

  // Phase 3: Compose simple opener + closer fragments
  // These are deliberately SIMPLE and DIRECT — no poetry
  console.log('Phase 3: Simple composing...');
  
  const SIMPLE_STARTS = [
    "i miss you","i love you","im sorry","i still think about you",
    "you mean everything to me","i wish you stayed","i hope youre happy",
    "i cant stop thinking about you","i should have told you",
    "i forgive you","you hurt me","i trusted you",
    "i wish things were different","you were my best friend",
    "you broke my heart","i hope you know","i was wrong",
    "i need you to know","i wish i said something",
    "i still care about you","you deserve better",
    "i never forgot you","i dream about you",
    "nobody compares to you","you changed me",
    "i still love you","i cant forget you",
    "i want you back","you were everything to me",
    "i miss your laugh","i miss your voice",
    "i think about you everyday","please come back",
    "i loved you so much","i still do","you were my person",
    "i miss us","im not over you","i lied when i said i was fine",
    "youre always on my mind","i need you",
    "i miss you sm","i love u","i hate that i still care",
    "i miss how things were","you made me happy",
    "i gave you everything","you left me","you promised me",
    "i waited for you","i believed in us","i tried my best",
    "i couldnt save us","i wanted to stay","you walked away",
    "i think you were the one","i never stopped caring",
    "i kept everything you gave me","i still wear {O}",
    "i cant go to {P} anymore","i still remember {T}",
    "i drove past {P} today","i found {O} yesterday",
    "i heard our song today","remember {T}",
  ];

  const SIMPLE_ENDS = [
    "and i probably always will","but i was too scared to say it",
    "and it hurts every single day","more then youll ever know",
    "and i think thats okay","but its too late now",
    "even after everything","and i dont know what to do about it",
    "and im tired of pretending im fine","but the timing was never right",
    "but i cant do anything about it","and i hate it",
    "even tho you dont care anymore","and i probably shouldnt",
    "but i dont regret anything","and im scared ill never stop",
    "and i wish you knew","but i cant tell you",
    "and it still hurts","but life goes on i guess",
    "and its killing me","but i have to let go",
    "more then anyone ever will","and i hope you know that",
    "but i couldnt say it to your face","even when i try not to",
    "and i dont think that will ever change","but you moved on already",
    "and i just needed to say it somewhere","and thats okay",
    "but im learning to be okay with it","and i think about it all the time",
    "and im okay with that","but it still stings sometimes",
    "and i just want you to know","even if it doesnt matter anymore",
    "and i wish i could change it","but i cant keep waiting",
    "and i hope youre happy. i really do","but i miss what we had",
    "and im finally starting to accept it","even if you forgot about me",
    "and i cried about it yesterday","but im getting better i think",
    "and some days are worse then others","but today was a bad day",
    "so yeah. thats that","and i needed to get that off my chest",
    "and im done pretending otherwise","and i just wanna say thank you",
  ];

  attempts = 0;
  lastLog = pool.length;
  const maxPhase3 = 800000;
  while (pool.length < 9500 && attempts < maxPhase3) {
    attempts++;
    const start = R(SIMPLE_STARTS);
    const end = R(SIMPLE_ENDS);
    let msg = `${start} ${end}`;
    msg = injectDetails(msg);
    msg = applyLightAbbrevs(msg);
    msg = applyCasing(msg);
    msg = tweakPunctuation(msg);
    tryAdd(msg);
    
    if (pool.length >= lastLog + 500) {
      lastLog = pool.length;
      console.log(`  Phase 3: ${pool.length} entries (${attempts} attempts)`);
    }
  }
  console.log(`  After Phase 3: ${pool.length} entries (${attempts} attempts)`);

  // Phase 4: Fill remaining with double-varied templates
  if (pool.length < 10000) {
    console.log('Phase 4: Final fill...');
    attempts = 0;
    lastLog = pool.length;
    const maxPhase4 = 500000;
    while (pool.length < 10000 && attempts < maxPhase4) {
      attempts++;
      const tpl = R(TPL);
      let { msg, name, hasName } = processTemplate(tpl);
      msg = applyLightAbbrevs(msg);
      msg = applyLightAbbrevs(msg); // double abbreviation pass
      msg = applyCasing(msg);
      msg = tweakPunctuation(msg);
      msg = maybeTail(msg);
      tryAdd(msg, hasName ? name : undefined);
      if (pool.length >= lastLog + 500) {
        lastLog = pool.length;
        console.log(`  Phase 4: ${pool.length} entries (${attempts} attempts)`);
      }
    }
    console.log(`  After Phase 4: ${pool.length} entries (${attempts} attempts)`);
  }

  // Final shuffle
  pool.sort(() => rand() - 0.5);
  return pool;
}

// ─── VALIDATION ──────────────────────────────────────────────
function validate(pool) {
  const NAME_REGEX = /^[a-zA-Z\s'\-]+$/;
  let errors = 0;

  const messageSet = new Set();
  const nameCount = {};
  
  for (let i = 0; i < pool.length; i++) {
    const entry = pool[i];

    if (!NAME_REGEX.test(entry.name)) {
      console.error(`[${i}] Invalid name: "${entry.name}"`);
      errors++;
    }

    const words = wc(entry.message);
    if (words > 25) {
      console.error(`[${i}] Too many words (${words}): "${entry.message}"`);
      errors++;
    }
    if (words < 1) {
      console.error(`[${i}] Empty message`);
      errors++;
    }
    if (entry.message.length > 250) {
      console.error(`[${i}] Too many chars (${entry.message.length})`);
      errors++;
    }

    if (!CARD_COLORS.includes(entry.color_id)) {
      console.error(`[${i}] Invalid color: "${entry.color_id}"`);
      errors++;
    }

    const key = entry.message.toLowerCase().trim();
    if (messageSet.has(key)) {
      console.error(`[${i}] Duplicate: "${entry.message.substring(0, 50)}..."`);
      errors++;
    }
    messageSet.add(key);

    nameCount[entry.name] = (nameCount[entry.name] || 0) + 1;
  }

  // Check name usage
  const overused = Object.entries(nameCount).filter(([, c]) => c > 8);
  if (overused.length > 0) {
    console.error(`Names used >8 times: ${overused.map(([n, c]) => `${n}(${c})`).join(', ')}`);
    errors += overused.length;
  }

  return errors;
}

// ─── RUN ─────────────────────────────────────────────────────
console.log('Generating 10,000 unique human-like messages (v3)...\n');
const pool = generatePool();

console.log(`\nValidating ${pool.length} entries...`);
const errors = validate(pool);

if (errors > 0) {
  console.error(`\n❌ ${errors} validation errors found!`);
  process.exit(1);
}

if (pool.length < 10000) {
  console.warn(`\n⚠ Only generated ${pool.length} entries (target: 10,000)`);
  console.warn('Consider adding more templates or expanding detail pools.');
}

console.log(`\n✅ ${pool.length} entries generated and validated!`);

// Write to file
const outPath = join(__dirname, 'seed-messages.json');
writeFileSync(outPath, JSON.stringify(pool, null, 2));
console.log(`Written to: ${outPath}`);

// Stats
const colorDist = {};
CARD_COLORS.forEach(c => colorDist[c] = 0);
pool.forEach(e => colorDist[e.color_id]++);
console.log('\nColor distribution:');
Object.entries(colorDist).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => {
  console.log(`  ${c}: ${n} (${(n / pool.length * 100).toFixed(1)}%)`);
});

const lcCount = pool.filter(e => e.message === e.message.toLowerCase()).length;
console.log(`\nCasing: ${lcCount} lowercase (${(lcCount / pool.length * 100).toFixed(1)}%), ${pool.length - lcCount} mixed/caps`);

const avgWords = pool.reduce((sum, e) => sum + wc(e.message), 0) / pool.length;
console.log(`Average word count: ${avgWords.toFixed(1)}`);

const nameUsed = new Set(pool.map(e => e.name)).size;
console.log(`Unique names used: ${nameUsed}`);

// Opening pattern diversity
const patterns = {};
pool.forEach(e => {
  const p = tokenize(e.message).slice(0, 3).join(' ');
  patterns[p] = (patterns[p] || 0) + 1;
});
const topPatterns = Object.entries(patterns).sort((a, b) => b[1] - a[1]).slice(0, 10);
console.log('\nTop 10 opening patterns:');
topPatterns.forEach(([p, n]) => console.log(`  "${p}": ${n}`));
