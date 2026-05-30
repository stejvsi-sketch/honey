#!/usr/bin/env node
// =============================================================
// generate-messages.mjs  (v4 — hand-crafted from 200+ real screenshots)
//
// Every template is a COMPLETE self-contained human thought.
// NO random tails. NO random emoticon injection. NO combiners.
// Each message has its own casing, punctuation, and style built in.
//
// 🧹 CLEANUP (after ~4 months / Oct 2026):
//   Delete: this file, seed-messages.json, seed-submissions.mjs,
//           .github/workflows/seed-submissions.yml
//   Remove GitHub Secrets: SUPABASE_SERVICE_ROLE_KEY
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

function R(a){return a[Math.floor(Math.random()*a.length)]}
function wc(s){return s.split(/\s+/).filter(w=>w.length>0).length}

// ─── 1700+ INTERNATIONAL NAMES ─────────────────────────────
const NAMES=[
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
  'Gelo','Mark','Jayden','Rafael','Jerome','Francis','Enzo','Darren','Gabriel',
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
  'Jimin','Minho','Jungkook','Taehyung','Seojun','Jaehyun','Donghyuk','Sunwoo','Woojin','Hyun',
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
  'Hugo','Louis','Raphael','Jules','Antoine','Pierre','Maxime','Alexandre','Nicolas',
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
  'Chioma','Akosua','Aminata','Fatou','Nkechi','Ayana','Binta','Chiamaka','Dahlia','Efua',
  'Folake','Gifty','Hadiza','Iyabo','Jamila','Keza','Lira','Makena','Nandi','Omolara',
  'Palesa','Rashida','Sade','Temi','Uju','Wangari','Yetunde','Zanele','Chinwe',
  'Thiago','Gustavo','Bruno','Felipe','Leonardo','Guilherme','Caio','Vitor','Pedro','Henrique',
  'Arthur','Bernardo','Eduardo','Igor','Joao','Kaique','Luan','Matheus',
  'Otavio','Paulo','Samuel','Tiago','Vinicius','Wagner','Yago',
  'Larissa','Amanda','Juliana','Leticia','Bruna','Isabela','Rafaela',
  'Flavia','Helena','Ingrid','Jessica','Kelly',
  'Livia','Marina','Patricia','Renata','Sabrina','Tatiana','Vanessa','Aline',
  'Nikolai','Mikhail','Dmitri','Sergei','Aleksei','Andrei','Maxim','Viktor','Boris',
  'Anton','Bogdan','Cyril','Denis','Evgeni','Fyodor','Grigori','Igor','Kirill','Leonid',
  'Matvei','Oleg','Pavel','Roman','Stanislav','Timur','Vadim','Vladislav','Yaroslav','Zakhar',
  'Anya','Katya','Natasha','Olga','Mila','Irina','Daria','Svetlana','Polina','Vera',
  'Alina','Anastasia','Ekaterina','Galina','Ksenia','Lada',
  'Tatiana','Yelena','Zoya','Larisa','Tamara','Raisa',
  'Erik','Lars','Sven','Axel','Magnus','Nils','Leif','Bjorn','Odin','Gunnar',
  'Anders','Emil','Filip','Gustaf','Henrik','Johan','Karl','Lukas','Niklas',
  'Oskar','Per','Rasmus','Sigurd','Torsten','Ulrik','Wilhelm','Arne','Dag',
  'Freya','Astrid','Ingrid','Saga','Elsa','Sigrid','Linnea','Thea','Maja','Liv',
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
  'Athena','Katerina','Daphne','Irene','Penelope','Thalia','Zoe',
  'Ariadne','Calliope','Demetra','Evangelia','Fotini','Ioanna','Konstantina',
  'Jakub','Mateusz','Szymon','Kacper','Wojciech','Bartek','Dawid','Piotr','Tomasz',
  'Aleksander','Bartosz','Cezary','Grzegorz','Hubert','Jan','Konrad',
  'Zuzanna','Lena','Julia','Maja','Hanna','Aleksandra','Wiktoria','Oliwia',
  'Agnieszka','Barbara','Celina','Dorota','Ewa','Izabela','Karolina','Magdalena','Patrycja',
  'Arash','Darius','Farhad','Kaveh','Mehdi','Navid','Omid','Reza','Saman','Behnam',
  'Cyrus','Ehsan','Hossein','Iman','Javad','Kian','Milad','Nima','Payam',
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
const UNAMES=[...new Set(NAMES)];

// ═══════════════════════════════════════════════════════════════
// TEMPLATES — each one is a COMPLETE self-contained human thought
// {N} = name placeholder (replaced with recipient name)
// Every template has its own casing/style built in. NO post-processing.
// ═══════════════════════════════════════════════════════════════
const TPL = [

// ─── CRUSH / CONFESSION (unique situations) ──────────────────
"do you think about me like I'm thinking about you?",
"Can you PLEASE just ask me out I have a stupid fat crush on you",
"I like like you and I hope you like like me too.. I can't tell",
"If I wasnt scared I would ask you out. You make my day every time I see you",
"i changed my whole schedule just to have one class with you",
"every time you walk past me my heart does this stupid thing and I hate it",
"I stare at you during class and I know thats weird but I literally cant stop",
"I like you!!!!! Super much!!!!",
"Do you really know how much I luv you?",
"if I were a girl, would you have said yes?",
"i could never admit it bc of who i am.. but i love u so much it hurts me",
"I'm afraid when I'm finally worthy of you, you will have moved on",
"I want to text you but I know you won't answer",
"the way you laugh makes my whole week better and you dont even realize",
"sitting next to you is the best part of my entire day and you have no idea",
"my friends are so tired of hearing about you but i cant help it",
"I get butterflies when I see your name pop up on my screen",
"you were wearing that blue jacket today and I swear my brain stopped working",
"im literally in love with someone who doesnt know i exist",
"I know we could be soulmates if you liked me the way i like you",
"things are so new but i think i love you",
"I wish that I could tell you just how much I like you",
"I'm falling in love with you and it scares me so much",
"i wrote your name in my notebook like 50 times today and im so embarrassed",
"I think about asking you out every single day and chicken out every single time",
"you smiled at me in the hallway today and I literally could not breathe",
"I have the biggest crush on you and you have absolutely no idea",
"i practiced what id say to you in front of my mirror. i am so pathetic",
"I added you on spotify just to see what you listen to",
"{N} I have a crush on you and I'm terrified to say it out loud",
"you make me so nervous I literally forget how to talk",
"I like you so much it physically hurts. what do I even do with that",
"I have been loving you from the depths of my soul knowing you will not love me back",
"I still look at ur old pinterest acc. it hurts to not have you when I pushed you",
"every time I see a cup of chai it reminds me of you. I started drinking chai. Still don't like it",
"I think of you in opera music, in picnics, and in big cities. In the color pink, I love you",
"you consume my thoughts and feelings every day I need you so bad it hurts",
"i keep saving your instagram stories and going back to look at them",
"I drew pictures of you that I will prob never send",
"I pray for you every night before I sleep, cuz I love you",
"you are the answer to all my desperate pleas of love. to god. I must say the BEST one",
"i literally cannot focus on anything when you're in the room",
"I still think about you everyday & I still Love You, I'd drop everything just to be with you again",
"I'm so scared of telling you because what if it ruins everything",
"i swear every love song on the radio is about you",
"the seat next to you in math is the only reason I go to that class",
"i screenshot all your texts so i can read them again later",
"you dont know this but youre the reason I smile before I go to sleep",
"my heart races when I see you online and thats so embarrassing to admit",

// ─── MISSING SOMEONE (specific situations) ───────────────────
"I miss you so much. Come back soon",
"i miss you more than words can express, you are the love of my life",
"I miss you every day and I hope your songs make it",
"still thinking of you",
"i miss you so much and i know we dont talk but somtimes i wish we worked out...",
"it feels like theres a hole in my life where you used to be",
"I was reading our old texts, wondering what happened. Pls tell me if you're not okay",
"i think about you every single morning when I wake up and thats not an exaggeration",
"I keep your picture in my phone and look at it when i miss you which is always",
"sometimes I type your name into my phone just to look at our old conversations",
"I miss the version of us that existed before everything got complicated",
"the house feels so empty without you. even the dog waits by the door",
"i found your old hoodie in the back of my closet and I cried for like 20 minutes",
"I drove past your house today. your car was there but I kept driving",
"miss u bro",
"i miss having someone who actually gets me",
"i thought of u today after years and now I'm a bit sad, wondering what you became",
"I miss the person you were 10 years ago, I tried to make things right but u aint u anymore",
"You've been in my dreams a lot recently. Am I in yours? Do you miss me like I miss you?",
"I cant go to that coffee shop anymore without thinking about you",
"i love having special names for you. my man in every language. i miss you every summer",
"I miss you so much my pretty boy",
"the door will always be open handsome <3 i will forever miss you",
"I still check your social media even though i know i shouldnt. old habits i guess",
"you will never know how much i love you",
"i miss our late night phone calls where we would talk about absolutely nothing",
"your side of the bed is still empty. I dont let anyone sit there",
"I miss you big time :( you deserve so much better, i would give you the world",
"everything reminds me of you and its exhausting honestly",
"I miss my best friend",
"I miss our friendship. I still don't know what I did wrong",
"I still wear your old t shirt to bed every night. its falling apart but i wont throw it away",
"i miss the sound of your laugh more than anything else in the world",
"i heard our song at the grocery store today and had to leave",
"I miss you. not the you from now. the you from back then. when things were good",
"I miss who i was when i was with you",
"I still make enough food for two and then remember you're not coming",
"sometimes i catch myself about to text you and then i remember",
"I saved every voicemail you ever left me. i play them when I cant sleep",

// ─── HEARTBREAK / BREAKUP (real situations) ──────────────────
"you hurt me so bad and my life's good now but if you ever need a friend I'm here. Always",
"I'm not mad at you for ending it, but the way you ended it, the way you just left me standing",
"She ruined the version of u that I fell in love with. You will regret it all, and I won't be there",
"I don't think I'll ever love you the same way and finally I am healing but you'll always be special",
"I know its over, and it never really began, but in my heart it was so real",
"you'll forever be in my heart, even if I'm barely in yours",
"you broke my heart and you didnt even notice",
"the worst part is I saw it coming and I stayed anyway",
"I loved you more than you will ever know and you threw it all away for her",
"we were so good together and you destroyed it for nothing",
"I still cant listen to that playlist without crying",
"you chose her and I have to live with that every single day",
"it hurts knowing I gave you everything and it still wasn't enough",
"I cant believe you told everyone what I told you in private. that was just for us",
"you walked out of my life like it was easy and I spent months trying to figure out what I did wrong",
"I dont hate you but I wish I could because it would make this so much easier",
"you made me feel like I was nothing and it took me so long to realize I was everything",
"it took losing you to realize what I had. and now its too late",
"the day you stopped texting back is the day something in me broke",
"you promised you would never leave. you promised",
"I hope one day you feel what you made me feel",
"you were my first love and you ruined me for everyone else",
"I still flinch when someone raises their voice because of you",
"you left without even saying goodbye and I have to pretend im fine about it",
"I keep wondering if any of it was ever real to you",
"the hardest part isn't losing you. its pretending I'm okay around everyone who knew us",
"I trusted you with everything and you used it against me",
"you replaced me so fast like I was nothing",
"I used to think we were a love story. now I know I was just a chapter you skipped",
"it still hurts when I see you happy with someone else but I would never tell you that",
"Ik you didn't love me but I did I loved u so much but I can't love you anymore",
"you said you needed space and then you gave your time to everyone except me",
"i gave you my whole heart and you handed it back in pieces",
"the last thing you said to me replays in my head every single night",

// ─── FRIENDSHIP (diverse situations) ─────────────────────────
"you're my best friend. i hope i'm yours too!!",
"You're my bestest friend ever forever and I wished you never moved. Love you forever",
"hope our friendship lasts, even if we are not going to the same school, you will allways be my bff",
"I'm glad I met you. You are the most beautiful woman I have ever met",
"You are the most coolest person. Thank you for being my friend",
"I know we're best friends, but I like you. From the core of my heart, I want it to be you. Always",
"You are my best friend, I love you very much and I don't tell you often enough",
"I hope u don't think that I'm annoying, because I genuinely like being your friend..",
"I'm going to miss you, I hope youre going to be okay at your new school",
"Heyyy girl, you will never be alone again! I promise, and I'm sorry for all the missed hangouts",
"I think about you and our friendship a lot, I wonder if you think about us ever. You were special",
"my twin I love you with all my heart, I believe I will never meet someone who gets me like you do",
"I wish we never stopped being friends. you were the only one who really knew me",
"thank you for introducing me to your kind of music and the movies and the people",
"you were my only real friend in that school and I never told you how much that meant to me",
"why do i have to beg for love? maybe thats why we're not friends anymore",
"we never even dated but I think I'll always miss you, stay safe sweet boy",
"i know it's been tough, but I hope we can stay friends for years to come",
"You're the big brother I don't have. I'm so honoured to be your friend and I'm proud of you",
"we were inseparable and now I dont even know your phone number",
"I miss the group. everyone went their separate ways and it will never be the same",
"you were the only person I could be 100% myself around",
"I still have our matching bracelets in my drawer. do you still have yours?",
"remember when we used to sneak out and get food at 2am. I miss that",
"you always made me feel included when no one else did and I never thanked you for that",
"losing your friendship hurt more than any breakup I've ever been through",
"I still laugh at our inside jokes even though theres no one left to tell them to",
"i know we had a falling out but you were the best friend I ever had",
"you taught me what it means to have someone in your corner. i miss that feeling",
"i'm sad you changed so much. i miss our friendship. i still don't know what i did wrong",

// ─── FAMILY (parents, siblings, grandparents) ────────────────
"I wish time didn't pass so quickly, I wish to be your little girl again",
"My dearest sister. You're the person I love the most. I will always love you in every situation",
"You da best big sister everrr I wuv you sooooo much",
"Hi grandpa, we played one last game of pitch right over your grave. Rest in peace",
"I love you lots honey",
"You are doing good baby keep going",
"You're the big brother I always wanted. I'm so proud of who you became",
"Mom I know we fight alot but I really do love you more than anything",
"Dad I wish you were here to see who I turned out to be. you would be proud I think",
"I'm sorry I was such a difficult teenager. you deserved better from me",
"my pets miss you, call me if you see this yk i'll answer",
"I know you tried your best with what you had. I understand that now",
"you were more of a parent to me than my actual parents ever were",
"I'm scared of becoming like you and I dont know how to stop it",
"grandma I still make your recipe every sunday. it never tastes the same but I keep trying",
"I wish I called you more before it was too late. I took our time for granted",
"to my little brother: the world is going to be so lucky to have you. keep going",
"i forgive you for not being the parent I needed. I hope you find peace too",
"you're the reason I believe in unconditional love. thank you for never giving up on me",
"I found your old letters in the attic. I sat on the floor and read every single one",
"happy mothers day. I know things are complicated between us but I love you",
"you always told me I could be anything and I believed you. I still do",

// ─── ANGER / BETRAYAL (raw and real) ─────────────────────────
"I hate the way you act and how we are handling things but I still miss you even if you don't care",
"you say you're trying, im struggling to believe that. I miss our calls",
"Why would you say those things about me to your mom? You were my best friend why would you say that",
"how could you do that to me after everything we went through together",
"I don't forgive you, i love you",
"stop pretending like you care when we both know you dont",
"you lied to my face and smiled while doing it. I will never forget that",
"Wished u hadn't went behind my back. I still love u though. And miss the old u sm",
"everyone warned me about you and I defended you every single time. what a joke",
"you made me feel crazy for having feelings. that was not okay",
"the way you talked about me behind my back. I heard every word",
"I gave you chance after chance and you wasted every single one of them",
"you dont get to hurt me and then act like the victim. thats not how this works",
"I still have the screenshots of what you said about me. in case you ever try to deny it",
"you were supposed to be different. you promised you were different",
"you played me and you know it. I hope it was worth it",
"I cant believe I cried over someone who couldnt even give me basic respect",
"break up with her already you deserve better i love you",
"good luck with her. pls don't make her feel as dumb as i do",
"hope she treats you better than i ever could",
"you knew exactly what you were doing when you introduced me to her",
"pls never touch the game ever again",
"You are a terrible person and I still loved you anyway and that makes me angry at myself",
"I keep forgiving you and youre making me look stupid",
"you humiliated me in front of everyone and then asked why I was upset",
"Stop showing up in my dreams",
"I deleted all our pictures but I know you still have them. delete them",
"you cheated and I found out from someone else. do you know how that felt?",

// ─── REGRET / APOLOGY (with specific context) ────────────────
"I'm so sorry I said those things. Please talk to me again. I think it'd really clear things up. Ily",
"I still check up on you. I'm still sorry even if you don't blame me. You deserve the world",
"I'm sorry im not getting better im trying for you, i love you so much",
"I'm thankful for everything you did for me, I love you but I'm so sorry for how things are",
"I should've gone to London with you, but I was a stupid little boy. I'll always be here if you need",
"Sorry for leaving you like that. I miss you",
"I took you for granted and I hate myself for it",
"I wish I fought harder for us instead of just letting you walk away",
"im sorry for every time I chose my pride over your feelings",
"I regret not saying yes when you asked me. I think about it every day",
"Even tho you said and did mean things, I'll still be waiting for you bunny. Always",
"I messed up the best thing that ever happened to me and I have to live with that",
"I was wrong and I should have said it sooner. I'm sorry {N}",
"I should have been there for you that night. I will never forgive myself for that",
"I wish I could take back every hurtful word I ever said to you",
"if I could go back I would do everything differently. you deserved so much better from me",
"Let's try again please can't stop thinking what we could've been. It's my fault",
"I pushed you away because I was scared and now youre gone and im the scared one still",
"i was wrong about everything and you were right and I should have listened",
"I'm so sorry I haven't told you the whole truth but I can't be the reason your heart breaks again",
"I know I dont deserve another chance but I really wish youd give me one",
"the way I treated you keeps me up at night. you were so good to me",
"I was selfish and I see that now. I'm sorry {N}",
"I should have picked up the phone. I should have just picked up the phone",

// ─── GRIEF / LOSS (someone who passed) ───────────────────────
"I can't believe I'll never see you again. But I'll spend a lifetime grieving you",
"its been 2 years and I still set a place for you at the table on your birthday",
"I talk to you in the car when im alone. I know you cant hear me but it helps",
"I wore your favorite color to graduation because I wanted you there somehow",
"the world got a lot quieter without you in it",
"I still expect you to call. every sunday at 3pm. I still wait by the phone",
"heaven got the best person I ever knew and im still mad about it",
"I keep finding your stuff around the house and each time it feels like losing you again",
"rest in peace. I wish I had more time. I wish I had said more things",
"I know you can see me. I hope Im making you proud wherever you are",
"there are so many things I wanted to tell you and now I never can",
"I visited your grave today. brought your favorite flowers. told you about my week",
"i miss your voice the most. I would give anything to hear it one more time",
"the last time I hugged you I didnt know it was the last time",
"you deserved so many more years. this was not fair",
"I named my daughter after you. I hope thats okay. I think you would have loved her",
"I still celebrate your birthday every year. i make your cake and eat it alone",
"been over 2 years since last saw you. Didnt had courage to confess then, now dont have opportunity",

// ─── MOVING ON / HEALING ─────────────────────────────────────
"I'm moving on now from you but there was once a time you meant everything to me",
"it's hard to accept that I'm still in love with you, but I no longer know you",
"We should have stayed friends. Nothing more, nothing less",
"I wish we could have solved things and kept what we had...",
"I don't think I'll ever love you the same way and finally I am healing but you'll always be special",
"Things could have gone very differently. But I don't regret loving you. I forgive you. Take care",
"I'm learning to be happy without you and its working and that scares me",
"I dont need you anymore but some days I still want you and I hate that",
"you were a lesson I needed to learn even though it hurt like hell",
"I finally stopped checking your profile. its been 47 days",
"im starting to forget what your voice sounds like and im not sure how I feel about that",
"I saw you today and felt nothing for the first time. I think im finally free",
"I dont wish bad things for you. I just wish you had been better to me",
"im finally at the point where your name doesnt make my stomach drop",
"someday I wont think about you when this song plays. today is not that day but someday",
"I went to our spot with someone new. felt wrong but also felt like progress",
"I'm putting you down now. I'm letting go. thank you for everything you taught me",
"its weird that you used to be my whole world and now youre just a person I used to know",
"you'll always have a piece of me. but I need the rest of it back now",
"i swear this is the last night i love you",

// ─── JEALOUSY / NEW PERSON ───────────────────────────────────
"I have been waiting for you for almost a year but now you got someone else in the span of a week",
"u like her not me I knew u wouldn't like me but I still believed I just want u to like me",
"watching you fall in love with someone else while I was right here the whole time",
"I wonder if you hold her the way you used to hold me",
"I saw the picture of you two and I had to put my phone down for the rest of the day",
"you replaced me in a week and it took me months to even look at someone else",
"I hope shes everything you wanted. I mean that. even though it kills me",
"does she know about me? does she know you used to say those things to me?",
"i bet you say the same things to her that you used to say to me",
"you look happy with her. im glad. im dying inside but im glad",
"I see her wearing the necklace you gave me. so it was never really mine was it",
"you said no one could ever replace me and then you went and proved yourself wrong",
"every time I see you two together I have to remind myself to breathe",
"I heard you took her to our restaurant. thats fine I guess. its fine",
"you introduced her to your parents after 2 months. you never introduced me in 2 years",

// ─── QUESTIONS (real questions real people ask) ──────────────
"do you ever think about what would have happened if we met at the right time?",
"was any of it real? or were you just bored?",
"do you miss me at all or am I the only one still stuck in the past?",
"did you ever actually love me or was I just convenient?",
"do u even like me like u used to?",
"why did you ghost me again i thought we were getting back together",
"would you take me back if I showed up at your door right now?",
"do you remember that night the same way I do?",
"was it casual when I saw a submission with the exact date I met up with u? I hope not",
"why didnt you fight for us? was I really that easy to give up on?",
"if I told you I still love you would it change anything?",
"did you keep any of the letters I wrote you?",
"do you ever listen to our playlist still?",
"when you said forever did you actually mean it?",
"are you happy now? like genuinely happy? because I hope you are",
"Will you ever come back? I hope you do I miss you since the day you've left",
"do you think we would have worked out if we were older?",
"whyd you have to ruin everything we had?",
"do you still have my number saved?",
"can we start over? pretend none of this ever happened?",
"was I really just practice for the person you actually wanted?",
"I wonder if i was just another of the girls you date because you dont know how to be alone",

// ─── RECONCILIATION / SECOND CHANCES ─────────────────────────
"We could try again. I really love you. Don't be afraid to love loudly. You're perfect",
"I'm willing to put in the work if you are, I love you and I never meant to hurt you",
"I still believe we are meant to be, we just did it wrong. I miss talking to you everyday",
"I know life's been too hard on you, but I will always be by your side. I love you so much",
"I wish we could start again, angel",
"I shouldn't but I love you. And I know you love me too. This always happens",
"What we had was special and deserves another chance. I hope you realise that one day and reach out",
"If you hadn't moved away we would be tg but I'm back so be ready next time",
"i love you so much, i would do honestly anything for us to work, please my love",
"I'm falling in love with you and it scared me, hope we can try again or find ways back to each other",
"I know we did not end in good term and it hurts that you hate me so much. love me again",
"We both know it's been too many years to just let this go. Fresh start this summer",
"I hope you find peace and learn to love yourself before you ever get into a relationship again",
"I wish you would just give it a real chance. You never will though",
"I still set my alarm 10 minutes early because thats when we used to call. old habits",
"one conversation could fix all of this. why wont you just talk to me",
"the door is still open. it always will be. just walk through it",
"I keep writing messages to you and deleting them. this is the first one I actually sent",

// ─── DECLARATIONS OF LOVE (raw, not poetic) ──────────────────
"I love you, forever and ever. Even if you'll never see me",
"i love you too.",
"i'd wait a lifetime for you",
"I hope I can marry you someday",
"ilysm i hope we can work out one day and be end game",
"I love you more than anybody else can love you sweetheart, please be mine forever",
"I love you so much, but i ask myself how long we will have to fight",
"you're the love of my life and i will never love anyone like you. please come back to me",
"I love you so much it hurts. I don't regret falling for you even if I don't know if you love me back",
"i really love you. and i miss you. and sometimes i just wish that youd choose me to love you best",
"I love you I know weve been fighting much recently I dont want this to end",
"I wish you'd talk to me. or look at me. I know you care, I just wish you'd act like it",
"My Sab, I know we did not end in good term and it hurts that you hate me so much",
"your a gorgeous, gorgeous girl and u deserve the world. I'm so sorry...",
"I love you so much. You are the funniest and kindest I know. I hope you always know you are loved",
"You are my human sunshine",
"I cant wait to spend a lifetime with you",
"In a billion years time you will always be my day one <3",
"i love yew",
"you're the best bf i could've ever asked for, i love you so much",
"I'll never stop loving you, even if you love someone else and we'll remain just friends",
"I'd choose to love you in every life, even if you were never mine",
"From the day we met you have been the one. I never looked close enough to see the pain",
"there's so much i want to tell u but im afraid ull leave",
"I love you so much, you're such a sweet girl and I'm so happy you're in my life",
"I think i love u.... and u are very precious",
"you are my whole world even when you drive me absolutely crazy",
"im not good with words but everything I feel for you is real. all of it",

// ─── SPECIFIC MEMORIES (details that feel real) ──────────────
"i couldn't forget about the day you bandaged my fingers at school. you were so gentle with me",
"remember when we stayed up until 4am playing mario kart and you fell asleep on my shoulder",
"that time you drove 3 hours just to bring me soup when I was sick. nobody does that",
"you used to save me the window seat. every single time",
"I found that note you left in my locker freshman year. the one that said dont give up. I kept it",
"the night we danced in your kitchen to no music. I think about it more than I should",
"you always ordered for me because you knew I had anxiety talking to strangers",
"I still have the flower you gave me after my recital. its dried up but I kept it",
"remember when we got lost on that road trip and ended up at that weird diner at 2am",
"the time you lent me your jacket at the football game because you saw me shivering",
"you taught me how to ride a bike when I was 8. did you know I still ride every day?",
"that voicemail you left me drunk on new years. I saved it. its still funny",
"we were sitting in your car and you said something that changed my whole life and I dont think you know",
"the day we skipped school and went to the lake. I never told anyone about that day",
"remember the time you braided my hair at the sleepover. no one ever did that for me before",
"you made me a playlist for my birthday and I still listen to it. every song still hits",
"I still have that stupid picture we took in the photobooth at the mall. I look at it too much",
"i still think about the argument that we had.. just why? do u even like me like u used to?",
"I kept that sticky note you put on my steering wheel. it said drive safe. I still read it sometimes",
"the night we sat on the roof and you pointed out all the constellations wrong. I didnt correct you",

// ─── IDENTITY / DEEP PERSONAL ────────────────────────────────
"I am trans too. I am glad you found yourself, hope you know our time together was important to me",
"i feel like i was in a coma the entire time i was dating you. and now im not but i miss the numbness",
"the sugar coating on your words intoxicates. i keep dreaming of things i shouldn't",
"if life does not bring us together again, i will think of your blue eyes on my wedding day",
"i know its better like this. i miss you so much. it hurts. but why did it have to end like this?",
"U should sleep more and care more about yourself man, u care too much about others",
"I'm scared of messing this up and losing my favorite person",
"I feel like Im drowning and nobody around me notices because I keep smiling",
"you were the first person who made me feel like being myself was okay",
"I hide so much from everyone and the one person I could be honest with was you",
"i dont know who i am without you and that scares me more than anything",
"you made me believe I was lovable for the first time in my life",
"im sorry you had to deal with all my issues. you deserved someone with less baggage",
"I love you but I need to love myself first and I dont know how to do both at the same time",
"you saw the parts of me I hide from everyone and you didnt run. thank you",
"its hard being queer in this town and you were the only person who made it easier",

// ─── ENCOURAGEMENT / SUPPORT ─────────────────────────────────
"KEEP BEING AWESOME!!",
"you are doing so good and im so proud of you even if no one tells you",
"I hope you're doing okay! I love you :(",
"I know things are hard right now but you are so much stronger than you think",
"Against all odds I want to write the story we should have had",
"Despite the pain, I wish you the best. I forgive you, and I still want to get better",
"the world is better because you're in it. dont ever forget that",
"you are going to do amazing things. I just know it. I believe in you so much",
"I know youre struggling right now but please dont give up. people need you here",
"you dont have to be strong all the time. its okay to fall apart sometimes",
"im so proud of how far youve come. you worked so hard for this",
"hey. you matter. I just wanted someone to tell you that today",
"I know no one checks on you so I am. how are you? genuinely. im listening",
"you inspire me every day and you dont even know it",
"please eat something today. drink water. take your meds. I care about you",
"the way you show up for everyone else but never yourself. please take a break",

// ─── SITUATIONSHIP / COMPLICATED ─────────────────────────────
"I'm so no madly in love with you and I don't think I'll ever get over you...",
"I cant keep being your maybe. I deserve a yes or a no",
"we act like a couple but refuse to put a label on it and its driving me insane",
"you send me mixed signals every single day and I'm exhausted from trying to read them",
"are we something or are we nothing? because this in between is killing me",
"you call me at 3am but wont text me back during the day. what are we?",
"I wish you knew how much you meant to all of us",
"I love you so much, but i ask myself how long we will have to keep pretending",
"you say you dont want a relationship but you treat me like im yours",
"i know what we have isnt official but its the most real thing ive ever felt",
"stop telling everyone we're just friends when we both know thats not true",
"I would give you everything but you only want me when its convenient for you",
"we keep ending up in the same place. doesnt that tell you something?",
"you hold my hand in private but act like a stranger in public. it hurts",
"this thing between us is a mess but id rather be a mess with you than clean without you",
"I dont want to be your secret anymore. either claim me or let me go",
"one minute youre everything and the next minute you act like I dont exist",
"i was scared to block u because what if one day u needed me and no one else was there",

// ─── GRATITUDE / APPRECIATION ────────────────────────────────
"You're the best thing that happened to me, that'll never change. I love you so much",
"thank you for staying when everyone else left. that meant more than you know",
"I know I dont say it enough but you literally saved my life",
"you believed in me when I couldnt even believe in myself. I owe you everything",
"the way you love me makes me want to be a better person",
"I I'm lucky to have you and I hope you know that",
"you make the bad days so much better just by being there",
"thank you for being patient with me. I know im a lot sometimes",
"you are the one good thing in my life that I did not mess up",
"I dont deserve you but im so grateful you chose me anyway",
"Hey, how are you? Hope ur well! Rmb our deal?",
"you taught me what love is supposed to feel like and I can never repay you for that",
"thank you for every time you stayed up late listening to my problems",
"you picked me up from rock bottom and you never once made me feel embarrassed about it",
"the fact that you exist makes the whole world better and I mean that",

// ─── PLAYFUL / SHORT / PUNCHY ────────────────────────────────
"My Woman",
"I love you lots honey",
"i liked u btwv :)",
"you're cute. thats all. bye",
"I love u bye",
"catch feelings? in this economy? apparently yes because of you",
"we would be so good together and you KNOW it",
"MARRY ME ALREADY",
"i have a whole pinterest board about our future and thats normal right?",
"you are so fine and you walk around like its normal. how",
"I hate you. (no i dont. i love you. ugh.)",
"thanks for ruining every other person for me. no one compares now",
"*stares at you respectfully*",
"the AUDACITY of you being that attractive",
"you live in my head rent free and im not even mad about it",
"im over you. (narrator: she was in fact not over him)",
"you.. yeah you.. i love you",
"you are SO annoying and SO cute and I hate how much I like you",
"why do you have to be so stupid perfect at everything",
"I wrote this at 2am so dont judge me okay",
"this is embarrassing but I need to say it somewhere",
"I literally cannot even look at you without smiling and its annoying",
"ily. thats it. thats the message",
"told my therapist about you and she laughed at me so. thats where we are",

// ─── LONG DISTANCE ───────────────────────────────────────────
"one day the distance wont matter anymore and I will be right there next to you",
"I hate the timezone difference. when youre awake im asleep. we keep missing each other",
"counting down the days until I can hug you for real instead of through a screen",
"it hurts that I cant just drive to your house when youre sad. i hate being so far away",
"I saved up enough to visit you this summer. youre the only thing im spending my money on",
"the distance is the hardest thing ive ever done but youd be worth a million miles",
"I fell asleep on facetime with you and woke up to your snoring. I miss that",
"its 3am here and 9pm there and I miss you and this is so unfair",
"I looked up flights to your city today. I didnt book one. but I looked",
"the day I get to hold you and not have to let go to catch a flight will be the best day of my life",

// ─── MIXED EMOTIONS / CONTRADICTIONS ─────────────────────────
"I shouldn't but I love you. And I know you love me too. This always happens",
"the worst part is I still love you even after everything you put me through",
"I miss you but I know missing you is holding me back",
"I hate that I still care about you after what you did",
"you were the best and worst thing that ever happened to me and I mean both equally",
"I want you to be happy but I want you to be happy with me and thats selfish I know",
"some days I want to call you and some days I want to forget you existed",
"I love you and I'm furious at you and I miss you all at the same time",
"im supposed to hate you but all I can think about is how much I want to hear your voice",
"you ruined my life and I would let you do it all over again. thats the problem",
"I deleted your number but I know it by heart. whats the point",
"I dont want you back but I dont want anyone else to have you either and I know thats not fair",
"I tell everyone im over you while wearing the shirt you left at my place. hypocrite",
"the thought of you makes me smile and cry at the same time and thats exhausting",
"i cant decide if meeting you was the best or worst thing that happened to me",
"I forgive you but I dont trust you. is that even possible?",
"I love you so much, but i ask myself every day if this is even worth it anymore",
"Even though you regected me I can't stop loving you, even after 5 years of a one sided crush",

// ─── SELF-REFLECTION / GROWTH ────────────────────────────────
"i see my reflection in your eyes",
"It's been months and I still can't stop thinking about you. What even was between us?",
"i need to stop looking for you in everyone i meet",
"I keep falling for people who treat me exactly the way you did and I need to break the cycle",
"im finally the person I wished I was when I was with you. funny how that works",
"I thought I needed you to be happy. turns out I just needed to find myself",
"I used to think love was supposed to hurt. you taught me that. and now im unlearning it",
"I waited until the last day to speak with you, I always wait, and I hope you dont do it too",
"im so tired of being the one who cares more. just once I want someone to choose me first",
"I keep attracting the same type of person and im starting to realize the common factor is me",
"I used to bend over backwards for people who wouldnt even cross the street for me",
"its lonely knowing exactly what you want from someone and watching them give it to someone else",
"I gave pieces of myself to people who never even asked for them",
"I dont know how to accept love without waiting for the catch. you did that to me",
"I wish I could go back and tell my younger self that this person is not worth your tears",
"the hardest thing ive ever done is admit that I was the toxic one in our relationship",

// ─── DESPERATE / RAW / UNFILTERED ────────────────────────────
"this can't be the end. there are so many reminders of you everywhere. you can't just leave me",
"please just tell me what i did wrong so i can fix it. please",
"I cant eat I cant sleep I cant do anything without thinking about you",
"come back. please. I'll do anything. I mean it",
"I know im pathetic for still wanting you but I dont care anymore",
"every night I pray that tomorrow will be the day you come back",
"I texted you 12 times and you didnt answer a single one. I get it. but it hurts",
"im begging you to just give me one more chance. just one. thats all I need",
"you are slipping away from me and I can feel it and theres nothing I can do",
"I would walk through fire for you and you wouldnt even cross the room for me",
"I I'm losing my mind over you and everyone keeps telling me to move on like its that easy",
"I know you read my messages and choose not to reply. that silence is louder than anything",
"nothing feels right without you. not even the things that used to make me happy",
"you're the first person I want to tell everything to and the one person I can't talk to",
"im falling apart and the only person who could put me back together is the one who broke me",
"I stared at your contact for 45 minutes tonight. I almost called. I almost did",

// ─── ACCEPTANCE / CLOSURE ────────────────────────────────────
"I think you were the love of my life but you were not the love of my life at the same time",
"I finally understand why it didnt work. we were two good people at the wrong time",
"thank you for showing me what I deserve, even if you werent the one to give it to me",
"I hope you're happy {N}. genuinely. even if its not with me",
"we had our time and it was beautiful. I wont pretend it wasnt",
"I dont need an apology anymore. I just needed to know it mattered to you too",
"you were my favorite chapter but not my whole story. and thats okay",
"im at peace with how things ended. it took a long time but im there now",
"I finally forgive you. not for you. for me. im tired of carrying it",
"goodbye for real this time. I mean it. (I think I mean it.)",
"It's been months and I still can't stop thinking about you. But the gap between thoughts is growing",
"we were beautiful and tragic and I wouldnt trade any of it",
"I learned more about myself from losing you than I ever learned from having you",

// ─── MISC UNIQUE THOUGHTS ────────────────────────────────────
"Happy late bday... it's been a while",
"i miss you more than words can express, i hope you read this someday",
"imysb even ur not mine. hope u like the keychain and gifts i gave u before ur last day of school",
"the sugar coating on your words intoxicates",
"against all odds I want to write the story we should have had. my writing got too creative didn't it",
"I wish you knew how much you ment to all of us",
"A soul who's experienced love for the first time and another who can no longer love. How poetic",
"i still look at ur old pinterest acc. it hurts to not have you when I pushed you. Im still ur puppy?",
"You were my sunshine. I wish I was your too. I'm happy that your happy. My sunshine is happy",
"i love having special names for you my mio. my man in every language",
"Every time I see a cup of chai, it reminds me of you. I've started drinking chai. Still don't like it",
"Lets build a happy family you've been dreaming of, with me",
"I'm in love with you. You are the sweetest person I've ever met",
"i know we're just coworkers but you make 8 hours feel like nothing",
"you always smelled like vanilla and now every time I smell vanilla I have to leave the room",
"I saw someone who looked like you at the supermarket and my stomach dropped",
"you would hate the person I became after you left. and honestly so do I",
"I keep your old voicemails and replay them when I miss you. your laugh still gets me",
"the last text I sent you is still on delivered. its been 4 months",
"I made a playlist called songs that remind me of u and its 127 songs long",
"you are the only person who ever made silence feel comfortable. I miss that",
"I went back to the park where you told me you loved me. the bench is still there. we're not",
"I keep a list of things I want to tell you. its 3 pages long now",
"you taught me that home is a person not a place and now im homeless",
"I saw a dog that looked exactly like yours today and almost cried in public",
"you were supposed to be at my graduation. I saved you a seat. it stayed empty",
"Every time someone says your name my heart still skips and its been 2 years",
"you're the reason I started writing. every word I write is for you even when its not about you",
"I still use your netflix password. you havent noticed. or maybe you have and you let me",
"you know that bench by the lake? I go there when I need to think. its our bench. always will be",
"I wonder if you know that I named a star after you. its stupid I know. but its yours",
"I bought two tickets to that concert hoping youd want to go with me. I went alone",
"you always said id find someone better. you were wrong. nobody comes close",
"the sweater you left at my place still smells like you and I refuse to wash it",
"I hope whatever you're searching for, you find it. even if it isn't me",
"I found the letter you never sent me. your mom gave it to me after. I read it every day",
"you dont know this but you're the reason I got sober. I wanted to be someone you could be proud of",
"i see you everywhere. in coffee shops. in crowds. its never actually you but for a second it feels like it",
"I think about that last car ride a lot. the silence. the way neither of us said goodbye",
"you are the only person who ever made me feel like I was enough exactly as I am",
"I keep your number memorized even though I deleted it. old habits die hard",
"I was at the bookstore and saw that book you always talked about. I bought it. finally reading it",
"if you ever read this just know it was always you. from the very beginning it was always you",

// ─── EXTRA TEMPLATES (standalone, no name in body) ──────────
"I think about you more than I should",
"you changed my life and you dont even know it",
"I still love you. nothing changed",
"I should have told you how I felt when I had the chance",
"I saw your name today and my heart still skipped. why does it do that",
"you are the best thing that ever happened to me and I mean that",
"I dream about you sometimes. is that weird?",
"please take care of yourself",
"I never stopped loving you",
"do you remember when things were good between us?",
"I wrote this for you. I'll probably never send it",
"you deserve someone who actually shows up for you",
"im so proud of you. you dont hear that enough",
"I cant believe we ended up like this",
"you were everything to me. I hope you knew that",
"I wish I could talk to you one more time",
"I forgive you. I need you to know that",
"Im not over you. I dont think I ever will be",
"you made me feel like I wasnt alone in this world",
"I still have your number memorized",
"I think we could have been something incredible",
"I wish you could see yourself the way I see you",
"some days I still reach for my phone to text you",
"youre on my mind. always have been",
"I dont know how to do this without you",
"I still pray for you every night",
"you taught me what love actually looks like",
"the world feels different without you",
"I kept every letter you wrote me",
"you were my best friend before anything else",
"I miss our stupid conversations about nothing",
"I still root for you. from a distance. but I do",
"I cant listen to that song without thinking of you",
"every birthday wish I make is about you",
"you made the bad days bearable",
"I have so much to tell you. I dont even know where to start",
"I thought we had more time",
"nobody compares to you. I tried. nobody does",
"I wonder if you kept our photos",
"you are braver than you think. dont forget that",
"the way you smiled at me that day. I never forgot it",
"I miss being your person",
"I would do it all over again even knowing how it ends",
"I hope you think of me sometimes",
"I know I wasnt perfect but I loved you for real",
"you will always have a place in my heart",
"did you keep the bracelet I gave you?",
"Im rooting for you. always will be",
"I think you were my soulmate. wrong timing though",
"you made me a better person and I never thanked you",
"I drove past your street today. almost stopped",
"the way you said my name. nobody else says it like that",
"I never got to say a proper goodbye",
"I saw someone wearing your perfume today. had to walk the other way",
"you were the only person who made me feel safe",
"everything reminds me of you. its exhausting but I dont want it to stop",
"I started drinking coffee because of you. still hate it",
"the last thing you said to me keeps playing in my head",
"I wish I fought harder for us",
"you deserved a better ending than what I gave you",
"Im still wearing your ring. cant take it off",
"I told my mom about you. she says I should reach out",
"we were so close to making it work",
"I made a playlist of songs that remind me of you. its embarrassingly long",
"I miss the way you always knew what to say",
"you changed everything for me. everything",
"I wonder what we would be like if we met now instead of then",
"I named my cat after you. dont judge me",
"you were right about everything and I was too stubborn to see it",
"I hope wherever you are you're smiling",
"the distance between us kills me. every day",
"I read your old messages when I cant sleep",
"I think the universe keeps putting you in my path for a reason",
"you made ordinary days feel special",
// ─── KEEP {N} only where it sounds truly natural ─────────────
"hey {N}. I miss you",
"dear {N}, I wish things were different between us",
"hey {N}. just wanted you to know I still care",
"happy birthday {N}. I still remember every year",
"{N} I hope you find everything you're looking for",
];

// ═══════════════════════════════════════════════════════════════
// EXPANSION TEMPLATES — contextual slot-based variations
// These use {opt1|opt2|opt3} syntax where ONE option is picked.
// This creates genuine semantic variation, not random tails.
// ═══════════════════════════════════════════════════════════════
const EXPAND = [
  // ─── MISSING / LONGING with situational slots ──────────────
  "i miss {you so much|you more than anything|everything about you|the way things were|us}",
  "I {miss|think about|keep thinking about|can't stop missing|can't forget} you {every day|all the time|constantly|more than you know}",
  "I wish {you were here|things were different|we could go back|we never ended|I could see you again}",
  "it's been {weeks|months|a year|so long|ages} and I still {think about you|miss you|can't get over you|dream about you}",
  "I still {love you|miss you|think about you|care about you|want you in my life}",
  "I {drove past|walked by|went near} {your house|our old spot|the coffee shop|the park|your street} and {almost cried|my heart dropped|I froze|it all came back|I had to stop}",
  "I keep {our photos|your old texts|that playlist|your hoodie|your letters|the bracelet you gave me} because {I can't let go|it's all I have left|throwing it away feels wrong|I'm not ready}",
  "the {worst|hardest|saddest} part is {you don't even know|you probably forgot|I can't tell you|you moved on already|I have to pretend I'm fine}",
  "I miss {our late night calls|when we used to talk|how it used to be|your laugh|your stupid jokes|our random adventures|movie nights with you}",
  "sometimes I {almost text you|type your name|open your chat|call you by accident|hear a song and think of you} and then {I remember|I stop myself|reality hits|I put my phone down}",
  "do you ever {miss me|think about me|wonder about us|miss what we had|regret how things ended}?",
  "I haven't {talked to you|seen you|heard from you|heard your voice} in {months|weeks|forever|so long|a year} and it still {hurts|stings|feels wrong|bothers me}",
  "I {found|saw|came across} {your old hoodie|our photos|your number|that note you wrote me|your birthday card} and it {broke me|hit me hard|made me cry|brought everything back}",
  "there's {a hole|an emptiness|a gap|something missing} in my {life|heart|world|routine} where you {used to be|were|fit perfectly|belonged}",
  "I just want you to know that {I still care|you still matter|I never stopped caring|I think about you|you were important to me}",

  // ─── LOVE / AFFECTION with context ─────────────────────────
  "I love you {more than anything|so much it hurts|and I always will|even when you make me crazy|with everything I have}",
  "you are {my person|everything to me|the best thing in my life|the reason I smile|my whole world|so special to me}",
  "you are {the love of my life|my favorite person|my best friend|my everything|the sweetest person I know|my whole heart}",
  "I {love you|care about you|adore you} more than {you'll ever know|words can say|I can express|I should probably admit}",
  "I {fell in love with you|started loving you|knew you were special} the {moment I met you|first time we talked|day you smiled at me|second I saw you|night at that party}",
  "you make {me so happy|my life better|everything okay|bad days good|the world less scary|me feel safe}",
  "I would {do anything|cross oceans|drop everything|wait forever|give up everything} for you {and you know it|and I mean it|without hesitation|if you asked}",
  "I love {you so much|everything about you|your laugh|the way you care about people|how you make me feel|who you are}",
  "the way you {look at me|hold my hand|say my name|laugh|make me feel} is {everything|the best feeling|what I live for|something I never want to lose}",
  "I'm {so in love|completely in love|madly in love|hopelessly in love|deeply in love} with you and {I can't help it|there's nothing I can do|I don't want to stop|it scares me|I hope you feel it too}",
  "you {don't know|have no idea|can't imagine} how much you {mean to me|changed my life|matter|impact my day|make me feel}",

  // ─── HEARTBREAK / PAIN with specific situations ────────────
  "you {hurt me|broke me|destroyed me|let me down|betrayed me} and {I still love you|I don't hate you|I'm still here|the worst part is I'd do it again|I keep making excuses for you}",
  "the way you {left|ended things|ghosted me|stopped caring|walked away|gave up on us} was {the worst part|so cruel|unnecessary|what hurts the most|unforgettable}",
  "you {chose her|replaced me|moved on|found someone new|left me for them} {so fast|like I was nothing|without looking back|in a week|and I had to watch}",
  "I gave you {everything|my whole heart|all of me|my trust|years of my life} and {it wasn't enough|you threw it away|you didn't care|you wasted it|you chose someone else}",
  "you {promised|swore|told me|said} you would {never leave|always be there|stay|love me forever|never hurt me} and {you lied|look where we are|here I am alone|you broke that promise}",
  "I {keep replaying|can't stop thinking about|remember|still hear} {our last conversation|what you said|the last thing you told me|the day you left|that fight} and it {kills me|won't stop|hurts every time|breaks my heart}",
  "it hurts {knowing|seeing|realizing|watching} you {don't care|moved on|forgot about me|are happy without me|treat someone else the way you treated me}",
  "you walked {away|out of my life|right past me|away like it was nothing|out that door} and {didn't look back|left me standing there|never came back|I watched you go|I couldn't stop you}",
  "you {ruined me|changed me|broke something in me|took something from me} and {you don't even know|I don't think you care|I still can't fix it|I'm still trying to heal}",
  "the {worst|hardest|most painful} thing about {losing you|this|us ending|our breakup} was {realizing I wasn't enough|watching you move on|having to pretend I'm fine|knowing you're happier now}",

  // ─── FRIENDSHIP with real detail ───────────────────────────
  "you are {my best friend|the greatest friend|the most important person|someone I can't lose|the only one who gets me}",
  "you were {always there|the only one|my person|my rock|the first one I called} when {things got bad|I needed someone|nobody else was|I was falling apart|everything went wrong}",
  "I {miss|wish I still had|think about|want back|need} our {friendship|late night talks|inside jokes|adventures|bond|hangouts}",
  "you were {the best friend|a better friend|more of a friend|a real friend} than {I deserved|anyone else|I ever had|I gave you credit for}",
  "I wish {we never stopped|we could go back to|I didn't lose|I fought harder for|I appreciated} our {friendship|bond|connection|time together}",
  "I {love you|appreciate you|am so grateful for you|am lucky to have you} and {I don't say it enough|you need to hear that|I hope you know|I mean it with everything}",
  "losing {your friendship|you as a friend|our bond|what we had} hurt {more than any breakup|worse than I expected|differently|in a way I can't describe|so deep}",
  "you {taught me|showed me|made me understand|helped me see} what {real friendship|loyalty|trust|having someone in your corner|being understood} {looks like|means|feels like|really is}",
  "I {still laugh|think|smile|get emotional} about {our inside jokes|that one time|our dumb memories|the stuff we did|when we used to sneak out} and there's no one {left to share them with|who would get it|I can tell}",
  "remember when we {stayed up until 4am|skipped class together|drove around all night|got lost on purpose|spent the whole day doing nothing}? that was {the best|everything|when I was happiest|my favorite memory|so perfect}",

  // ─── REGRET / APOLOGY with context ─────────────────────────
  "I'm sorry for {everything|what I said|how I acted|not being there|pushing you away|hurting you|being selfish|not trying harder}",
  "I {should have|wish I had|regret not} {said something|fought harder|stayed|told you the truth|been better|been there|picked up the phone|apologized sooner}",
  "if I could {go back|do it over|change one thing|take it back|redo that day} I would {do everything differently|never let you go|say yes|tell you how I felt|stay}",
  "I {took you for granted|wasn't good enough|was the problem|messed up|ruined the best thing I had} and {I know it|I see that now|I hate myself for it|I can't fix it|I have to live with that}",
  "I was {wrong|selfish|scared|stupid|too proud|too stubborn|afraid} and {you paid for it|you deserved better|I lost you because of it|now you're gone|I see that now}",
  "the way I {treated you|acted|handled things|left|responded|reacted} {keeps me up at night|was wrong|was unfair|I can never take back|haunts me}",
  "I {owe you|need to say|want you to know|should have told you} {an apology|I'm sorry|the truth|how much you meant to me|that I was wrong}",
  "I {pushed you away|let you go|didn't fight for us|gave up too easy|chose wrong} and now {you're gone|it's too late|I'm the one hurting|I can't undo it|someone else has what I lost}",

  // ─── QUESTIONS / WONDERING ─────────────────────────────────
  "do you {ever|still|sometimes} think about {me|us|what we had|how things could have been|that night}?",
  "I wonder if {you miss me|it was real|you remember|I ever cross your mind|you kept our photos|you still care}",
  "do you {still have|remember|think about|miss|listen to} {my number|our song|our photos|those letters|that playlist|what I said}?",
  "was {I|it|any of it|what we had|our time together} ever {real|important|special|more than just convenient|something you cared about} to you?",
  "if I {showed up|called you|texted you|asked you|told you I still loved you} {right now|today|tomorrow|one more time|out of nowhere} would you {care|answer|want to talk|give me a chance|feel anything}?",
  "why did you {leave|stop talking to me|give up|ghost me|act like I don't exist|change so much|walk away|lie to me}?",
  "are you {happy|okay|doing well|better without me|thinking about me}? {genuinely|honestly|seriously|for real}?",
  "did you {ever love me|mean what you said|think about what you did|realize what you lost|know how I felt}?",

  // ─── JEALOUSY / THEIR NEW PERSON ───────────────────────────
  "I hope {she|he|they} {treat you|love you|know you|appreciate you|care about you} {better than I could|the way you deserve|like I wanted to|the way I tried to}",
  "watching you {with someone else|fall for them|be happy without me|give them what I wanted|move on so fast} is {the hardest thing|torture|something I wasn't ready for|killing me slowly}",
  "you {replaced me|moved on|found someone new|gave my spot away} in {a week|days|no time|a heartbeat} like {I was nothing|our time meant nothing|I didn't exist|it was easy}",
  "I bet you {say the same things|do the same stuff|make the same promises|use the same words|send the same texts} to {her|him|them} that you {used to say to|once said to|always told} me",
  "does {she|he|your new person} know about {me|us|what we had|what you did|how you were with me}?",
  "you took {her|him|them} to {our place|our restaurant|the spot you took me|where we went on our first date} and that {hurt|stung|was a choice|feels like a betrayal}",
  "I see you {with her|happy now|posting with someone new|moved on} and I {am happy for you|can't breathe|have to look away|pretend it doesn't hurt|smile through it}",
  "I {still love you|want you|am not over you} but you {chose someone else|are with them now|don't see me that way|moved on|want her instead}",

  // ─── SITUATIONSHIP / COMPLICATED ───────────────────────────
  "we {act like a couple|hold hands|talk every day|share everything|sleep together} but you {refuse to call it anything|won't commit|tell everyone we're just friends|don't want labels|keep me a secret}",
  "stop {giving me hope|texting me at 3am|acting like you care|sending mixed signals|calling me when you're lonely} if you {don't actually want me|aren't serious|can't commit|won't choose me|are just bored}",
  "I {can't keep|refuse to|am tired of|shouldn't have to} be your {maybe|backup plan|secret|option|sometimes|just in case}",
  "you {call me at night|want me in private|text when you're sad} but {ignore me|act different|pretend I don't exist|avoid me} {during the day|in public|around your friends|when it matters}",
  "this {thing|situation|whatever we are|mess|complicated thing} between us is {confusing|killing me|not fair|exhausting|undefined} and I {need an answer|deserve clarity|can't do it anymore|want more|need to know where I stand}",
  "{are we something|is this real|what are we|what is this}? I {need to know|deserve an answer|can't keep guessing|am tired of not knowing}",
  "either {choose me|say something|commit|let me in|be mine} or {let me go|say goodbye|stop leading me on|walk away|stop pretending}",
  "you {want me|need me|miss me|love me} when {it's convenient|you're lonely|no one else is there|things go wrong|you need something} and that's {not enough|not love|not fair|what hurts the most|what I keep accepting}",

  // ─── ENCOURAGEMENT / SUPPORT ───────────────────────────────
  "I {am so proud|am proud|couldn't be prouder} of {you|how far you've come|what you've done|who you became|your growth}",
  "you are {doing so well|going to be fine|stronger than you think|amazing|so brave|going to make it}",
  "the world is {better|brighter|kinder|luckier|more beautiful} because {you're in it|you exist|of who you are|of you}",
  "{keep going|don't give up|you got this|stay strong|I believe in you|never stop being you|you can do this|I'm proud of you}",
  "you {deserve|are worthy of|should have|need to accept} {love|happiness|good things|peace|someone who stays|better than what you got}",
  "I know {things are hard|it's rough right now|you're struggling|it doesn't feel like it} but {you're going to be okay|better days are coming|I'm here|you matter so much|this won't last forever}",
  "please {take care of yourself|eat something today|rest|don't be so hard on yourself|know you're loved|remember your worth}",
  "hey {N}. just {checking on you|wanted you to know I care|making sure you're okay|thinking about you|sending love your way}",

  // ─── GRIEF / LOSS ──────────────────────────────────────────
  "I {miss you|think about you|talk to you|visit you} {every day|all the time|when I'm alone|on your birthday|whenever it rains|at night}. I hope {you can hear me|you know|you're at peace|you see me}",
  "it's been {a year|months|2 years|so long|3 years} and {I still expect your call|it still hurts|I can't believe you're gone|the house is still empty|I still set your place at the table}",
  "I {wore your favorite color|brought your flowers|played your song|made your recipe|told them about you} {to graduation|on your birthday|at Christmas|today|at the wedding} because {I wanted you there|it felt right|you should have been there|I needed you close}",
  "the world {got quieter|feels emptier|isn't the same|makes less sense|lost something real} without you {in it|here|around|to make it better|to talk to}",
  "I {wish you could see|hope you know|know you would be proud of|need you to know|want to believe} {who I became|how much I've grown|that I'm trying|I'm okay|I made it|we're all okay}",
  "heaven {got the best one|needed an angel|took you too soon|is lucky to have you} and {I'm still mad about it|we all feel it|the world feels it|I miss you every day}",

  // ─── MOVING ON / HEALING ───────────────────────────────────
  "I'm {finally|slowly|learning to|starting to|beginning to} {move on|let go|heal|accept it|be okay without you|find myself again}",
  "you were {a lesson|a chapter|important|a part of my growth|someone I needed to meet} and I {don't regret it|am grateful|learned from it|wouldn't change it|thank you for that}",
  "someday {your name|this song|that place|your memory|seeing you} won't {hurt anymore|make me cry|break me|sting|feel like this}. {today isn't that day|not yet|almost there|getting closer|I can feel it}",
  "I {saw you today|heard your name|drove past our spot|looked at our photos} and felt {nothing|less than before|something small|almost nothing|peace} for the {first time|first time in months|first time ever|first time in years}",
  "I'm {putting you down|letting you go|saying goodbye|closing this chapter|walking away} and {it's the hardest thing|I mean it this time|I'm at peace|it hurts but it's right|I'm ready}",
  "I {used to|once|always|for so long} {need you|want you|look for you|depend on you} but {I found myself instead|I'm stronger now|I don't anymore|I grew past it|I have me now}",
  "I hope {you're happy|you find what you're looking for|life is good to you|you get everything you want|you heal too}. {I mean that|genuinely|even if it's not with me|from the bottom of my heart}",
  "the {gap|space|silence|distance} between {my thoughts of you|missing you|the pain|wanting to text you} is {getting bigger|growing|longer|finally widening} and I think that's {progress|a good sign|healing|growth|okay}",

  // ─── MIXED / CONTRADICTIONS ────────────────────────────────
  "I {love you|miss you|want you} and I {hate you|am furious at you|want to forget you|resent you} {at the same time|equally|simultaneously|and I don't know which one wins}",
  "you were {the best|everything|my world|my favorite} and {the worst|a disaster|my downfall|my biggest mistake} thing that ever happened to me",
  "I {want you back|miss us|crave you} but I {know it's bad for me|shouldn't|can't go through that again|deserve better|am trying to be strong}",
  "I {tell everyone|pretend|act like|say} I'm {over you|fine|moved on|doing great|happy} {while wearing your shirt|while listening to our song|but I'm not|and nobody believes me|but my pillow knows the truth}",
  "I {don't want you back|am done|should hate you} but I {don't want anyone else to have you|can't stand seeing you happy|still care|think about you daily|compared everyone to you}",
  "I {forgive you|understand|get it|accept what happened} but I {don't trust you|can't forget|will never look at you the same|still hurt|won't let you close again}",

  // ─── SHORT / PUNCHY with meaning variety ───────────────────
  "I {love you|miss you|want you|need you|forgive you|choose you}",
  "I'm {sorry|here for you|proud of you|not giving up|always going to love you|rooting for you|thinking about you}",
  "you {matter|are enough|are loved|are not alone|are missed|deserve better|deserve the world}",

  // ─── SPECIFIC DETAIL messages ──────────────────────────────
  "I {still use|haven't changed|keep typing in} your {netflix|spotify|wifi} password and {you haven't noticed|I think you know|that's probably weird}",
  "I saw {a dog|someone|a couple|a sunset} that {reminded me of you|you would have loved|made me think of you} and {almost cried|smiled|froze|my heart hurt}",
  "I {made|cooked|ordered} {enough food for two|your favorite meal|two coffees} and then {remembered|realized} you're not {coming|here|around anymore}",
  "every time someone {says your name|plays our song|mentions you|wears that cologne} my {heart stops|stomach drops|chest hurts|brain goes blank}",
  "I {went to|visited|sat at} {our spot|the park bench|the lake|where we first met|that restaurant} and just {sat there|cried|remembered everything|talked to you in my head}",
  "your {old texts|voicemails|letters|photos} are {still saved|all I have left|what I go back to} and I {read them sometimes|listen when I can't sleep|look at them too much|refuse to delete them}",

  // ─── EXTRA EXPANSION — crush / attraction ──────────────────
  "I {think about|keep thinking about|can't stop thinking about|dream about} {kissing you|holding your hand|telling you how I feel|asking you out|being with you}",
  "the {butterflies|nervous feeling|heart racing|sweaty palms} I get around you is {ridiculous|embarrassing|the best feeling|driving me crazy|getting worse}",
  "I {changed my route|started going to that cafe|joined that club|picked that class} just to {see you|be near you|run into you|have an excuse to talk to you}",
  "every {playlist|song|poem|drawing|journal entry} I {make|write|create} is secretly about {you|us|how you make me feel|what I wish I could tell you}",
  "my friends {know about you|can tell|figured it out|are tired of hearing about you|tease me about you} and I {don't care|can't help it|am embarrassed|laugh it off}",
  "I {saved|screenshot|kept|downloaded} {your profile pic|that selfie you posted|the photo of us|your story} and I look at it {too much|when I miss you|before I sleep|more than I should}",

  // ─── EXTRA EXPANSION — anger / frustration ─────────────────
  "you {knew|know|always knew} exactly what you were doing when you {said that|left|chose her|lied|ignored me} and that's what {makes it worse|I can't forgive|hurts the most|kills me}",
  "I {trusted|believed|relied on|opened up to|defended} you and you {threw it away|proved me wrong|used it against me|made me look stupid|didn't care}",
  "you {don't get to|can't just|have no right to} {hurt me|leave|lie|walk away} and then {act like nothing happened|play the victim|expect me to be fine|come back when it's convenient}",
  "the {audacity|nerve|absolute nerve|disrespect} of you {texting me|showing up|acting like we're cool|expecting forgiveness|pretending nothing happened} after {what you did|everything|all of that|how you treated me}",
  "I {wasted|spent|gave|threw away} {months|years|my best years|so much time|everything} on someone who {didn't deserve it|never cared|couldn't even be honest|treated me like an option}",
  "you {talk|text|call|show up} when you're {bored|lonely|drunk|sad|fighting with her} and I'm {done being that person|not your backup|tired of it|worth more than that}",

  // ─── EXTRA EXPANSION — family / siblings ───────────────────
  "you are {the best sister|my favorite person|the best brother|my biggest supporter|the reason I kept going} and {I don't say it enough|you need to hear that|I'll never forget what you did for me}",
  "I wish {you were still here|I called more often|we had more time|I said I love you more|things weren't so complicated between us}",
  "you {raised me|took care of me|protected me|sacrificed everything} and {I never thanked you properly|I see that now|I am who I am because of you|I will never forget}",
  "I know {we fight|things are complicated|we don't always get along|I'm difficult} but {you're my person|I love you more than anything|you mean the world to me|I'd be lost without you}",

  // ─── EXTRA EXPANSION — growth / self awareness ─────────────
  "I'm {learning|figuring out|starting to understand|finally seeing} that {I can't fix everyone|I need to put myself first|some things aren't meant to be|not everyone deserves my energy|love isn't supposed to hurt}",
  "the {version of me|person I was|way I acted|love I gave} when I was with you was {not healthy|not sustainable|too much|everything I had|breaking me} and I {see that now|had to learn the hard way|don't blame you|needed to grow}",
  "I {stopped|quit|finally stopped|made myself stop} {checking your profile|driving past your house|listening to our songs|wearing your stuff|rereading our texts} and it's been {hard|painful|freeing|weird|quiet}",
  "I {always|once|genuinely|really|honestly|seriously|literally} {thought|believed|felt like|was convinced} I {needed someone|couldn't be alone|had to be loved|required your validation} to be {happy|complete|enough|whole} and now I {know better|am learning|realize I was wrong|found myself}",
  "healing {looks like|means|is} {unfollowing you|not texting back|crying in the shower|choosing myself for once|letting go of what could have been} and I'm {doing it|trying|getting there|proud of myself}",

  // ─── EXTRA EXPANSION — reconciliation specific ─────────────
  "if you {ever|still} want to {talk|try again|work things out|fix this|be friends}, {I'm here|the door is open|you know where to find me|just say the word|I'd be open to it}",
  "I keep {writing|typing|drafting|starting} messages to you and {deleting them|never sending them|chickening out|closing the app|putting my phone down}",
  "one {conversation|honest talk|real conversation|phone call|sit-down} could {fix everything|change things|clear the air|give us closure|make this better} but {neither of us will|you won't|I'm too scared to|we're both too proud to|nobody wants to} {start it|make the first move|reach out|be the one}",
  "I still {set|keep|leave} {a spot for you|your mug out|your side of the bed|your favorite snack in the fridge} out of {habit|hope|denial|reflex|not wanting to let go}",
  "the {door|offer|invitation|chance} is {still open|always open|never closed|there whenever you want it}. I just need you to {walk through it|say something|show up|take it|try}",

  // ─── EXTRA EXPANSION — long distance / time ────────────────
  "{being apart|the distance|not seeing you|living in different cities} is {the hardest thing|killing me|testing everything|so unfair|making me question everything} but {you're worth it|I'd wait forever|I believe in us|I'm not giving up}",
  "I {count|mark|track|cross off} the days until {I see you|we're together|I can hold you|this distance doesn't matter|I'm in your arms again}",
  "I {fell asleep|stayed up|spent hours} on {facetime|the phone|video call|our call} with you and {it's not the same|I wish you were here|it made me miss you more|your voice is my favorite sound}",
  "every {morning|night|day|hour} in a different timezone from you {hurts|feels wrong|is torture|is the worst part|makes me appreciate you more}",

  // ─── EXTRA EXPANSION — gratitude deep ──────────────────────
  "you {showed up|were there|stayed|held me|sat with me} when {no one else did|I was falling apart|I needed someone most|everyone left|I hit rock bottom} and {that changed everything|I'll never forget|you saved me|I owe you my life}",
  "the way you {love|care|show up|listen|support} {me|people|your friends|everyone around you} makes me want to {be better|try harder|love louder|never take you for granted|protect you}",
  "you {believed in me|saw something in me|pushed me|encouraged me|never gave up on me} when {I couldn't believe in myself|I wanted to quit|no one else did|I was at my lowest|I had nothing}",
  "thank you for {never judging me|accepting my mess|loving my flaws|staying through the worst|being real with me} when {everyone else did|it would've been easier to leave|I gave you every reason not to}",

  // ─── EXTRA EXPANSION — specific memories deep ──────────────
  "I {still think about|can't forget|keep replaying|smile when I remember} {that night we danced|the road trip|when you cooked for me|our first kiss|the time you cried in my arms|when we stayed up all night talking}",
  "the way you {laughed|looked at me|held my hand|sang in the car|fell asleep on my shoulder} that {one time|night|afternoon|day at the beach|evening} still {lives in my head|makes me smile|brings me to tears|feels like yesterday}",
  "remember {that playlist you made me|the notes you left in my locker|when we snuck out|that dumb bet we made|our secret handshake|the time we got caught}? I {never told you|want you to know|think about it constantly|still have it|miss that}",
  "the {smell of|taste of|sound of|feeling of} {rain|coffee|vanilla|the ocean|autumn|that song} takes me {right back to|straight to|instantly to} {you|that day|that summer|when we were happy|the beginning}",

  // ─── EXTRA EXPANSION — identity / personal deep ────────────
  "I {couldn't tell you|was too scared to say|hid it from everyone|kept it inside} because {of who I am|I didn't know how|it wasn't safe|the world isn't kind about it|I was ashamed} but {I loved you|you mattered|it was real|you were everything}",
  "you were the {first person|only one|only human} who {made me feel normal|didn't judge me|saw the real me|accepted all of me|made being myself feel safe} and {I'll never forget that|losing that broke me|I need you to know|thank you}",
  "I'm {tired of|exhausted from|done with|struggling with} {pretending to be okay|hiding who I am|acting like it doesn't hurt|faking it for everyone|carrying this alone} and {you're the only one I can tell|I needed to say it somewhere|this is all I have}",

  // ─── EXTRA EXPANSION — playful / light ─────────────────────
  "you are SO {cute|fine|annoyingly attractive|perfect|unfairly good looking} and you {walk around like it's normal|don't even know it|make it look easy|drive me insane|have no idea what you do to people}",
  "I have a {whole|secret|private|hidden|dedicated} {pinterest board|spotify playlist|journal|notes app|folder} about {you|us|our future|things that remind me of you} and {that's normal right|I'm not ashamed|don't judge me|it's getting long}",
  "told my {therapist|best friend|mom|dog|journal|mirror} about you and {they laughed|they're worried|they said I'm in too deep|they think I should tell you|I cried}",
  "you are SO {annoying|chaotic|loud|dramatic|extra} and I {love every second of it|wouldn't change a thing|can't get enough|am so glad you're in my life|adore you for it}",

  // ─── NOSTALGIA / SEASONS ──────────────────────────────────
  "every {autumn|winter|spring|summer|rainy day|cold night|sunset|sunrise|holiday season} makes me {think of you|miss you more|remember us|ache a little|wish you were here}",
  "{autumn|winter|spring|summer|december|january} was {our season|when we were happiest|when it all fell apart|the best time|when everything changed} and now {it just reminds me|it hurts to see it come|I dread it|I can't enjoy it the same}",
  "the {leaves changing|first snow|cherry blossoms|summer heat|rain on the window|christmas lights|fireflies|fog} will always {be yours|remind me of you|mean something different now|carry your memory|take me back}",
  "{holiday|Christmas|New Years|Thanksgiving|Easter|Valentine's Day|my birthday} felt {wrong|incomplete|empty|different|hollow|less} without {you there|your laugh|you beside me|you this year}",

  // ─── SELF TALK / INNER MONOLOGUE ──────────────────────────
  "I {keep telling|remind|convince|lie to} myself that {I'm over you|I don't care|it didn't matter|I'm fine|you weren't that important} but {my body knows the truth|I cry in the shower|I still check your profile|I can't sleep|I replay everything}",
  "the {brave face|mask|act|front|smile} I {wear|put on|show everyone|maintain} is {exhausting|cracking|starting to slip|so heavy|not fooling anyone}",
  "I {wonder|ask myself|can't figure out|keep questioning} why I {wasn't enough|couldn't make you stay|keep loving people who leave|fall for the wrong ones|give more than I get}",
  "some {mornings|nights|days|moments|hours} I {wake up fine|forget for a second|feel nothing|think I'm healed} and then {it hits me|I remember|a song plays|reality crashes back|your ghost shows up}",
  "the {voice in my head|part of me|thing I won't say out loud|truth I avoid|thought I suppress} is that {I still love you|I'd take you back|I miss you every day|I never got over it|I was the problem}",

  // ─── TOXIC PATTERNS (recognizing them) ────────────────────
  "you were {toxic|manipulative|controlling|emotionally unavailable|gaslighting me|love bombing me} and I {still miss you|kept going back|made excuses|called it love|defended you to everyone}",
  "I {confused|mistook|thought} {chaos for chemistry|fighting for passion|jealousy for love|control for caring|breadcrumbs for effort}",
  "every {red flag|warning sign|toxic trait|hurtful thing|boundary you crossed} looked {like love|like passion|normal|like caring|okay} when I was {in it|young|desperate|lonely|blinded by you}",
  "you {apologized|said sorry|cried|promised to change} {every time|so many times|after every fight|and I believed you|like clockwork} and {nothing ever changed|I kept believing|we did the same dance|I was the fool|here I am again}",
  "I know you're {bad for me|not good for me|a pattern I need to break|everything I should avoid|the worst decision} but {my heart doesn't listen|I keep coming back|I miss the good parts|I romanticize everything|the chemistry blinds me}",

  // ─── PHYSICAL SENSATIONS / BODY ───────────────────────────
  "my {chest|heart|stomach|throat|hands} {hurts|aches|tightens|drops|shakes} every time I {think about you|see your name|hear our song|remember|pass by your street}",
  "I can still {feel your hand|smell your cologne|hear your laugh|taste that last kiss|feel your arms around me} even though {it's been months|you're gone|it's over|we're strangers now|you've moved on}",
  "the {weight|heaviness|pressure|knot|sting} in my chest {won't go away|gets heavier|is always there|only shows up at night|is the only constant}",
  "I {held my breath|stopped breathing|froze|felt my heart stop|went numb} when I {saw your face|heard your voice|read your text|bumped into you|saw you with someone}",

  // ─── SOCIAL MEDIA ERA ─────────────────────────────────────
  "I {unfollowed|muted|blocked|restricted|archived} you and it was {the hardest thing|necessary|liberating|painful|like cutting off a limb} but I {had to|needed to heal|kept checking anyway|regret it|don't regret it}",
  "you {posted that|went live|updated your story|changed your photo|tweeted that} and I {know it was about me|felt it|overthought it|couldn't stop analyzing it|pretended I didn't see}",
  "I {wrote a whole|typed out a long|drafted a|spent an hour on a} {text|DM|email|letter|reply} to you and {never sent it|deleted it|saved it in drafts|read it back and cried|it's still sitting there}",
  "your {online|active|last seen|typing|viewed my story} status {drives me crazy|gives me hope|hurts|means nothing and everything|makes me spiral}",
  "I {stalk|check|visit|look at} your {profile|page|stories|posts|photos} {way too much|more than I should|every night|even though it hurts|and I hate myself for it}",

  // ─── DREAMS / SLEEP ───────────────────────────────────────
  "I {dreamed|dreamt} about you {last night|again|every night this week|for the first time in months} and {woke up reaching for you|it felt so real|I didn't want to wake up|I cried when I opened my eyes|the bed was empty}",
  "{3am|2am|midnight|4am|late at night} is when I {miss you most|think about you|break down|can't pretend anymore|feel everything I avoid during the day}",
  "I {can't sleep|lie awake|toss and turn|stare at the ceiling|count the hours} because {my mind won't stop|I keep replaying us|the silence is too loud|your side of the bed is cold|I'm afraid to dream about you}",
  "the {night|darkness|quiet|silence|emptiness} is when {I lose it|the mask comes off|I feel everything|I'm honest with myself|you creep back in}",

  // ─── MUSIC / ART CONNECTION ───────────────────────────────
  "that {song|album|playlist|artist|lyric} {you showed me|we listened to together|was playing when we kissed|you dedicated to me|reminds me of our drives} still {breaks me|makes me cry|transports me back|won't leave my head|hits different now}",
  "I {heard|found|discovered|finally understood} a song that {perfectly describes|captures exactly|says everything about|nails|puts words to} {us|what we had|how I feel|what I lost|this pain}",
  "music {used to be|was|is} our {language|thing|escape|connection|lifeline} and now every {song|beat|melody|lyric|note} is {a landmine|a trigger|haunted|bittersweet|tainted}",
  "I {can't listen to|skip|avoid|cringe at|break down during} {our song|that album|that playlist|anything we shared|certain artists} because {it takes me right back|I'm not ready|it still hurts|the memories flood in}",

  // ─── FOOD / PLACES ────────────────────────────────────────
  "I {still order|can't stop making|accidentally made|found myself cooking|ordered} {your coffee order|your favorite meal|two plates|enough for us|the thing you always got} and {felt stupid|laughed at myself|cried into it|realized I'm not over it|old habits die hard}",
  "{that restaurant|the diner|our coffee shop|the bar|that bakery|the pizza place} we {always went to|discovered together|had our first date at|spent hours in|called ours} is {ruined for me now|somewhere I avoid|closed actually|still there and it stings|our ghost's favorite spot}",
  "I {went back to|visited|drove past|ate at|couldn't avoid} {our place|that spot|where we first met|your favorite restaurant} and {every corner had your ghost|it wasn't the same|I sat in your seat|I ate alone and felt it|the staff asked about you}",

  // ─── WORK / SCHOOL / DAILY LIFE ───────────────────────────
  "someone {at work|in class|at the store|on the bus|in line} {said something you would say|laughed like you|looked like you|wore your perfume|mentioned your name} and I {lost it|had to step away|froze for a second|smiled and then hurt|almost said your name}",
  "I {got the promotion|graduated|passed the exam|landed the job|achieved the thing} {we used to talk about|you always said I could do|I was working toward when we were together|you never believed I would} and {the first person I wanted to tell was you|you weren't there to celebrate|it felt empty|I wished you saw it}",
  "my {morning|day|commute|routine|schedule} is {built around avoiding|designed to not remind me of|reorganized since|missing the part where|emptier without} {you|our routine|what we had|the things we did together}",

  // ─── PROMISES / COMMITMENTS ───────────────────────────────
  "you said {forever|always|I promise|I'll never leave|we'll figure it out|it's you and me|I'm not going anywhere} and {I believed every word|I should've known|forever lasted 8 months|here I am alone|those words mean nothing now}",
  "I {still believe|want to believe|can't stop believing|foolishly hope|know deep down} that {we'll find our way back|the universe has a plan|this isn't the end|you'll come back|we're not done yet}",
  "we {planned|talked about|dreamed of|imagined|mapped out} {a future|growing old|traveling together|a house|kids|a life} and now {I drive past houses alone|none of that exists|someone else gets that dream|I mourn what could've been|I'm building it without you}",
  "every {promise|plan|dream|word|future} we {made|shared|built|talked about|whispered} is just {a memory now|dust|something that haunts me|proof it was real|a wound that won't close}",

  // ─── BOUNDARIES / SELF RESPECT ────────────────────────────
  "I {chose myself|walked away|set a boundary|said no|stopped answering} for the {first time|first time ever|first time in my life|sake of my health|sake of my sanity} and {it was the hardest thing|I'm proud of that|I cried the whole drive home|I don't regret it|you made it easy}",
  "loving {you|someone|a person} shouldn't {feel like drowning|hurt this much|require losing myself|mean giving up everything|come with conditions|mean begging}",
  "I {deserve|am worth|need|want|have earned the right to} {better|consistency|honesty|effort|someone who stays|love that doesn't hurt|peace}",
  "I'm not {your therapist|your placeholder|someone to keep warm|a safety net|an ego boost|a convenience} and {I refuse to be|I see that now|it took me too long to realize|I wish I knew sooner}",
  "the {moment|day|second|instant|point} I {stopped chasing|quit begging|accepted it was over|let go|chose my peace} was {terrifying|freeing|the best and worst day|when I started healing|when I became myself again}",

  // ─── VULNERABILITY / RAW ──────────────────────────────────
  "I have {never|not once|literally never} {told anyone this|said this out loud|admitted this|written this down|been this honest} but {I loved you more than myself|you broke me|I think about you daily|you were the one|I would still choose you}",
  "this is {embarrassing|pathetic|vulnerable|raw|terrifying|hard} to {say|write|admit|put into words|type} but {I need to get it out|you deserve to know|I can't hold it anymore|someone has to hear it|this app is all I have}",
  "the {scariest|most vulnerable|hardest|bravest|most terrifying} thing I {ever did|have ever done|could do|had to do} was {loving you|trusting you|letting you in|opening up|telling you how I felt|being honest}",
  "I'm {writing this|typing this|saying this|sending this|posting this} because {I'll never say it to your face|you'll never see it|I need to let go|the words are rotting inside me|holding it in is killing me}",

  // ─── COMPARISON / MOVING ON STRUGGLES ──────────────────────
  "I {went on a date|met someone|tried to move on|kissed someone new|downloaded the app} and {all I could think about was you|compared them to you|felt nothing|cried after|it confirmed what I already knew}",
  "everyone says {you'll find someone better|time heals|there are other people|move on|get over it} but {nobody feels like you|time just makes it different|I don't want other people|it's not that simple|they don't understand}",
  "the {new person|rebound|next one|someone after you|person I'm seeing} is {great|kind|everything I should want|good on paper|nice} but {they're not you|something is missing|I feel guilty|I can't connect|my heart isn't in it}",
  "I {keep|catch myself|can't stop|hate that I} {comparing everyone to you|looking for you in other people|measuring them against us|searching for your traits|wanting what we had from someone else}",

  // ─── SPECIFIC SMALL MOMENTS ───────────────────────────────
  "I saw {a couple|two people|someone} {holding hands|laughing together|sharing food|being in love|kissing in the rain|arguing then making up} and {my heart cracked|I looked away|I smiled but it hurt|all I thought was that used to be us}",
  "you {left|forgot} your {toothbrush|earring|hoodie|socks|charger|book|mug} here and I {can't throw it away|use it sometimes|stare at it|put it in a box|sleep with it}",
  "the {grocery store|pharmacy|gas station|laundromat|parking lot} is where I {broke down|cried in public|lost it|finally felt it hit me|realized you were really gone}",
  "I {wave|nod|smile|say hi|pretend} when I {see your mom|run into your friends|pass your brother|see your family} and {die inside|wonder if they know|hope they don't hate me|miss them too|act normal}",
  "your {laugh|voice|smile|way of walking|handwriting|the way you pronounce certain words} {plays in my head|is something I'm terrified of forgetting|I hear in crowds|is imprinted in me|I'd recognize anywhere}",

  // ─── TIME PASSING ─────────────────────────────────────────
  "it's been {347|112|89|203|a thousand} days since {you left|we talked|I last saw you|it ended|you walked away} and {yes I'm counting|I counted just now|I wish I wasn't tracking|every single one hurt}",
  "time {doesn't heal|isn't healing this|is supposed to help|keeps moving|passes differently now} the way {they said it would|people promise|I hoped|the quotes say|movies show}",
  "{a year ago|six months ago|two years ago|last summer|this time last year} we were {happy|inseparable|planning forever|laughing about something stupid|in each other's arms} and now {we're strangers|I don't recognize us|look at us|it's like it never happened|you're a memory}",
  "the {calendar|clock|days|weeks|months} keep {moving|going|ticking|passing|piling up} and I {keep standing still|am stuck in that moment|can't move forward|feel frozen|am slowly starting to catch up}",

  // ─── WHAT IFS ─────────────────────────────────────────────
  "what if {I had stayed|you had stayed|we tried harder|we met at a different time|I said yes|I didn't say that|I picked up the phone|we were braver}",
  "I {replay|rewrite|reimagine|fantasize about|dream of} {our ending|that last day|what could've been|an alternate timeline|a version where we make it} and {it always hurts|in every version we're happy|I torture myself|none of them are real|I can't stop}",
  "in {another life|a parallel universe|a different timeline|some other version of this|my head} we {made it|are still together|figured it out|are happy|never ended|got it right}",
  "if {timing|distance|circumstances|life|our ages|our families|fear} wasn't {a factor|the issue|in the way|against us|the problem} we would {still be together|be married|be happy|have been forever|have made it work}",

  // ─── ACCEPTANCE / PEACE ───────────────────────────────────
  "I'm {choosing|finding|making|learning|fighting for} {peace|acceptance|closure|myself|my own happiness} even though {it means losing you|you never gave me closure|it's painful|every cell in me resists|I wanted us to work}",
  "maybe {we were never meant to last|it was a chapter not the whole book|we met for a reason and that reason is over|some love is temporary|you were the lesson not the destination}",
  "I {stopped being angry|released the resentment|forgave you in my heart|let go of the bitterness|made peace with it} not because {you deserve it|what you did was okay|I forgot|I'm over it} but because {I deserve peace|I was tired of carrying it|it was killing me|I need to move forward}",
  "the {truth|reality|thing I finally accept|hardest pill|honest answer} is that {we were great but not right|love isn't always enough|I can love you and still leave|some people are meant to be temporary|it's over and I'm going to be okay}",

  // ─── RANDOM LIFE OBSERVATIONS ─────────────────────────────
  "I {wonder|think about|question|ask myself} if {love is supposed to hurt this much|I'll ever love anyone the way I loved you|we peak at one love and everything after is just trying|the universe is punishing me|second chances are real}",
  "everyone's {getting married|having kids|building lives|moving forward|growing up} and I'm {still here|stuck on you|not over a text from 2 years ago|processing the same heartbreak|barely functioning}",
  "the {irony|cruelest part|funniest thing|most painful twist|plot twist} is that {you taught me to love and then left|I became who you wanted after you left|you're with someone like me|I'm better now but you'll never see it|we were perfect on paper}",
  "I {don't believe in|still believe in|want to believe in|have given up on|am terrified of} {love|soulmates|forever|second chances|trusting someone again|opening up} {after you|because of you|since you|now}",

  // ─── DIRECT ADDRESS (no name, raw) ────────────────────────
  "you {owe me|at least owe me|could've given me|should've had the decency to give me} {an explanation|closure|the truth|an honest conversation|a real goodbye|one last chance to understand}",
  "I {hope|pray|wish} you {feel it someday|understand what you lost|grow from this|never do this to someone else|realize how good we were|think of me when it rains}",
  "the {least|minimum|bare minimum} you could {do|have done|give me} is {be honest|explain|apologize|acknowledge what happened|admit you were wrong|not pretend we never existed}",
  "stop {texting me|calling me|watching my stories|reaching out|showing up} if you're not going to {choose me|stay|mean it|commit|follow through|actually do something about it}",
  "you know {exactly|damn well|perfectly well} {what you did|how you hurt me|why I'm like this|the effect you have on me|what you're doing} so don't {act confused|play dumb|pretend|act innocent|gaslight me}",

  // ─── GRATITUDE FOR THE PAIN ───────────────────────────────
  "you {breaking me|leaving|hurting me|walking away|destroying us} was the {best worst thing|push I needed|beginning of something better|painful gift|wake up call|turning point} {and I'm grateful now|that changed everything|that saved me|that forced me to grow|in disguise}",
  "I {hated you|was so angry|wanted to destroy everything|cursed your name|cried for months} but {now I understand|I get it|I see the bigger picture|I'm grateful|it all makes sense}",
  "losing you {taught me|showed me|forced me to learn|revealed|made me realize} {who I am|my own strength|what I actually need|that I'm enough alone|how to love myself first}",

  // ─── SPECIFIC AGES / GROWTH ───────────────────────────────
  "the {17|18|19|20|21|22|15|16} year old me who {loved you|met you|fell for you|gave you everything|believed in us} would {not recognize|be proud of|cry seeing|hug|forgive} the {person I am today|me now|version of me that survived|adult I became}",
  "I {met you|loved you|lost you|found you|needed you} at {the wrong time|the right time|a time I was broken|my lowest|my most vulnerable|a crossroads} and {that's what makes it hurt|I wonder if timing was the only problem|life isn't fair|I'm still processing it}",
  "I {grew up|matured|became an adult|found myself|healed} {without you|in your absence|because you left|on my own|in spite of everything} and {it's bittersweet|you wouldn't recognize me|I wish you could see|I'm proud and sad|I did it}",

  // ─── UNSENT LETTER STYLE ──────────────────────────────────
  "this is {my goodbye|the closure I'm giving myself|the last thing I'll write about you|what I should've said|the truth I owed you|my final word}",
  "I don't {need you to respond|expect anything|want your pity|care if you read this|need your permission|want an apology anymore}. I just {needed to say it|had to write it down|wanted you to know|needed to let it go|had to release it}",
  "by the time {you read this|this matters|you realize|you care|you look back} it'll {be too late|be years from now|not matter anymore|be just words|be a memory of a memory}",
  "I'll {never send this|probably delete this|keep this forever|read this in 10 years and cry|forget I wrote this|come back to this when I'm stronger}",

  // ─── MISCELLANEOUS UNIQUE ─────────────────────────────────
  "if you're {reading this|out there|wondering|thinking about texting me|looking at the sky right now too}, {I still love you|I hope you're okay|I forgive you|I'm doing better|hi}",
  "the {hardest|bravest|scariest|most grown up|realest} thing I {ever did|have done|had to do|am doing} was {walking away from you|choosing myself|forgiving you|admitting I was wrong|saying goodbye}",
  "you {didn't break me|don't get that credit|weren't the villain|weren't the hero either|were just a person} you were just {a lesson|a chapter|someone I loved too much|part of my story|passing through}",
  "I {carry|hold|keep|remember|treasure|protect} {what we had|our memories|the good parts|the love|your words} {like a bruise|like a secret|like a scar|close to my chest|in a place nobody can touch}",
  "some {days|mornings|nights|hours|moments} I {miss you|love you|hate you|forgive you|need you|feel nothing} and {I never know which one it's going to be|they change by the hour|all of them feel true|it's exhausting|that's just life now}",

  // ─── ADDITIONAL HIGH-COMBO TEMPLATES ───────────────────────
  "I {think|wonder|worry|ask myself|stay up thinking} about whether {you ever loved me|I was just convenient|we were real|any of it mattered|you think about me too} and {it eats me alive|I'll never know|I'm scared of the answer|I hate not knowing}",
  "the {problem|thing|truth|issue|reality} was {never you|never me|us|the timing|that we wanted different things} it was {everything around us|how we handled it|that we stopped trying|fear|pride}",
  "{Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday} {mornings|nights|afternoons|evenings} are {when I miss you most|the hardest|when it all hits|when I feel it|when I break down}",
  "I {pretend|act like|fake|convince everyone|tell people} {we're cool|I've moved on|it doesn't bother me|I'm over it|I'm happy} when {really I'm dying|I still check your profile|I cried yesterday|my heart is shattered|nothing has changed}",
  "you had {my whole heart|everything I had|my trust|my loyalty|my vulnerability|my future} and you {treated it like nothing|dropped it|didn't care|used it|threw it back}",
  "the {thing|part|detail|memory|moment} that {haunts me|I replay|won't leave|I fixate on|I can't shake} is {the look on your face|what you said last|how quiet it was|that you didn't cry|how easy it seemed for you}",
  "I'm {doing|learning|trying|forcing myself|slowly getting} {new things|hobbies|routines|habits|anything} to {fill the void|stop thinking|distract myself|forget|replace what we had|become someone new}",
  "you {smell like|remind me of|feel like|sound like|taste like} {home|safety|nostalgia|pain|everything I want|a memory I can't reach}",
  "the {first|last|only|worst|best} {thing|word|look|touch|moment} between us was {unforgettable|the most real thing I've felt|burned into me|what I hold onto|what I keep coming back to}",
  "I {built|created|constructed|designed|arranged} my {entire life|whole world|daily routine|future plans|identity} around {you|us|what we had|being yours|our love} and now {I have to start over|it's all rubble|I don't know who I am|I'm standing in the wreckage|nothing fits}",
  "{nobody|no one|not a single person|none of them|nothing} {compares|comes close|measures up|feels the same|hits the same} and I {hate that|am terrified of that|know it's true|wish it wasn't|keep trying anyway}",
  "I {learned|found out|realized|discovered|finally understood} that {I was the toxic one|I pushed you away|it was my fault too|I wasn't innocent|I contributed to our end} and {I'm working on it|I'm sorry|it keeps me up|I wish I could redo it|I'll be better next time}",
  "you were {right|correct|honest|not wrong|telling the truth} about {everything|me|us|what would happen|how it would end} and I {was too stubborn|didn't listen|see it now|owe you that|wish I heard you then}",
  "I {found|noticed|saw|discovered|stumbled on} {a note you wrote|your handwriting|an old photo|a video of us|your birthday card to me} and {collapsed|couldn't breathe|time stopped|I smiled through tears|I kept it}",
  "{rain|thunder|the cold|darkness|silence|a full moon|cloudy skies} {makes me think of you|reminds me of that night|takes me back|is our weather|feels like you}",
  "I {don't know|can't figure out|will never understand|keep asking|am confused about} {why you left|how you stopped loving me|what I did wrong|when it changed|if any of it was real}",
  "the {way|fact} that I {can laugh again|found joy|am healing|smile now|don't cry as much} doesn't mean I {forgot you|don't miss you|am over it|don't love you still|wouldn't go back if I could}",
  "I {regret|miss|mourn|grieve|ache for} {the version of us|who we were|the early days|before things got complicated|when loving you was easy|the beginning}",
  "you {were|are|became|turned into|represent} {the standard|the benchmark|what I measure everyone against|impossible to follow|a hard act to follow} and {that's not fair to anyone|I know that's unhealthy|nobody asked for that|I'm working on it|everyone suffers}",
  "I keep {your photo|our chat|your number|that voicemail|your letter|that text} {in my phone|in my wallet|under my pillow|in a box|hidden} like {evidence|proof|a secret|a lifeline|the last piece of you}",
  "{graduation|prom|the wedding|that party|my birthday|Christmas dinner|new years} would have been {different|better|perfect|complete|bearable|less lonely} with {you|you there|you beside me|your hand in mine|your laugh in the room}",
  "I {started|picked up|got into|began|dove into} {therapy|journaling|working out|meditation|painting|running} {because of you|after you left|to process us|to heal from this|to become who I should've been}",
  "some {love|people|connections|bonds|relationships} are {supposed to end|not meant to last|beautiful and temporary|lessons disguised as forever|chapters not books}",
  "the {silence|space|emptiness|distance|void} you left behind {screams|echoes|rings|reverberates|speaks louder than you ever did}",
  "I {packed up|boxed|stored|hid|gathered} {your things|our memories|everything of yours|the gifts|the photos} and it felt like {a funeral|closing a book|surgery|amputation|saying goodbye to a version of me}",
  "{strangers|acquaintances|people who barely know me} can tell {something's different|I'm carrying something|I'm not the same|I'm hurting|something broke} and I {don't even hide it well|laugh it off|change the subject|say I'm fine|blame allergies}",
  "I {accidentally|almost|nearly|instinctively|reflexively} {called you|texted you|said your name|typed your number|opened your chat} and {caught myself|panicked|felt stupid|laughed sadly|let it ring once then hung up}",
  "the {version of you|you that I remember|person you were|way you used to be} and {who you are now|the current you|what you became|you today} feel like {two different people|strangers|a before and after|a split timeline|someone I invented}",
  "I {wear|still wear|haven't taken off|hold onto|sleep in} {your ring|that bracelet|your necklace|the shirt you gave me|your watch} because {it's all I have|taking it off means it's real|I'm not ready|it still smells like you|I'm sentimental}",
  "the {worst days|hardest moments|times I break|moments I lose it|darkest hours} are {when I forget|when I reach for you|when no one's watching|birthdays and holidays|when I hear your name in public}",
  "I {write|journal|type|scribble|pour out} {everything|my feelings|what I can't say|these words|this mess} because {talking is too hard|nobody would understand|it's all I have|the page doesn't judge|my therapist is booked}",
  "you {live|exist|remain|persist|linger} in {every love song|every sunset|every coffee shop|every slow dance|every rom com|every quiet moment} and {I can't escape it|it's beautiful and cruel|I stopped fighting it|I'm learning to coexist with it}",
  "I {gave you|offered you|showed you|handed you} {my deepest secrets|the parts nobody sees|my most vulnerable self|everything I hide|the real me} and {you held it so gently|you used it against me|you kept it safe|you let it fall|you didn't know what to do with it}",
  "the {relationship|bond|love|connection|thing} we {had|built|created|shared|lived} was {imperfect|messy|real|raw|chaotic|flawed} and {that's what made it beautiful|I wouldn't trade it|I miss every part|it taught me everything|that's why it hurts so much}",
  "{age|time|distance|maturity|life|growth} has {softened|changed|shifted|evolved|reframed} how I {see us|remember you|feel about it|understand what happened|look back} and {I'm grateful|I'm at peace|I still hurt|I'd do it again|I forgive us both}",
  "I {whisper|pray for|manifest|wish for|send out|put into the universe} {good things for you|that you're okay|peace for us both|your healing|happiness for you} even though {you'll never know|we don't talk|you hurt me|I'm still broken|you wouldn't do the same}",
  "our {story|love|chapter|time|saga|mess} {deserved|earned|warranted|needed|should've had} a {better ending|proper goodbye|final conversation|real closure|chance to try again|different outcome}",
  "I {didn't eat|couldn't sleep|skipped class|called in sick|cancelled plans|drove aimlessly} for {days|weeks|a month|way too long} after {you left|we ended|that night|the text|I found out}",
  "the {way|speed|ease|casualness} you {moved on|got over it|started dating|seemed fine|forgot} makes me {question everything|feel crazy|wonder if I imagined us|spiral|doubt my own memory}",
  "I {cried|broke down|lost it|sobbed|fell apart} in {the car|the bathroom|the shower|a parking lot|my room|a public restroom} and {nobody knew|I cleaned up and went back|I let it happen|it was the most honest I'd been|I needed it}",
  "you {texted|called|reached out|messaged|showed up} {at the worst time|when I was finally moving on|right when I was healing|after months of silence|out of nowhere} and {ruined my progress|set me back|I wasn't ready|everything came flooding back|I didn't respond}",
  "I {trace|reread|revisit|scroll through|analyze} our {old conversations|text history|DMs|photos together|voicemails} looking for {the moment it changed|where it went wrong|signs I missed|proof you loved me|clues I ignored}",
  "the {thought|idea|possibility|chance|hope} that {you might come back|we could try again|this isn't permanent|there's still something there|you miss me too} is {what keeps me going|dangerous|probably delusion|the only thing I have|fading but still there}",
  "I {celebrate|mark|acknowledge|remember|honor} the {milestones|achievements|wins|moments|growth} {we talked about|you helped me reach|that belong partly to you|that remind me of our plans|that feel incomplete without you}",
  "you {showed me|taught me|revealed|opened my eyes to|introduced me to} what {love|trust|safety|vulnerability|happiness|companionship} {could look like|feels like|is supposed to be|tastes like|really means} and then {took it away|left with it|disappeared|walked out|proved it temporary}",

  // ─── FINAL BATCH — push past 10K ──────────────────────────
  "I {keep thinking|catch myself wondering|can't shake the thought|lie awake asking} {what if we met now|would it be different now|if the timing was just wrong|whether we'd work today|if you've changed too}",
  "you {walked into|crashed into|stumbled into|entered|appeared in} my {life|world|universe|story|chaos} and {nothing was ever the same|everything shifted|I didn't ask for it|rearranged everything|wrecked the plan I had}",
  "there are {moments|seconds|flashes|instants|glimpses} where I {forget|let go|am free|don't think of you|almost breathe normally} and then {it rushes back|gravity returns|I remember|something triggers it|the ache restarts}",
  "I {used to think|once believed|was so sure|naively thought|genuinely believed} {love conquers all|we were different|we'd be the exception|forever existed|nothing could break us} and {you proved me wrong|reality happened|life disagreed|here we are|I was foolish}",
  "the {most unfair|cruel|twisted|ironic|backwards} part is {I still root for you|I'd still help you|I wish you well|I can't hate you|I want your happiness}",
  "my {phone|camera roll|gallery|notes app|search history} is {a graveyard|a museum|a shrine|a minefield|evidence} of {us|you|what we were|memories I can't delete|a past I haven't processed}",
  "I {told|swore to|promised|begged|convinced} myself {never again|not this time|I wouldn't|I'd be stronger|I learned my lesson} and {here I am|look at me|I'm doing it again|my heart had other plans|nothing changed}",
  "you {left a mark|changed my DNA|rewired my brain|altered my chemistry|broke and rebuilt me} and {you have no idea|I'm still dealing with it|I'll carry it forever|nobody sees it|it's invisible but permanent}",
  "{sunsets|the ocean|empty chairs|train stations|airports|highways at night|park benches} {remind me of you|feel like you|carry your energy|are where I feel you|make my chest tight|bring you back}",
  "the {bravest|scariest|hardest|most painful|realest} {version of me|part of my story|moment of my life|chapter|decision} was {letting you go|choosing to stay|forgiving you|walking away|admitting the truth}",
  "I {refuse to believe|can't accept|won't accept|reject the idea|don't buy} that {this is it|we're really over|love dies like this|you meant nothing|people are just temporary}",
  "you {ruined|wrecked|destroyed|broke|poisoned} {a perfectly good song|my favorite movie|that restaurant|coffee shops|rain|autumn|that color} for me and {I'll never tell you|you don't even know|I think that's funny actually|I forgive you for it|it's the little things that linger}",
  "I {practice|rehearse|imagine|draft|plan} {what I'd say to you|our reunion conversation|the perfect response|how I'd act cool|running into you} {in the mirror|in the shower|driving home|at 3am|while walking alone} and {it never goes like that|I always cry|I know I'd freeze|I nail it every time except in reality}",
  "the {loneliest|emptiest|quietest|most hollow|saddest} {feeling|moment|experience|thing|realization} is {missing someone who's alive|grieving someone who's still here|wanting someone you can't have|losing someone who chose to leave|being forgotten by someone you remember daily}",
  "I {hope|wish|pray|need|am trying to believe} that {the pain has a purpose|this is building something|I'll understand someday|it was worth it|I'm becoming who I need to be|there's light at the end}",
];

console.log(`Base templates: ${TPL.length}`);
console.log(`Expansion templates: ${EXPAND.length}`);

// ═══════════════════════════════════════════════════════════════
// GENERATION ENGINE — slot-based expansion + name variation
// ═══════════════════════════════════════════════════════════════

// Resolve {opt1|opt2|opt3} slots by picking one randomly
function resolveSlots(tpl) {
  return tpl.replace(/\{([^{}]+)\}/g, (match, inner) => {
    // Skip {N} — that's a name placeholder handled separately
    if (inner === 'N') return match;
    const opts = inner.split('|');
    if (opts.length < 2) return match; // not a slot
    return R(opts);
  });
}

function generate() {
  const pool = [];
  const seen = new Set();
  const nameUsage = {};
  const templateUsage = new Map();  // track per-template usage
  const MAX_TPL_USES = 40;  // no single template used more than this

  // Build available names list with usage tracking
  function getName() {
    const shuffled = [...UNAMES].sort(() => Math.random() - 0.5);
    for (const n of shuffled) {
      if ((nameUsage[n] || 0) < 8) return n;
    }
    return null;
  }

  function tryAdd(msg, name, tplIdx) {
    if (!msg || msg.length < 2) return false;
    const w = wc(msg);
    if (w > 25 || w < 1) return false;
    if (msg.length > 250) return false;

    const key = msg.toLowerCase().trim();
    if (seen.has(key)) return false;

    seen.add(key);
    nameUsage[name] = (nameUsage[name] || 0) + 1;
    if (tplIdx !== undefined) templateUsage.set(tplIdx, (templateUsage.get(tplIdx) || 0) + 1);
    pool.push({ name, message: msg.trim(), color_id: R(CARD_COLORS) });
    return true;
  }

  // Phase 1: Use each base template once (direct, no modification)
  console.log('Phase 1: Base templates...');
  const indices = [...Array(TPL.length).keys()].sort(() => Math.random() - 0.5);
  for (const idx of indices) {
    const tpl = TPL[idx];
    const name = getName();
    if (!name) break;
    let msg = tpl.replace(/\{N\}/g, name);
    tryAdd(msg, name);
  }
  console.log(`  ${pool.length} entries`);

  // Pre-calculate each template's max viable uses based on combinatorial space
  function countCombos(tpl) {
    let product = 1;
    tpl.replace(/\{([^{}]+)\}/g, (match, inner) => {
      if (inner === 'N') return match;
      const opts = inner.split('|');
      if (opts.length >= 2) product *= opts.length;
      return match;
    });
    return product;
  }
  const templateCaps = EXPAND.map(tpl => {
    const combos = countCombos(tpl);
    return Math.min(Math.max(Math.floor(combos * 0.5), 5), 100);
  });

  // Phase 2: Expand slot-based templates with dynamic per-template cap
  console.log('Phase 2: Slot-based expansion...');
  let attempts = 0;
  let lastLog = pool.length;
  while (pool.length < 10000 && attempts < 500000) {
    attempts++;
    // Pick a random template that hasn't been overused
    const tplIdx = Math.floor(Math.random() * EXPAND.length);
    if ((templateUsage.get(tplIdx) || 0) >= templateCaps[tplIdx]) continue;

    const tpl = EXPAND[tplIdx];
    const name = getName();
    if (!name) { console.log('  Names exhausted at', pool.length); break; }

    let msg = resolveSlots(tpl);
    msg = msg.replace(/\{N\}/g, name);
    tryAdd(msg, name, tplIdx);

    if (pool.length >= lastLog + 1000) {
      lastLog = pool.length;
      console.log(`  ${pool.length} entries (${attempts} attempts)`);
    }
  }
  console.log(`  ${pool.length} entries after Phase 2 (${attempts} attempts)`);

  // Log template usage stats
  const usages = [...templateUsage.values()].sort((a,b) => b-a);
  console.log(`  Template usage: max=${usages[0]}, min=${usages[usages.length-1]}, avg=${(usages.reduce((a,b)=>a+b,0)/usages.length).toFixed(1)}`);
  const capped = [...templateUsage.entries()].filter(([idx, u]) => u >= templateCaps[idx]).length;
  console.log(`  Templates at cap: ${capped}/${EXPAND.length}`);

  pool.sort(() => Math.random() - 0.5);
  return pool;
}

// ─── VALIDATION ──────────────────────────────────────────────
function validate(pool) {
  const NAME_REGEX = /^[a-zA-Z\s'\-]+$/;
  let errors = 0;
  const messageSet = new Set();
  const nameCount = {};

  for (let i = 0; i < pool.length; i++) {
    const e = pool[i];
    if (!NAME_REGEX.test(e.name)) { console.error(`[${i}] Bad name: "${e.name}"`); errors++; }

    const words = wc(e.message);
    if (words > 25) { console.error(`[${i}] Over 25 words (${words}): "${e.message}"`); errors++; }
    if (words < 1) { console.error(`[${i}] Empty`); errors++; }
    if (e.message.length > 250) { console.error(`[${i}] Over 250 chars`); errors++; }

    if (!CARD_COLORS.includes(e.color_id)) { console.error(`[${i}] Bad color: "${e.color_id}"`); errors++; }

    const key = e.message.toLowerCase().trim();
    if (messageSet.has(key)) { console.error(`[${i}] Duplicate: "${e.message.substring(0,50)}..."`); errors++; }
    messageSet.add(key);

    nameCount[e.name] = (nameCount[e.name] || 0) + 1;
  }

  const overused = Object.entries(nameCount).filter(([,c]) => c > 8);
  if (overused.length > 0) {
    console.error(`Names >8: ${overused.map(([n,c]) => `${n}(${c})`).join(', ')}`);
    errors += overused.length;
  }

  // Check for unresolved template tokens
  const leaked = pool.filter(e => /\{[^}]*\|[^}]*\}/.test(e.message));
  if (leaked.length > 0) {
    console.error(`Unresolved slots: ${leaked.length}`);
    leaked.slice(0,5).forEach(e => console.error(`  "${e.message}"`));
    errors += leaked.length;
  }

  return errors;
}

