export interface ArtFlower {
  id: string;
  name: string;
  artwork: string;
  artist: string;
  year: string;
  moods: string[];
  description: string;
  healingMessage: string;
  color: string; // HSL accent for the card
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
    moods: ["loved", "happy", "content", "warm", "peaceful", "grateful", "joyful"],
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
    artwork: "Bouquet of Peonies",
    artist: "Édouard Manet",
    year: "1882",
    moods: ["numb", "empty", "disconnected", "flat", "apathetic", "bored", "indifferent"],
    description: "Manet painted this luminous bouquet in his final year, channeling fading strength into blossoms that burst with defiant vitality — oil on canvas rendered with the urgency of someone who knows beauty is fleeting.",
    healingMessage: "Numbness is not the absence of feeling — it is feeling's cocoon. Manet painted these peonies while gravely ill, yet every petal glows with tenderness. Something beautiful is forming beneath your surface. Give it time.",
    color: "340 40% 72%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:%C3%89douard_Manet_Bouquet_of_Peonies.JPG",
  },
  {
    id: "anemone",
    name: "Anemone",
    artwork: "Bouquet d'Anémones",
    artist: "Pierre Boncompain",
    year: "1980",
    moods: ["brave", "bold", "passionate", "alive", "intense", "determined", "fierce"],
    description: "Boncompain's anemones burst with Mediterranean warmth — bold reds, blues, and purples arranged with the joyful spontaneity of a Provençal afternoon. His Fauvist-inspired palette celebrates color as pure emotion.",
    healingMessage: "This vivid anemone is for the fire in you. Boncompain paints with unapologetic joy, layering bold color upon bold color because life is too short for muted tones. Whatever you're feeling fiercely right now — that intensity is your gift. Let it bloom.",
    color: "0 70% 50%",
  },
  {
    id: "lilac",
    name: "Lilac",
    artwork: "Le Vase Bleu aux Lilas",
    artist: "Pierre Boncompain",
    year: "1991",
    moods: ["tender", "gentle", "soft", "caring", "affectionate", "sentimental", "delicate"],
    description: "Boncompain's lilacs spill from a blue vase in warm pinks against a teal backdrop — a Provençal still life that radiates quiet affection and domestic beauty.",
    healingMessage: "This bouquet of lilacs is for your gentle heart. Boncompain paints with the warmth of a Mediterranean afternoon, layering soft color upon soft color. Your tenderness is not weakness — it is the most courageous thing you carry.",
    color: "330 45% 65%",
    sourceUrl: "https://place-des-arts.com/en/artist/Pierre-BONCOMPAIN/oLj6cbTLQzxKcX3RQ/Le-vase-bleu-aux-lilas/nWkCBnhqujQ6p4u9Z",
  },
  {
    id: "tulip",
    name: "Tulip",
    artwork: "Tulipes du Jardin",
    artist: "Pierre Boncompain",
    year: "1991",
    moods: ["cheerful", "playful", "silly", "lighthearted", "carefree", "spontaneous", "giddy"],
    description: "Golden tulips burst skyward from a white vase against vivid cerulean blue — Boncompain's joyful lithograph captures the unbridled optimism of a garden in spring.",
    healingMessage: "These tulips reach toward the light, and so do you. Boncompain painted them with the spontaneity of someone who trusts that joy doesn't need permission. Let yourself be light today — you've earned it.",
    color: "50 85% 55%",
    sourceUrl: "https://place-des-arts.com/en/artist/Pierre-BONCOMPAIN/oLj6cbTLQzxKcX3RQ/Tulipes-du-jardin/WRxd5BAbPgT9a6Hah",
  },
  {
    id: "wildflower",
    name: "Wildflower",
    artwork: "Bouquet des Champs",
    artist: "Pierre Boncompain",
    year: "1998",
    moods: ["free", "adventurous", "wild", "independent", "rebellious", "untamed", "restless"],
    description: "A riotous field bouquet arranged on a blue tablecloth — Boncompain's wildflowers refuse to be tamed, each bloom leaning in its own direction with Fauvist abandon.",
    healingMessage: "These wildflowers were never meant for a manicured garden, and neither were you. Boncompain gathered them from the fields of Provence — imperfect, ungoverned, magnificent. Your restlessness is not chaos — it is freedom finding its shape.",
    color: "210 50% 55%",
    sourceUrl: "https://place-des-arts.com/en/artist/Pierre-BONCOMPAIN/oLj6cbTLQzxKcX3RQ/Bouquet-des-champs/9GskNwYAQTmWA36v4",
  },
  {
    id: "daisy",
    name: "Daisy",
    artwork: "Vase with Daisies and Anemones",
    artist: "Vincent van Gogh",
    year: "1887",
    moods: ["innocent", "simple", "pure", "childlike", "wonder", "curious", "open"],
    description: "Van Gogh's Parisian still life bursts with daisies and anemones in a humble stoneware vase — a celebration of simple beauty painted during his transformative years in Paris.",
    healingMessage: "Sometimes the simplest flower holds the deepest truth. Van Gogh painted these daisies when he was discovering a new way of seeing — each petal a small revelation. Your openness to the world is a gift. Keep looking with those curious eyes.",
    color: "55 70% 65%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vase_with_daisies_and_anemones_-_Vincent_Van_Gogh.jpg",
  },
  {
    id: "carnation",
    name: "Carnation",
    artwork: "Vase with Carnations",
    artist: "Vincent van Gogh",
    year: "1886",
    moods: ["proud", "dignified", "accomplished", "strong", "resilient", "steady", "grounded"],
    description: "Painted shortly after arriving in Paris, Van Gogh's carnations stand upright in a simple vase — their layered petals a study in quiet dignity and endurance.",
    healingMessage: "The carnation is the flower of resilience — it lasts longer than almost any cut flower, holding its beauty with quiet pride. Van Gogh painted these during a time of reinvention. Like these steadfast blooms, your strength is not loud — it is lasting.",
    color: "350 50% 60%",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vase-with-Carnations_F243.jpg",
  },
];


export function findFlowerForMood(input: string): ArtFlower {
  const lower = input.toLowerCase();
  
  // Score each flower based on mood keyword matches
  let bestMatch: ArtFlower | null = null;
  let bestScore = 0;

  for (const flower of artFlowers) {
    let score = 0;
    for (const mood of flower.moods) {
      if (lower.includes(mood)) {
        score += mood.length; // Longer matches = more specific
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = flower;
    }
  }

  // If no mood match, use word-level sentiment heuristics
  if (!bestMatch) {
    const negativeWords = ["bad", "terrible", "awful", "horrible", "rough", "hard", "difficult", "hurt", "pain", "cry", "crying", "hate", "broken", "heavy", "dark"];
    const positiveWords = ["good", "great", "amazing", "wonderful", "fine", "okay", "well", "better", "nice", "love", "beautiful", "light", "bright"];
    
    let sentiment = 0;
    for (const w of negativeWords) if (lower.includes(w)) sentiment--;
    for (const w of positiveWords) if (lower.includes(w)) sentiment++;

    if (sentiment < -1) bestMatch = artFlowers[0]; // Sunflower for deep sadness
    else if (sentiment < 0) bestMatch = artFlowers[1]; // Water Lily for mild distress
    else if (sentiment > 1) bestMatch = artFlowers[5]; // Rose for happiness
    else if (sentiment > 0) bestMatch = artFlowers[4]; // Almond Blossom for hope
    else bestMatch = artFlowers[7]; // Lotus for neutral/numb
  }

  return bestMatch;
}
