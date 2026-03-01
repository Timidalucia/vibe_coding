export interface ArtFlower {
  id: string;
  name: string;
  artwork: string;
  artist: string;
  year: string;
  moods: string[];
  description: string;
  healingMessage: string;
  color: string;
  sourceUrl?: string;
}

export const artFlowers: ArtFlower[] = [
  {
    id: "sunflower",
    name: "Sunflower",
    artwork: "Sunflowers",
    artist: "Vincent van Gogh",
    year: "1888",
    moods: ["sad", "lonely", "down", "depressed", "tired", "exhausted", "hopeless"],
    description: "Van Gogh painted his iconic Sunflowers as a symbol of gratitude and warmth. Each petal holds the radiance of a sun that refuses to set.",
    healingMessage: "We chose this sunflower for you because even in your darkest moments, there is a light turning toward you. Van Gogh painted these during his own struggles, yet poured golden joy onto canvas. Let this sunflower remind you that beauty persists — and so will you.",
    color: "45 90% 55%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vincent_Willem_van_Gogh_127.jpg",
  },
  {
    id: "water-lily",
    name: "Water Lily",
    artwork: "Water Lilies",
    artist: "Claude Monet",
    year: "1906",
    moods: ["anxious", "stressed", "overwhelmed", "nervous", "worried", "restless", "panic"],
    description: "Monet's Water Lilies float in a world of stillness, painted from his garden in Giverny — a sanctuary he built to quiet the noise of the world.",
    healingMessage: "This water lily drifts to you as a reminder to breathe. Monet spent decades painting these serene ponds, finding peace in repetition and reflection. Let this flower be your still water — a place where your racing thoughts can finally rest.",
    color: "220 40% 65%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_1906,_Ryerson.jpg",
  },
  {
    id: "iris",
    name: "Iris",
    artwork: "Irises",
    artist: "Vincent van Gogh",
    year: "1889",
    moods: ["confused", "lost", "uncertain", "stuck", "indecisive", "searching"],
    description: "Painted during Van Gogh's time at the Saint-Rémy asylum, the Irises stand bold and alive — proof that clarity can bloom in chaos.",
    healingMessage: "When the path feels unclear, we send you Van Gogh's iris. He painted these while finding his way through darkness, and yet each bloom pulses with purpose. You don't need to see the whole garden — just the next petal unfolding.",
    color: "270 45% 50%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Irises-Vincent_van_Gogh.jpg",
  },
  {
    id: "red-poppy",
    name: "Red Poppy",
    artwork: "Oriental Poppies",
    artist: "Georgia O'Keeffe",
    year: "1927",
    moods: ["angry", "frustrated", "bitter", "irritated", "furious", "annoyed", "resentful"],
    description: "O'Keeffe magnified her poppies to fill the entire canvas, demanding that the world slow down and truly see their fierce, tender beauty.",
    healingMessage: "Your fire deserves to be seen. O'Keeffe painted this poppy enormous because she believed small things deserve monumental attention. Channel your intensity — it is not a flaw, it is your power. This flower burns as brightly as you do.",
    color: "5 75% 50%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Georgia_O%27Keeffe._Oriental_Poppies._1927.jpg",
  },
  {
    id: "almond-blossom",
    name: "Almond Blossom",
    artwork: "Almond Blossom",
    artist: "Vincent van Gogh",
    year: "1890",
    moods: ["hopeful", "grateful", "renewed", "fresh", "beginning", "optimistic", "excited"],
    description: "Van Gogh painted the almond blossoms for his newborn nephew — a celebration of new life against a sky of infinite possibility.",
    healingMessage: "How beautiful that you carry hope today. This almond blossom was Van Gogh's gift of joy, painted to welcome new beginnings. Like these branches against the February sky, your optimism is brave and precious. Nurture it.",
    color: "195 50% 70%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg",
  },
  {
    id: "rose",
    name: "Rose",
    artwork: "Roses",
    artist: "Pierre-Auguste Renoir",
    year: "1890",
    moods: ["loved", "happy", "content", "warm", "peaceful", "joyful"],
    description: "Renoir's roses glow with the soft warmth of an afternoon spent in good company — petals so tender they seem to breathe.",
    healingMessage: "You are in a gentle place, and you deserve this gentle flower. Renoir painted roses with arthritic hands, finding beauty despite pain. Your happiness matters. Hold it close like these layered petals — each one a reason to smile.",
    color: "340 55% 65%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pierre-Auguste_Renoir_-_Roses_dans_un_vase.jpg",
  },
  {
    id: "chrysanthemum",
    name: "Chrysanthemum",
    artwork: "Chrysanthemums",
    artist: "Qi Baishi",
    year: "1940",
    moods: ["nostalgic", "melancholy", "reflective", "wistful", "missing", "longing", "reminiscing"],
    description: "In East Asian tradition, the chrysanthemum symbolizes resilience and reflection. Qi Baishi painted them with ink that whispers of autumn and memory.",
    healingMessage: "Your memories are a garden, not a cage. This chrysanthemum honors your capacity to feel deeply. Qi Baishi painted with the wisdom of decades — each brushstroke a conversation with time. Let nostalgia be tender, not heavy.",
    color: "45 60% 60%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Qi_Baishi_chrysanthemum.jpg",
  },
  {
    id: "peony",
    name: "Peony",
    artwork: "Peonies in a Vase",
    artist: "Henri Fantin-Latour",
    year: "1864",
    moods: ["numb", "empty", "disconnected", "flat", "apathetic", "bored", "indifferent"],
    description: "Fantin-Latour's peonies emerge from shadow with quiet luminosity — their lush, layered petals unfolding like slow revelations against the dark.",
    healingMessage: "Numbness is not the absence of feeling — it is feeling's cocoon. Fantin-Latour painted these peonies with extraordinary patience, coaxing soft light from darkness. Something beautiful is forming beneath your surface. Give it time.",
    color: "340 40% 72%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:%27Peonies_in_a_Vase%27_by_Henri_Fantin-Latour,_c._1864,_Hermitage.JPG",
  },
  {
    id: "anemone",
    name: "Anemone",
    artwork: "Bouquet d'Anémones",
    artist: "Pierre Boncompain",
    year: "1990",
    moods: ["brave", "bold", "passionate", "alive", "intense", "determined", "fierce"],
    description: "Boncompain's anemones burst with Mediterranean warmth — bold reds, blues, and purples arranged with the joyful spontaneity of a Provençal afternoon.",
    healingMessage: "This vivid anemone is for the fire in you. Boncompain paints with unapologetic joy, layering bold color upon bold color because life is too short for muted tones. Whatever you're feeling fiercely right now — that intensity is your gift. Let it bloom.",
    color: "0 70% 50%",
  },
  // === NEW FLOWERS ===
  {
    id: "oleander",
    name: "Oleander",
    artwork: "Oleanders",
    artist: "Vincent van Gogh",
    year: "1888",
    moods: ["heartbroken", "rejected", "abandoned", "unloved", "betrayed", "wounded"],
    description: "Van Gogh painted Oleanders during his happiest period in Arles, their pink blooms radiating defiant beauty — a poisonous flower rendered with pure love.",
    healingMessage: "The oleander is beautiful and fierce, just like your wounded heart. Van Gogh painted these during a time of renewal. Even when love cuts deep, your capacity to feel is proof of your courage. This flower survives every season.",
    color: "330 50% 65%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Oleander.jpg",
  },
  {
    id: "dahlia",
    name: "Dahlia",
    artwork: "Dahlias in a Delft Vase",
    artist: "Paul Cézanne",
    year: "1873",
    moods: ["proud", "accomplished", "successful", "triumphant", "confident", "strong"],
    description: "Cézanne's dahlias stand upright and unapologetic in their Delft vase, each bloom a small explosion of structured color against shadow.",
    healingMessage: "This dahlia celebrates your strength. Cézanne built his paintings like architecture — deliberate, measured, powerful. Your accomplishment is not luck; it is the sum of every effort you've ever made. Stand tall like these blooms.",
    color: "350 60% 55%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Paul_Cezanne_-_Dahlias_dans_un_grand_vase_de_Delft.jpg",
  },
  {
    id: "carnation",
    name: "Carnation",
    artwork: "Vase with Carnations",
    artist: "Vincent van Gogh",
    year: "1886",
    moods: ["grateful", "thankful", "appreciative", "blessed", "moved", "touched"],
    description: "Van Gogh's carnations in Paris reveal his transition from dark Dutch tones to the luminous palette that would define his legacy.",
    healingMessage: "Gratitude is a flower that blooms from within. Van Gogh painted these carnations as he discovered light and color in Paris. Your thankfulness illuminates everything around you — hold on to that warmth.",
    color: "350 45% 60%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Vase_mit_Nelken_und_anderen_Blumen.jpeg",
  },
  {
    id: "wisteria",
    name: "Wisteria",
    artwork: "Wisteria",
    artist: "Claude Monet",
    year: "1920",
    moods: ["dreamy", "romantic", "loving", "tender", "affectionate", "sentimental"],
    description: "Monet's Wisteria cascades like lavender rain, painted in his final years when his vision blurred but his feeling only deepened.",
    healingMessage: "Love flows through you like wisteria draping over an old stone wall. Monet painted these at 80, nearly blind, yet his brush still trembled with tenderness. Your romantic heart is not weakness — it is your most beautiful offering to the world.",
    color: "270 35% 65%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Wisteria_-_Google_Art_Project.jpg",
  },
  {
    id: "lilac",
    name: "Lilac",
    artwork: "Lilacs in a Vase",
    artist: "Édouard Manet",
    year: "1882",
    moods: ["gentle", "tender", "soft", "delicate", "vulnerable", "sensitive"],
    description: "Manet painted lilacs during his final illness — fragile white blooms that carry the weight of farewell and the lightness of spring.",
    healingMessage: "Your sensitivity is not a burden; it is a gift of perception. Manet painted these lilacs knowing his time was short, yet each petal glows with quiet delight. To be tender in a hard world takes immense courage.",
    color: "280 30% 75%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Manet,_Edouard_-_Lilacs_In_A_Vase,_c.1882.jpg",
  },
  {
    id: "magnolia",
    name: "Magnolia",
    artwork: "Giant Magnolias on a Blue Velvet Cloth",
    artist: "Martin Johnson Heade",
    year: "1890",
    moods: ["patient", "waiting", "enduring", "persistent", "steady", "resilient"],
    description: "Heade placed his magnolias on blue velvet like sacred objects — each blossom monumental, luminous, and impossibly still.",
    healingMessage: "Patience is its own kind of strength. Heade spent years perfecting these magnolias, returning to the same subject with reverence. Like these blooms resting on velvet, your quiet endurance holds a beauty that rushing never could.",
    color: "200 30% 55%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Martin_Johnson_Heade_Giant_Magnolias_on_a_Blue_Velvet_Cloth_NGA.jpg",
  },
  {
    id: "violet",
    name: "Violet",
    artwork: "Bouquet of Violets",
    artist: "Édouard Manet",
    year: "1872",
    moods: ["shy", "quiet", "introverted", "reserved", "withdrawn", "private"],
    description: "Manet's violets are small, intimate, almost whispered — a secret bouquet for someone who understands that beauty needs no announcement.",
    healingMessage: "Not every flower needs to shout. These violets remind us that quiet presence is its own kind of power. Manet painted them as a private gift. You don't need to be the loudest bloom in the garden to matter deeply.",
    color: "270 50% 40%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Edouard_Manet_-_Bouquet_Of_Violets_(14045636396).jpg",
  },
  {
    id: "tulip",
    name: "Tulip",
    artwork: "Tulip Fields in Holland",
    artist: "Claude Monet",
    year: "1886",
    moods: ["playful", "silly", "lighthearted", "carefree", "cheerful", "amused"],
    description: "Monet captured the dazzling tulip fields of Holland — endless ribbons of color stretching to the horizon under a pale spring sky.",
    healingMessage: "Joy looks good on you. Monet traveled to Holland just to witness these tulip fields — pure color, pure play. Your lighthearted spirit is not trivial; it's the kind of energy that makes the world bearable. Keep being colorful.",
    color: "0 65% 55%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Tulip_fields_in_Holland_(Mus%C3%A9e_d%27Orsay).jpg",
  },
  {
    id: "daisy",
    name: "Daisy",
    artwork: "Vase with Daisies and Anemones",
    artist: "Vincent van Gogh",
    year: "1887",
    moods: ["curious", "wondering", "amazed", "fascinated", "interested", "exploring"],
    description: "Van Gogh's daisies and anemones shimmer in a blue vase — an experiment in complementary colors that vibrates with discovery.",
    healingMessage: "Your curiosity is a compass. Van Gogh painted these flowers as he experimented with color theory in Paris, each brushstroke a question. Stay curious — the world reveals itself to those who keep looking.",
    color: "50 70% 70%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Vase_mit_Margeriten_und_Anemonen.jpeg",
  },
  {
    id: "redon-bouquet",
    name: "Wildflower",
    artwork: "Vase of Flowers",
    artist: "Odilon Redon",
    year: "1906",
    moods: ["creative", "inspired", "imaginative", "flowing", "artistic", "visionary"],
    description: "Redon's otherworldly bouquet dissolves the boundary between real and imagined — flowers that exist only in the dreamspace between sleep and waking.",
    healingMessage: "Your imagination is a garden no one else can tend. Redon painted flowers that don't exist in nature but feel more alive than reality. Your creative spirit sees colors others miss. Trust the vision only you can see.",
    color: "320 40% 60%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Odilon_Redon_-_Vase_of_Flowers_-_Google_Art_Project.jpg",
  },
  {
    id: "ruysch-bouquet",
    name: "Dutch Bloom",
    artwork: "Flowers in a Vase",
    artist: "Rachel Ruysch",
    year: "1700",
    moods: ["scared", "afraid", "fearful", "terrified", "frightened", "uneasy"],
    description: "Ruysch's meticulously painted bouquets contain hidden insects and wilting petals — reminders that beauty and fragility are inseparable.",
    healingMessage: "Fear is natural — even the most exquisite gardens have shadows. Rachel Ruysch was one of the greatest painters of the Dutch Golden Age, and she understood that life's fragility makes it precious. Your fear means you care deeply about something worth protecting.",
    color: "30 35% 45%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rachel_Ruysch_-_Flowers_in_a_vase_-_NG_6425.jpg",
  },
  {
    id: "bosschaert-tulip",
    name: "Spring Bouquet",
    artwork: "Flower Still Life",
    artist: "Ambrosius Bosschaert",
    year: "1614",
    moods: ["jealous", "envious", "competitive", "insecure", "comparing", "inadequate"],
    description: "Bosschaert painted impossible bouquets — flowers from different seasons gathered into one perfect arrangement that could never exist in nature.",
    healingMessage: "Comparison is a thief of joy, and Bosschaert knew it. His bouquets were fantasies — no garden blooms all these flowers at once. You are not behind; you are simply in a different season. Every flower blooms in its own time.",
    color: "45 50% 55%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ambrosius_Bosschaert_the_Elder_(Dutch_-_Flower_Still_Life_-_Google_Art_Project.jpg",
  },
  {
    id: "carnation-lily-rose",
    name: "Garden Lily",
    artwork: "Carnation, Lily, Lily, Rose",
    artist: "John Singer Sargent",
    year: "1886",
    moods: ["magical", "enchanted", "wonder", "mystical", "spellbound", "awe"],
    description: "Sargent painted this twilight garden scene during just minutes of perfect light each evening — two children among glowing lilies and paper lanterns.",
    healingMessage: "There is magic in the in-between moments. Sargent chased the perfect twilight for months, painting only minutes a day. Your sense of wonder is precious — it means you're still paying attention to the world's quiet miracles.",
    color: "120 25% 55%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:John_Singer_Sargent_-_Carnation,_Lily,_Lily,_Rose_-_Google_Art_Project.jpg",
  },
];


