#!/usr/bin/env node
// =============================================================
// generate-messages.mjs
// One-time script to produce scripts/seed-messages.json
// Contains 500+ hand-crafted message templates + 400+ names
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
import { createHash, randomUUID } from 'crypto';
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
  // Spanish / Latin (Male)
  'Santiago','Mateo','Diego','Alejandro','Carlos','Miguel','Andres','Pablo','Rafael','Fernando',
  'Javier','Luis','Eduardo','Roberto','Manuel','Jorge','Marco','Emilio','Rodrigo','Hector',
  'Sergio','Raul','Arturo','Enrique','Oscar','Cesar','Victor','Alberto','Ignacio','Tomas',
  'Angel','Cristian','Francisco','Gonzalo','Ivan','Julian','Lorenzo','Martin','Ricardo','Salvador',
  // Spanish / Latin (Female)
  'Valentina','Camila','Valeria','Mariana','Daniela','Sofia','Gabriela','Lucia','Elena','Natalia',
  'Maria','Carmen','Rosa','Adriana','Alicia','Julieta','Catalina','Ximena','Renata','Isabella',
  'Fernanda','Alejandra','Ana','Beatriz','Carolina','Dolores','Esperanza','Flora','Gloria','Ines',
  'Jimena','Karla','Laura','Marisol','Nadia','Paloma','Regina','Silvia','Teresa','Yolanda',
  // Indian (Male)
  'Arjun','Rohan','Aditya','Vikram','Karan','Rahul','Aarav','Siddharth','Varun','Arnav',
  'Dhruv','Kabir','Shiv','Dev','Nikhil','Vivek','Akash','Manish','Raj','Sahil',
  'Aman','Ankit','Deepak','Gaurav','Harsh','Ishaan','Jay','Kunal','Lakshman','Mohan',
  'Naveen','Om','Pranav','Rishi','Suresh','Tanmay','Utkarsh','Veer','Yash','Aryan',
  'Krishna','Sagar','Amar','Ajay','Kartik','Neel','Parth','Rishabh','Sameer','Vishal',
  // Indian (Female)
  'Priya','Ananya','Ishita','Neha','Shreya','Pooja','Kavya','Aisha','Divya','Riya',
  'Meera','Tara','Anika','Sana','Nisha','Simran','Aditi','Trisha','Kiara','Zara',
  'Aaradhya','Bhavya','Charvi','Diya','Esha','Fatima','Gauri','Harini','Isha','Jaya',
  'Khushi','Lavanya','Mahi','Nandini','Oviya','Payal','Radhika','Sakshi','Tanvi','Urmi',
  'Vaishnavi','Anushka','Swara','Saanvi','Mahika','Myra','Pihu','Riddhi','Siya','Vedika',
  // Filipino (Male)
  'Angelo','Joshua','Carl','Jericho','Kenneth','Renz','Paolo','Tristan','Cedric','Vince',
  'Gelo','Mark','Jayden','Miguel','Rafael','Jerome','Francis','Enzo','Darren','Gabriel',
  'Andre','Benedict','Christian','Dominic','Elijah','Ian','Jed','Kyle','Lance','Martin',
  'Neil','Patrick','Ray','Sean','Theo','Warren','Aldrin','Bryan','Cyrus','Dennis',
  // Filipino (Female)
  'Jasmine','Althea','Keziah','Bea','Francine','Marian','Shaira','Aimee','Katrina','Rica',
  'Janelle','Princess','Nina','Angelica','Chelsea','Denise','Erica','Faye','Gia','Hannah',
  'Iris','Julie','Kim','Lara','Mae','Nadine','Patrice','Rhea','Sophia','Trixie',
  'Andrea','Bianca','Carla','Dawn','Ella','Gwen','Hailey','Joanna','Kristine','Leah',
  // Arabic / Middle Eastern (Male)
  'Omar','Yusuf','Adam','Hassan','Khalid','Tariq','Samir','Ibrahim','Zain','Faisal',
  'Karim','Rami','Ali','Hamza','Bilal','Sami','Nabil','Amir','Rashid','Jamal',
  'Ahmed','Basil','Daoud','Ehab','Farid','Ghazi','Hadi','Ismail','Jawad','Kareem',
  'Latif','Majid','Nasir','Qasim','Rafiq','Said','Tahir','Wahid','Yasser','Zayd',
  // Arabic / Middle Eastern (Female)
  'Layla','Amira','Noura','Hana','Yasmin','Fatima','Leila','Mariam','Sara','Noor',
  'Dina','Salma','Reem','Jana','Maha','Lina','Dalal','Rania','Huda','Lamia',
  'Amal','Basma','Duaa','Esra','Farida','Ghada','Hayat','Inas','Jumana','Khadija',
  'Lubna','Muna','Najwa','Ola','Rawia','Samira','Tahani','Wafa','Yara','Zahra',
  // Korean (Male)
  'Jimin','Minho','Jungkook','Taehyung','Seojun','Jaehyun','Donghyuk','Sunwoo','Woojin','Hyun',
  'Siwoo','Hajun','Jiho','Doyun','Junseo','Yejun','Eunwoo','Hyunjin','Taemin','Changmin',
  'Junwoo','Minseok','Seungho','Yoongi','Jinhyuk','Kyungsoo','Sangwoo','Dongwoo','Hoseok','Inhyuk',
  // Korean (Female)
  'Sora','Yuna','Jihye','Eunji','Minji','Sooyoung','Haeun','Chaewon','Dahyun','Soojin',
  'Jiwon','Seoyeon','Hayeon','Subin','Nayeon','Yeji','Ryujin','Chaeyoung','Seulgi','Jihyo',
  'Miyeon','Shuhua','Yuqi','Minnie','Jisoo','Jennie','Yeri','Irene','Wendy','Tzuyu',
  // Japanese (Male)
  'Haruto','Yuto','Sota','Ren','Kaito','Riku','Hayato','Hinata','Takumi','Sora',
  'Yuma','Asahi','Minato','Shota','Akira','Daiki','Eiji','Fumiya','Genki','Hikaru',
  'Itsuki','Jiro','Kenji','Makoto','Naoki','Ryo','Shinji','Taro','Yuki','Kenta',
  // Japanese (Female)
  'Sakura','Hina','Yui','Aoi','Mio','Rin','Koharu','Mei','Akari','Honoka',
  'Haru','Nana','Saki','Misaki','Ayaka','Chihiro','Emi','Fumiko','Haru','Izumi',
  'Kanon','Mana','Natsuki','Riko','Sayuri','Tomoko','Wakana','Yoko','Chiaki','Kana',
  // French (Male)
  'Theo','Hugo','Louis','Raphael','Jules','Antoine','Pierre','Maxime','Alexandre','Nicolas',
  'Baptiste','Clement','Damien','Etienne','Florian','Guillaume','Hadrien','Jean','Laurent','Mathieu',
  'Olivier','Philippe','Quentin','Romain','Sylvain','Thierry','Valentin','Xavier','Yann','Fabien',
  // French (Female)
  'Chloe','Lea','Manon','Camille','Juliette','Elise','Margot','Lucie','Marie','Sophie',
  'Amelie','Brigitte','Charlotte','Delphine','Elodie','Fleur','Genevieve','Helene','Ines','Josephine',
  'Laure','Madeleine','Nathalie','Oceane','Pauline','Roxane','Sandrine','Colette','Vivienne','Adele',
  // African (Male)
  'Kwame','Kofi','Tendai','Chidi','Emeka','Oluwaseun','Jabari','Amare','Obinna','Sekou',
  'Tunde','Jelani','Nnamdi','Dayo','Idris','Kojo','Ayoub','Boubacar','Cedrick','Diallo',
  'Ekon','Faraji','Gideon','Hamidi','Issa','Jomo','Kamau','Lekan','Musa','Nkosi',
  'Olu','Pape','Rashidi','Simba','Thabo','Uche','Wole','Yaw','Zuberi','Adewale',
  // African (Female)
  'Amara','Nia','Zuri','Ayanda','Thandiwe','Abena','Ife','Nala','Adaeze','Imani',
  'Chioma','Akosua','Aminata','Fatou','Nkechi','Ayana','Binta','Chiamaka','Dahlia','Efua',
  'Folake','Gifty','Hadiza','Iyabo','Jamila','Keza','Lira','Makena','Nandi','Omolara',
  'Palesa','Rashida','Sade','Temi','Uju','Wangari','Yetunde','Zanele','Abigail','Chinwe',
  // Brazilian / Portuguese (Male)
  'Thiago','Gustavo','Bruno','Felipe','Leonardo','Guilherme','Caio','Vitor','Pedro','Henrique',
  'Arthur','Bernardo','Daniel','Eduardo','Gabriel','Igor','Joao','Kaique','Luan','Matheus',
  'Nicolas','Otavio','Paulo','Rafael','Samuel','Tiago','Vinicius','Wagner','Yago','Andre',
  // Brazilian / Portuguese (Female)
  'Beatriz','Larissa','Amanda','Juliana','Fernanda','Leticia','Bruna','Isabela','Rafaela','Gabriela',
  'Ana','Bianca','Camila','Daniela','Eduarda','Flavia','Helena','Ingrid','Jessica','Kelly',
  'Livia','Marina','Natalia','Patricia','Renata','Sabrina','Tatiana','Vanessa','Yasmin','Aline',
  // Eastern European / Slavic (Male)
  'Nikolai','Mikhail','Dmitri','Ivan','Sergei','Aleksei','Andrei','Maxim','Viktor','Boris',
  'Anton','Bogdan','Cyril','Denis','Evgeni','Fyodor','Grigori','Igor','Kirill','Leonid',
  'Matvei','Oleg','Pavel','Roman','Stanislav','Timur','Vadim','Vladislav','Yaroslav','Zakhar',
  // Eastern European / Slavic (Female)
  'Anya','Katya','Natasha','Olga','Mila','Irina','Daria','Svetlana','Polina','Vera',
  'Alina','Anastasia','Ekaterina','Galina','Ksenia','Lada','Marina','Nina','Oksana','Rada',
  'Sofia','Tatiana','Valentina','Yelena','Zoya','Larisa','Tamara','Lydia','Nadia','Raisa',
  // Nordic / Scandinavian (Male)
  'Erik','Lars','Sven','Axel','Magnus','Nils','Leif','Bjorn','Odin','Gunnar',
  'Anders','Emil','Filip','Gustaf','Henrik','Johan','Karl','Lukas','Martin','Niklas',
  'Oskar','Per','Rasmus','Sigurd','Torsten','Ulrik','Viktor','Wilhelm','Arne','Dag',
  // Nordic / Scandinavian (Female)
  'Freya','Astrid','Ingrid','Saga','Elsa','Sigrid','Linnea','Thea','Maja','Liv',
  'Alma','Britta','Dagny','Elin','Frida','Greta','Hedda','Idun','Johanna','Karin',
  'Lovisa','Matilda','Nora','Oda','Petra','Ragnhild','Signe','Tilda','Ulla','Vigga',
  // Turkish (Male)
  'Emre','Burak','Cem','Alp','Baris','Mert','Kaan','Arda','Deniz','Onur',
  'Ahmet','Berat','Cihan','Doruk','Efe','Furkan','Gokhan','Halil','Ilker','Kerem',
  'Levent','Murat','Necip','Oguz','Polat','Recep','Serkan','Taner','Umut','Volkan',
  // Turkish (Female)
  'Elif','Defne','Zeynep','Yagmur','Selin','Ebru','Nazli','Tugba','Ceren','Asli',
  'Aylin','Buse','Cansu','Damla','Ezgi','Fulya','Gulnur','Hazal','Ipek','Kardelen',
  'Melis','Neslihan','Ozge','Pelin','Reyhan','Sevgi','Tulay','Yeliz','Zeliha','Bahar',
  // Chinese (Male)
  'Wei','Jin','Hao','Chen','Liang','Feng','Ming','Jun','Bo','Lei',
  'Yong','Tao','Kai','Rui','Jie','Cheng','Peng','Sheng','Zhi','Gang',
  'Qiang','Xin','Hong','Shan','Long','Hua','Guang','Dong','Nan','Yang',
  // Chinese (Female)
  'Mei','Xiao','Ying','Fang','Hui','Yan','Li','Na','Ting','Xue',
  'Yue','Jing','Qian','Shu','Wen','Lan','Min','Ping','Rong','Zhen',
  'Ai','Bao','Cui','Dan','En','Fei','Ge','Han','Juan','Kun',
  // Vietnamese (Male)
  'Anh','Minh','Duc','Thanh','Phong','Tuan','Hieu','Long','Dung','Hung',
  'Bao','Cuong','Dat','Giang','Huy','Khoa','Loc','Nam','Phat','Quang',
  // Vietnamese (Female)
  'Linh','Thao','Mai','Hoa','Lan','Trang','Ngoc','Hanh','Phuong','Tuyet',
  'An','Bich','Chi','Dao','Ha','Kieu','Lien','My','Nhu','Oanh',
  // Thai (Male)
  'Chai','Krit','Prem','Somchai','Tanawat','Nat','Pong','Sak','Ton','Win',
  'Aran','Bank','Chart','Dej','Ek','Gun','Jett','Kan','Nai','Pat',
  // Thai (Female)
  'Ploy','Fah','Nong','Pim','Nan','Som','Dao','Lek','Bua','Joy',
  'Aom','Bee','Gam','Ice','Kwan','May','Noi','Opal','Pang','Rung',
  // Greek (Male)
  'Nikos','Yannis','Dimitri','Kostas','Stavros','Petros','Giorgos','Alexis','Andreas','Vasilis',
  'Christos','Elias','Fotis','Ilias','Kosmas','Leonidas','Marios','Panos','Sotiris','Thanasis',
  // Greek (Female)
  'Eleni','Maria','Sophia','Athena','Katerina','Daphne','Irene','Penelope','Thalia','Zoe',
  'Ariadne','Calliope','Demetra','Evangelia','Fotini','Georgia','Helena','Ioanna','Konstantina','Lydia',
  // Polish (Male)
  'Jakub','Mateusz','Szymon','Kacper','Filip','Wojciech','Bartek','Dawid','Piotr','Tomasz',
  'Adam','Aleksander','Bartosz','Cezary','Dominik','Emil','Grzegorz','Hubert','Jan','Konrad',
  // Polish (Female)
  'Zuzanna','Lena','Julia','Maja','Hanna','Aleksandra','Amelia','Wiktoria','Oliwia','Natalia',
  'Agnieszka','Barbara','Celina','Dorota','Ewa','Gabriela','Izabela','Karolina','Magdalena','Patrycja',
  // Persian / Iranian (Male)
  'Arash','Darius','Farhad','Kaveh','Mehdi','Navid','Omid','Reza','Saman','Behnam',
  'Amir','Cyrus','Ehsan','Hossein','Iman','Javad','Kian','Milad','Nima','Payam',
  // Persian / Iranian (Female)
  'Shirin','Parisa','Maryam','Narges','Setareh','Bahar','Azadeh','Darya','Elham','Fatemeh',
  'Ghazal','Hasti','Kimia','Laleh','Mahsa','Nasrin','Parastoo','Roxana','Sahar','Tina',
  // Malay / Indonesian (Male)
  'Adi','Budi','Dimas','Farhan','Haris','Irfan','Johan','Rizal','Syafiq','Yusof',
  'Arief','Bagus','Cahya','Eko','Fajar','Galih','Hafiz','Iwan','Lukman','Nugroho',
  // Malay / Indonesian (Female)
  'Putri','Siti','Dewi','Rani','Fitri','Laila','Maya','Wulan','Ratna','Ayu',
  'Bunga','Citra','Dian','Eka','Gita','Indah','Kartini','Lestari','Melati','Nirmala',
  // Hungarian (Male)
  'Balazs','Csaba','Gabor','Istvan','Levente','Miklos','Tamas','Zoltan','Andras','Bence',
  // Hungarian (Female)
  'Eszter','Fanni','Katalin','Noemi','Reka','Vivien','Anna','Dorottya','Hanna','Lilla',
  // Romanian (Male)
  'Andrei','Cristian','Dragos','Mihai','Radu','Stefan','Alexandru','Bogdan','Cosmin','Florin',
  // Romanian (Female)
  'Ioana','Mihaela','Raluca','Simona','Andreea','Bianca','Cristina','Daniela','Elena','Gabriela',
  // Gender-neutral / Universal
  'Alex','Sam','Jordan','Taylor','Morgan','Casey','Quinn','Avery','Cameron','Jesse',
  'Jamie','Robin','Charlie','Drew','Sage','Eden','Skyler','River','Phoenix','Blake',
  'Reese','Dakota','Rowan','Emery','Finley','Marlowe','Lennox','Haven','Nico','Mika',
  'June','Ruby','Ace','Kit','Wren','Clay','Nash','Lane','Jude','Beau',
  'Heath','Troy','Dean','Ezra','Iris','Alma','Noa','Ada','Eve','Mara',
  'Arlo','Blair','Corey','Dallas','Ellis','Flynn','Harley','Jess','Kerry','Lee',
  'Marley','Noel','Pat','Rory','Shay','Toni','Val','Winter','Ashton','Bay',
];

