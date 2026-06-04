#!/usr/bin/env node
// =============================================================
// generate-messages.mjs (v8 — maximum variety and emotion)
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
// PATTERN 1: STANDARD COMBO (START + MIDDLE + END)
// ═══════════════════════════════════════════════════════════════

const P1_START = [
  "i cant believe", "honestly", "tbh", "ngl", "i just wanted to say", 
  "just so you know", "btw", "for the record", "just remembering when", 
  "thinking about how", "i still dont understand why", "i hate that", 
  "it sucks that", "im so mad that", "im so sad that", 
  "i cant stop thinking about how", "it kills me that", "i wish", 
  "i really wish", "sometimes i wish", "part of me wishes", "i hope", 
  "i really hope", "im glad", "im so glad", "i regret", 
  "my biggest regret is", "the worst part is", "the hardest part is", 
  "funny how", "its crazy how", "wild how", "remember when", 
  "do you ever think about how", "i still wonder if", "i keep wondering why", 
  "sometimes i cant believe", "every night i think about how", 
  "every morning i wonder why", "i can't stop replaying when",
  "you have no idea how much", "i really cant process how",
  "its actually insane how", "i just can't fathom why",
  "i will never understand why", "its beyond me why",
  "i honestly don't get why", "i just dont understand how",
  "i still ask myself why", "i lay awake wondering if",
  "i still cant believe", "it blows my mind how", "i cant wrap my head around why", 
  "i am still in shock that", "its kind of pathetic but", "just a reminder that", 
  "im just sitting here thinking about how", "it honestly scares me how", 
  "sometimes i forget that", "im still trying to process how", "i keep telling myself that", 
  "my friends keep telling me that", "i finally realized that", "it took me this long to realize", 
  "i just cant accept that", "its hard to accept that", "i still cant accept how", 
  "i refuse to believe that", "i cant even begin to understand why", "what hurts the most is", 
  "the worst feeling is", "i hate waking up and remembering how", 
  "i hate going to sleep knowing that", "i cant even look at myself knowing", 
  "i cant even look at you after", "its so funny to me how", "its actually hilarious how", 
  "you really thought that", "i bet you think that", "do you really believe that", 
  "i cant help but laugh when", "i just laugh now when i think about how", 
  "it makes me sick that", "it physically hurts that", 
  "i feel nauseous just thinking about how", "im so disgusted by how", 
  "i just wanted you to know that", "i hope you know that", "do you even realize that", 
  "i wonder if you even care that", "does it even bother you that",
  "how can you live with yourself after", "how do you even justify how", 
  "i still cant wrap my mind around how", "i keep asking myself if", "i always wonder if", 
  "i will never forgive you for how", "im never going to forget how", "its sad that", 
  "its just so sad that", "its pathetic that", "im embarrassed that", "im so ashamed that", 
  "i miss you so much that", "im literally begging you to", "i just want to know if", 
  "i check my phone every day hoping", "it breaks my heart that", "i cant stop crying because", 
  "i feel so empty when", "i just need you to know that", "i would give anything to", 
  "im so lonely without you and", "its so hard waking up and", "im completely lost because", 
  "every single day i wish", "im so broken since", "i just cant let go of how", 
  "i lay in bed staring at the ceiling because", "i feel like im dying inside because"
];