// ─── RUN ─────────────────────────────────────────────────────
console.log('Generating 10,000 unique human-like messages (v4)...\n');
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
const colorDist = {};
CARD_COLORS.forEach(c => colorDist[c] = 0);
pool.forEach(e => colorDist[e.color_id]++);
console.log('\nColor distribution:');
Object.entries(colorDist).sort((a,b) => b[1]-a[1]).forEach(([c,n]) => {
  console.log(`  ${c}: ${n} (${(n/pool.length*100).toFixed(1)}%)`);
});

const lcCount = pool.filter(e => e.message === e.message.toLowerCase()).length;
console.log(`\nCasing: ${lcCount} lowercase (${(lcCount/pool.length*100).toFixed(1)}%), ${pool.length-lcCount} mixed/caps`);

const avgWords = pool.reduce((s,e) => s + wc(e.message), 0) / pool.length;
console.log(`Average word count: ${avgWords.toFixed(1)}`);

const nameUsed = new Set(pool.map(e => e.name)).size;
console.log(`Unique names used: ${nameUsed}`);

// Pattern diversity check
const msgPatterns = {};
pool.forEach(e => {
  const p = e.message.split(/\s+/).slice(0,4).join(' ').toLowerCase();
  msgPatterns[p] = (msgPatterns[p] || 0) + 1;
});
const topP = Object.entries(msgPatterns).sort((a,b) => b[1]-a[1]).slice(0,20);
console.log('\nTop 20 opening patterns:');
topP.forEach(([p,n]) => console.log(`  "${p}": ${n}`));

// Sample output
console.log('\n── Sample messages ──');
for (let i = 0; i < 30; i++) {
  const e = pool[i];
  console.log(`  To: ${e.name} → "${e.message}"`);
}