// Deduplicate names (some names appear across multiple regions)
const UNIQUE_NAMES = [...new Set(NAMES)];

// ─── MESSAGE TEMPLATES BY CATEGORY ──────────────────────────
// Each message is a standalone string, written to sound like a real human.
// ~80% lowercase, ~20% mixed case. Varied punctuation, abbreviations, typos.

const LOVE_LONGING = [
  "i still love you and i don't think that's ever going to change",
  "you're the only person who ever made me feel like i was enough",
  "i think about you every single day and it scares me",
  "i never stopped loving you. i just stopped showing it",
  "everything reminds me of you and i hate it",
  "i wish you knew how much you mean to me",
  "you were my favorite person and you didn't even know it",
  "i'd wait for you. i think i always will",
  "my heart still skips when i see your name",
  "i loved you in a way i'll never love anyone else",
  "you were my person. i miss that more than anything",
  "i still have all your texts saved. i read them sometimes",
  "the way you looked at me that night. i'll never forget it",
  "you made ordinary days feel like something worth remembering",
  "i dream about you more than i'd like to admit",
  "i loved you before i even knew what love was",
  "some days i still reach for my phone to text you",
  "you changed my life and you don't even know it",
  "i would choose you in every lifetime",
  "you were the best part of my worst days",
  "i still listen to our playlist when i miss you",
  "nobody else makes me feel the way you did",
  "i fell for you the moment you laughed at my stupid joke",
  "you are the most beautiful soul i have ever known",
  "i love you more than i love myself and that's the problem",
  "i wrote your name in my journal again today",
  "you make me want to be a better person",
  "i've never felt this way about anyone before you",
  "i think i'll always love you. even from far away",
  "i saved the hoodie you left at my place. it still smells like you",
  "you are my 11:11 wish every single time",
  "i love you so much it physically hurts sometimes",
  "i want to grow old with you more than anything in this world",
  "my favorite sound is your laugh. i miss it every day",
  "i still look for you in every crowded room",
  "i can't listen to that song without thinking of you",
  "every love song makes sense because of you",
  "i wish i could tell you how much i care",
  "you're the first person i want to talk to when something good happens",
  "i've loved you quietly for so long now",
  "you're the reason i believe in love at all",
  "i love you. there. i said it. even if you'll never see this",
  "being near you feels like coming home",
  "my heart is yours even if you don't want it",
  "i'd give anything to hear you say my name one more time",
  "you're the missing piece i keep looking for in everyone else",
  "even on my worst days you're the first thing i think about",
  "i loved you with everything i had. it still wasn't enough",
  "you don't know it but you saved me",
  "i think about what we could have been all the time",
  "i would drop everything if you asked me to",
  "you feel like a song i want to listen to on repeat forever",
  "i didn't know what love was until you showed me",
  "every time i close my eyes i see your face",
  "i'm still in love with you and i probably always will be",
  "the way you say my name is my favorite thing",
  "i keep your picture in my wallet still",
  "i love you more than words could ever say",
  "you're the only person who feels like home to me",
  "i still get butterflies when i think about you",
  "you were the one. you'll always be the one",
  "i can't stop thinking about you and it's been months",
  "i love everything about you even the parts you hate",
  "you make me believe good things can happen to me",
  "i'd cross oceans for you without hesitation",
  "i hope you know how loved you are even if i can't say it",
  "your smile is the most beautiful thing i've ever seen",
  "i think you're my soulmate. i really do",
  "my world got brighter the day i met you",
  "i'd rather have a lifetime of missing you than never having known you",
  "you feel like the calm after a storm",
  "i still pick up my phone to text you goodnight",
  "i love you in ways i didn't think were possible",
  "you made me feel safe when nothing else did",
  "my heart knows your name before my mind does",
  "i think i loved you from the very first moment",
  "i'm terrified of how much i need you",
  "you're the thought that keeps me up at 3am",
  "i want you. just you. always",
  "you're the kind of love people write songs about",
  "i still get nervous around you even after all this time",
  "i hope you think of me half as much as i think of you",
  "loving you is the easiest and hardest thing i've ever done",
  "i carry you with me everywhere i go",
  "i didn't choose to love you. it just happened",
  "the best moments of my life all have you in them",
  "i still remember exactly how your hand felt in mine",
  "you're the only person i've ever wanted to fight for",
  "i wish i could pause time whenever i'm with you",
  "you're my favorite chapter in this messy life",
  "i love you beyond what i can put into words",
  "some people come into your life and change everything. you did that",
  "i never want to know what my life looks like without you",
  "i love how you make me laugh when i want to cry",
  "i'll love you even when the world ends",
  "you're the one constant in my chaotic life",
  "i want to spend every boring sunday morning with you",
  "you see me. really see me. and that's everything",
  "i'd choose your worst day over anyone else's best",
  "i didn't know my heart could feel this full",
  "you're the reason i look forward to tomorrow",
  "i love you and i think part of me always knew i would",
  "you're the first person who made love feel safe",
  "i'd rather argue with you than laugh with anyone else",
  "i love you like the moon loves the night",
  "you're the good in every bad day i've ever had",
  "i still remember the first time you hugged me",
  "i'd walk through fire just to see you smile",
  "you made me realize what i actually deserve",
  "loving you taught me what it means to be vulnerable",
  "i think you're the love of my life and i never told you",
  "you are my calm in every storm",
  "my favorite memory is any memory with you in it",
  "i love you. not the way you think. more",
  "you're the kind of person i want to wake up next to every day",
  "i think about your eyes more than i should",
  "you're everything i never knew i needed",
  "i'll never regret loving you no matter what happens",
  "you're the warmth i keep coming back to",
  "i didn't know i was lost until you found me",
  "you make my heart do stupid things",
  "i think the universe put you in my life for a reason",
  "i love you quietly but deeply",
  "i'd give up everything for five more minutes with you",
  "you feel like a warm blanket on a cold night",
  "i wish i could hold your hand right now",
  "i'm yours even if you don't know it yet",
];