const P1_MIDDLE = [
  "you lied to my face", "you cheated on me", "you left me", 
  "you walked away", "you gave up on us", "you stopped trying", 
  "you stopped caring", "you stopped loving me", "you chose her", 
  "you chose him", "you chose them", "you picked them over me", 
  "you broke my trust", "you ruined everything", "you destroyed us", 
  "you threw it all away", "you threw me away", "you treated me like garbage", 
  "you treated me like an option", 
  "you made me feel worthless", "you made me feel like nothing", 
  "you made me feel crazy", "you gaslit me", "you manipulated me", 
  "you used me", "you took advantage of me", "you took me for granted", 
  "you played with my feelings", "you messed with my head", 
  "you broke my heart", "you shattered my heart", "you tore me apart", 
  "you hurt me so badly", "we fell apart", "we ended", "we broke up", 
  "we stopped talking", "we drifted apart", "we lost each other", 
  "i lost you", "i let you go", "i pushed you away", "i gave up", 
  "i stopped trying", "i stopped caring", "i walked away", "i ruined it", 
  "i messed it up", "i made a mistake", 
  "i made the biggest mistake", "i trusted you", "i believed you", 
  "i loved you", "i loved you so much", "i gave you everything", 
  "i gave you my all", "i tried so hard", "i did everything for you", 
  "i bent over backwards for you", "i compromised everything for you", 
  "i changed for you", "i lost myself loving you", 
  "i lost myself trying to save you", "i couldn't save you", 
  "i couldn't save us", "i couldn't fix you", "i couldn't fix us", 
  "we couldn't make it work", "you dragged me through the mud",
  "you completely blindsided me", "you threw me under the bus",
  "you made me hate myself", "you ruined my self esteem",
  "you completely shattered my confidence", "you took everything from me",
  "you stole my peace", "you took my happiness", "you drained me",
  "you sucked the life out of me", "you were so incredibly toxic",
  "you were so selfish", "you only ever thought of yourself",
  "you couldn't care less about me", "you threw me away like trash",
  "you played me like a fool", "you made a fool out of me",
  "you lied about everything", "you were living a double life", "you played the victim so well", 
  "you convinced everyone i was the crazy one", "you turned my friends against me", 
  "you isolated me from everyone", "you made me depend on you", "you broke every single promise", 
  "you never meant a word you said", "you faked the whole thing", "you never actually loved me", 
  "you only loved the idea of me", "you just used me for attention", 
  "you just needed someone to stroke your ego", "you took advantage of my kindness", 
  "you drained me of everything i had", "you used me until i was empty", 
  "you threw me away when you were done", "you discarded me like i was nothing", 
  "you replaced me in a week", "you moved on so fast", "you act like we never happened", 
  "you pretend i don't exist", "you erased me from your life", "you never even tried", 
  "you gave up at the first sign of trouble", "you ran away when things got hard", 
  "you couldn't handle my feelings", "you always shut me out", "you made me feel like a burden", 
  "you made me feel so small", "you made me feel invisible", 
  "you ignored me when i needed you most", "you left me crying on the floor", 
  "you walked out without a word", "you ghosted me after everything", 
  "you couldn't even give me closure", "you couldn't even look me in the eye", 
  "you were so cold to me", "you flipped a switch and became a stranger", 
  "you turned into someone i don't even know", "you became exactly who you promised you'd never be", 
  "you stooped so low", "you crossed every line", "you betrayed me in the worst way", 
  "you stabbed me in the back and asked why i was bleeding", "you tore me down to build yourself up", 
  "you crushed my spirit", "you destroyed my self worth", "you made me question my own reality", 
  "you always twisted my words", "you made everything my fault", "you never took responsibility", 
  "you never apologized for anything", "you always found a way to blame me", 
  "you made me feel like i was the problem", "you were never actually there for me", 
  "you never cared about my feelings", "you only cared about yourself", 
  "you were so incredibly selfish", "you showed your true colors", "the mask finally slipped", 
  "i saw right through your lies", "i finally saw the real you", 
  "i realized you're incapable of love", "i realized you're just empty inside",
  "i still love you", "i need you in my life", "im so sorry for everything", 
  "i messed up so badly", "i want to fix this", "i just want to hear your voice", 
  "i would do anything to get you back", "i miss holding you", "i just want you back", 
  "i still wait for your text", "i look for you everywhere", "i still think about our future", 
  "i cant picture my life without you", "i still wear the shirt you gave me", 
  "i cant delete your pictures", "im holding onto the memories", "i still reread our old messages", 
  "i cant sleep without you here", "i reach for you in the middle of the night",
  "you changed your mind so fast", "you stopped loving me", "you could just walk away like that", 
  "you never gave us a real chance", "we went from everything to nothing", "you gave up without even trying", 
  "you shut me out", "you decided i wasnt worth it", "you just stopped caring", 
  "we suddenly became strangers", "you lost feelings so quickly", "you couldn't even explain why",
  "i cant stop thinking about you", "i just really miss you", "i want to hear your voice", 
  "i want to see you", "im looking at our old photos", "i need to talk to you", 
  "im craving your touch", "i wish you were here with me", "i just wanted to say hi", 
  "im wondering what you're doing right now", "im listening to our song", "i just need you right now"
];

