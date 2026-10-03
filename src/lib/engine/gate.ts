// Contextual gate (spec section 15, layer 2): a short timed quiz per interest.
// Answering correctly within the time limit grants a permanent verified tag.

export const GATE_SECONDS = 15;
export const PASS_RATIO = 0.67;

interface GateQuestion {
  id: string;
  interest: string;
  text: string;
  options: string[];
  answer: string;
}

const BANK: GateQuestion[] = [
  { id: "tech1", interest: "Technology", text: "What does 'iOS' run on?", options: ["Android phones", "iPhones", "Smart TVs only", "Windows laptops"], answer: "iPhones" },
  { id: "tech2", interest: "Technology", text: "Which of these is a cloud storage service?", options: ["Google Drive", "Spotify", "Jumia", "Bolt"], answer: "Google Drive" },
  { id: "tech3", interest: "Technology", text: "What does 5G refer to?", options: ["A phone brand", "A mobile network generation", "A video format", "A battery type"], answer: "A mobile network generation" },
  { id: "fit1", interest: "Health & Fitness", text: "Which exercise mainly works the legs?", options: ["Squats", "Bicep curls", "Push-ups", "Shoulder press"], answer: "Squats" },
  { id: "fit2", interest: "Health & Fitness", text: "What does 'cardio' mainly train?", options: ["Heart and lungs", "Eyesight", "Grip strength", "Flexibility only"], answer: "Heart and lungs" },
  { id: "fit3", interest: "Health & Fitness", text: "Protein mainly helps the body to…", options: ["Build and repair muscle", "Store water", "Grow hair faster", "Improve eyesight"], answer: "Build and repair muscle" },
  { id: "fash1", interest: "Fashion & Beauty", text: "Which fabric is Nigerian 'Aso Oke' traditionally?", options: ["Hand-woven cloth", "Denim", "Leather", "Polyester knit"], answer: "Hand-woven cloth" },
  { id: "fash2", interest: "Fashion & Beauty", text: "What is a 'primer' used for in makeup?", options: ["Preparing skin before foundation", "Removing makeup", "Colouring lips", "Curling lashes"], answer: "Preparing skin before foundation" },
  { id: "fash3", interest: "Fashion & Beauty", text: "'Thrifting' means buying…", options: ["Second-hand clothes", "Designer clothes only", "Custom tailoring", "School uniforms"], answer: "Second-hand clothes" },
  { id: "food1", interest: "Food & Drink", text: "Which is the main ingredient in jollof rice's red colour?", options: ["Tomatoes and peppers", "Beetroot", "Palm wine", "Carrots"], answer: "Tomatoes and peppers" },
  { id: "food2", interest: "Food & Drink", text: "Which of these is a food delivery app in Nigeria?", options: ["Chowdeck", "Paystack", "Piggyvest", "Cowrywise"], answer: "Chowdeck" },
  { id: "food3", interest: "Food & Drink", text: "'Al dente' describes pasta that is…", options: ["Firm to the bite", "Very soft", "Burnt", "Raw"], answer: "Firm to the bite" },
  { id: "trav1", interest: "Travel", text: "What document do you need to travel abroad?", options: ["Passport", "NIN slip only", "Utility bill", "Voter's card"], answer: "Passport" },
  { id: "trav2", interest: "Travel", text: "Lagos' main international airport is…", options: ["Murtala Muhammed", "Nnamdi Azikiwe", "Mallam Aminu Kano", "Port Harcourt International"], answer: "Murtala Muhammed" },
  { id: "trav3", interest: "Travel", text: "A 'layover' is…", options: ["A stop between connecting flights", "A cancelled flight", "Hotel breakfast", "Extra baggage fee"], answer: "A stop between connecting flights" },
  { id: "ent1", interest: "Entertainment", text: "Nigeria's film industry is commonly called…", options: ["Nollywood", "Bollywood", "Hollywood", "Kollywood"], answer: "Nollywood" },
  { id: "ent2", interest: "Entertainment", text: "Which is a music streaming app?", options: ["Audiomack", "Opay", "Konga", "Glo"], answer: "Audiomack" },
  { id: "ent3", interest: "Entertainment", text: "Burna Boy is best known as a…", options: ["Musician", "Footballer", "Comedian", "Chef"], answer: "Musician" },
  { id: "fin1", interest: "Finance", text: "What does 'interest' on savings mean?", options: ["Money the bank pays you", "A bank charge", "A loan", "A tax"], answer: "Money the bank pays you" },
  { id: "fin2", interest: "Finance", text: "Which is a savings/investment app?", options: ["Piggyvest", "Bolt", "Jumia", "Chowdeck"], answer: "Piggyvest" },
  { id: "fin3", interest: "Finance", text: "Inflation means prices are generally…", options: ["Rising", "Falling", "Fixed", "Free"], answer: "Rising" },
  { id: "edu1", interest: "Education", text: "WAEC organises which exam?", options: ["WASSCE", "UTME", "GRE", "IELTS"], answer: "WASSCE" },
  { id: "edu2", interest: "Education", text: "JAMB's exam is used for…", options: ["University admission", "Driving licence", "Visa interviews", "Job promotion"], answer: "University admission" },
  { id: "edu3", interest: "Education", text: "A 'CGPA' measures…", options: ["Academic performance", "Attendance only", "School fees", "Hostel rank"], answer: "Academic performance" },
  { id: "spo1", interest: "Sport", text: "How many players does a football team have on the pitch?", options: ["11", "9", "7", "13"], answer: "11" },
  { id: "spo2", interest: "Sport", text: "Nigeria's national football team is called the…", options: ["Super Eagles", "Black Stars", "Bafana Bafana", "Indomitable Lions"], answer: "Super Eagles" },
  { id: "spo3", interest: "Sport", text: "In basketball, a shot from beyond the arc is worth…", options: ["3 points", "1 point", "2 points", "4 points"], answer: "3 points" },
  { id: "home1", interest: "Home & Living", text: "An inverter at home is used for…", options: ["Backup power", "Cooking", "Water filtering", "Air freshening"], answer: "Backup power" },
  { id: "home2", interest: "Home & Living", text: "'Caution fee' when renting is…", options: ["A refundable deposit", "Monthly rent", "Agent's commission", "A tax"], answer: "A refundable deposit" },
  { id: "home3", interest: "Home & Living", text: "Which room is a 'BQ' in Nigerian housing?", options: ["Boys' quarters", "Big queen bedroom", "Back quarters kitchen", "Balcony"], answer: "Boys' quarters" },
  { id: "auto1", interest: "Automotive", text: "What does a car's 'alternator' do?", options: ["Charges the battery", "Cools the engine", "Steers the wheels", "Brakes the car"], answer: "Charges the battery" },
  { id: "auto2", interest: "Automotive", text: "'Tokunbo' cars are…", options: ["Foreign used", "Brand new", "Electric", "Rental only"], answer: "Foreign used" },
  { id: "auto3", interest: "Automotive", text: "Engine oil should be changed to…", options: ["Keep the engine lubricated", "Improve the radio", "Clean the windows", "Inflate tyres"], answer: "Keep the engine lubricated" },
  { id: "par1", interest: "Parenting", text: "Babies usually start crawling around…", options: ["6-10 months", "1 month", "3 years", "2 weeks"], answer: "6-10 months" },
  { id: "par2", interest: "Parenting", text: "Which vaccine schedule do Nigerian clinics follow?", options: ["The national immunisation schedule", "None", "School calendar", "Football season"], answer: "The national immunisation schedule" },
  { id: "par3", interest: "Parenting", text: "Creche is care for…", options: ["Young children", "Elderly people", "Pets", "Cars"], answer: "Young children" },
];

export type PublicGateQuestion = Omit<GateQuestion, "answer">;

/** Two questions per chosen interest, without the answers. */
export function gateFor(interests: string[], seed = Date.now()): PublicGateQuestion[] {
  return interests.flatMap((interest) => {
    const pool = BANK.filter((q) => q.interest === interest);
    const start = Math.abs(seed) % Math.max(1, pool.length);
    return [pool[start], pool[(start + 1) % pool.length]].filter(Boolean).map(({ answer, ...q }) => {
      void answer;
      return q;
    });
  });
}

/** Interests verified: enough correct answers, each within the time limit. */
export function gradeGate(answers: { id: string; value: string; ms: number }[]): string[] {
  const byInterest = new Map<string, { right: number; total: number }>();
  for (const a of answers) {
    const q = BANK.find((x) => x.id === a.id);
    if (!q) continue;
    const s = byInterest.get(q.interest) ?? { right: 0, total: 0 };
    s.total += 1;
    if (a.value === q.answer && a.ms <= GATE_SECONDS * 1000) s.right += 1;
    byInterest.set(q.interest, s);
  }
  return [...byInterest].filter(([, s]) => s.total > 0 && s.right / s.total >= PASS_RATIO).map(([i]) => i);
}