const HEARTBREAK_BREAKUP = [
  "i miss who you were before everything fell apart",
  "you broke me in ways i didn't know i could break",
  "i gave you everything and you threw it away like nothing",
  "the worst part is i still care about you",
  "you were the love of my life and the source of my pain",
  "i hope she treats you better than you treated me",
  "i'm still picking up the pieces you left behind",
  "you left and took the best parts of me with you",
  "i trusted you with my heart and you crushed it",
  "i keep wondering what i did wrong",
  "you moved on so fast it made me question everything we had",
  "i hope you regret losing me one day",
  "i'm not the same person i was before you broke my heart",
  "you promised you'd never leave and then you did",
  "i hate that i still miss you after everything",
  "you chose her and that's something i'll never understand",
  "i used to think we were unbreakable. i was so wrong",
  "the hardest part was realizing i meant nothing to you",
  "you walked away like i was easy to forget",
  "i loved you more than you deserved and we both know it",
  "i didn't just lose a partner. i lost my best friend",
  "you said forever and i was stupid enough to believe you",
  "i'm still healing from the way you left",
  "you were my biggest lesson and my deepest wound",
  "the way you ended things will haunt me for a long time",
  "i don't miss you. i miss who i thought you were",
  "you made me feel like i wasn't worth staying for",
  "we were supposed to make it. what happened to us",
  "you stopped loving me and forgot to tell me",
  "i wish i could hate you but i can't",
  "you ruined love for me. i hope you know that",
  "i'm angry at myself for still wanting you back",
  "you said you'd never hurt me. that was the biggest lie",
  "i don't think you realize how much damage you did",
  "i still sleep on my side of the bed even though you're gone",
  "i keep replaying our last conversation in my head",
  "you didn't just break my heart you broke my trust",
  "i wonder if you think about me at all",
  "it took me months to stop looking for your car in parking lots",
  "i'm trying to move on but everything reminds me of you",
  "you were the worst thing that happened to me and the best",
  "i still flinch when someone says your name",
  "i wish i never met you. and i wish i could stop wishing that",
  "you left me at my lowest and i'll never forgive you for that",
  "the empty side of my bed still feels wrong",
  "i thought we were building something real",
  "you made me afraid to love again",
  "i gave you my whole heart and you only wanted half",
  "you moved on like our years together were nothing",
  "i hate how you're fine and i'm still falling apart",
  "i can't believe i wasted so many tears on you",
  "you made love feel like something i should be afraid of",
  "i keep deleting our photos and then pulling them from trash",
  "you chose the easy way out instead of fighting for us",
  "i wish you fought harder for what we had",
  "some nights the silence where your voice used to be is deafening",
  "i think about the last time you kissed me and it breaks me",
  "you were supposed to be different",
  "i'm learning to live without you but i don't want to",
  "you let me go like i was nothing",
  "i'll never understand how you could just stop caring",
  "the saddest part is i'd still take you back",
  "you taught me that love isn't always enough",
  "i can't believe we went from everything to nothing",
  "you broke my heart and i still check on you",
  "i keep wondering if she makes you happier than i did",
  "you left but your ghost lives in every corner of my room",
  "i hate that you're happy without me",
  "i still wear the bracelet you gave me even tho we're done",
  "you threw us away like we meant nothing at all",
  "the night you left i couldn't breathe for hours",
  "i loved you through things i shouldn't have tolerated",
  "we could have been so much more if you just tried",
  "you left me with questions i'll never get answers to",
  "i can't listen to our song anymore without crying",
  "i think about the last time we were happy and it hurts so bad",
  "you made me feel so small in the end",
  "i'm still not over you and i hate myself for it",
  "the worst part is knowing you don't even think about me",
  "you destroyed something beautiful because you were scared",
  "i loved you through every version of yourself. you couldn't do the same",
  "you stopped trying and expected me not to notice",
  "i wonder if you miss me or if i imagined everything",
  "you left without even saying goodbye properly",
  "i thought we'd figure it out. i thought we had time",
  "you hurt me in ways i'm still discovering",
  "some days i'm fine. other days i miss you so much i can't function",
  "you said i was your world and then you left the planet",
  "i'm tired of pretending i'm okay without you",
  "you made me feel disposable",
  "we burned so bright and then you just let us go out",
  "i keep hoping you'll text me but you never do",
  "you left and i had to learn how to be alone all over again",
  "the worst heartbreak is the one you never saw coming",
  "you didn't even give us a chance to fix things",
  "i miss the way things were before you changed",
  "you made me believe in us and then took it all away",
  "i'm still angry and i'm still sad and i still love you",
  "i can't even look at photos from that year anymore",
  "you replaced me so fast like i was temporary all along",
];