const P1_END = [
  "and i hate you for it", "and ill never forgive you", 
  "and ill never forget it", "and it still hurts", 
  "and it hurts so much", "and im still bleeding", 
  "and im still broken", "and im still putting the pieces back together", 
  "and im still healing", "and im still trying to move on", 
  "and im still trying to forget you", "and i cant seem to let you go", 
  "and i cant seem to get over it", "and i dont know how to move forward", 
  "and i dont know what to do now", "and i dont know who i am without you", 
  "and im so lost without you", "and im so empty now", "and im so angry", 
  "and im so bitter", "and im so resentful", 
  "and i feel nothing but apathy", "and i just feel numb", 
  "and i wish i never met you", "and i wish we never happened", 
  "and i regret everything", "and i regret ever loving you", 
  "and i regret giving you so much of myself", 
  "and i hope karma gets you", 
  "and i hope she does to you what you did to me", 
  "and i hope he breaks your heart", 
  "and i hope you get what you deserve", "and i hope you suffer", 
  "and i hope you're miserable", 
  "and i hope you think of me and it ruins your day", 
  "and i hope you regret it", "and i hope you realize what you lost", 
  "and i hope you realize you fucked up", 
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
  "but part of me still wants you back", "but part of me still loves you", 
  "but i still miss you", "but i still love you", "but i still care", 
  "but i still think about you", "but i still dream about you", 
  "but i still cry over you", "but i still check your social media", 
  "but i still look for you in crowds", "but i still hope you'll call", 
  "but i still wish you were here", "but i still wish we could try again", 
  "and maybe one day we can", "and maybe in another life", 
  "and maybe our timing was just wrong", 
  "and maybe we'll find each other again", 
  "and maybe it was just never meant to be", "and maybe it's for the best",
  "and quite frankly i'm exhausted", "and i'm just so tired",
  "and i literally can't do this anymore", "and i'm at my breaking point",
  "and i've completely lost my mind", "and i just want it all to stop",
  "and honestly good riddance", "and i wouldn't take you back if you begged",
  "and please don't ever contact me again",
  "and i feel nothing for you anymore", "and i honestly pity you", 
  "and i feel sorry for whoever comes next", "and i hope she sees through you too", 
  "and i hope he realizes what you are", "and you're going to end up alone", 
  "and no one will ever love you like i did", "and you threw away the best thing you ever had", 
  "and you're going to regret this for the rest of your life", 
  "and one day you'll realize what you did", "and by the time you realize, i'll be gone", 
  "and i'm never looking back", "and i'm so done with your bullshit", 
  "and i can't believe i wasted so much time on you", 
  "and you took years of my life i'll never get back", "and i hate myself for staying so long", 
  "and i should have walked away years ago", "and everyone was right about you", 
  "and my mom was right about you from the start", "and my friends warned me about you", 
  "and i was so blind to not see it", "and i feel so stupid for trusting you", 
  "and i'll never trust anyone again because of you", "and you ruined my ability to love", 
  "and you left me with so much trauma", "and i'm still in therapy because of you", 
  "and i'm still picking up the pieces", "and i'm still trying to unlearn all your toxic habits", 
  "and i'm finally starting to heal", "and i'm finally finding myself again", 
  "and i'm doing so much better without you", "and i've never been happier", 
  "and my life is so much better now", "and you're just a bad memory now", 
  "and i don't even recognize you anymore", "and you're dead to me", 
  "and you mean absolutely nothing to me", 
  "and i wouldn't spit on you if you were on fire", 
  "and don't ever reach out to me again", "and lose my number", 
  "and keep away from me", "and i never want to hear your name again", 
  "and just stay out of my life", "and please just leave me alone", 
  "and don't you dare try to come back", "and it's way too late for apologies", 
  "and your apologies mean nothing to me", "and you can shove your apologies", 
  "and you're not sorry, you're just sorry you got caught", 
  "and i'm never going to let you hurt me again", "and i'm finally free of you", 
  "and i finally cut the cord", "and good riddance to bad rubbish", 
  "and i wouldn't wish you on my worst enemy", 
  "and you're going to get exactly what's coming to you", "and karma never forgets", 
  "and the universe will make you pay for it", "and i can't wait to see you get your karma", 
  "and i'm just waiting for the day you get what you deserve", 
  "and just go away",
  "and i dont know how to live without you", "and im begging you to come back", 
  "and i just want one more chance", "and please just answer me", 
  "and i miss you more than anything", "and i still love you so much", 
  "and my heart literally aches for you", "and im so incredibly lonely", 
  "and i would do anything to fix us", "and i just cant do this alone", 
  "and it hurts more every single day", "and im just praying you'll come back", 
  "and nothing feels right without you", "and please just give me a sign", 
  "and im so lost without you",
  "and i just need an explanation", "and it makes absolutely no sense", 
  "and im just so confused", "and it keeps me up at night", "and i just want the truth", 
  "and i cant wrap my head around it", "and i just need to know why", 
  "and i cant find peace without knowing", "and it drives me crazy", 
  "and im just left here wondering",
  "and i know i shouldn't be saying this", "and please just ignore this", 
  "and im sorry for bothering you", "and i'll probably regret this tomorrow", 
  "and please just text me back", "and i just had to tell you", "and ugh i miss you", 
  "and i hate that i still care", "and just tell me you miss me too", "and i wish you were awake"
];

// ═══════════════════════════════════════════════════════════════
// PATTERN 2: QUESTIONS
// ═══════════════════════════════════════════════════════════════

const P2_Q_START = [
  "why did you", "how could you", "when did you decide to", 
  "were you ever going to", "what made you", "why didn't you", "how did you",
  "why would you", "what possessed you to", "how long did it take you to",
  "why was it so easy for you to", "how did you find it so easy to", 
  "when exactly did you", "did you even hesitate to", "did it hurt you to",
  "did it bother you to", "how on earth could you", "why the hell did you",
  "when did you realize you wanted to", "did you ever plan to", 
  "was it your goal to", "was it fun for you to"
];