export function findFlowerForMood(input: string): ArtFlower {
  return findFlowersForMood(input, 1)[0];
}

export function findFlowersForMood(input: string, count: number = 3): ArtFlower[] {
  const lower = input.toLowerCase();

  const scored = artFlowers.map((flower) => {
    let score = 0;
    for (const mood of flower.moods) {
      if (lower.includes(mood)) {
        score += mood.length;
      }
    }
    return { flower, score };
  });

  scored.sort((a, b) => b.score - a.score);

  if (scored[0].score === 0) {
    const negativeWords = ["bad", "terrible", "awful", "horrible", "rough", "hard", "difficult", "hurt", "pain", "cry", "crying", "hate", "broken", "heavy", "dark"];
    const positiveWords = ["good", "great", "amazing", "wonderful", "fine", "okay", "well", "better", "nice", "love", "beautiful", "light", "bright"];

    let sentiment = 0;
    for (const w of negativeWords) if (lower.includes(w)) sentiment--;
    for (const w of positiveWords) if (lower.includes(w)) sentiment++;

    let primary: ArtFlower;
    if (sentiment < -1) primary = artFlowers[0];
    else if (sentiment < 0) primary = artFlowers[1];
    else if (sentiment > 1) primary = artFlowers[5];
    else if (sentiment > 0) primary = artFlowers[4];
    else primary = artFlowers[7];

    const others = artFlowers.filter((f) => f.id !== primary.id);
    const shuffled = others.sort(() => Math.random() - 0.5);
    return [primary, ...shuffled.slice(0, count - 1)];
  }

  return scored.slice(0, count).map((s) => s.flower);
}