const GRIEF_LOSS = [
  "i miss you every single day. heaven is lucky to have you",
  "i wish i could hear your voice one more time",
  "the world feels emptier without you in it",
  "i talk to you even though you can't hear me anymore",
  "i never got to say goodbye and it eats me alive",
  "i see you in everything beautiful and it breaks my heart",
  "grief doesn't get smaller. you just learn to carry it differently",
  "i wish i told you i loved you more when i had the chance",
  "the hardest part is accepting that you're really gone",
  "i still set a place for you at the table sometimes",
  "i would give anything for one more day with you",
  "you left a hole in my life that no one else can fill",
  "some days the grief hits me like it just happened",
  "i still can't delete your number from my phone",
  "i hope wherever you are you're at peace",
  "you were taken too soon and it's not fair",
  "i keep things the way you left them. i can't move them",
  "i see you in the sunset every evening",
  "i hope you know how much you were loved",
  "the world keeps moving but mine stopped when you left",
  "i still buy your favorite flowers. old habits",
  "i miss your laugh the most. nothing sounds like it",
  "i pray you're watching over me from somewhere",
  "i carry your memory with me like a wound that won't heal",
  "i thought i'd have more time with you. i was wrong",
  "the holidays feel wrong without you here",
  "i keep waiting for you to walk through the door",
  "you were my safe place. now i have nowhere to go",
  "i talk about you in present tense. i can't use past",
  "i miss you more than words will ever capture",
  "i found your old jacket today. i just held it and cried",
  "i wish i could dream about you more often",
  "you deserved so much more time on this earth",
  "i light a candle for you every night before bed",
  "nothing prepares you for losing someone you love this much",
  "i still smell your perfume sometimes and it stops me cold",
  "your birthday is the hardest day of the year for me now",
  "i named my daughter after you. you would have loved her",
  "you taught me everything about love before you left",
  "i promise to live the life you wanted for me",
  "i miss our conversations more than anything",
  "i know you'd tell me to stop crying and start living",
  "losing you was the worst thing that ever happened to me",
  "i see your face in strangers sometimes and my heart stops",
  "i'll carry you with me until it's my turn to go",
  "you left fingerprints on my heart that will never fade",
  "i wish you could see who i've become because of you",
  "the first year without you was the longest year of my life",
  "i don't think i'll ever fully heal from losing you",
  "i hope you found the peace you couldn't find here",
  "rest easy. i'll take care of everything you left behind",
  "i miss the way you called me by my nickname",
  "i still have the last voicemail you left me",
  "some losses change you forever. losing you changed everything",
  "i'll never stop missing you. never",
  "you were the strongest person i ever knew",
  "i would trade anything to hug you one more time",
  "grief is just love with nowhere to go",
  "you're gone but you'll never be forgotten",
  "i visit your spot every sunday. it helps a little",
];

const REGRET_APOLOGY = [
  "i'm sorry i wasn't brave enough to tell you how i felt",
  "i should have treated you better when i had the chance",
  "i regret every word i said that night. i was so wrong",
  "i'm sorry for leaving when you needed me most",
  "if i could go back i would do everything differently",
  "i was too proud to apologize and now it's too late",
  "i should have fought for us instead of walking away",
  "i'm sorry i took you for granted. you deserved so much more",
  "i wish i could undo the damage i caused",
  "i was selfish and scared and i hurt the one person who mattered",
  "i think about the things i said and i hate myself for them",
  "you deserved a better version of me and i'm sorry you didn't get it",
  "i should have called you back. i'll always regret that",
  "i'm sorry i wasn't there when you needed someone",
  "my biggest regret is not telling you i loved you sooner",
  "i was wrong. about everything. and i'm so sorry",
  "i wish i chose you instead of my pride",
  "i let fear ruin the best thing that ever happened to me",
  "i owe you an apology that words can't fully express",
  "i'm sorry for the silence when you needed me to speak up",
  "i should have listened to you more instead of always being right",
  "i was a coward and you paid the price for it",
  "i didn't realize what i had until it was gone. classic i know",
  "i'm sorry for every time i made you feel unimportant",
  "i pushed you away because i was scared of how much i loved you",
  "i regret not showing up for you when it counted",
  "i should have held on tighter instead of letting go",
  "i hurt you and i know sorry doesn't fix it but i am",
  "i wish i could take back the years i wasted being angry",
  "i'll never forgive myself for how i made you cry",
  "you gave me grace i didn't deserve and i threw it away",
  "i'm sorry for being absent when you needed me present",
  "the biggest mistake of my life was letting you walk away",
  "i should have been kinder. i know that now",
  "i regret not appreciating the small things you did for me",
  "i was toxic and i'm only now realizing how much i hurt you",
  "i'm sorry i didn't fight for us. i was a coward",
  "if i could take it all back i would in a heartbeat",
  "i owe you years of apologies and i don't know where to start",
  "i should have chosen you every single time",
  "i was so caught up in my own pain i forgot about yours",
  "i'm sorry i made you feel like you weren't enough. you always were",
  "i lied to protect myself and it cost me everything",
  "i'm sorry for the version of me that hurt you",
  "i should have stayed. i know that now",
  "i let my insecurities ruin something beautiful. i'm so sorry",
  "i'm sorry i couldn't be what you needed me to be",
  "i wish i had the guts to say all this to your face",
  "i failed you and i think about it every day",
  "my ego cost me the best person in my life",
  "i'm sorry i ghosted you. you deserved an explanation at least",
  "i should have been honest with you from the start",
  "i hope someday you can forgive me even if i don't deserve it",
  "i was the villain in your story and i hate that",
  "i hurt the only person who actually gave a damn about me",
  "i'm sorry for wasting your time pretending i was ready",
  "i wish i could rewrite our ending",
  "i let you down and i'll carry that with me forever",
  "i was wrong and i've been too scared to admit it until now",
  "i'm sorry i made you feel alone when i was right there",
];