const P2_Q_ACTION = [
  "lie to me", "walk away", "give up on us", "choose them", "choose yourself",
  "stop loving me", "stop caring", "throw it all away", "ghost me", 
  "hurt me like that", "break my heart", "ruin everything", "betray me",
  "stab me in the back", "lead me on", "use me", "take advantage of me",
  "make me feel crazy", "gaslight me", "make me feel worthless", "replace me",
  "forget about me", "erase me from your life", "move on", "leave me crying",
  "walk out without a word", "shut me out", "give up without trying"
];

const P2_Q_END = [
  "like that", "so easily", "without a second thought", "after everything", 
  "when i needed you most", "and just pretend it never happened",
  "and act like everything was fine", "and sleep at night",
  "without even caring", "without any remorse", "and not feel guilty",
  "and look me in the eyes", "and still smile", "and move on so fast",
  "and act like i meant nothing", "without saying goodbye",
  "and leave me completely broken", "and expect me to be okay",
  "and just walk away", "and never look back"
];

// ═══════════════════════════════════════════════════════════════
// PATTERN 3: MEMORIES & TIME
// ═══════════════════════════════════════════════════════════════

const P3_TIME = [
  "sometimes", "late at night", "when i wake up", "randomly", 
  "every time i drive past your house", "when our song plays", 
  "when i see your friends", "when i look at old photos", "out of nowhere",
  "in the middle of the night", "when i'm alone", "when it rains",
  "every morning", "every single day", "when i'm driving alone",
  "when someone mentions your name", "when i go to that restaurant",
  "when i wear that shirt", "every time i close my eyes", "almost every day"
];

const P3_MEMORY = [
  "i remember how you", "i think about how we", 
  "i can't stop thinking about when you", "my mind goes back to when you", 
  "i get a flashback to when you", "i just remember you", "i picture how you",
  "i recall exactly how you", "i think about the time you", 
  "i catch myself thinking about how you", "i find myself remembering how we",
  "i randomly think about you", "i start replaying how you", "i reminisce about when we"
];

const P3_FEELING = [
  "and it ruins my day", "and i just start crying", "and i feel sick to my stomach", 
  "and i just feel completely empty", "and it still hurts", "and i miss it", 
  "and i hate that i miss it", "and i wish i could forget",
  "and it makes me so angry", "and it makes me want to scream",
  "and i get so mad at myself", "and i realize how stupid i was",
  "and i realize how much you hurt me", "and i feel so numb",
  "and it breaks my heart all over again", "and i just want to sleep forever",
  "and i wish i never met you", "and i just feel so pathetic",
  "and it reminds me why we ended", "and it reminds me that you're gone"
];

// ═══════════════════════════════════════════════════════════════
// PATTERN 4: CONFESSIONS
// ═══════════════════════════════════════════════════════════════

const P4_CONFESSION = [
  "i never told you but", "i have a confession:", "secretly,", "truth is,", 
  "i always pretended that", "i lied when i said", "i act like i don't care but", 
  "i tell everyone i'm over you but", "i pretend i'm fine but", 
  "i try to act tough but", "nobody knows this but", "i've been hiding that",
  "i hate to admit it but", "i promised myself i wouldn't say this but",
  "i swore i was done but", "i know it's pathetic but", "to be totally honest,"
];

const P4_REVELATION = [
  "i still wait for your text", "i still love you", 
  "im still completely in love with you", "i miss you every single day", 
  "i cry about you all the time", "i still check your pages", 
  "i never wanted to let you go", "im still broken over it",
  "i'm not okay", "i haven't moved on at all", "i still think you're the one",
  "i compare everyone to you", "i still wear your hoodie", 
  "i read our old texts every night", "i wish you would just call me",
  "i would take you back in a heartbeat", "i still sleep on my side of the bed",
  "i'm dying inside without you", "i still hope you'll come back"
];

// ═══════════════════════════════════════════════════════════════
// PATTERN 5: RAW / SHORT / STANDALONE
// ═══════════════════════════════════════════════════════════════

