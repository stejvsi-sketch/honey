#!/usr/bin/env node
// =============================================================
// generate-messages.mjs (v8 — 6200+ hand-crafted unique messages, ZERO inflation)
//
// Reads raw messages from raw_pool_v2.json
// Assigns names + colors, applies light casing only
// Outputs seed-messages.json
// =============================================================

import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CARD_COLORS = [
  'parchment', 'rose-dust', 'sage-whisper', 'lavender-haze',
  'honey-gold', 'ocean-mist', 'blush-coral', 'dusty-mauve',
  'faded-denim', 'ivory-ash',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function R(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function wc(s) { return s.trim().split(/\s+/).filter(w => w.length > 0).length; }

// ─── NAMES ──────────────────────────────────────────────────
const NAMES_USCANAU = [
  'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia',
  'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Ella', 'Avery',
  'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Riley', 'Aria', 'Lily', 'Aurora',
  'Zoey', 'Nora', 'Camila', 'Hannah', 'Lillian', 'Addison', 'Eleanor', 'Natalie',
  'Luna', 'Savannah', 'Brooklyn', 'Leah', 'Zoe', 'Stella', 'Hazel', 'Ellie',
  'Paisley', 'Audrey', 'Skylar', 'Violet', 'Claire', 'Bella', 'Lucy', 'Anna',
  'Caroline', 'Genesis', 'Aaliyah', 'Kennedy', 'Kinsley', 'Allison', 'Maya',
  'Sarah', 'Madelyn', 'Adeline', 'Alexa', 'Ariana', 'Elena', 'Gabriella',
  'Naomi', 'Alice', 'Sadie', 'Hailey', 'Eva', 'Emilia', 'Autumn', 'Quinn',
  'Nevaeh', 'Piper', 'Ruby', 'Serenity', 'Willow', 'Everly', 'Cora', 'Kaylee',
  'Lydia', 'Aubrey', 'Arianna', 'Eliana', 'Peyton', 'Melanie', 'Gianna',
  'Isabelle', 'Julia', 'Valentina', 'Nova', 'Clara', 'Vivian', 'Reagan',
  'Mackenzie', 'Madeline', 'Brielle', 'Delilah', 'Isla', 'Rylee', 'Katherine',
  'Sophie', 'Josephine', 'Ivy', 'Liliana', 'Jade', 'Maria', 'Taylor', 'Hadley',
  'Kylie', 'Emery', 'Adalynn', 'Natalia', 'Annabelle', 'Faith', 'Alexandra',
  'Ximena', 'Ashley', 'Brianna', 'Raelynn', 'Bailey', 'Mary', 'Athena',
  'Andrea', 'Lyla', 'Daisy', 'Norah', 'Amaya', 'Brooke', 'Penelope',
  'Freya', 'Morgan', 'Jordyn', 'London', 'Alina', 'Jasmine', 'Lila',
  'Iris', 'Ana', 'Diana', 'Katie', 'Nicole', 'Lauren', 'Rachel',
  'Samantha', 'Vanessa', 'Jenna', 'Megan', 'Amber', 'Tiffany', 'Courtney',
  'Stephanie', 'Amanda', 'Jennifer', 'Jessica', 'Heather', 'Michelle', 'Melissa',
  'Kayla', 'Danielle', 'Crystal', 'Christina', 'Brittany', 'Kimberly', 'Rebecca',
  'Laura', 'Chelsea', 'Sara', 'Kelsey', 'Lindsey', 'Paige', 'Shelby', 'Holly',
  'Jamie', 'Casey', 'Whitney', 'Tara', 'Kristen', 'Shannon', 'Molly',
  'Cassandra', 'Marissa', 'Alicia', 'Destiny', 'Sierra', 'Savanna', 'Briana',
  'Veronica', 'Angelina', 'Catherine', 'Katelyn', 'Sydney', 'Mikayla', 'Adriana',
  'Summer', 'Winter', 'Sienna', 'Margot', 'Wren', 'Elsie', 'Millie',
  'Rosalie', 'Eloise', 'Lena', 'Gemma', 'Olive', 'June', 'Mabel', 'Thea',
  'Ada', 'Harley', 'Mckenzie', 'Teagan', 'Emerson', 'Sloane', 'Finley',
  'Lennox', 'Sage', 'Blair', 'Ainsley', 'Monroe', 'Ellis', 'Palmer',
  'Oakley', 'Frankie', 'Remi', 'Rowan', 'Reese', 'Spencer', 'Sutton',
  'Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas',
  'Benjamin', 'Theodore', 'Jack', 'Levi', 'Alexander', 'Mason', 'Ethan',
  'Daniel', 'Jacob', 'Logan', 'Jackson', 'Sebastian', 'Aiden', 'Owen',
  'Samuel', 'Ryan', 'Nathan', 'Carter', 'Luke', 'Jayden', 'Dylan', 'Grayson',
  'Caleb', 'Isaac', 'Leo', 'Joshua', 'Andrew', 'Ezra', 'Thomas', 'Hudson',
  'Charles', 'Christopher', 'Jaxon', 'Maverick', 'Josiah', 'Isaiah', 'David',
  'Elias', 'Hunter', 'Waylon', 'Adrian', 'Christian', 'Lincoln', 'Eli',
  'Nolan', 'Connor', 'Cameron', 'Jeremiah', 'Asher', 'Austin', 'Easton',
  'Colton', 'Everett', 'Parker', 'Brooks', 'Dominic', 'Carson', 'Roman',
  'Max', 'Jace', 'Cooper', 'Miles', 'Ian', 'Harrison', 'Tristan', 'Landon',
  'Brayden', 'Greyson', 'Ryder', 'Bennett', 'Blake', 'Gavin', 'Cole',
  'Tyler', 'Chase', 'Ashton', 'Weston', 'Silas', 'Jasper', 'Milo',
  'Beau', 'Axel', 'Beckett', 'Damian', 'Hayden', 'Ace', 'Emmett',
  'Jaxson', 'Kayden', 'Braxton', 'Brandon', 'Kevin', 'Justin', 'Kyle',
  'Aaron', 'Zachary', 'Patrick', 'Sean', 'Brian', 'Travis', 'Derek',
  'Cody', 'Troy', 'Dustin', 'Jordan', 'Shane', 'Brett', 'Corey', 'Brad',
  'Trevor', 'Jesse', 'Tanner', 'Marcus', 'Grant', 'Wesley', 'Garrett',
  'Bryce', 'Dalton', 'Colby', 'Wyatt', 'Jared', 'Chandler',
  'Keith', 'Scott', 'Mitchell', 'Derrick', 'Kenneth', 'Craig', 'Seth',
  'Evan', 'Tucker', 'Griffin', 'Sawyer', 'Knox', 'Phoenix', 'Felix',
  'Atlas', 'Declan', 'Hayes', 'Kai', 'August', 'Finn', 'Bodhi', 'Legend',
  'Walker', 'River', 'Remington', 'Colt', 'Crew', 'Cash', 'Hendrix',
  'Gunner', 'Kingston', 'Nash', 'Luca', 'Beckham', 'Nico', 'Sullivan',
  'Remy', 'Arlo', 'Shiloh', 'Marlowe', 'Holden', 'Callum', 'Rhett',
  'Theo', 'Arthur', 'Maeve', 'Florence',
  'Hamish', 'Angus', 'Fraser', 'Archie', 'Poppy',
  'Matilda', 'Imogen', 'Billie', 'Harriet', 'Zara',
  'Hugo', 'Archer', 'Fletcher', 'Lachlan', 'Heath',
  'Darcy', 'Tahlia', 'Kiara', 'Talia', 'Ayla', 'Marley',
  'Kendra', 'Selena', 'Makayla', 'Alexis', 'Mariah', 'Kira', 'Catalina',
  'Helena', 'Josie', 'Annie', 'Gracie', 'Lainey', 'Gia', 'Celeste',
  'Cali', 'Maisie', 'Nyla', 'Brinley', 'Hayley', 'Alaina', 'Kenzie',
  'Camille', 'Esme', 'Priscilla', 'Giselle', 'Alana', 'Kiera', 'Tessa',
  'Maci', 'Charli', 'Daphne', 'Jocelyn', 'Hope', 'Angie', 'Gloria',
  'Serena', 'Bianca', 'Nina', 'Joy', 'Maggie', 'Lana', 'Julianna',
  'Fiona', 'Ember', 'Henley', 'Tatum', 'Collins', 'Eliza', 'Saylor',
  'Carmen', 'Opal', 'Raven', 'Dakota', 'Angel', 'Mercy', 'Haven',
  'Ronan', 'Stetson', 'Gage', 'Kade', 'Brock', 'Lane',
  'Corbin', 'Zander', 'Tate', 'Reed', 'Clay', 'Sterling', 'Briggs',
  'Davis', 'Wells', 'Barrett', 'Lawson', 'Kash', 'Jett',
  'Cade', 'Ryker', 'Lennon', 'Zane', 'Kyler', 'Paxton', 'Boden',
  'Kellan', 'Emmitt', 'Kobe', 'Chance', 'Nelson', 'Dean', 'Tobias',
  'Graham', 'Anderson', 'Kendrick', 'Conner', 'Warren', 'Grady',
  'Zion', 'Brantley', 'Cannon', 'Rylan', 'Thatcher', 'Malcolm', 'Brody',
  'Kane', 'Devin', 'Prince', 'Simon', 'Axton', 'Dillon', 'Emilio',
  'Malik', 'Jasiah', 'Jayce', 'Zayn', 'Karter', 'Desmond', 'Khalil',
  'Drew', 'Robin', 'Shawn', 'Marlon', 'Glen', 'Clint',
  'Clark', 'Wayne', 'Roy', 'Gene', 'Ray', 'Dale', 'Don', 'Ted',
];

const NAMES_INDIA = [
  'Aadhya', 'Aanya', 'Aisha', 'Ananya', 'Anjali', 'Anushka', 'Aradhya', 'Avni',
  'Bhavya', 'Charvi', 'Devi', 'Diya', 'Divya', 'Esha', 'Gauri', 'Gia',
  'Ira', 'Ishita', 'Jiya', 'Kavya', 'Khushi', 'Kiara', 'Kriti', 'Lavanya',
  'Mahika', 'Meera', 'Mira', 'Mishka', 'Myra', 'Navya', 'Nisha', 'Nitya',
  'Pihu', 'Pooja', 'Prisha', 'Priya', 'Radhika', 'Rhea', 'Riya', 'Ruhi',
  'Saanvi', 'Sakshi', 'Sara', 'Siya', 'Sneha', 'Tanvi', 'Trisha', 'Urvi',
  'Vaani', 'Vanya', 'Vidya', 'Zara', 'Aditi', 'Amaira', 'Deepa', 'Fatima',
  'Hina', 'Isha', 'Janvi', 'Kashvi', 'Mahi', 'Neha', 'Nandini', 'Pallavi',
  'Rani', 'Sanvi', 'Shruti', 'Tara', 'Yasmin', 'Zoya', 'Anika', 'Kyra',
  'Pari', 'Sia', 'Tanya', 'Anaya', 'Aarohi', 'Shanaya', 'Suhana', 'Inaya',
  'Aarav', 'Advik', 'Aditya', 'Arjun', 'Arnav', 'Ayaan', 'Dev', 'Dhruv',
  'Gautam', 'Harsh', 'Ishaan', 'Kabir', 'Krishna', 'Laksh', 'Manan', 'Mohit',
  'Nakul', 'Nikhil', 'Om', 'Pranav', 'Rahul', 'Raj', 'Reyansh', 'Rohan',
  'Sahil', 'Samar', 'Shaurya', 'Siddharth', 'Tanish', 'Utkarsh', 'Varun', 'Vihaan',
  'Vivaan', 'Yash', 'Aryan', 'Atharv', 'Daksh', 'Eshaan', 'Farhan', 'Gaurav',
  'Hrithik', 'Ishan', 'Jai', 'Karan', 'Kunal', 'Lakshya', 'Manav', 'Neel',
  'Parth', 'Rishi', 'Rudra', 'Sai', 'Vikram', 'Kartik', 'Madhav', 'Naveen',
  'Prateek', 'Raghav', 'Sachin', 'Tarun', 'Vikas', 'Yuvraj',
  'Amit', 'Ankur', 'Ashwin', 'Deepak', 'Dinesh', 'Ganesh', 'Harish',
  'Jatin', 'Kamal', 'Manoj', 'Nitin', 'Pankaj', 'Rajesh', 'Ramesh', 'Suresh',
  'Tushar', 'Vinay', 'Ajay', 'Akash', 'Anand', 'Arun',
];

const NAMES_GLOBAL = [
  'Valentina', 'Camila', 'Lucia', 'Martina', 'Renata', 'Gabriela',
  'Mariana', 'Daniela', 'Fernanda', 'Jimena', 'Paula', 'Carolina',
  'Alejandra', 'Regina', 'Valeria', 'Paloma',
  'Santiago', 'Mateo', 'Diego', 'Nicolas', 'Miguel', 'Rafael',
  'Carlos', 'Emiliano', 'Thiago', 'Alejandro', 'Pablo', 'Eduardo', 'Fernando',
  'Rodrigo', 'Andres', 'Javier', 'Enrique', 'Ricardo', 'Hector', 'Marco',
  'Pedro', 'Luis', 'Bruno', 'Dante', 'Enzo', 'Ivan',
  'Mariam', 'Noura', 'Layla', 'Hana', 'Lina',
  'Dina', 'Rania', 'Salma', 'Amina', 'Nadia', 'Leila', 'Samira', 'Zahra',
  'Maryam', 'Noor', 'Rana', 'Huda', 'Malak', 'Lara',
  'Omar', 'Yusuf', 'Ahmed', 'Ali', 'Hassan', 'Ibrahim', 'Khalid', 'Tariq',
  'Hamza', 'Adam', 'Zain', 'Kareem', 'Bilal', 'Idris', 'Mustafa', 'Rami',
  'Saif', 'Faisal', 'Rashid', 'Jamal', 'Amir',
  'Yuki', 'Sakura', 'Mei', 'Akira', 'Haruto', 'Ren', 'Sora',
  'Aoi', 'Mio', 'Riko', 'Yui', 'Hinata', 'Kaede', 'Koharu', 'Nanami',
  'Hiroto', 'Takumi', 'Yuto', 'Sota', 'Kaito', 'Riku', 'Daiki', 'Kenta',
  'Jisoo', 'Eunji', 'Haeun', 'Seoyeon', 'Jiho',
  'Minho', 'Joon', 'Hyun', 'Taeyang', 'Woojin', 'Jihoon', 'Seojun',
  'Wei', 'Chen', 'Xiao', 'Ling', 'Jing', 'Yan', 'Fei', 'Zhi',
  'Ming', 'Hao', 'Jun', 'Lei', 'Feng', 'Yi', 'Cheng',
  'Putri', 'Nhi', 'Mai', 'Linh', 'Trang', 'An',
  'Thanh', 'Bao', 'Minh', 'Duc', 'Tuan', 'Huy',
  'Ayu', 'Dewi', 'Siti', 'Budi', 'Adi', 'Bagus', 'Rizky',
  'Amara', 'Zuri', 'Nia', 'Asha', 'Imani', 'Eshe', 'Makena',
  'Kofi', 'Kwame', 'Sekou', 'Ayo', 'Emeka', 'Chidi', 'Obi',
  'Chiamaka', 'Ngozi', 'Kemi', 'Folake', 'Yemi', 'Tolu',
  'Mandla', 'Thabo', 'Sipho', 'Lebo', 'Naledi', 'Thandiwe', 'Kagiso',
  'Ingrid', 'Soren', 'Astrid', 'Lars', 'Erik', 'Magnus',
  'Nils', 'Sigrid', 'Henrik', 'Maja', 'Freja', 'Gustaf',
  'Celine', 'Mathilde', 'Juliette', 'Antoine', 'Pierre', 'Amelie',
  'Jean', 'Lucie', 'Louis', 'Jules',
  'Chiara', 'Francesca', 'Giulia', 'Lorenzo', 'Matteo', 'Luca',
  'Giovanni', 'Alessandro', 'Federico', 'Beatrice', 'Alessia',
  'Hans', 'Klaus', 'Wolfgang', 'Heidi', 'Greta', 'Lotte', 'Moritz',
  'Katarina', 'Petra', 'Marta', 'Zofia', 'Kasia', 'Marek', 'Jakub',
  'Jan', 'Pavel', 'Lukas', 'Tereza', 'Ivana', 'Nikolai', 'Dmitri',
  'Anastasia', 'Natasha', 'Olga', 'Svetlana', 'Sergei', 'Mikhail',
  'Viktor', 'Andrei', 'Boris', 'Alexei', 'Tatiana', 'Katya', 'Daria',
  'Aroha', 'Tane', 'Moana', 'Nikau', 'Kaia', 'Maia',
  'Elif', 'Defne', 'Zeynep', 'Beren', 'Azra', 'Ece',
  'Mert', 'Kerem', 'Baris', 'Cem', 'Emre', 'Burak', 'Deniz', 'Can',
  'Ines', 'Florencia', 'Marisol', 'Rocio', 'Paola', 'Lorena', 'Monica',
  'Gustavo', 'Sergio', 'Arturo', 'Raul', 'Gerardo', 'Oscar', 'Cesar',
  'Joaquin', 'Salvador', 'Octavio',
  'Althea', 'Bea', 'Jem', 'Kaye', 'Riza', 'Vina',
  'Juan', 'Carlo', 'Paolo', 'Rico', 'Jericho', 'Ramon',
  'Nurul', 'Farah', 'Aisyah', 'Nur', 'Hanis', 'Syafiq',
  'Keisha', 'Tyrell', 'Dwayne',
  'Kalani', 'Leilani', 'Keanu', 'Makana',
];

const NAMES_SPECIAL = [
  'M', 'J', 'K', 'A', 'R', 'S', 'T', 'D', 'C', 'B', 'E', 'N', 'L',
  'H', 'G', 'P', 'V', 'W', 'F', 'Z', 'I', 'O', 'Q', 'X', 'Y', 'U',
  'mama', 'mom', 'mommy', 'mother', 'dad', 'daddy', 'papa', 'pops',
  'bro', 'sis', 'brother', 'sister', 'bestie', 'bff',
  'babe', 'baby', 'love', 'honey', 'angel', 'sunshine', 'darling',
  'sweetheart', 'beautiful', 'handsome', 'mi amor', 'habibi', 'habibti',
  'MyPerson', 'YouKnowWho', 'Her', 'Him', 'Them', 'You',
  'MyFirst', 'MyLast', 'MyAlmost',
  'SomeoneIUsedToKnow', 'TheOneWhoLeft', 'TheOneILost',
  'MyOldBestFriend', 'MyExBestFriend',
  'GreenEyes', 'CurlyHair', 'TallGuy',
  'CoworkerCrush', 'LibraryBoy',
  'MyEx', 'FirstLove', 'AlmostLover',
  'Stranger', 'OldFriend',
];

// Weighted name pool (US/CAN/AU names weighted 3x, India 2x, etc.)
const NAMES = [
  ...NAMES_USCANAU, ...NAMES_USCANAU, ...NAMES_USCANAU,
  ...NAMES_INDIA, ...NAMES_INDIA,
  ...NAMES_GLOBAL,
  ...NAMES_SPECIAL,
];
const UNAMES = [...new Set([...NAMES_USCANAU, ...NAMES_INDIA, ...NAMES_GLOBAL, ...NAMES_SPECIAL])];


// =============================================================
// GENERATION
// =============================================================

function generate() {
  // Load raw messages
  const rawPath = join(__dirname, 'raw_pool_v2.json');
  const RAW_MESSAGES = JSON.parse(readFileSync(rawPath, 'utf-8'));
  console.log(`Loaded ${RAW_MESSAGES.length} raw messages from raw_pool_v2.json`);

  const pool = [];
  const seen = new Set();
  const nameUsage = {};
  const MAX_PER_NAME = 7;

  function pickName() {
    for (let attempt = 0; attempt < 50; attempt++) {
      const n = R(NAMES);
      if ((nameUsage[n] || 0) < MAX_PER_NAME) return n;
    }
    const shuffled = shuffle(UNAMES);
    for (const n of shuffled) {
      if ((nameUsage[n] || 0) < MAX_PER_NAME) return n;
    }
    return R(UNAMES);
  }

  // Light casing variation only — NO word swaps, NO u/you toggles
  function applyCasing(msg) {
    const r = Math.random();
    if (r < 0.30) return msg;                    // 30% keep as-written
    if (r < 0.55) return msg.toLowerCase();       // 25% all lowercase
    if (r < 0.75) return msg.charAt(0).toUpperCase() + msg.slice(1).toLowerCase(); // 20% capitalize first
    if (r < 0.95) {
      // 20% sentence case
      return msg.replace(/(^|[.!?]\s+)([a-z])/g, (_, p, c) => p + c.toUpperCase());
    }
    return msg.toUpperCase();                     // 5% ALL CAPS
  }

  // Process each raw message — just clean up and apply casing
  for (const raw of shuffle(RAW_MESSAGES)) {
    let msg = raw.trim();
    if (!msg || msg.length < 1 || msg.length > 280) continue;

    // Word count check (max 25 words)
    if (wc(msg) > 25) continue;

    // Apply light casing
    msg = applyCasing(msg);

    // Deduplicate
    const key = msg.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);

    const name = pickName();
    nameUsage[name] = (nameUsage[name] || 0) + 1;
    pool.push({ name, message: msg, color_id: R(CARD_COLORS) });
  }

  return shuffle(pool);
}


// =============================================================
// VALIDATION
// =============================================================

function validate(pool) {
  let errors = 0;
  const messageSet = new Set();

  for (let i = 0; i < pool.length; i++) {
    const e = pool[i];
    if (e.message.length > 280) { console.error(`[${i}] Over 280 chars`); errors++; }
    if (wc(e.message) > 25) { console.error(`[${i}] Over 25 words: "${e.message}"`); errors++; }
    if (wc(e.message) < 1) { console.error(`[${i}] Empty`); errors++; }
    if (!CARD_COLORS.includes(e.color_id)) { console.error(`[${i}] Bad color`); errors++; }
    const key = e.message.toLowerCase().trim();
    if (messageSet.has(key)) { console.error(`[${i}] Duplicate: "${e.message.substring(0, 50)}"`); errors++; }
    messageSet.add(key);
  }

  // Opening pattern diversity check
  const openingPatterns = {};
  for (const e of pool) {
    const opening = e.message.split(/\s+/).slice(0, 3).join(' ').toLowerCase();
    openingPatterns[opening] = (openingPatterns[opening] || 0) + 1;
  }
  let highRepeat = 0;
  for (const [pat, count] of Object.entries(openingPatterns)) {
    if (count > 5) {
      console.warn(`  ⚠ Opening "${pat}" appears ${count}x`);
      highRepeat++;
    }
  }
  if (highRepeat) console.warn(`  ${highRepeat} opening patterns >5x`);

  return errors;
}


// =============================================================
// MAIN
// =============================================================

console.log('Generating unique seed messages (v8 — zero inflation)...\n');
const pool = generate();

console.log(`\nValidating ${pool.length} entries...`);
const errors = validate(pool);

if (errors > 0) {
  console.error(`\n❌ ${errors} validation errors!`);
  process.exit(1);
}

console.log(`\n✅ ${pool.length} entries generated and validated!`);

// Name stats
const nameCounts = {};
for (const e of pool) {
  nameCounts[e.name] = (nameCounts[e.name] || 0) + 1;
}
const uniqueNames = Object.keys(nameCounts).length;
const maxPerName = Math.max(...Object.values(nameCounts));
const avgPerName = (pool.length / uniqueNames).toFixed(1);

console.log(`\n── Name Statistics ──`);
console.log(`  Unique names: ${uniqueNames}`);
console.log(`  Max msgs/name: ${maxPerName}`);
console.log(`  Avg msgs/name: ${avgPerName}`);

// Word count distribution
const wcDist = {};
for (const e of pool) {
  const w = wc(e.message);
  const bucket = w <= 3 ? '1-3' : w <= 6 ? '4-6' : w <= 10 ? '7-10' : w <= 15 ? '11-15' : w <= 20 ? '16-20' : '21-25';
  wcDist[bucket] = (wcDist[bucket] || 0) + 1;
}
console.log(`\n  Word count distribution:`);
for (const bucket of ['1-3', '4-6', '7-10', '11-15', '16-20', '21-25']) {
  if (wcDist[bucket]) console.log(`    ${bucket} words: ${wcDist[bucket]}`);
}

const outPath = join(__dirname, 'seed-messages.json');
writeFileSync(outPath, JSON.stringify(pool, null, 2));
console.log(`\nWritten to: ${outPath}`);

console.log('\n── Sample messages ──');
for (let i = 0; i < 25; i++) {
  const e = pool[i];
  console.log(`  To: ${e.name} → "${e.message}"`);
}
