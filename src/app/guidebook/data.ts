export type GuideStep = {
  title: string
  detail: string
}

export type GuideRole = {
  role: string
  intro: string
  steps: GuideStep[]
}

export type Guide = {
  slug: string
  title: string
  summary: string
  category: 'Events' | 'Everyday' | 'Skills'
  level: string
  minutes: number
  emoji: string
  roles: GuideRole[]
  asks: string[]
  bring: string[]
}

export const GUIDES: Guide[] = [
  {
    slug: 'restaurant-dining-out',
    title: 'Dining Out Safely',
    summary: 'Use a few smart questions to make restaurant meals feel predictable and low-stress.',
    category: 'Events',
    level: 'Beginner',
    minutes: 8,
    emoji: '🍽️',
    roles: [
      {
        role: 'Attending',
        intro: 'If you are eating out, you want the restaurant to confirm what is actually safe before the first bite.',
        steps: [
          { title: 'Call ahead or check online', detail: 'Look for allergen notes, dedicated fryer language, and whether the kitchen uses shared prep surfaces.' },
          { title: 'Ask the right questions', detail: 'Ask whether the menu items are free from gluten, nut-free, or prepared in a dedicated space if the allergy is severe.' },
          { title: 'Keep the order simple', detail: 'Request a clean prep surface, no bread basket, no shared fryer, and verified ingredients for your final order.' },
        ],
      },
      {
        role: 'Organizing',
        intro: 'When you are hosting, your best move is to set a clear expectation and remove hidden risk before guests arrive.',
        steps: [
          { title: 'Choose a restaurant with a documented allergen policy', detail: 'Ask about separate prep tools, fried items, and ingredient labels for sauces and dressings.' },
          { title: 'Pressure-test the menu', detail: 'For every shared item, confirm the gluten-free or nut-free status before you commit to a group plan.' },
          { title: 'Share a short guest note', detail: 'Send one simple message with the safest menu options so everyone knows what to expect.' },
        ],
      },
    ],
    asks: [
      'Can the kitchen confirm whether this dish is made without gluten or nuts?',
      'Do you use a separate fryer or prep tool for allergen-safe items?',
      'Which sauces and dressings are hidden sources of gluten or sesame?',
    ],
    bring: ['A printed menu snapshot', 'Backup snacks you know are safe', 'A short note with your key restrictions'],
  },
  {
    slug: 'game-day-snacks',
    title: 'Game Day Snack Strategy',
    summary: 'Make sports events safer by moving the most risky foods out of the center of the table.',
    category: 'Events',
    level: 'Beginner',
    minutes: 6,
    emoji: '🏟️',
    roles: [
      {
        role: 'Attending',
        intro: 'At a game or tailgate, the safest plan is to bring one food that you know is safe and to ask for a clean serving scoop.',
        steps: [
          { title: 'Bring a backup snack', detail: 'Pack one familiar item that is certified or clearly labeled safe for your needs.' },
          { title: 'Ask for separate utensils', detail: 'If the venue is serving shared snacks, ask for clean serving spoons and avoid the communal bread basket.' },
          { title: 'Watch for cross-contact', detail: 'Cheese trays, pretzels, and shared dips are common hidden triggers at sports events.' },
        ],
      },
      {
        role: 'Organizing',
        intro: 'A good game-day host keeps the most common allergens on the edges and labels food clearly.',
        steps: [
          { title: 'Build a safe snack zone', detail: 'Keep one clearly labeled safe item at the front, with separate labels for the rest of the food.' },
          { title: 'Avoid shared serving tools', detail: 'Use dedicated spoons, dips, and tongs so there is no accidental cross-contact.' },
          { title: 'Post the simple list', detail: 'Tell guests which foods are gluten-free, nut-free, or made without common allergens.' },
        ],
      },
    ],
    asks: [
      'Can this same tray be served with separate utensils?',
      'Is the bread basket or shared fryer near the main allergen-free item?',
      'Can I label the safe snack clearly for guests who need it?',
    ],
    bring: ['A safe snack', 'Reusable serving utensils', 'A card with your allergen-safe plan'],
  },
  {
    slug: 'potluck-party',
    title: 'Potluck Party Playbook',
    summary: 'Help the group order the snacks so everyone can eat without guessing.',
    category: 'Events',
    level: 'Intermediate',
    minutes: 9,
    emoji: '🥗',
    roles: [
      {
        role: 'Attending',
        intro: 'A potluck works best when each person brings one clearly labeled dish, rather than relying on everyone to read everything later.',
        steps: [
          { title: 'Ask what everyone is bringing', detail: 'Make sure at least one main dish and one easy side are safe for you before you arrive.' },
          { title: 'Read labels on store-bought items', detail: 'Look for hidden gluten, sesame, or nut ingredients in sauces, spice mixes, and desserts.' },
          { title: 'Bring one sure thing', detail: 'A safe side or dessert removes the stress of finding food in the moment.' },
        ],
      },
      {
        role: 'Organizing',
        intro: 'The host should set the tone: label dishes by ingredients and make the safest foods easy to spot.',
        steps: [
          { title: 'Ask guests to note ingredients', detail: 'Use a simple shared note so everyone understands what is in each dish.' },
          { title: 'Give the safe options a clear spot', detail: 'Keep your allergy-safe dish away from shared serving spoons and breads.' },
          { title: 'Offer a safe dessert first', detail: 'This keeps the guest who is sensitive from feeling left out of the whole event.' },
        ],
      },
    ],
    asks: [
      'Is this dish gluten-free, nut-free, and sesame-free?',
      'Did you use any shared prep tools or sauce containers?',
      'Can you label the ingredients clearly on the chip or card?',
    ],
    bring: ['A clearly labeled dish', 'Ingredient card', 'A backup snack if the table gets crowded'],
  },
  {
    slug: 'holiday-party-checklist',
    title: 'Holiday Party Checklist',
    summary: 'Use a simple guest and host flow so major allergens do not become a surprise at holiday meals.',
    category: 'Events',
    level: 'Intermediate',
    minutes: 10,
    emoji: '🎉',
    roles: [
      {
        role: 'Attending',
        intro: 'Holiday meals often add bread, fudge, sauces, and dessert trays. Keep your plan narrow and specific.',
        steps: [
          { title: 'Scout the menu in advance', detail: 'Ask which foods are safe before the meal starts, especially breads, sauces, and dessert stations.' },
          { title: 'Use a safe-first strategy', detail: 'Eat the most predictable dish first, then decide about the more risky shared items.' },
          { title: 'Bring your own side', detail: 'A safe side or dessert helps avoid the “nothing safe is left” problem.' },
        ],
      },
      {
        role: 'Organizing',
        intro: 'Host the event with an allergen-friendly map so guests can navigate the table with confidence.',
        steps: [
          { title: 'Label the dishes', detail: 'Write ingredient notes on cards and separate the main dish from the bread and dessert table.' },
          { title: 'Offer a safe plate option', detail: 'Give guests at least one simple and clearly safe choice before they see the buffet.' },
          { title: 'Show the cross-contact risks', detail: 'Note which items are served with shared utensils or fries.' },
        ],
      },
    ],
    asks: [
      'Which dishes are completely free from my main allergens?',
      'Are the breads, sauces, and desserts made with the same utensils?',
      'Can we put a separate label on the option that is safest for me?',
    ],
    bring: ['A safe dessert', 'A quick list of your restrictions', 'A meal-prep backup if the buffet is heavy on risk'],
  },
  {
    slug: 'label-reading',
    title: 'How to Read Food Labels',
    summary: 'Learn how to spot hidden gluten, nuts, sesame, and soy in the ingredients list.',
    category: 'Everyday',
    level: 'Beginner',
    minutes: 7,
    emoji: '🧾',
    roles: [
      {
        role: 'Learn',
        intro: 'Labels are the easiest place to catch hidden ingredients before they become real risk in your kitchen.',
        steps: [
          { title: 'Start with the ingredient list', detail: 'Look for wheat, barley, rye, oat flour, and common nut or sesame ingredients.' },
          { title: 'Check the advisory language', detail: 'Some packages say “may contain” or “processed on shared equipment,” which matters for severe allergies.' },
          { title: 'Look for the exact allergen statement', detail: 'The ingredient list and allergen statement should match your safety needs.' },
        ],
      },
    ],
    asks: [
      'Does this ingredient list include wheat, barley, rye, or nut-derived ingredients?',
      'Is this product made in a shared facility or on shared equipment?',
      'Does the package say “may contain” for any ingredient I need to avoid?',
    ],
    bring: ['A phone camera', 'A list of your top food fears', 'A few packaged products you already rely on'],
  },
  {
    slug: 'gluten-free-home-cooking',
    title: 'Cooking Gluten-Free at Home',
    summary: 'Easy kitchen habits that keep home cooking consistently safe and flavorful.',
    category: 'Everyday',
    level: 'Intermediate',
    minutes: 8,
    emoji: '🏡',
    roles: [
      {
        role: 'Learn',
        intro: 'Home cooking is easiest when you separate the risk, keep labels visible, and use one clean prep area for safe foods.',
        steps: [
          { title: 'Set one prep zone', detail: 'Choose a clean cutting board, knife, and storage area for your safest ingredients.' },
          { title: 'Use dedicated spice jars', detail: 'Cross-contact from shared seasoning jars often gets overlooked in the kitchen.' },
          { title: 'Choose a safe replacement', detail: 'Rice flour, certified corn tortillas, and dedicated GF oats can make the week much easier.' },
        ],
      },
    ],
    asks: [
      'Which ingredients in this recipe are especially likely to hide gluten?',
      'Do I need a fresh pan or a separate spoon for the safe version?',
      'What is the safest substitution if I am playing with texture or breading?',
    ],
    bring: ['A clean prep tray', 'A few safe vegetable sides', 'One trusted gluten-free staple'],
  },
  {
    slug: 'certified-safe-brands',
    title: 'Certified Safe Brands',
    summary: 'A short starter list of brands with a documented allergen-safe product track record.',
    category: 'Skills',
    level: 'Advanced',
    minutes: 5,
    emoji: '🏷️',
    roles: [
      {
        role: 'Research',
        intro: 'Certified brands are not magic, but they give you a better starting point when your needs are strict.',
        steps: [
          { title: 'Look for certification', detail: 'A label like dedicated facility or certified free-from helps narrow your shortlist quickly.' },
          { title: 'Compare ingredient statements', detail: 'Even certified brands can vary from product to product, so read each package.' },
          { title: 'Keep a reusable shortlist', detail: 'Save a short list of trusted brands and repeat the same safe options whenever possible.' },
        ],
      },
    ],
    asks: [
      'Does this brand certify its allergens, or only the product?',
      'What does the facility statement actually guarantee?',
      'Is the product consistent across the whole label line?',
    ],
    bring: ['A saved brand list', 'A note on certification meaning', 'A few grocery items you can compare side-by-side'],
  },
  {
    slug: 'naturally-gluten-free-foods',
    title: 'Naturally Gluten-Free Foods',
    summary: 'Build your safe food list from ingredients that are naturally free from the most common problem triggers.',
    category: 'Skills',
    level: 'Beginner',
    minutes: 5,
    emoji: '🌿',
    roles: [
      {
        role: 'Build',
        intro: 'A strong safe-food list makes your grocery routine much simpler and less stressful.',
        steps: [
          { title: 'Start with whole foods', detail: 'Rice, potatoes, fruits, vegetables, and plain meat are often reliable staples.' },
          { title: 'Match the ingredient to the label', detail: 'Even naturally safe foods can be contaminated by sauces or seasoning mixes.' },
          { title: 'Keep one fallback list', detail: 'Save three to five easy foods you know you can eat anywhere without a second thought.' },
        ],
      },
    ],
    asks: [
      'Is this ingredient safe as-is, or only after a sauce or seasoning is added?',
      'Does the brand use shared production lines?',
      'Which foods can I repeat every week without a pantry panic?',
    ],
    bring: ['A grocery list', 'A note on your top replacement ingredients', 'A few safe staples to preload in your kitchen'],
  },
]