const RAW_MESSAGES = [
  "i hate you", 
  "you're terrible", 
  "i hope she breaks your heart", "i hope he cheats on you", 
  "you disgust me", "i never want to see you again", "delete my number", 
  "dont ever text me again", "lose my number", "we're done", "its over", 
  "im done", "i cant do this anymore", "im blocking you", "unblock me", 
  "unblock me please", "answer your phone", "pick up", 
  "pick up the fucking phone", "why are you ignoring me", 
  "stop ignoring me", "please just talk to me", "can we talk", 
  "can we please just talk", "i miss you", "i miss u", "im sorry", 
  "im so sorry", "please come back", 
  "i need you", "im begging you", "please", "just one more chance", 
  "i promise ill change", "i cant live without you", 
  "why did you do this to me", "why wasn't i enough", 
  "what did she have that i didnt", "was it worth it", "was she worth it", 
  "did you ever even love me", "was any of it real", "you lied to me", 
  "youre a liar", "coward", "youre such a coward", "i hate that i miss you", 
  "i hate that i still love you", "lol ok", "k", "ok", "fine", "whatever", 
  "wow", "wow.", "just wow", "ur loss", "your loss", "good luck with that", 
  "have a nice life", "i hope you're happy", "are you happy now", 
  "congratulations", "u up?", "you up?", "im drunk", "im so drunk right now", 
  "i shouldnt be texting you", "i know i shouldnt text u but", 
  "i cant stop thinking about you", "i cant sleep", 
  "its 3am and im crying over you", "im crying right now", 
  "you broke my heart", "you ruined me", "you ruined my life", 
  "you broke me", "i trusted you", "you promised", 
  "you said you would never leave", "you said forever", "you played me", 
  "you played me so hard", "im such an idiot", "i feel so stupid", 
  "everyone warned me about you", "my friends were right about you", 
  "my mom hates you", "i should have listened", "youre toxic", 
  "we are so toxic", "this is so toxic", "i cant keep doing this", 
  "make it stop", "it hurts so much", "it literally hurts", "im so numb", 
  "i feel nothing anymore", "you took everything from me", 
  "give me my stuff back", "i want my hoodie back", "im keeping the dog", 
  "you owe me money", "pay me back", "you owe me an apology", 
  "say youre sorry", "you never even apologized", "that wasnt an apology", 
  "go away", "leave me alone", "stop calling me", 
  "stop texting me", "im calling the cops if you come here", 
  "dont show up at my house", "dont talk to my friends", 
  "keep my name out of your mouth", "i saw your story", "who is she", 
  "who is he", "i know what you did", "i saw the texts", 
  "she told me everything", "he told me everything", 
  "you need help", "get therapy", "seek help", "youre a narcissist", 
  "classic narcissist", "gaslighter", "stop gaslighting me", 
  "manipulator", "you manipulated me", "i was so good to you", 
  "i treated you so well", "you didn't deserve me", "you don't deserve me", 
  "i deserve better", "im moving on", "ive moved on", "im seeing someone else", 
  "hes better than you", "shes prettier than you", "im happier without you", 
  "i was happier before i met you", "i wish i never met you", 
  "biggest regret of my life", "i hate myself for loving you", 
  "why cant i let you go", "how do i move on", "help me", "im dying inside",
  "i saw you yesterday and felt absolutely nothing",
  "you're blocked on everything for a reason",
  "stop having your friends check my stories",
  "im not your backup plan",
  "you only want me when you're lonely",
  "you only text me when you're drunk",
  "i hope the new girl is worth it",
  "i heard you two broke up",
  "tell your mom i said hi",
  "i want my records back",
  "you never returned my sweater",
  "im throwing all your stuff away",
  "i burned your letters",
  "i deleted all our pictures",
  "i threw the ring in the ocean",
  "you were a waste of time",
  "three years down the drain",
  "five years wasted on you",
  "i gave you my best years",
  "you drained the life out of me",
  "you sucked the joy out of everything",
  "you ruined my birthday",
  "you ruined the holidays for me",
  "i cant even listen to my favorite band anymore because of you",
  "you ruined that restaurant for me",
  "i cant go to that part of town anymore",
  "you made me hate myself",
  "you made me feel so ugly",
  "you made me feel so stupid",
  "you made me question my sanity",
  "my friends all told me to leave you",
  "i defended you to everyone and you made me look like an idiot",
  "i stood up for you and you betrayed me",
  "i chose you over everyone and you chose yourself",
  "you were always so selfish",
  "you only cared about yourself",
  "it was always all about you",
  "you never listened to me",
  "you never supported me",
  "you were never there when i needed you",
  "you left me at my lowest point",
  "you kicked me when i was down",
  "you stabbed me in the back",
  "you broke every promise you ever made",
  "your words mean nothing",
  "actions speak louder than words and yours screamed that you didn't care",
  "i should have left the first time you lied",
  "i should have left when you hit me",
  "i should have left when you cheated",
  "i was too blind to see who you really were",
  "love is blind but i finally opened my eyes",
  "the rose-colored glasses came off",
  "i finally see you for who you are",
  "you're a monster",
  "you're a coward",
  "you're pathetic",
  "you're weak",
  "you're a child",
  "grow up",
  "grow up",
  "take some responsibility for once in your life",
  "stop playing the victim",
  "you're not the victim here",
  "stop twisting the narrative",
  "stop lying to everyone",
  "everyone knows the truth",
  "the truth will come out eventually",
  "you cant hide who you are forever",
  "im done protecting your secrets",
  "im done protecting you",
  "im done covering for you",
  "im done defending you",
  "im done",
  "we're done",
  "it's over",
  "goodbye",
  "farewell",
  "im so done", "we are never getting back together", 
  "dont call me", "im blocking your number", "im blocking you on everything", "youre blocked", 
  "youre dead to me", "i dont know you anymore", "who even are you", "youre a stranger to me now", 
  "i wasted my life on you", "you stole my twenties", "give me my time back", "you owe me so much", 
  "youre a leech", "youre a parasite", "youre exhausting", "im exhausted", "im so tired of crying", 
  "im out of tears", "i have nothing left to give", "you took it all", "you left me with nothing", 
  "i hate who i became with you", "you brought out the worst in me", "we were a mistake", 
  "you were a mistake", "biggest mistake of my life", "i regret everything", "i regret meeting you", 
  "i wish we never crossed paths", "i wish i never swiped right", "i wish i never gave you my number", 
  "i should have listened to the red flags", "you were a walking red flag", "red flags everywhere and i was blind", 
  "you blinded me", "you manipulated everyone", "you need serious help", 
  "go to therapy", "get a therapist", "youre unhinged", "youre crazy", "you made me feel crazy", 
  "youre so toxic", "toxic af", "goodbye forever", "never speak to me again", "dont ever look at me", 
  "if i see you in public im walking away", "dont say hi if you see me", "we arent friends", 
  "we will never be friends", "i dont want to be friends", "stop asking to be friends", "im not your friend", 
  "im not your bro", "save it", "i dont care", "i literally dont care", "who cares", 
  "whatever", "just stop", "stop.", "leave me be", "let me go", "just let me go", "why cant you let me go", 
  "you dont own me", "im not yours", "i belong to me now", "im taking my power back", "im taking my life back", 
  "you dont control me anymore", "you have no power over me", "youre nothing to me", "you mean nothing", 
  "youre irrelevant", "ur irrelevant", "im over it", "im over you", "ive been over you", 
  "i was over you months ago", "im doing great", "im thriving without you", "watch me shine without you", 
  "watch me win without you", "you held me back", "you weighed me down", "you were dead weight", 
  "im flying now", "i feel so light without you", "the trash took itself out", "trash.", "garbage.", 
  "youre garbage", "youre a clown", "clown.", "clown behavior", "embarrassing", "youre embarrassing", 
  "this is embarrassing for you", "im embarrassed for you", "cringe", "youre so cringe", "grow up", 
  "act your age", "man child", "youre a child", "immature", "so immature", "you never grew up", 
  "peter pan syndrome", "im not your mother", "i was your mother not your partner", "im not your maid", 
  "im not your therapist", "pay me for therapy", "you used me as a therapist", "trauma dumping", 
  "stop trauma dumping on me", "deal with your own issues", "fix yourself", "heal yourself", "youre broken", 
  "youre damaged", "stay away from me", "stay far away from me", 
  "i see your burner accounts", "stop watching my stories from fake accounts", 
  "i know its you", "youre not slick", "youre not fooling anyone", "everyone sees through you", 
  "everyone knows what you did", "the truth is out", "your secrets are out", "i told everyone", 
  "i exposed you", "youre exposed", "game over", "the game is over", "stop playing games", 
  "i dont play games", "im too old for games", "im tired of the games", "you played yourself", 
  "congratulations, you played yourself", "you won the game but lost me", "have fun being single", 
  "have fun being miserable", "have fun alone", "enjoy your miserable life", 
  "im so angry", "im shaking im so angry", "i want to scream", "im screaming", 
  "you give me the ick", "major ick", "the ick is real", "i cant unsee it", 
  "never again", "lesson learned", "hard lesson learned", 
  "you were a lesson", "you werent a blessing you were a lesson", "not a soulmate, a lesson", "karmic debt", 
  "you were my karma", "i paid my karma", "my karma is clear", "your karma is coming", "watch your back", 
  "karma is coming for you", "it will catch up to you", "it always catches up", "time will tell", 
  "the truth always comes out", "lies", "all lies", "nothing but lies", "liar", "compulsive liar", 
  "pathological liar", "you believe your own lies", "youre delusional", "delusional", "seek help immediately", 
  "you need Jesus", 
  "youre spiraling", "stop spiraling", "get a grip", "pull yourself together", "pathetic", "so pathetic", 
  "pitiful", "i pity you", "sad", "sad life", "what a sad life you live", "sucks to be you", "sucks to suck", 
  "L", "take the L", "huge L", "you lost", "i won", "im winning", "im the prize", "you fumbled", 
  "you fumbled the bag", "you fumbled me", "biggest fumble of your life", "you dropped the ball", 
  "your loss entirely", "my gain", "im better off", "way better off", "infinitely better off", "never looking back", 
  "forward only", "onto better things", "onto bigger and better things", "upgrading", "i upgraded", 
  "my new man is better", "my new girl is better", "they treat me right", "im finally treated right", 
  "this is what love feels like", "you never loved me", "you dont know how to love", "incapable of love", 
  "empty shell", "hollow", "youre hollow inside", "soulless", "you have no soul", "heartless", 
  "you have no heart", "ice cold", "stone cold", "cold hearted", "cold blooded", "reptile", "snake", 
  "youre a snake", "viper", "toxic snake", "rat", "youre a rat", "snitch", "two faced", "backstabber", 
  "hypocrite", "biggest hypocrite i know", "do as i say not as i do", "double standards", 
  "your double standards are insane", "rules for thee but not for me", "narcissistic abuse", "survivor", 
  "im a survivor", "i survived you", "you didn't break me", "you tried to break me", "you failed", 
  "im still standing", "im stronger than you", "im stronger now", "what doesn't kill you", "you made me stronger", 
  "thanks for the trauma", "thanks for nothing", "thanks for the lessons", "no thanks to you", 
  "fuck you very much", "kindly fuck off", "respectfully, fuck off", "with all due respect, go to hell", 
  "bye", "bye forever", "peace out", "peace", "im out", "done.", "so done.", "finally done.", "permanently done.",
  "i just want you back", "i still love you", "i cant do this without you", "please just answer me", 
  "im so lost without you", "i feel so empty", "i miss my best friend", "i miss my person", 
  "i cry every single night", "i still smell your perfume on my hoodie", "i cant sleep in my bed anymore", 
  "i sleep on the couch because the bed feels too big", "i just need a hug from you", 
  "i need to hear your voice", "please call me", "im begging you", "ill do anything", 
  "ill change i swear", "im so sorry", "i fucked up so badly", "i hate myself for what i did",
  "im so lonely", "the silence is deafening", "i miss everything about you", 
  "im breaking apart", "im shattering", "im completely broken", "i dont want to wake up tomorrow",
  "how could you do this", "why wasn't i enough", "what did i do wrong", "was it me", 
  "was i the problem", "why did you leave", "why did you stop loving me", "was any of it real", 
  "did you ever actually love me", "how are you moving on so fast", "how do you just forget", 
  "did i mean nothing to you", "was i just a joke to you", "i just need closure", 
  "i need an explanation", "i deserve an explanation", "i deserve the truth", "just tell me the truth",
  "u up", "are u awake", "im drunk", "i had a few drinks", "im sitting outside your house", 
  "i drove past your house", "i accidentally dialed your number", "i shouldn't be texting u", 
  "i know u hate me but", "i miss u so much", "can i just see u", "just for 5 minutes", 
  "im at our old bar", "they played our song", "i cant stop crying",
  "come over", "i need u right now", "dont leave me", "my heart hurts", "my chest hurts", 
  "i cant breathe without you", "im having a panic attack", "youre the only one i want",
  "idgaf anymore", "whatever man", "i dont care", "its whatever", "cool", "yeah ok", "sure",
  "stop", "just stop", "leave it alone", "drop it", "dont text me again", "im blocking u",
  "youre literally the worst", "i hate you so much", "you ruined everything", "im so mad at u",
  "my mom was right", "i cant believe u did that", "u broke my heart", "i hope ur happy",
  "was she worth it", "did u even care", "was it easy to leave", "do u miss me at all",
  "i saw u today", "u looked happy", "it hurts to see u happy", "do u even think about me",
  "i miss ur laugh", "i miss ur face", "i hate waking up alone", "come back to bed",
  "i cant do this anymore", "im so exhausted", "im mentally checked out", "im done trying",
  "fuck off", "burn", "die", "go away", "never speak to me again", "im serious this time",
  "dont call me", "im not picking up", "stop calling", "stop leaving voicemails",
  "im deleting our photos", "i threw away ur hoodie", "i hate the smell of ur cologne now",
  "who are u even", "i dont know u anymore", "u changed so much", "youre not the same person",
  "wtf is wrong with u", "what is ur problem", "ur actually insane", "psychopath behavior",
  "ur so toxic", "im glad ur gone", "best decision i ever made", "finally free", "so free",
  "i miss u", "i still love u", "its always been u", "no one compares to u", "im still urs"
];