const FRIENDSHIP = [
  "i miss you and our friendship more than you'll ever know",
  "you were my person before everything got complicated",
  "i wish we could go back to how we used to be",
  "i miss late night talks with you about nothing and everything",
  "you were the best friend i ever had and i ruined it",
  "i think about our old memories all the time",
  "i hope you're doing well even though we don't talk anymore",
  "i still consider you my best friend even if you don't",
  "i miss laughing with you until we couldn't breathe",
  "i didn't realize how much i needed you until you were gone",
  "you were the only one who truly understood me",
  "i hope life is treating you well. you deserve it",
  "i wish we didn't grow apart. i miss us",
  "i'd give anything to have one more night hanging out like we used to",
  "you taught me what real friendship looks like",
  "i'm sorry our friendship ended the way it did",
  "nobody gets my humor the way you did",
  "i still laugh at our inside jokes even alone",
  "you were more than a friend. you were family",
  "i wonder if you miss me the way i miss you",
  "i keep almost texting you when funny things happen",
  "our friendship was the most important relationship of my life",
  "i hope wherever you are you have people who love you like i did",
  "i'm sorry i let distance ruin what we had",
  "you knew me better than anyone and that terrified me",
  "i miss road trips with you and singing off key in the car",
  "we were supposed to be friends forever. what happened",
  "i think about you every time i hear that dumb song we loved",
  "i hope you found friends who appreciate you the way i should have",
  "you made my worst years bearable just by being there",
  "i miss having someone who just gets it without me having to explain",
  "i should have been a better friend to you and i'm sorry",
  "i still keep the birthday card you made me. it's in my drawer",
  "i miss the person i was when i was around you",
  "you made me feel less alone in this world",
  "our friendship was the kind of thing people write stories about",
  "i'd drop everything to see you if you asked",
  "i miss having a person. you were that person for me",
  "i regret choosing a relationship over our friendship",
  "nobody has ever known me the way you did",
  "i still check your social media sometimes just to see you're okay",
  "you were the sister i never had and i miss you so much",
  "i can't believe we went from inseparable to strangers",
  "i think the worst heartbreak is losing your best friend",
  "i miss watching bad movies with you at 2am",
  "our friendship felt effortless. i miss that feeling",
  "i hope you know you'll always have a place in my heart",
  "i wish i could text you right now but i know i shouldn't",
  "you were the only one who never judged me",
  "i miss having someone to tell everything to",
];

const SELF_REFLECTION = [
  "i need to learn how to love myself before i try again",
  "i'm scared that i'll never feel happy again",
  "some days i don't recognize the person in the mirror",
  "i've been pretending to be okay for so long i forgot what okay feels like",
  "i think i'm finally ready to let go of who i used to be",
  "i'm tired of being strong all the time. i just want to rest",
  "i don't know who i am without you and that scares me",
  "i need to stop looking for myself in other people",
  "i'm learning that healing isn't linear and that's okay",
  "i deserve better than what i keep accepting",
  "i've been running from my feelings for too long",
  "i need to forgive myself before i can forgive anyone else",
  "i'm trying to be someone i'd be proud of",
  "the version of me that existed with you is gone now",
  "i think the loneliest feeling is being surrounded by people and still feeling alone",
  "i'm done shrinking myself to make other people comfortable",
  "i keep choosing people who can't love me the way i need",
  "i'm learning to sit with the discomfort instead of running from it",
  "i think i finally understand what they mean by growing pains",
  "i need to stop waiting for someone to save me and save myself",
  "i'm tired of being an afterthought in everyone's life",
  "i deserve the love i keep giving to everyone else",
  "i've been carrying other people's baggage and ignoring my own",
  "i think i'm finally ready to start over",
  "i'm learning that being alone doesn't mean being lonely",
  "i need to stop apologizing for taking up space",
  "i've outgrown people i never thought i would",
  "i'm choosing myself for the first time and it's terrifying",
  "i need to stop romanticizing people who hurt me",
  "the hardest conversation i'll ever have is with myself",
  "i'm not the same person i was a year ago and i'm glad",
  "i've been my own worst enemy for way too long",
  "i'm slowly learning that i am enough just as i am",
  "i keep looking for closure when i need to give it to myself",
  "i think the bravest thing i ever did was ask for help",
  "i'm unlearning everything that made me small",
  "i need to stop letting fear make my decisions for me",
  "i've spent my whole life trying to be loved instead of loving myself",
  "i'm finally starting to see my own worth",
  "i've been so focused on surviving i forgot to live",
];

const UNSENT_CONFESSIONS = [
  "i like you. a lot. more than i should probably admit here",
  "i've been in love with you since that day at the park",
  "i think about kissing you more than i'd ever say out loud",
  "you have no idea how nervous you make me",
  "i've liked you for three years and you still don't know",
  "i'm too scared to tell you how i feel so i'm writing it here",
  "every time you touch my arm i forget how to breathe",
  "i think about you when i should be sleeping",
  "you're the reason i started caring about how i look",
  "i stare at you in class and pray you don't notice",
  "i wrote your name in my notebook like we're in middle school",
  "i get jealous when you talk to other people and i hate that about myself",
  "i think you might like me back but i'm too scared to find out",
  "you smiled at me today and it made my entire week",
  "i wish i had the courage to ask you out",
  "i practice what i'd say to you in the mirror",
  "my friends are tired of hearing about you but i can't stop",
  "i think we'd be great together if i could just say something",
  "you make my heart race and you don't even try",
  "i liked you the moment you walked into the room",
  "i keep finding excuses to be near you and it's embarrassing",
  "i get butterflies every time i see your name pop up on my phone",
  "i think you're beautiful and i wish i could tell you that",
  "i wrote this because i'll never have the guts to say it to your face",
  "i can't focus on anything when you're around",
  "you looked at me today and i swear my heart stopped",
  "i've had a crush on you forever and it's not going away",
  "i wonder what it would be like to hold your hand",
  "i replay our conversations in my head before i fall asleep",
  "you're the kind of person i'd be lucky to end up with",
  "i'm too shy to tell you but i think you're amazing",
  "i want to be more than friends but i'm terrified of losing you",
  "i keep hoping you'll notice me the way i notice you",
  "you have no idea the effect you have on me",
  "i like you and i think you might like me too but neither of us will say it",
  "i'd rather love you from a distance than lose you up close",
  "you are the most interesting person i've ever met",
  "i noticed the little things about you that nobody else sees",
  "i got tongue tied every time i tried to tell you",
  "you're the first thing on my mind when i wake up",
];

const ANGER_FRUSTRATION = [
  "you don't deserve the energy i still spend thinking about you",
  "i'm done making excuses for the way you treated me",
  "you lied to my face and smiled while doing it",
  "stop pretending you cared. your actions told me everything",
  "i'm angry at myself for letting you treat me that way",
  "you were never the person you pretended to be",
  "i wasted years on someone who never deserved a day",
  "you knew exactly what you were doing and you did it anyway",
  "i hope karma finds you. i really do",
  "the audacity you had to act like the victim after what you did",
  "i'm not sad anymore. i'm furious",
  "you don't get to hurt me and then act like nothing happened",
  "i'm tired of people like you getting away with everything",
  "you made me feel crazy for having valid feelings",
  "you gaslit me and i believed every word. never again",
  "i trusted you with my darkest secrets and you used them against me",
  "you broke every promise you ever made and then blamed me",
  "i shouldn't have to beg someone to treat me with basic respect",
  "you strung me along knowing you didn't feel the same",
  "stop texting me when you're bored. i'm not your backup plan",
  "you treated me like an option and expected loyalty in return",
  "you didn't love me. you loved having someone love you",
  "i saw the real you and honestly i wish i hadn't",
  "you chose her over me and now you want me back. absolutely not",
  "i'm not going to sit around waiting for you to decide i'm worth it",
  "the fact that you sleep fine at night knowing what you did disgusts me",
  "you never apologized because you never cared enough to",
  "i gave you chance after chance and you wasted every single one",
  "you love bombed me and then disappeared like i was nothing",
  "i can't believe i cried over someone who felt nothing for me",
  "you didn't break me. you revealed who you really are",
  "the worst part is other people think you're a good person",
  "i'm tired of forgiving people who aren't even sorry",
  "you used me and i let you. that's on both of us",
  "i'm angry that i still care about someone who never cared about me",
  "you took the best years of my life and gave me trauma in return",
  "you showed me your true colors and they were ugly",
  "i deserve so much better than the crumbs you gave me",
  "you only reach out when you need something. i see you clearly now",
  "i was loyal to a fault and you took full advantage of that",
];

