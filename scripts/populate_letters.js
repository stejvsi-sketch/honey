import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const US_NAMES_MALE = [
  'James', 'Michael', 'Robert', 'John', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles',
  'Christopher', 'Daniel', 'Matthew', 'Anthony'
];
const US_NAMES_FEMALE = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Lisa'
];

const CANADA_NAMES_MALE = [
  'Liam', 'Jackson', 'Noah', 'Lucas', 'Oliver', 'William', 'Benjamin', 'Theodore', 'Jack', 'Levi',
  'Alexander', 'James'
];
const CANADA_NAMES_FEMALE = [
  'Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Chloe', 'Mia', 'Mila', 'Alice',
  'Lily', 'Ella', 'Isla'
];

const INDIA_NAMES_MALE = [
  'Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kabir', 'Aryan', 'Riyansh', 'Dhruv',
  'Ayaan', 'Atharv'
];
const INDIA_NAMES_FEMALE = [
  'Saanvi', 'Aadhya', 'Kiara', 'Myra', 'Ira', 'Ananya', 'Navya', 'Pari', 'Prisha', 'Aarohi',
  'Diya', 'Avni', 'Riya'
];

const AUS_NAMES_MALE = [
  'Oliver', 'Noah', 'Leo', 'William', 'Henry', 'Jack', 'Theodore', 'Hudson', 'Charlie', 'Luca',
  'Thomas', 'Elijah'
];
const AUS_NAMES_FEMALE = [
  'Charlotte', 'Amelia', 'Isla', 'Olivia', 'Mia', 'Ava', 'Matilda', 'Grace', 'Willow', 'Harper',
  'Chloe', 'Ivy', 'Sophie'
];

const ALL_NAMES = [
  ...US_NAMES_MALE, ...US_NAMES_FEMALE,
  ...CANADA_NAMES_MALE, ...CANADA_NAMES_FEMALE,
  ...INDIA_NAMES_MALE, ...INDIA_NAMES_FEMALE,
  ...AUS_NAMES_MALE, ...AUS_NAMES_FEMALE
].slice(0, 100);

const RAW_MESSAGES = [
  "i still check my phone every morning hoping u texted me first.",
  "WHY DID YOU LIE TO ME FOR 3 YEARS",
  "u were right about everything im sorry",
  "its been 6 months and i still cant listen to frank ocean without crying",
  "i saw u at the mall with her. she looks just like me.",
  "i hope you fail your finals u ruined my life",
  "do u ever think about that night in july or was it just me",
  "u took my youth and gave me trust issues",
  "I miss ur dog more than I miss you tbh",
  "sometimes i pretend we r still together to fall asleep",
  "im doing so much better without you. i hope u know that.",
  "why wasn't i enough for u to stay?",
  "i deleted all our photos today. it felt like dying.",
  "you never even said goodbye.",
  "i hate that my mom still asks about u",
  "if u ever want to try again, im still here. pathetic i know.",
  "I HOPE SHES WORTH IT.",
  "u were my first everything. i dont know how to do this with anyone else.",
  "i wish i never met you. seriously.",
  "sometimes i wonder if u kept the sweater i gave u",
  "im sorry i was so toxic. i was just so scared of losing u.",
  "u owe me $400 u broke loser",
  "i still wear the necklace u gave me. i cant take it off.",
  "i finally got into nursing school!! i wish u were here to celebrate.",
  "you completely destroyed me and u dont even care.",
  "i saw ur story. u look happy. im glad.",
  "HOW COULD YOU DO THAT TO ME AFTER EVERYTHING I DID FOR YOU",
  "i still smell your cologne on my pillow sometimes.",
  "u were the best thing that ever happened to me and i ruined it.",
  "i hope every time u hear that song u think of me and it ruins your day",
  "i know u cheated. i knew the whole time.",
  "im pregnant and idk how to tell u",
  "i miss staying up til 4am playing mario kart with u",
  "u promised we would get married.",
  "i hope karma gets u back ten times worse",
  "im so tired of pretending im okay without u",
  "u were right. we are better as strangers.",
  "i drove past ur house yesterday just to see if ur car was there",
  "u made me feel so small.",
  "i cant wait to forget u completely.",
  "i still have the voicemails u left me saved on my phone",
  "why did u block me everywhere? at least give me closure.",
  "i hope she breaks ur heart exactly like u broke mine",
  "u said u would never leave.",
  "i miss your laugh more than anything",
  "i found out u lied about where u were that night.",
  "im moving to chicago next month. just thought u should know.",
  "u ruined my birthday and i will never forgive u",
  "i still love u. i think i always will.",
  "ur such a narcissist it actually terrifies me"
];

const COLORS = [
  'parchment', 'rose-dust', 'sage-whisper', 'twilight-blue', 'faded-ink',
  'golden-hour', 'sepia-tear', 'midnight-shade', 'blush-fade', 'moss-shadow',
  'lavender-haze', 'ash-grey', 'terracotta-sun', 'deep-plum', 'storm-cloud',
  'peach-echo', 'emerald-mist', 'ocean-depth', 'crimson-stain', 'sandstone'
];

// Helper to generate a consistent slug
function generateNameSlug(name) {
  let cleanedName = name
    .trim()
    .toLowerCase()
    .replace(/[\s_.-]+/g, '-') // Replace spaces and common separators with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove all non-alphanumeric characters except hyphens
    .replace(/-+/g, '-'); // Collapse multiple hyphens into one

  if (!cleanedName || cleanedName.length < 2) {
    return 'unknown';
  }

  return cleanedName;
}

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function run() {
  console.log(`Starting to generate 400 messages across ${ALL_NAMES.length} names...`);
  
  const submissions = [];

  for (const name of ALL_NAMES) {
    for (let i = 0; i < 4; i++) {
      submissions.push({
        name: name,
        message: getRandomItem(RAW_MESSAGES),
        color_id: getRandomItem(COLORS),
        slug: generateNameSlug(name),
        ip_hash: 'script-generated-' + Math.random().toString(36).substring(7), // fake IP hash
        country: ['US', 'CA', 'IN', 'AU'][Math.floor(Math.random() * 4)],
        user_uuid: crypto.randomUUID(),
        status: 'approved', // auto-approve so they show up immediately
        created_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(), // Random date in last 30 days
      });
    }
  }

  // Insert in batches of 100 to avoid Supabase limits
  for (let i = 0; i < submissions.length; i += 100) {
    const batch = submissions.slice(i, i + 100);
    const { error } = await supabase.from('submissions').insert(batch);
    if (error) {
      console.error('Error inserting batch:', error);
    } else {
      console.log(`Inserted batch ${i / 100 + 1} of 4`);
    }
  }

  console.log('Successfully generated 400 realistic raw messages!');
}

run();