// =============================================================
// HELPER LOGIC
// =============================================================

function applyCasing(msg) {
  const rand = Math.random();
  if (rand < 0.60) return msg.toLowerCase();
  if (rand < 0.75) return msg;
  if (rand < 0.90) return msg.charAt(0).toUpperCase() + msg.slice(1);
  return msg.toUpperCase();
}

function applyPunctuation(msg) {
  if (Math.random() < 0.4) return msg;
  msg = msg.replace(/[.!?]+$/, '').trim();
  const rand = Math.random();
  if (rand < 0.15) msg += '...';
  else if (rand < 0.25) msg += '.';
  else if (rand < 0.35) msg += '..';
  else if (rand < 0.45) msg += '!';
  else if (rand < 0.55) msg += '?!';
  else if (rand < 0.65) msg += '?!?';
  return msg;
}

function generate() {
  const pool = [];
  const seen = new Set();
  
  // Track frequencies to ensure variety
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
    if ((firstTwoWords[opening] || 0) >= 300) return false; 
    
    const trigrams = getTrigrams(msg);
    for (const gram of trigrams) {
      if ((trigramCounts[gram] || 0) >= 60) return false;
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

  // Generate 10000 messages
  let attempts = 0;
  
  // 1. First add all raw messages as is
  console.log("Phase 1: Adding base raw messages");
  for (let msg of RAW_MESSAGES) {
      let finalMsg = applyCasing(msg);
      finalMsg = applyPunctuation(finalMsg);
      if (canAdd(finalMsg)) addMessage(finalMsg);
  }
  
  console.log(`Phase 1 total: ${pool.length}`);
  
  // 2. Generate combinations randomly across all 5 structures
  console.log("Phase 2: Generating combo messages with 5 distinct structures");
  while (pool.length < 10000 && attempts < 5000000) {
      attempts++;
      
      let msg = "";
      let structureType = Math.random();
      
      if (structureType < 0.20) {
          // Structure E: Raw Message variations
          msg = R(RAW_MESSAGES);
          if (Math.random() < 0.4) msg = msg.replace(/\byou\b/gi, 'u');
          if (Math.random() < 0.4) msg = msg.replace(/\byour\b/gi, 'ur');
          if (Math.random() < 0.3) msg = msg.replace(/\byou're\b/gi, 'ur');
      } else if (structureType < 0.40) {
          // Structure F: Double Raw Combo (e.g. "fuck you. i miss you.")
          let msg1 = R(RAW_MESSAGES);
          let msg2 = R(RAW_MESSAGES);
          while(msg1 === msg2) msg2 = R(RAW_MESSAGES); // Avoid identical duplicates
          let separator = Math.random() < 0.5 ? ". " : " ";
          msg = msg1 + separator + msg2;
          if (Math.random() < 0.3) msg = msg.replace(/\byou\b/gi, 'u');
      } else if (structureType < 0.60) {
          // Structure A: Combo (P1)
          let r = Math.random();
          if (r < 0.3) msg = R(P1_START) + " " + R(P1_MIDDLE);
          else if (r < 0.7) msg = R(P1_START) + " " + R(P1_MIDDLE) + " " + R(P1_END);
          else {
              msg = R(P1_MIDDLE) + " " + R(P1_END);
              msg = msg.charAt(0).toUpperCase() + msg.slice(1);
          }
      } else if (structureType < 0.75) {
          // Structure B: Questions (P2)
          let r = Math.random();
          if (r < 0.6) msg = R(P2_Q_START) + " " + R(P2_Q_ACTION) + " " + R(P2_Q_END);
          else msg = R(P2_Q_START) + " " + R(P2_Q_ACTION);
      } else if (structureType < 0.90) {
          // Structure C: Memories (P3)
          let r = Math.random();
          if (r < 0.6) msg = R(P3_TIME) + " " + R(P3_MEMORY) + " " + R(P3_FEELING);
          else msg = R(P3_TIME) + " " + R(P3_MEMORY);
      } else {
          // Structure D: Confessions (P4)
          msg = R(P4_CONFESSION) + " " + R(P4_REVELATION);
      }
      
      // Some random textspeak mutations for extra spice
      if (Math.random() < 0.15) msg = msg.replace(/\byou\b/gi, 'u');
      if (Math.random() < 0.15) msg = msg.replace(/\byour\b/gi, 'ur');
      if (Math.random() < 0.10) msg = msg.replace(/\bto\b/gi, '2');
      if (Math.random() < 0.10) msg = msg.replace(/\bfor\b/gi, '4');
      
      msg = applyCasing(msg);
      msg = applyPunctuation(msg);
      
      if (canAdd(msg)) addMessage(msg);
  }
  
  console.log(`Phase 2 total: ${pool.length} (in ${attempts} attempts)`);
  
  // Return exact amount required, completely shuffled so emotions and styles are interleaved
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

console.log('Generating 10,000 unique RAW texts...\n');
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
const avgLen = (lengths.reduce((a,b)=>a+b,0) / lengths.length).toFixed(1);
const shortCount = lengths.filter(l => l <= 3).length;
const medCount = lengths.filter(l => l > 3 && l <= 12).length;
const longCount = lengths.filter(l => l > 12).length;
console.log(`\nMessage length distribution:`);
console.log(`  Short (1-3 words): ${shortCount} (${(shortCount/pool.length*100).toFixed(1)}%)`);
console.log(`  Medium (4-12 words): ${medCount} (${(medCount/pool.length*100).toFixed(1)}%)`);
console.log(`  Long (13-30 words): ${longCount} (${(longCount/pool.length*100).toFixed(1)}%)`);
console.log(`  Average: ${avgLen} words`);

console.log('\n── Sample messages ──');
for (let i = 0; i < 20; i++) {
  const e = pool[i];
  console.log(`  To: ${e.name} → "${e.message}"`);
}