const HOPE_HEALING = [
  "i hope we find our way back to each other someday",
  "i'm finally learning to be okay on my own",
  "one day this won't hurt anymore and i look forward to that",
  "i believe everything happens for a reason even when it hurts",
  "maybe in another life we'll get it right",
  "i'm healing slowly but i'm healing and that's enough for now",
  "i hope the future version of us gets the happy ending we deserved",
  "i'm letting you go not because i want to but because i need to",
  "someday i'll look back on this and smile instead of cry",
  "i'm choosing to believe that better things are coming",
  "i hope you find whatever it is you're looking for",
  "maybe we needed to fall apart to grow into who we're supposed to be",
  "i'm starting to understand that some things aren't meant to be fixed",
  "i wish you nothing but happiness even though you broke my heart",
  "i think we'll meet again when we're both ready",
  "i'm learning to let go of things i can't control",
  "i hope one day you'll understand why i had to walk away",
  "the universe has a plan even when i can't see it",
  "i'm grateful for what we had even though it ended",
  "maybe we're just two right people who met at the wrong time",
  "i'm starting to find joy in small things again and it feels good",
  "i forgive you. not for you but for me",
  "i hope wherever you are you're smiling",
  "one day i'll tell this story and it won't sting anymore",
  "i'm becoming the person i needed when i was younger",
  "i choose to believe that love will find me again",
  "i hope time heals what my words never could",
  "i'm letting go of the person i wanted you to be",
  "maybe our story isn't over. maybe it's just paused",
  "i'm finally starting to feel like myself again",
  "i hope you're taking care of yourself the way you took care of me",
  "i believe we'll find each other in the next life",
  "i'm learning that endings can also be beginnings",
  "i hope you grow into the person i always saw in you",
  "the sun still rises even after the darkest night",
  "i'm stronger than i was yesterday and that's enough",
  "i'm rooting for you even from the sidelines",
  "i hope life gives you everything you gave me",
  "someday this pain will make sense. i have to believe that",
  "i'm healing and it's messy but it's happening",
  "i hope we meet again when we've both figured ourselves out",
  "i'm letting go with love instead of anger",
  "the best is yet to come and i'm choosing to believe that",
  "i'll always care about you even from a distance",
  "i think the hardest goodbyes lead to the best hellos",
  "i'm finding pieces of myself i thought i'd lost forever",
  "i hope happiness finds you wherever you go",
  "i'm done looking back. it's time to look forward",
  "we weren't meant to last but we were meant to teach each other something",
  "i'm grateful for the pain because it taught me how strong i am",
];

// ─── VARIATION ENGINE ────────────────────────────────────────

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFloat() { return Math.random(); }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ~80% lowercase, ~15% sentence case, ~5% capitalize "I" only
function applyCasing(msg) {
  const r = randomFloat();
  if (r < 0.80) {
    return msg.toLowerCase();
  } else if (r < 0.95) {
    return msg.charAt(0).toUpperCase() + msg.slice(1).toLowerCase();
  } else {
    return msg.toLowerCase().replace(/\bi\b/g, 'I');
  }
}

// Synonym swaps — rich vocabulary for variation (55+ groups)
const SYNONYM_GROUPS = [
  [[/\bmiss\b/gi], ['think about', 'keep thinking about', 'long for']],
  [[/\blove\b/gi], ['care about', 'adore', 'cherish']],
  [[/\bscared\b/gi], ['afraid', 'terrified', 'anxious']],
  [[/\bafraid\b/gi], ['scared', 'terrified', 'worried']],
  [[/\bhappy\b/gi], ['glad', 'grateful', 'thankful', 'at peace']],
  [[/\bsad\b/gi], ['hurt', 'broken', 'empty', 'lost']],
  [[/\bangry\b/gi], ['furious', 'mad', 'upset', 'frustrated']],
  [[/\bhurt\b/gi], ['wounded', 'damaged', 'broken', 'crushed']],
  [[/\bbeautiful\b/gi], ['gorgeous', 'stunning', 'pretty', 'radiant']],
  [[/\bamazing\b/gi], ['incredible', 'wonderful', 'extraordinary']],
  [[/\bstupid\b/gi], ['dumb', 'foolish', 'silly', 'careless']],
  [[/\beverything\b/gi], ['all of it', 'it all', 'the whole thing']],
  [[/\bnothing\b/gi], ['none of it', 'absolutely nothing']],
  [[/\balways\b/gi], ['forever', 'constantly', 'endlessly']],
  [[/\bnever\b/gi], ['not once', 'not ever', 'at no point']],
  [[/\breally\b/gi], ['truly', 'genuinely', 'honestly', 'deeply']],
  [[/\bwant\b/gi], ['need', 'wish', 'long']],
  [[/\bneed\b/gi], ['want', 'crave', 'ache for']],
  [[/\bsorry\b/gi], ['apologetic', 'regretful']],
  [[/\bremember\b/gi], ['recall', 'think back to', 'replay']],
  [[/\bforget\b/gi], ['let go of', 'move past', 'erase']],
  [[/\btrying\b/gi], ['working on', 'learning to', 'struggling to']],
  [[/\bhate\b/gi], ['despise', "can't stand", 'resent']],
  [[/\bwish\b/gi], ['hope', 'pray', 'dream']],
  [[/\bhope\b/gi], ['wish', 'pray', 'believe']],
  [[/\bcrazy\b/gi], ['insane', 'wild', 'unreal']],
  [[/\btired\b/gi], ['exhausted', 'drained', 'done', 'worn out']],
  [[/\bperson\b/gi], ['human', 'soul', 'being']],
  [[/\bheart\b/gi], ['soul', 'spirit', 'whole being']],
  [[/\blife\b/gi], ['world', 'existence', 'days']],
  [[/\bstay\b/gi], ['remain', 'stick around', 'hold on']],
  [[/\bleave\b/gi], ['walk away', 'go', 'disappear']],
  [[/\balone\b/gi], ['on my own', 'by myself', 'lonely']],
  [[/\bsilence\b/gi], ['quiet', 'stillness', 'distance']],
  [[/\bpain\b/gi], ['ache', 'agony', 'weight']],
  [[/\bcry\b/gi], ['break down', 'tear up', 'weep']],
  [[/\blaugh\b/gi], ['smile', 'grin', 'joy']],
  [[/\bwrong\b/gi], ['mistaken', 'messed up', 'off']],
  [[/\bstrong\b/gi], ['brave', 'tough', 'resilient']],
  [[/\bweak\b/gi], ['vulnerable', 'fragile', 'soft']],
  [[/\bfight\b/gi], ['struggle', 'push through', 'battle']],
  [[/\bdream\b/gi], ['imagine', 'picture', 'fantasize about']],
  [[/\bworry\b/gi], ['stress', 'overthink', 'obsess']],
  [[/\bchange\b/gi], ['shift', 'transform', 'alter']],
  [[/\bthink\b/gi], ['feel', 'believe', 'sense']],
  [[/\bunderstand\b/gi], ['get it', 'see it', 'comprehend']],
  [[/\bforgive\b/gi], ['pardon', 'let it go', 'make peace with']],
  [[/\bdeserve\b/gi], ['are worthy of', 'earned', 'merit']],
  [[/\bpromise\b/gi], ['swear', 'vow', 'commit']],
  [[/\btrust\b/gi], ['believe in', 'rely on', 'have faith in']],
  [[/\bperfect\b/gi], ['flawless', 'ideal', 'right']],
  [[/\bmistake\b/gi], ['regret', 'error', 'blunder']],
  [[/\bsecret\b/gi], ['truth', 'confession', 'thing']],
  [[/\bchance\b/gi], ['shot', 'opportunity', 'moment']],
  [[/\bfeeling\b/gi], ['emotion', 'sensation', 'vibe']],
];

// Abbreviation swaps — more aggressive application
const ABBREV_SWAPS = [
  [/\byou\b/gi, 'u'],
  [/\byour\b/gi, 'ur'],
  [/\byou're\b/gi, "ur"],
  [/\bthough\b/gi, 'tho'],
  [/\babout\b/gi, 'abt'],
  [/\bso much\b/gi, 'sm'],
  [/\bi don't know\b/gi, 'idk'],
  [/\bto be honest\b/gi, 'tbh'],
  [/\bi love you\b/gi, 'ily'],
  [/\bright now\b/gi, 'rn'],
  [/\bpeople\b/gi, 'ppl'],
  [/\bbecause\b/gi, "cuz"],
  [/\bprobably\b/gi, "prolly"],
  [/\bwithout\b/gi, "w/o"],
  [/\bplease\b/gi, "pls"],
  [/\btomorrow\b/gi, "tmrw"],
  [/\btonight\b/gi, "tn"],
  [/\bforever\b/gi, "4ever"],
  [/\bbefore\b/gi, "b4"],
  [/\bsomeone\b/gi, "sb"],
  [/\bsomething\b/gi, "sth"],
  [/\beveryone\b/gi, "evry1"],
  [/\banything\b/gi, "anythin"],
  [/\bwhatever\b/gi, "whatevr"],
  [/\bcoming\b/gi, "comin"],
  [/\bgoing\b/gi, "goin"],
  [/\bnothing\b/gi, "nothin"],
  [/\bthinking\b/gi, "thinkin"],
  [/\bfeeling\b/gi, "feelin"],
  [/\bkind of\b/gi, "kinda"],
  [/\bwant to\b/gi, "wanna"],
  [/\bgoing to\b/gi, "gonna"],
  [/\bgot to\b/gi, "gotta"],
  [/\bdon't\b/gi, "dont"],
  [/\bcan't\b/gi, "cant"],
  [/\bwon't\b/gi, "wont"],
  [/\bi'm\b/gi, "im"],
  [/\bit's\b/gi, "its"],
  [/\bthat's\b/gi, "thats"],
  [/\bwhat's\b/gi, "whats"],
];

// Apply synonym swaps (1-2 swaps per message, 30% chance)
function applySynonyms(msg) {
  if (randomFloat() > 0.35) return msg; // 35% chance to apply any synonyms
  let result = msg;
  const numSwaps = randomInt(1, 2);
  const shuffled = [...SYNONYM_GROUPS].sort(() => randomFloat() - 0.5);
  let applied = 0;
  for (const [patterns, replacements] of shuffled) {
    if (applied >= numSwaps) break;
    for (const pattern of patterns) {
      if (pattern.test(result)) {
        const replacement = randomChoice(replacements);
        result = result.replace(pattern, replacement);
        applied++;
        break;
      }
    }
  }
  return result;
}

// Apply abbreviations (30% chance per swap — more aggressive)
function applyAbbreviations(msg) {
  let result = msg;
  for (const [pattern, replacement] of ABBREV_SWAPS) {
    if (randomFloat() < 0.30) {
      result = result.replace(pattern, replacement);
    }
  }
  return result;
}

// Human-like prefixes (prepended occasionally) — 50 options
const PREFIXES = [
  'honestly ', 'tbh ', 'idk why but ', 'look ', 'hey ', 'listen ',
  'okay so ', 'i mean ', 'not gonna lie ', 'ngl ', 'lowkey ',
  'real talk ', 'fr tho ', 'god ', 'ugh ', 'man ',
  'bro ', 'dude ', 'yo ', 'okay ', 'so ', 'like ',
  'can i just say ', 'the truth is ', 'hear me out ',
  'i just wanna say ', 'here goes ', 'okay hear me out ',
  'no but seriously ', 'for what it\'s worth ', 'between us ',
  'confession: ', 'unpopular opinion but ', 'idk man ',
  'it\'s 3am and ', 'late night thoughts but ', 'can\'t sleep so ',
  'random thought but ', 'just saying ', 'fwiw ',
  'not to be dramatic but ', 'please don\'t judge me but ',
  'i keep thinking ', 'every day ', 'sometimes ', 'at this point ',
  'after all this time ', 'even now ', 'still to this day ',
  'the hardest part is ', 'what hurts most is ', 'deep down ',
];

// Human-like suffixes (appended occasionally) — 55 options
const SUFFIXES = [
  '. always', '. forever', ' lol', ' haha', ' :(', ' :)',
  '..', '...', ' x', ' xx', ' <3', ' smh', ' sigh',
  ' fr', ' ngl', ' istg', ' bruh', ' ugh',
  '. that\'s it', ' tbh', '. period', ' idk',
  '. and it kills me', '. every single day', ' still',
  '. no cap', ' sadly', ' unfortunately', ' apparently',
  '. it is what it is', ' tho', ' honestly',
  '. and i mean it', '. for real', ' always will',
  ' and i hate it', ' and that\'s okay', '. whatever',
  ' but it\'s fine', ' i guess', ' or something',
  '. end of story', ' ya know', ' innit',
  '. and that terrifies me', '. more than you know',
  ' even now', '. nothing has changed', ' and it shows',
  '. trust me', ' no matter what', '. always always',
  '. i just needed to say it', ' finally', '. there i said it',
  ' and i\'m done pretending otherwise', '. goodnight',
];

// Add prefix (~8% chance — reduced to lower repetition)
function maybeAddPrefix(msg) {
  if (randomFloat() < 0.08) {
    const prefix = randomChoice(PREFIXES);
    return prefix + msg;
  }
  return msg;
}

// Add suffix (~8% chance — reduced to lower repetition)
function maybeAddSuffix(msg) {
  if (randomFloat() < 0.08) {
    const suffix = randomChoice(SUFFIXES);
    return msg + suffix;
  }
  return msg;
}

// Tweak punctuation
function tweakPunctuation(msg) {
  if (randomFloat() < 0.4 && msg.endsWith('.')) {
    return msg.slice(0, -1);
  }
  if (randomFloat() < 0.08 && !msg.endsWith('.') && !msg.endsWith('?') && !msg.endsWith('!')) {
    return msg + '.';
  }
  return msg;
}

// Occasionally drop "i think" / "i feel" / "i just" from start (~15%)
function maybeDropOpener(msg) {
  if (randomFloat() < 0.15) {
    const dropPatterns = [
      /^i think /i, /^i feel like /i, /^i just /i, /^i really /i,
      /^honestly /i, /^sometimes /i, /^maybe /i,
    ];
    for (const p of dropPatterns) {
      if (p.test(msg)) {
        return msg.replace(p, '');
      }
    }
  }
  return msg;
}

// Word count validator
function wordCount(msg) {
  return msg.split(/\s+/).filter(w => w.length > 0).length;
}

// Clean up whitespace and fix double conjunctions
function cleanMsg(msg) {
  return msg
    .replace(/\s+/g, ' ')
    .replace(/\bbut but\b/gi, 'but')
    .replace(/\bbut and\b/gi, 'but')
    .replace(/\band and\b/gi, 'and')
    .replace(/\band but\b/gi, 'but')
    .trim();
}

// ─── MAIN GENERATION ─────────────────────────────────────────

function generatePool() {
  const allTemplates = [
    ...LOVE_LONGING,
    ...HEARTBREAK_BREAKUP,
    ...GRIEF_LOSS,
    ...REGRET_APOLOGY,
    ...FRIENDSHIP,
    ...SELF_REFLECTION,
    ...UNSENT_CONFESSIONS,
    ...ANGER_FRUSTRATION,
    ...HOPE_HEALING,
  ];

  console.log(`Total unique templates: ${allTemplates.length}`);
  console.log(`Total unique names: ${UNIQUE_NAMES.length}`);

  const usedMessages = new Set();
  const nameUsage = {};    // Track how many times each name is used
  const MAX_NAME_USAGE = 8;
  const pool = [];
  let attempts = 0;

  function pickName() {
    // Try up to 50 times to find a name under the cap
    for (let i = 0; i < 50; i++) {
      const name = randomChoice(UNIQUE_NAMES);
      if ((nameUsage[name] || 0) < MAX_NAME_USAGE) {
        return name;
      }
    }
    // Fallback: find any name under the cap
    const available = UNIQUE_NAMES.filter(n => (nameUsage[n] || 0) < MAX_NAME_USAGE);
    if (available.length > 0) return randomChoice(available);
    // All names at cap — just pick any (shouldn't happen with 1300+ names and 10K entries)
    return randomChoice(UNIQUE_NAMES);
  }

  function tryAdd(msg) {
    msg = cleanMsg(msg);
    if (wordCount(msg) > 25 || msg.length > 250) return false;
    if (msg.length < 5) return false;
    const key = msg.toLowerCase().trim();
    if (usedMessages.has(key)) return false;
    usedMessages.add(key);
    const name = pickName();
    nameUsage[name] = (nameUsage[name] || 0) + 1;
    pool.push({
      name,
      message: msg,
      color_id: randomChoice(CARD_COLORS),
    });
    return true;
  }

  // Phase 1: Use each template as-is (lowercase + minor tweaks)
  const shuffledTemplates = [...allTemplates].sort(() => randomFloat() - 0.5);
  for (const tpl of shuffledTemplates) {
    let msg = applyCasing(tpl);
    msg = tweakPunctuation(msg);
    tryAdd(msg);
  }
  console.log(`After Phase 1 (originals): ${pool.length} entries`);

  // Phase 2: Abbreviation + synonym variations
  const maxPhase2 = 500000;
  while (pool.length < 6000 && attempts < maxPhase2) {
    attempts++;
    const tpl = randomChoice(allTemplates);
    let msg = applySynonyms(tpl);
    msg = applyCasing(msg);
    msg = applyAbbreviations(msg);
    msg = tweakPunctuation(msg);
    msg = maybeAddPrefix(msg);
    msg = maybeAddSuffix(msg);
    msg = maybeDropOpener(msg);
    tryAdd(msg);
    if (pool.length % 1000 === 0 && pool.length > 0) {
      console.log(`  Phase 2: ${pool.length} entries (${attempts} attempts)...`);
    }
  }
  console.log(`After Phase 2 (variations): ${pool.length} entries (${attempts} attempts)`);

  // Phase 3: Fragment combinations (opener + closer)
  const openers = [
    "i miss you", "i love you", "i'm sorry", "i think about you",
    "i wish we", "i hope you", "i never told you", "i can't stop thinking about you",
    "i'm still not over you", "i'll always remember", "i should have told you",
    "i wish i could tell you", "i need you to know", "i'm afraid of losing you",
    "i keep wondering about us", "i want you to know that", "i'll never forget the way",
    "i hope one day we", "i just wanted to say", "i still care about you",
    "i don't know how to tell you", "i'm trying to move on", "i can't believe you left",
    "i always wanted to tell you", "i think the hardest part is knowing",
    "i wish things were different", "sometimes i wonder if you think about me",
    "i'm learning to live without you", "the truth is i never stopped",
    "i never meant to hurt you", "every day i think about what we had",
    "i'm still waiting for you", "part of me still loves you",
    "all i wanted was for you to stay", "if only i could see you one more time",
    "i didn't mean to push you away", "i keep telling myself it's over",
    "the thing is i still love you", "i know i should move on",
    "deep down i know you felt it too", "i'm not sure if you ever cared",
    "i've always wanted to say this", "you were the best thing in my life",
    "i think about our last conversation", "every night i wonder what happened",
    "i can't pretend anymore", "my heart still aches for you",
    "the worst part is i'd do it all again", "you don't know what you meant to me",
    "i should have been braver", "i was wrong about everything",
    "i'm trying to forgive you", "i can't get you out of my head",
    "i regret not saying this sooner", "some nights i cry thinking about you",
    "you deserved better from me", "i still dream about us",
    "i'm not over it and maybe i never will be", "i hope you're happy now",
    "i wonder if you miss me too", "i promised myself i'd forget you",
    "you were my whole world", "i lost myself when i lost you",
    "i can't hear that song without thinking of you", "you left a mark on me",
    "i'm still mad at myself for what i said", "you made me feel alive",
    "i never got closure and it kills me", "i was too proud to say i needed you",
    "some days are harder than others", "i keep starting texts i'll never send",
    "the silence between us is the loudest thing", "i gave you my all",
    "it's been months and it still stings", "you were my favorite mistake",
    "i wanted to be your forever", "i'm tired of acting like i'm fine",
    "sometimes i still look at your photos", "i don't know what we were but i miss it",
    "you're the one who got away", "i hate how much i still think about you",
    "i see you everywhere even when you're not there", "you changed me",
  ];

  const closers = [
    "and i don't think i ever will",
    "but i was too afraid to say it",
    "even after everything that happened",
    "and it breaks my heart every time",
    "but i never had the courage to tell you",
    "more than you'll ever know",
    "and that's okay i think",
    "but it's too late now isn't it",
    "and i hope you know that",
    "even when you don't deserve it",
    "but i'm learning to live with it",
    "and it haunts me every single day",
    "but some things are better left unsaid",
    "and i wish i could change that",
    "even if you never read this",
    "and i'm tired of pretending otherwise",
    "but i needed to get this off my chest",
    "and i probably always will",
    "but the timing was never right for us",
    "and that's the hardest part of all this",
    "even though it terrifies me",
    "but i don't know how to anymore",
    "and i think you feel the same way",
    "but maybe it's for the best",
    "even from this far away",
    "and nothing has changed since then",
    "but i'll be okay eventually i think",
    "even if you've forgotten about me",
    "and i hope you feel the same",
    "but i'm afraid of the answer",
    "and i'll carry that with me forever",
    "but i couldn't find the words",
    "and i think i always knew",
    "but you already know that don't you",
    "even on my worst days",
    "and i don't regret a single second",
    "but i couldn't hold on any longer",
    "and maybe that's enough",
    "but you left before i could",
    "and i'd do it all over again",
    "because you deserved to hear it",
    "and now it's eating me alive",
    "but life got in the way",
    "and that's what hurts the most",
    "but i guess some things aren't meant to be",
    "even when it hurts this much",
    "and i'm finally starting to accept that",
    "but you'll never know",
    "and i think that's beautiful in a sad way",
    "because i owe you that much",
    "and i wish you felt it too",
    "but i've made my peace with it",
    "and it keeps me up at night",
    "but i'm done pretending",
    "and i hope someday you'll understand",
    "because you were worth it",
    "and that will never change",
    "but i have to let go now",
    "even though it kills me",
    "and i'm okay with that finally",
  ];

  attempts = 0;
  const maxPhase3 = 500000;
  while (pool.length < 10000 && attempts < maxPhase3) {
    attempts++;
    const opener = randomChoice(openers);
    const closer = randomChoice(closers);
    let msg = `${opener} ${closer}`;
    msg = applyCasing(msg);
    msg = applyAbbreviations(msg);
    msg = tweakPunctuation(msg);
    msg = maybeAddPrefix(msg);
    msg = maybeAddSuffix(msg);
    tryAdd(msg);
    if (pool.length % 1000 === 0 && pool.length > 0 && pool.length <= 10000) {
      console.log(`  Phase 3: ${pool.length} entries (${attempts} attempts)...`);
    }
  }
  console.log(`After Phase 3 (combinations): ${pool.length} entries`);

  // Shuffle the final pool
  pool.sort(() => randomFloat() - 0.5);

  return pool;
}

// ─── VALIDATION ──────────────────────────────────────────────

function validate(pool) {
  const NAME_REGEX = /^[a-zA-Z\s'\-]+$/;
  let errors = 0;

  const messageSet = new Set();
  for (let i = 0; i < pool.length; i++) {
    const entry = pool[i];

    // Name validation
    if (!NAME_REGEX.test(entry.name)) {
      console.error(`[${i}] Invalid name: "${entry.name}"`);
      errors++;
    }

    // Word count
    const wc = wordCount(entry.message);
    if (wc > 25) {
      console.error(`[${i}] Too many words (${wc}): "${entry.message}"`);
      errors++;
    }
    if (wc < 1) {
      console.error(`[${i}] Empty message`);
      errors++;
    }

    // Char length
    if (entry.message.length > 250) {
      console.error(`[${i}] Too many chars (${entry.message.length}): "${entry.message.substring(0, 50)}..."`);
      errors++;
    }

    // Color validation
    if (!CARD_COLORS.includes(entry.color_id)) {
      console.error(`[${i}] Invalid color: "${entry.color_id}"`);
      errors++;
    }

    // Duplicate check
    const key = entry.message.toLowerCase().trim();
    if (messageSet.has(key)) {
      console.error(`[${i}] Duplicate message: "${entry.message.substring(0, 50)}..."`);
      errors++;
    }
    messageSet.add(key);
  }

  return errors;
}

// ─── RUN ─────────────────────────────────────────────────────

console.log('Generating 10,000 unique human-like messages...\n');
const pool = generatePool();

console.log(`\nValidating ${pool.length} entries...`);
const errors = validate(pool);

if (errors > 0) {
  console.error(`\n❌ ${errors} validation errors found!`);
  process.exit(1);
}

if (pool.length < 10000) {
  console.warn(`\n⚠ Only generated ${pool.length} entries (target: 10,000)`);
  console.warn('This is still usable — the variation engine may need more templates to reach 10K.');
}

console.log(`\n✅ ${pool.length} entries generated and validated successfully!`);

// Write to file
const outPath = join(__dirname, 'seed-messages.json');
writeFileSync(outPath, JSON.stringify(pool, null, 2));
console.log(`Written to: ${outPath}`);

// Print some stats
const colorDist = {};
CARD_COLORS.forEach(c => colorDist[c] = 0);
pool.forEach(e => colorDist[e.color_id]++);
console.log('\nColor distribution:');
Object.entries(colorDist).sort((a,b) => b[1] - a[1]).forEach(([c, n]) => {
  console.log(`  ${c}: ${n} (${(n/pool.length*100).toFixed(1)}%)`);
});

const lowercaseCount = pool.filter(e => e.message === e.message.toLowerCase()).length;
console.log(`\nCasing: ${lowercaseCount} lowercase (${(lowercaseCount/pool.length*100).toFixed(1)}%), ${pool.length - lowercaseCount} mixed`);

const avgWords = pool.reduce((sum, e) => sum + wordCount(e.message), 0) / pool.length;
console.log(`Average word count: ${avgWords.toFixed(1)}`);
