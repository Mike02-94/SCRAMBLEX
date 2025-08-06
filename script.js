(() => {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.getElementById('loading-bar');
  const gameContainer = document.getElementById('game-container');
  const scrambleContainer = document.getElementById('scramble-word-container');
  const answerContainer = document.getElementById('answer-container');
  const startBtn = document.getElementById('start-btn');
  const exitBtn = document.getElementById('exit-btn');
  const levelLabel = document.getElementById('level-label');
  const categoryLabel = document.getElementById('category-label');
  const wordLengthLabel = document.getElementById('word-length-label');
  const xpBar = document.getElementById('xp-bar');
  const timerLabel = document.getElementById('timer');
  const virtualKeyboard = document.getElementById('virtual-keyboard');

  
  const sounds = {
    bgm: new Audio('sounds/bgm.mp3'),  
    letterClick: new Audio('sounds/letter_click.mp3'),
    shuffle: new Audio('sounds/shuffle.mp3'),
    correct: new Audio('sounds/correct.mp3'),
    levelUp: new Audio('sounds/levelup.mp3'),
    gameOver: new Audio('sounds/gameover.mp3'),
    error: new Audio('sounds/error.mp3'),
    backspace: new Audio('sounds/backspace.mp3'),
  };

  // Background music setup
  sounds.bgm.loop = true;
  sounds.bgm.volume = 0.80;

  // Game Data
  function getWordsPerLevel(level) {
  if (level <= 10) return 2;
  if (level <= 20) return 3;
  if (level <= 30) return 5;
  if (level <= 40) return 5;
  if (level <= 50) return 6;
  if (level <= 60) return 6;
  if (level <= 70) return 8;
  if (level <= 80) return 8;
  if (level <= 90) return 9;
  return 10; // Levels 91-99
}

  const maxLevel = 99; 
  let currentLevel = 1;
  let currentCategory = '';
  let currentWord = '';
  let scrambledWord = [];
  let answer = [];
  let xp = 0;
  let xpToNextLevel = 100;
  let timer = null;
  let timerSecondsLeft = 0;
  let isPlaying = false;
  let isSubmitting = false;
  let isPaused = false;
  let autoResumeTimer = null;
  let autoResumeSecondsLeft = 10; 
  const AUTO_RESUME_TIME = 10;
  

const categories = [
  // Levels 1-10: Basic Categories
  { name: 'Car Brands', words: ['ford', 'mini', 'audi', 'bmw', 'tesla', 'honda', 'jaguar', 'toyota', 'lexus', 'ferrari'] },
  { name: 'Animals', words: ['cat', 'dog', 'horse', 'eagle', 'giraffe', 'panther', 'dolphin', 'elephant', 'alligator', 'kangaroo'] },
  { name: 'Musical Instruments', words: ['flute', 'drum', 'piano', 'guitar', 'violin', 'trumpet', 'accordion', 'saxophone', 'xylophone', 'harpsichord'] },
  { name: 'Science Terms', words: ['atom', 'cell', 'molecule', 'gravity', 'neutron', 'electron', 'photosynthesis', 'telemetry', 'bioinformatics', 'quantum'] },
  { name: 'Countries', words: ['china', 'india', 'france', 'brazil', 'canada', 'japan', 'mexico', 'australia', 'germany', 'argentina'] },
  { name: 'Food', words: ['bread', 'sushi', 'pasta', 'lasagna', 'burger', 'omelette', 'paella', 'croissant', 'pizza', 'steak'] },
  { name: 'Planets', words: ['earth', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'mercury', 'ceres', 'eris'] },
  { name: 'Colors', words: ['red', 'blue', 'green', 'violet', 'orange', 'yellow', 'magenta', 'turquoise', 'lavender', 'crimson'] },
  { name: 'Clothing', words: ['hat', 'scarf', 'shirt', 'jacket', 'trousers', 'blouse', 'cardigan', 'overalls', 'sweatshirt', 'poncho'] },
  { name: 'Tech Gadgets', words: ['phone', 'watch', 'laptop', 'tablet', 'printer', 'router', 'scanner', 'headphones', 'microphone', 'projector'] },

  // Levels 11-20: Intermediate Categories
  { name: 'Sports', words: ['bowling', 'goal', 'coach', 'tennis', 'hockey', 'cricket', 'cycling', 'badminton', 'wrestling', 'skateboard'] },
  { name: 'Flowers', words: ['rose', 'lily', 'tulip', 'daisy', 'orchid', 'carnation', 'chrysanthemum', 'bluebell', 'magnolia', 'gardenia'] },
  { name: 'Mythical Creatures', words: ['elf', 'dragon', 'unicorn', 'phoenix', 'griffin', 'centaur', 'mermaid', 'golem', 'basilisk', 'chimera'] },
  { name: 'Movies', words: ['terminator', 'robocop', 'jumanji', 'frozen', 'gladiator', 'inception', 'avatar', 'interstellar', 'casablanca', 'matrix'] },
  { name: 'Famous Scientists', words: ['curie', 'einstein', 'newton', 'darwin', 'tesla', 'feynman', 'hawking', 'galileo', 'pasteur', 'faraday'] },
  { name: 'Languages', words: ['spanish', 'english', 'french', 'german', 'russian', 'chinese', 'japanese', 'arabic', 'hindi', 'latin'] },
  { name: 'Vehicles', words: ['bike', 'truck', 'scooter', 'submarine', 'helicopter', 'airplane', 'tank', 'canoe', 'skateboard', 'bulldozer'] },
  { name: 'Elements', words: ['iron', 'gold', 'argon', 'carbon', 'helium', 'oxygen', 'neon', 'silicon', 'uranium', 'platinum'] },
  { name: 'Games', words: ['borderlands', 'valorant', 'outlast', 'overcooked', 'sims', 'pubg', 'minecraft', 'fortnite', 'overwatch', 'dota'] },
  { name: 'Emotions', words: ['joy', 'fear', 'love', 'anger', 'pride', 'envy', 'grief', 'hope', 'guilt', 'surprise'] },

  // Levels 21-30: Advanced Categories
  { name: 'Ocean Life', words: ['fish', 'whale', 'shark', 'dolphin', 'octopus', 'jellyfish', 'seahorse', 'starfish', 'barracuda', 'hammerhead'] },
  { name: 'Weather', words: ['rain', 'snow', 'wind', 'storm', 'thunder', 'lightning', 'tornado', 'hurricane', 'blizzard', 'typhoon'] },
  { name: 'Space Objects', words: ['star', 'moon', 'comet', 'asteroid', 'galaxy', 'nebula', 'supernova', 'blackhole', 'pulsar', 'quasar'] },
  { name: 'Kitchen Items', words: ['fork', 'knife', 'spoon', 'plate', 'blender', 'toaster', 'microwave', 'refrigerator', 'dishwasher', 'coffeemachine'] },
  { name: 'Body Parts', words: ['eye', 'nose', 'hand', 'finger', 'shoulder', 'elbow', 'ankle', 'wrist', 'thumbnail', 'eyelash'] },
  { name: 'Professions', words: ['chef', 'pilot', 'doctor', 'teacher', 'engineer', 'architect', 'photographer', 'journalist', 'veterinarian', 'archaeologist'] },
  { name: 'Gemstones', words: ['ruby', 'diamond', 'emerald', 'sapphire', 'topaz', 'amethyst', 'turquoise', 'aquamarine', 'tourmaline', 'alexandrite'] },
  { name: 'Art Supplies', words: ['pen', 'brush', 'paint', 'canvas', 'pencil', 'marker', 'charcoal', 'watercolor', 'sketchbook', 'easel'] },
  { name: 'Board Games', words: ['risk', 'clue', 'chess', 'checkers', 'backgammon', 'monopoly', 'scrabble', 'battleship', 'stratego', 'trivial'] },
  { name: 'Furniture', words: ['chair', 'table', 'sofa', 'bed', 'desk', 'cabinet', 'bookshelf', 'wardrobe', 'nightstand', 'dresser'] },

  // Levels 31-40: Expert Categories
  { name: 'Desserts', words: ['cake', 'pie', 'cookie', 'pudding', 'icecream', 'brownie', 'cheesecake', 'tiramisu', 'macaron', 'eclair'] },
  { name: 'Transportation', words: ['bus', 'train', 'plane', 'boat', 'bicycle', 'motorcycle', 'helicopter', 'submarine', 'skateboard', 'segway'] },
  { name: 'Building Materials', words: ['wood', 'brick', 'steel', 'concrete', 'glass', 'marble', 'granite', 'aluminum', 'fiberglass', 'composite'] },
  { name: 'Dance Styles', words: ['waltz', 'tango', 'salsa', 'ballet', 'jazz', 'hiphop', 'breakdance', 'flamenco', 'contemporary', 'ballroom'] },
  { name: 'Card Games', words: ['poker', 'bridge', 'hearts', 'spades', 'rummy', 'blackjack', 'solitaire', 'baccarat', 'cribbage', 'whist'] },
  { name: 'Natural Disasters', words: ['flood', 'fire', 'earthquake', 'tsunami', 'avalanche', 'landslide', 'drought', 'wildfire', 'sinkhole', 'mudslide'] },
  { name: 'Mythology', words: ['zeus', 'thor', 'odin', 'apollo', 'athena', 'hercules', 'poseidon', 'aphrodite', 'artemis', 'dionysus'] },
  { name: 'Textiles', words: ['silk', 'wool', 'cotton', 'linen', 'velvet', 'satin', 'denim', 'polyester', 'cashmere', 'mohair'] },
  { name: 'Tree Types', words: ['oak', 'pine', 'maple', 'birch', 'cedar', 'willow', 'cherry', 'eucalyptus', 'redwood', 'mahogany'] },
  { name: 'Magic Terms', words: ['spell', 'wand', 'potion', 'crystal', 'ritual', 'enchant', 'mystical', 'sorcery', 'alchemy', 'divination'] },

  // Levels 41-50: Master Categories
  { name: 'Photography', words: ['lens', 'flash', 'focus', 'shutter', 'aperture', 'exposure', 'tripod', 'filter', 'viewfinder', 'darkroom'] },
  { name: 'Fabrics', words: ['lace', 'tweed', 'flannel', 'corduroy', 'chiffon', 'taffeta', 'organza', 'brocade', 'jacquard', 'damask'] },
  { name: 'Computer Terms', words: ['mouse', 'keyboard', 'monitor', 'processor', 'memory', 'software', 'hardware', 'algorithm', 'database', 'encryption'] },
  { name: 'Garden Tools', words: ['rake', 'shovel', 'hoe', 'pruner', 'wateringcan', 'trowel', 'shears', 'wheelbarrow', 'sprinkler', 'fertilizer'] },
  { name: 'Beverages', words: ['tea', 'coffee', 'juice', 'soda', 'water', 'smoothie', 'milkshake', 'cocktail', 'mocktail', 'espresso'] },
  { name: 'Office Supplies', words: ['pen', 'paper', 'stapler', 'folder', 'clipboard', 'calculator', 'paperclip', 'highlighter', 'notebook', 'binder'] },
  { name: 'Shoe Types', words: ['boot', 'sandal', 'sneaker', 'heel', 'loafer', 'oxford', 'moccasin', 'stiletto', 'platform', 'wellington'] },
  { name: 'Breakfast Foods', words: ['egg', 'toast', 'cereal', 'pancake', 'waffle', 'bagel', 'muffin', 'oatmeal', 'croissant', 'granola'] },
  { name: 'Jewelry', words: ['ring', 'necklace', 'bracelet', 'earring', 'brooch', 'pendant', 'anklet', 'tiara', 'cufflink', 'chainlink'] },
  { name: 'Exercise Equipment', words: ['weight', 'treadmill', 'bike', 'mat', 'barbell', 'dumbbell', 'kettlebell', 'resistance', 'elliptical', 'rower'] },

  // Levels 51-60: Grandmaster Categories
  { name: 'Camping Gear', words: ['tent', 'sleepingbag', 'lantern', 'compass', 'backpack', 'flashlight', 'campfire', 'cooler', 'binoculars', 'carabiner'] },
  { name: 'Architectural Styles', words: ['gothic', 'baroque', 'modern', 'colonial', 'victorian', 'renaissance', 'neoclassical', 'brutalist', 'artdeco', 'postmodern'] },
  { name: 'Musical Genres', words: ['jazz', 'blues', 'rock', 'classical', 'reggae', 'country', 'electronic', 'hiphop', 'folk', 'opera'] },
  { name: 'Ancient Civilizations', words: ['roman', 'egyptian', 'greek', 'mayan', 'aztec', 'persian', 'babylonian', 'carthaginian', 'phoenician', 'mesopotamian'] },
  { name: 'Medical Terms', words: ['virus', 'bacteria', 'antibody', 'vaccine', 'diagnosis', 'treatment', 'prescription', 'physiotherapy', 'immunization', 'rehabilitation'] },
  { name: 'Ocean Zones', words: ['surface', 'twilight', 'midnight', 'abyssal', 'hadal', 'pelagic', 'benthic', 'neritic', 'oceanic', 'bathyal'] },
  { name: 'Literary Devices', words: ['metaphor', 'simile', 'irony', 'allegory', 'hyperbole', 'personification', 'onomatopoeia', 'alliteration', 'symbolism', 'foreshadowing'] },
  { name: 'Renewable Energy', words: ['solar', 'wind', 'hydro', 'geothermal', 'biomass', 'tidal', 'nuclear', 'biofuel', 'hydroelectric', 'photovoltaic'] },
  { name: 'Brain Parts', words: ['cortex', 'cerebrum', 'cerebellum', 'brainstem', 'hippocampus', 'amygdala', 'thalamus', 'hypothalamus', 'medulla', 'pituitary'] },
  { name: 'Cryptocurrency', words: ['bitcoin', 'ethereum', 'blockchain', 'mining', 'wallet', 'exchange', 'altcoin', 'defi', 'smartcontract', 'stablecoin'] },

  // Levels 61-70: Legendary Categories
  { name: 'Martial Arts', words: ['karate', 'judo', 'taekwondo', 'aikido', 'kungfu', 'jiujitsu', 'muaythai', 'boxing', 'kickboxing', 'capoeira'] },
  { name: 'Financial Terms', words: ['stock', 'bond', 'dividend', 'portfolio', 'investment', 'mortgage', 'interest', 'inflation', 'recession', 'economics'] },
  { name: 'Dinosaur Types', words: ['rex', 'raptor', 'stegosaurus', 'triceratops', 'brontosaurus', 'pterodactyl', 'allosaurus', 'diplodocus', 'ankylosaurus', 'parasaurolophus'] },
  { name: 'Video Game Terms', words: ['respawn', 'boss', 'level', 'quest', 'achievement', 'multiplayer', 'speedrun', 'glitch', 'mod', 'easteregg'] },
  { name: 'Astronomy Objects', words: ['supernova', 'neutronstar', 'whitedwarf', 'redgiant', 'binarystar', 'exoplanet', 'asteroidbelt', 'solarwind', 'cosmicray', 'darkmatter'] },
  { name: 'Phobias', words: ['arachnophobia', 'claustrophobia', 'agoraphobia', 'acrophobia', 'hydrophobia', 'xenophobia', 'nyctophobia', 'aichmophobia', 'trypophobia', 'glossophobia'] },
  { name: 'Wine Types', words: ['merlot', 'cabernet', 'chardonnay', 'pinotnoir', 'sauvignon', 'riesling', 'champagne', 'prosecco', 'bordeaux', 'burgundy'] },
  { name: 'Philosophical Schools', words: ['stoicism', 'existentialism', 'nihilism', 'pragmatism', 'idealism', 'materialism', 'empiricism', 'rationalism', 'hedonism', 'absurdism'] },
  { name: 'Chemical Reactions', words: ['oxidation', 'reduction', 'combustion', 'synthesis', 'decomposition', 'precipitation', 'neutralization', 'polymerization', 'fermentation', 'catalysis'] },
  { name: 'Optical Phenomena', words: ['rainbow', 'aurora', 'mirage', 'refraction', 'reflection', 'diffraction', 'interference', 'polarization', 'dispersion', 'fluorescence'] },

  // Levels 71-80: Mythical Categories
  { name: 'Renaissance Artists', words: ['leonardo', 'michelangelo', 'raphael', 'donatello', 'botticelli', 'caravaggio', 'titian', 'giotto', 'brunelleschi', 'ghiberti'] },
  { name: 'Quantum Physics', words: ['entanglement', 'superposition', 'uncertainty', 'wavefunction', 'particle', 'photon', 'electron', 'qubit', 'decoherence', 'tunneling'] },
  { name: 'Geological Eras', words: ['precambrian', 'paleozoic', 'mesozoic', 'cenozoic', 'jurassic', 'cretaceous', 'triassic', 'permian', 'devonian', 'ordovician'] },
  { name: 'Social Media Terms', words: ['hashtag', 'viral', 'influencer', 'algorithm', 'engagement', 'follower', 'trending', 'retweet', 'story', 'livestream'] },
  { name: 'Linguistic Terms', words: ['phoneme', 'morpheme', 'syntax', 'semantics', 'pragmatics', 'phonetics', 'etymology', 'dialect', 'accent', 'vernacular'] },
  { name: 'Ecosystem Types', words: ['rainforest', 'desert', 'tundra', 'grassland', 'wetland', 'coralreef', 'mangrove', 'savanna', 'taiga', 'estuary'] },
  { name: 'AI Technology', words: ['algorithm', 'neuralnetwork', 'machinelearning', 'deeplearning', 'automation', 'robotics', 'chatbot', 'prediction', 'classification', 'optimization'] },
  { name: 'Mythology Creatures', words: ['kraken', 'sphinx', 'banshee', 'valkyrie', 'wendigo', 'kelpie', 'djinn', 'roc', 'salamander', 'manticore'] },
  { name: 'Extreme Sports', words: ['skydiving', 'bungeejumping', 'rockclimbing', 'snowboarding', 'surfing', 'paragliding', 'basejumping', 'wingsuit', 'freediving', 'mountaineering'] },
  { name: 'Spice Types', words: ['cinnamon', 'cardamom', 'turmeric', 'cumin', 'coriander', 'paprika', 'saffron', 'nutmeg', 'cloves', 'fenugreek'] },

  // Levels 81-90: Ultimate Categories
  { name: 'Mental Health', words: ['anxiety', 'depression', 'therapy', 'mindfulness', 'resilience', 'wellness', 'counseling', 'meditation', 'selfcare', 'cognitive'] },
  { name: 'Space Missions', words: ['apollo', 'voyager', 'cassini', 'hubble', 'marsrover', 'galileo', 'pioneer', 'viking', 'curiosity', 'perseverance'] },
  { name: 'Fashion Terms', words: ['hautecouture', 'pretaporter', 'avantgarde', 'minimalist', 'bohemian', 'vintage', 'streetwear', 'sustainable', 'luxury', 'artisan'] },
  { name: 'Internet Protocols', words: ['http', 'https', 'ftp', 'smtp', 'pop', 'imap', 'tcp', 'udp', 'dns', 'ssl'] },
  { name: 'Historical Periods', words: ['medieval', 'renaissance', 'enlightenment', 'industrial', 'modern', 'prehistoric', 'classical', 'baroque', 'romantic', 'victorian'] },
  { name: 'Molecular Biology', words: ['dna', 'rna', 'protein', 'enzyme', 'ribosome', 'mitochondria', 'chromosome', 'gene', 'mutation', 'transcription'] },
  { name: 'Climate Zones', words: ['tropical', 'temperate', 'polar', 'arid', 'humid', 'continental', 'maritime', 'alpine', 'mediterranean', 'subarctic'] },
  { name: 'Architectural Elements', words: ['column', 'arch', 'dome', 'buttress', 'cornice', 'pediment', 'frieze', 'capital', 'lintel', 'spandrel'] },
  { name: 'Cognitive Science', words: ['perception', 'memory', 'attention', 'reasoning', 'consciousness', 'cognition', 'learning', 'intelligence', 'emotion', 'behavior'] },
  { name: 'Nanotechnology', words: ['nanoparticle', 'quantumdot', 'carbonnanotube', 'graphene', 'nanomedicine', 'nanorobot', 'selfassembly', 'molecular', 'nanoscale', 'fabrication'] },

  // Levels 91-99: Transcendent Categories
  { name: 'Advanced Mathematics', words: ['calculus', 'algebra', 'geometry', 'trigonometry', 'statistics', 'probability', 'theorem', 'equation', 'function', 'derivative'] },
  { name: 'Cybersecurity', words: ['firewall', 'encryption', 'malware', 'phishing', 'ransomware', 'vulnerability', 'penetration', 'authentication', 'biometric', 'zeroday'] },
  { name: 'Evolutionary Biology', words: ['naturalselection', 'adaptation', 'speciation', 'phylogeny', 'homology', 'convergence', 'divergence', 'extinction', 'fossil', 'taxonomy'] },
  { name: 'Urban Planning', words: ['zoning', 'infrastructure', 'gentrification', 'sustainability', 'transit', 'walkability', 'density', 'mixeduse', 'greenspace', 'smartcity'] },
  { name: 'Particle Physics', words: ['quark', 'lepton', 'boson', 'fermion', 'hadron', 'baryon', 'meson', 'neutrino', 'higgs', 'antimatter'] },
  { name: 'Biotechnology', words: ['geneticengineering', 'cloning', 'stemcell', 'crispr', 'genetherapy', 'biomarker', 'transgenic', 'recombinant', 'syntheticbiology', 'bioinformatics'] },
  { name: 'Sustainable Energy', words: ['carbonneutral', 'renewable', 'efficiency', 'conservation', 'greentechnology', 'cleanenergy', 'zeroemission', 'sustainable', 'ecofriendly', 'carbonfootprint'] },
  { name: 'Neuroscience', words: ['synapse', 'neuron', 'dendrite', 'axon', 'neurotransmitter', 'plasticity', 'connectivity', 'neuralnetwork', 'brainwaves', 'consciousness'] },
  { name: 'Quantum Computing', words: ['qubit', 'superposition', 'entanglement', 'decoherence', 'quantumgate', 'algorithm', 'supremacy', 'errorcorrection', 'interference', 'measurement'] }
];
  
  // Helper: shuffle an array (Fisher-Yates)
  function shuffle(array) {
    let m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  // Helper: create letter element with flip animation
  function createLetterTile(letter) {
    const span = document.createElement('div');
    span.classList.add('letter-tile', 'flip');
    span.textContent = letter.toUpperCase();
    return span;
  }

  // Helper: create answer letter element
  function createAnswerLetter(letter) {
    const span = document.createElement('div');
    span.classList.add('answer-letter');
    span.textContent = letter.toUpperCase();
    return span;
  }

// Create letter movement animation
function createLetterMoveAnimation(sourceElement, direction) {
  // Create a visual effect on the source element only
  if (direction === 'down') {
    sourceElement.style.transition = 'all 0.3s ease';
    sourceElement.style.transform = 'scale(1.2) translateY(10px)';
    sourceElement.style.opacity = '0.7';
    
    setTimeout(() => {
      sourceElement.style.transform = 'scale(1)';
      sourceElement.style.opacity = '1';
    }, 300);
  } else {
    sourceElement.style.transition = 'all 0.3s ease';
    sourceElement.style.transform = 'scale(1.2) translateY(-10px)';
    sourceElement.style.opacity = '0.7';
    
    setTimeout(() => {
      sourceElement.style.transform = 'scale(1)';
      sourceElement.style.opacity = '1';
    }, 300);
  }
}

// Update scramble area to show which letters are used
function updateScrambleVisibility() {
  const tiles = scrambleContainer.querySelectorAll('.letter-tile');
  const answerLetters = [...answer];
  
  tiles.forEach(tile => {
    const letter = tile.textContent.toLowerCase();
    const usedCount = answerLetters.filter(l => l === letter).length;
    const availableCount = scrambledWord.filter(l => l.toLowerCase() === letter).length;
    
    if (usedCount >= availableCount) {
      tile.classList.add('used');
    } else {
      tile.classList.remove('used');
    }
  });
}

  // Update XP bar width and label
  function updateXpBar() {
  const catIndex = (currentLevel - 1) % categories.length;
  if (!window.usedWordsPerCategory) window.usedWordsPerCategory = {};
  if (!window.usedWordsPerCategory[catIndex]) window.usedWordsPerCategory[catIndex] = [];
  
  // Get required words for current level
  const requiredWords = getWordsPerLevel(currentLevel);
  
  // Subtract 1 because current word is added when level loads, not when completed
  const wordsCompleted = Math.max(0, window.usedWordsPerCategory[catIndex].length - 1);
  const percent = (wordsCompleted / requiredWords) * 100;
  xpBar.style.width = percent + '%';
}
  // Start timer for current level
  function startTimer(seconds) {
  timerSecondsLeft = seconds;
  timerLabel.textContent = timerSecondsLeft;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (isPaused) return; // Don't decrease timer when paused
    timerSecondsLeft--;
    timerLabel.textContent = timerSecondsLeft;
    if (timerSecondsLeft <= 0) {
      clearInterval(timer);
      timeUp();
    }
  }, 1000);
}

  // Called when time is up (level failed)
function timeUp() {
  isPlaying = false;
  sounds.gameOver.play().catch(() => {});
  showGameOverOverlay();
}

// Show game over overlay
function showGameOverOverlay() {
  const overlay = document.getElementById('game-over-overlay');
  const wordDisplay = document.getElementById('game-over-word');
  const finalLevel = document.getElementById('final-level');
  const finalXp = document.getElementById('final-xp');
  
  // Set word text
  wordDisplay.textContent = currentWord.toUpperCase();
  
  // Apply dynamic sizing based on word length
  wordDisplay.classList.remove('long-word', 'very-long-word');
  if (currentWord.length > 12) {
    wordDisplay.classList.add('very-long-word');
  } else if (currentWord.length > 8) {
    wordDisplay.classList.add('long-word');
  }
  
  finalLevel.textContent = currentLevel;
  finalXp.textContent = xp;
  
  overlay.classList.remove('hidden');
}

// Hide game over overlay
function hideGameOverOverlay() {
  const overlay = document.getElementById('game-over-overlay');
  overlay.classList.add('hidden');
}

// Restart game from beginning
function restartGame() {
  console.log('Restarting game...'); // Debug log
  hideGameOverOverlay();
  
  // Reset all game state
  currentLevel = 1;
  xp = 0;
  xpToNextLevel = 100;
  isPlaying = false;
  clearInterval(timer);
  
  // Clear used words to allow fresh selection
  window.usedWords = {};
  window.globalUsedWords = [];
  window.usedWordsPerCategory = {};
  
  // Reset UI
  timerLabel.textContent = '--';
  updateXpBar();
  resetAnswer();
  scrambleContainer.innerHTML = '';
  
  // Update labels
  levelLabel.textContent = `Level: --`;
  categoryLabel.textContent = `Category: --`;
  wordLengthLabel.textContent = `Word Length: --`;
  
  // Start fresh game
  setTimeout(() => {
    startGame();
  }, 100);
}

// Determine a fair time limit for each level with balanced difficulty
function getTimeLimitForLevel(level) {
  const wordLen = currentWord.length;
  
  // Base time calculation (similar to levels 1-10 throughout the game)
  let baseTime = 25; // Increased base time for better balance
  let wordLengthBonus = wordLen * 2.5; // More generous time per letter
  let levelPenalty = 0;
  
  // Much gentler progressive difficulty (similar to levels 1-10)
  if (level <= 10) {
    // Levels 1-10: Very gentle decrease
    levelPenalty = level * 0.3; // 0.3 seconds penalty per level
  } else if (level <= 25) {
    // Levels 11-25: Still gentle (like extending levels 1-10 pattern)
    levelPenalty = 3 + (level - 10) * 0.4; // Small additional penalty
  } else if (level <= 50) {
    // Levels 26-50: Moderate increase (but still manageable)
    levelPenalty = 9 + (level - 25) * 0.5; // Slightly more penalty
  } else if (level <= 75) {
    // Levels 51-75: Medium difficulty
    levelPenalty = 21.5 + (level - 50) * 0.6; // More penalty but reasonable
  } else {
    // Levels 76-99: Highest difficulty but still fair
    levelPenalty = 36.5 + (level - 75) * 0.7; // Maximum but not impossible
  }
  
  // Calculate final time
  let finalTime = baseTime + wordLengthBonus - levelPenalty;
  
  // Ensure reasonable minimum time limits (higher minimums for fairness)
  let minTime;
  if (level <= 20) {
    minTime = 15; // Generous minimum for early levels
  } else if (level <= 40) {
    minTime = 12; // Reasonable minimum for mid levels
  } else if (level <= 60) {
    minTime = 10; // Still fair for higher levels
  } else {
    minTime = 8; // Challenging but possible for expert levels
  }
  
  finalTime = Math.max(minTime, finalTime);
  
  // Remove randomness for consistent gameplay
  // finalTime += (Math.random() - 0.5) * 2; // Commented out for consistency
  
  console.log(`Level ${level}: ${finalTime.toFixed(1)}s (Word: ${currentWord}, Length: ${wordLen})`);
  return Math.round(finalTime);
}

  // Reset the current answer
function resetAnswer() {
  answer = [];
  answerContainer.innerHTML = '';
  isSubmitting = false; // Unlock when resetting
  updateScrambleVisibility(); // Update scramble area visibility
}

// Pause game function
function pauseGame() {
  if (!isPlaying || isPaused) return;
  
  isPaused = true;
  clearInterval(timer); // Stop the main game timer
  
  // Show pause overlay with current timer value
  const pauseOverlay = document.getElementById('pause-overlay');
  const pauseLevel = document.getElementById('pause-level');
  const pauseTime = document.getElementById('pause-time');
  const autoResumeDisplay = document.getElementById('auto-resume-time');
  
  // Display current game state
  pauseLevel.textContent = currentLevel;
  pauseTime.textContent = Math.max(0, timerSecondsLeft);
  
  // Start auto-resume countdown
  autoResumeSecondsLeft = AUTO_RESUME_TIME;
  if (autoResumeDisplay) {
    autoResumeDisplay.textContent = autoResumeSecondsLeft;
  }
  
  // Auto-resume timer
  autoResumeTimer = setInterval(() => {
    autoResumeSecondsLeft--;
    if (autoResumeDisplay) {
      autoResumeDisplay.textContent = autoResumeSecondsLeft;
    }
    
    if (autoResumeSecondsLeft <= 0) {
      clearInterval(autoResumeTimer);
      resumeGame(); // Auto-resume
    }
  }, 1000);
  
  pauseOverlay.classList.remove('hidden');
  
  // Update button text
  const pauseBtn = document.getElementById('pause-btn');
  pauseBtn.textContent = 'Resume';
  
  console.log('Game paused at:', timerSecondsLeft, 'seconds');
}

// Resume game function
function resumeGame() {
  if (!isPlaying || !isPaused) return;
  
  isPaused = false;
  
  // Clear auto-resume timer
  if (autoResumeTimer) {
    clearInterval(autoResumeTimer);
    autoResumeTimer = null;
  }
  
  // Hide pause overlay
  const pauseOverlay = document.getElementById('pause-overlay');
  pauseOverlay.classList.add('hidden');
  
  // Restart main game timer with remaining time
  startTimer(timerSecondsLeft);
  
  // Update button text
  const pauseBtn = document.getElementById('pause-btn');
  pauseBtn.textContent = 'Pause';
  
  console.log('Game resumed with', timerSecondsLeft, 'seconds remaining');
}

// Toggle pause/resume
function togglePause() {
  if (!isPlaying) return;
  
  console.log('Toggle pause called. Currently paused:', isPaused, 'Timer seconds:', timerSecondsLeft); // Debug
  
  if (isPaused) {
    resumeGame();
  } else {
    pauseGame();
  }
}

// Render scrambled word with pop-in animation
function renderScrambledWordWithAnimation() {
  scrambleContainer.innerHTML = '';
  
  scrambledWord.forEach((letter, i) => {
    setTimeout(() => {
      const tile = createLetterTile(letter);
      tile.title = 'Click to select letter';
      tile.dataset.index = i;
      
      // Add pop-in animation
      tile.classList.add('letter-pop-in');
      
    // Click to select letter
    tile.addEventListener('click', (e) => {
  if (!isPlaying || isSubmitting) return;
  
  // Check if this letter can be added
  const letterLower = letter.toLowerCase();
  const scrambledLetters = [...scrambledWord];
  const usedLetters = [...answer];
  
  const availableCount = scrambledLetters.filter(l => l.toLowerCase() === letterLower).length;
  const usedCount = usedLetters.filter(l => l.toLowerCase() === letterLower).length;
  
  if (availableCount > usedCount && answer.length < currentWord.length) {
    // Create animation effect
    createLetterMoveAnimation(tile, 'down');
    
    // Add letter to answer immediately
    answer.push(letterLower);
    updateAnswerDisplay();
    updateScrambleVisibility();
    sounds.letterClick.currentTime = 0;
    sounds.letterClick.play().catch(() => {});
  }
});
      
      scrambleContainer.appendChild(tile);
      
      // Remove animation class after animation completes
      setTimeout(() => {
        tile.classList.remove('letter-pop-in');
      }, 400);
    }, i * 80); // Stagger each letter appearance
  });
}

// Create shuffle particle effect
function createShuffleParticles() {
  const container = scrambleContainer;
  const rect = container.getBoundingClientRect();
  
  // Create 15 shuffle particles
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = 'shuffle-particle';
    
    // Random position within the container
    const startX = Math.random() * rect.width;
    const startY = Math.random() * rect.height;
    
    // Random direction
    const dx = (Math.random() - 0.5) * 150;
    const dy = (Math.random() - 0.5) * 150;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.setProperty('--dx', dx + 'px');
    particle.style.setProperty('--dy', dy + 'px');
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1000);
  }
}

  // Animate incorrect answer feedback
function animateIncorrectAnswer() {
  // First, clean up any existing animation classes
  const allElements = document.querySelectorAll('.incorrect-shake, .incorrect-wobble');
  allElements.forEach(el => {
    el.classList.remove('incorrect-shake', 'incorrect-wobble');
    el.style.removeProperty('background');
    el.style.removeProperty('border-color');
    el.style.removeProperty('box-shadow');
  });

  // Force a reflow to ensure classes are removed
  document.body.offsetHeight;

  // Animate answer letters with error effect
  const answerLetters = answerContainer.querySelectorAll('.answer-letter');
  answerLetters.forEach((letter, i) => {
    setTimeout(() => {
      // Remove any existing animation classes first
      letter.classList.remove('incorrect-shake');
      
      // Force reflow
      letter.offsetHeight;
      
      // Add animation class and styles
      letter.classList.add('incorrect-shake');
      letter.style.background = 'linear-gradient(145deg, #ff0000, #cc0000)';
      letter.style.color = '#ffffff';
      letter.style.borderColor = '#ff4444';
      letter.style.boxShadow = '0 0 15px #ff0000';
      
      // Remove animation class after animation completes
      setTimeout(() => {
        letter.classList.remove('incorrect-shake');
        // Reset styles to original
        letter.style.removeProperty('background');
        letter.style.removeProperty('color');
        letter.style.removeProperty('border-color');
        letter.style.removeProperty('box-shadow');
      }, 600);
    }, i * 100);
  });

  // Animate scramble letters to show they're available
  const letterTiles = scrambleContainer.querySelectorAll('.letter-tile');
  letterTiles.forEach((tile, i) => {
    setTimeout(() => {
      // Remove any existing animation classes first
      tile.classList.remove('incorrect-wobble');
      
      // Force reflow
      tile.offsetHeight;
      
      // Add animation class and styles
      tile.classList.add('incorrect-wobble');
      tile.style.borderColor = '#ffaa00';
      tile.style.boxShadow = '0 0 10px #ffaa00';
      
      // Remove animation class after animation completes
      setTimeout(() => {
        tile.classList.remove('incorrect-wobble');
        // Reset styles to original
        tile.style.removeProperty('border-color');
        tile.style.removeProperty('box-shadow');
      }, 800);
    }, i * 50);
  });

  // Create error particles
  createErrorParticles();

  // Play error sound
  sounds.error.currentTime = 0;
sounds.error.play().catch(() => {});
  
  // Container shake effect
  answerContainer.classList.remove('shake'); // Remove first
  answerContainer.offsetHeight; // Force reflow
  answerContainer.classList.add('shake');
  setTimeout(() => {
    answerContainer.classList.remove('shake');
  }, 500);
}

// Show level up popup with futuristic animation
function showLevelUpPopup(newLevel, nextCategory, xpGained) {
  const overlay = document.getElementById('levelup-overlay');
  const levelNumber = document.getElementById('levelup-level-number');
  const categoryName = document.getElementById('levelup-category-name');
  const xpGainedSpan = document.getElementById('levelup-xp-gained');
  const particlesContainer = document.getElementById('levelup-particles');
  
  // Set content
  levelNumber.textContent = newLevel;
  categoryName.textContent = nextCategory;
  xpGainedSpan.textContent = xpGained;
  
  // Create floating particles
  createLevelUpParticles(particlesContainer);
  
  // Show overlay
  overlay.classList.remove('hidden');
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    hideLevelUpPopup();
  }, 3000);
}

// Hide level up popup
function hideLevelUpPopup() {
  const overlay = document.getElementById('levelup-overlay');
  overlay.style.animation = 'levelup-popup 0.5s ease-in reverse';
  
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.style.animation = ''; // Reset animation
  }, 500);
}

// Show victory overlay
function showVictoryOverlay() {
  const overlay = document.getElementById('victory-overlay');
  const maxLevelSpan = document.getElementById('victory-max-level');
  const finalLevelSpan = document.getElementById('victory-final-level');
  const finalXpSpan = document.getElementById('victory-final-xp');
  const fireworksContainer = document.getElementById('victory-fireworks');
  
  // Set content
  maxLevelSpan.textContent = maxLevel;
  finalLevelSpan.textContent = maxLevel;
  finalXpSpan.textContent = xp;
  
  // Create fireworks
  createVictoryFireworks(fireworksContainer);
  
  // Show overlay
  overlay.classList.remove('hidden');
  
  // Play victory sound (if you have one)
  sounds.levelUp.play().catch(() => {});
}

// Hide victory overlay
function hideVictoryOverlay() {
  const overlay = document.getElementById('victory-overlay');
  overlay.classList.add('hidden');
}

// Create victory fireworks effect
function createVictoryFireworks(container) {
  // Clear any existing fireworks
  container.innerHTML = '';
  
  // Create multiple bursts of fireworks
  for (let burst = 0; burst < 5; burst++) {
    setTimeout(() => {
      createFireworkBurst(container);
    }, burst * 600);
  }
}

// Create individual firework burst
function createFireworkBurst(container) {
  const burstCount = 50; // Number of particles per burst
  
  for (let i = 0; i < burstCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'victory-firework';
    
    // Random burst origin point
    const originX = 20 + Math.random() * 60; // 20% to 80% of width
    const originY = 30 + Math.random() * 40; // 30% to 70% of height
    
    // Random direction and distance
    const angle = (i / burstCount) * 2 * Math.PI;
    const distance = 100 + Math.random() * 150;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    
    particle.style.left = originX + '%';
    particle.style.top = originY + '%';
    particle.style.setProperty('--dx', dx + 'px');
    particle.style.setProperty('--dy', dy + 'px');
    
    // Random animation delay
    particle.style.animationDelay = (Math.random() * 0.5) + 's';
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2500);
  }
}

// Create floating particles for level up effect
function createLevelUpParticles(container) {
  // Clear any existing particles
  container.innerHTML = '';
  
  // Create 30 particles
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'levelup-particle';
    
    // Random starting position around the edges
    const side = Math.floor(Math.random() * 4);
    let startX, startY;
    
    switch(side) {
      case 0: // Top
        startX = Math.random() * 100;
        startY = 0;
        break;
      case 1: // Right
        startX = 100;
        startY = Math.random() * 100;
        break;
      case 2: // Bottom
        startX = Math.random() * 100;
        startY = 100;
        break;
      case 3: // Left
        startX = 0;
        startY = Math.random() * 100;
        break;
    }
    
    // Random destination toward center with some spread
    const centerX = 50 + (Math.random() - 0.5) * 40;
    const centerY = 50 + (Math.random() - 0.5) * 40;
    
    const dx = (centerX - startX) * 3;
    const dy = (centerY - startY) * 3;
    
    particle.style.left = startX + '%';
    particle.style.top = startY + '%';
    particle.style.setProperty('--dx', dx + '%');
    particle.style.setProperty('--dy', dy + '%');
    
    // Random animation delay
    particle.style.animationDelay = (Math.random() * 0.5) + 's';
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 3500);
  }
}

// Create error particle effect
function createErrorParticles() {
  const container = answerContainer;
  const rect = container.getBoundingClientRect();
  
  // Create 12 error particles
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'error-particle';
    
    // Random position within the container
    const startX = Math.random() * rect.width;
    const startY = Math.random() * rect.height;
    
    // Random direction (mostly upward)
    const dx = (Math.random() - 0.5) * 120;
    const dy = -Math.random() * 100 - 50; // Upward bias
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.setProperty('--dx', dx + 'px');
    particle.style.setProperty('--dy', dy + 'px');
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1500);
  }
}

// Create success particle effect
function createSuccessParticles() {
  const container = scrambleContainer;
  const rect = container.getBoundingClientRect();
  
  // Create 20 particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'success-particle';
    
    // Random position within the container
    const startX = Math.random() * rect.width;
    const startY = Math.random() * rect.height;
    
    // Random direction and distance
    const dx = (Math.random() - 0.5) * 200;
    const dy = (Math.random() - 0.5) * 200 - 50; // Bias upward
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.setProperty('--dx', dx + 'px');
    particle.style.setProperty('--dy', dy + 'px');
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2000);
  }
}

  // Animate correct answer feedback
function animateCorrectAnswer() {
  // Clean up any existing animation classes
  const allElements = document.querySelectorAll('.correct-bounce, .correct-glow');
  allElements.forEach(el => {
    el.classList.remove('correct-bounce', 'correct-glow');
    el.style.removeProperty('background');
    el.style.removeProperty('color');
    el.style.removeProperty('transform');
    el.style.removeProperty('box-shadow');
  });

  // Force a reflow
  document.body.offsetHeight;

  // Animate scramble letters with success effect
  const letterTiles = scrambleContainer.querySelectorAll('.letter-tile');
  letterTiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.remove('correct-bounce');
      tile.offsetHeight; // Force reflow
      
      tile.classList.add('correct-bounce');
      tile.style.background = 'linear-gradient(145deg, #00ff00, #00cc00)';
      tile.style.color = '#ffffff';
      tile.style.transform = 'scale(1.2) rotateY(360deg)';
      
      // Clean up after animation
      setTimeout(() => {
        tile.classList.remove('correct-bounce');
        tile.style.removeProperty('background');
        tile.style.removeProperty('color');
        tile.style.removeProperty('transform');
      }, 800);
    }, i * 100);
  });

  // Animate answer letters with success effect
  const answerLetters = answerContainer.querySelectorAll('.answer-letter');
  answerLetters.forEach((letter, i) => {
    setTimeout(() => {
      letter.classList.remove('correct-glow');
      letter.offsetHeight; // Force reflow
      
      letter.classList.add('correct-glow');
      letter.style.background = 'linear-gradient(145deg, #00ffff, #0099ff)';
      letter.style.transform = 'scale(1.3)';
      letter.style.boxShadow = '0 0 20px #00ffff';
      
      // Clean up after animation
      setTimeout(() => {
        letter.classList.remove('correct-glow');
        letter.style.removeProperty('background');
        letter.style.removeProperty('transform');
        letter.style.removeProperty('box-shadow');
      }, 1000);
    }, i * 80);
  });

  // Add particle effect
  createSuccessParticles();
  
  // Shake effect for extra feedback
  scrambleContainer.classList.remove('shake');
  scrambleContainer.offsetHeight; // Force reflow
  scrambleContainer.classList.add('shake');
  setTimeout(() => {
    scrambleContainer.classList.remove('shake');
  }, 500);
}

  // Render the scrambled word on screen
function renderScrambledWord() {
  scrambleContainer.innerHTML = '';
  scrambledWord.forEach((letter, i) => {
    const tile = createLetterTile(letter);
    tile.title = 'Click to select letter';
    tile.dataset.index = i;
    // Click to select letter
    tile.addEventListener('click', (e) => {
      if (!isPlaying) return;
      handleVirtualKeyPress(letter.toUpperCase());
    });
    scrambleContainer.appendChild(tile);
  });
}

  // Reshuffle single letter at index i in scrambledWord among neighbors
  function reshuffleSingleLetter(i) {
    if (!isPlaying) return;
    if (scrambledWord.length < 2) return;
    const swapIndex = i === 0 ? 1 : i === scrambledWord.length - 1 ? i - 1 : (Math.random() < 0.5 ? i-1 : i+1);
    [scrambledWord[i], scrambledWord[swapIndex]] = [scrambledWord[swapIndex], scrambledWord[i]];
    renderScrambledWord();
    sounds.shuffle.currentTime = 0;
sounds.shuffle.play().catch(() => {});
  }

  // Update the answer display container
  function updateAnswerDisplay() {
    answerContainer.innerHTML = '';
    answer.forEach(letter => {
      const el = createAnswerLetter(letter);
      answerContainer.appendChild(el);
    });
  }

    // Check if answer is complete and correct
function checkAnswerComplete(forceSubmit = false) {
  console.log('checkAnswerComplete called, isSubmitting:', isSubmitting);
  
  if (isSubmitting) {
    console.log('Already submitting - blocked');
    return; // Prevent double submission
  }
  
  // Only check if forced by Enter key
  if (!forceSubmit) {
    return;
  }
  
  if (answer.length === 0) return;
  
  console.log('Setting isSubmitting to true');
  isSubmitting = true; // Lock submission
  
  const attempt = answer.join('').toLowerCase();
  if (attempt === currentWord.toLowerCase()) {
    levelUp();
  } else {
    // Incorrect: animate error feedback
    animateIncorrectAnswer();
    setTimeout(() => {
      resetAnswer();
      sounds.shuffle.currentTime = 0;
      sounds.shuffle.play().catch(() => {});
      console.log('Setting isSubmitting to false after error');
      isSubmitting = false; // Unlock after error animation
    }, 1000);
  }
}

  // Progress to next level or end game
function levelUp() {
  isPlaying = false;
  // Reset and play correct sound immediately (allow overlapping)
  sounds.correct.currentTime = 0;
  sounds.correct.play().catch(() => {});
  animateCorrectAnswer();

  xp += 20 + currentLevel * 5;
  updateXpBar();

  const catIndex = (currentLevel - 1) % categories.length;
  const wordsCompleted = window.usedWordsPerCategory[catIndex].length;
  const requiredWords = getWordsPerLevel(currentLevel);
    if (wordsCompleted >= requiredWords) {
    currentLevel++;
    if (currentLevel > maxLevel) {
      // Win game
      xpBar.style.width = '100%';
      showVictoryOverlay();
      return;
    }
    // New xp target grows progressively
    xp -= xpToNextLevel;
    xpToNextLevel = Math.round(xpToNextLevel * 1.35);
    sounds.levelUp.play().catch(() => {});

    // Get next category info (same logic as loadLevel function)
    const nextCatIndex = (currentLevel - 1) % categories.length;
    const nextCategory = categories[nextCatIndex].name;
    
    // Calculate XP gained for this level
    const xpGained = 20 + (currentLevel - 1) * 5;
    
    // Show futuristic level up popup
    showLevelUpPopup(currentLevel, nextCategory, xpGained);
  }

  setTimeout(() => {
    loadLevel(currentLevel);
    isPlaying = true;
    startTimer(getTimeLimitForLevel(currentLevel));
    resetAnswer();
    isSubmitting = false; // Unlock submission for next level
  }, 800);
}

  // Load a level: choose word, scramble it, show category/word-length details
  function loadLevel(level) {
    if (level < 1 || level > maxLevel) return;

    currentLevel = level;
    // choose category index cyclically or random but stable
    const catIndex = (level - 1) % categories.length;
    currentCategory = categories[catIndex].name;

    // Choose word based on increasing difficulty and avoid repetition
const targetLength = Math.min(3 + Math.floor(level / 3), 10);
let wordList = categories[catIndex].words.filter(w => w.length >= targetLength - 1 && w.length <= targetLength + 2);
if (wordList.length === 0) {
  wordList = categories[catIndex].words;
}

// Track used words per category
if (!window.usedWordsPerCategory) window.usedWordsPerCategory = {};
if (!window.usedWordsPerCategory[catIndex]) window.usedWordsPerCategory[catIndex] = [];

// Filter out already used words in this category
let availableWords = categories[catIndex].words.filter(w => !window.usedWordsPerCategory[catIndex].includes(w));

// If all words in category are used, reset for this category
if (availableWords.length === 0) {
  console.log('All words used in category, resetting');
  window.usedWordsPerCategory[catIndex] = [];
  availableWords = categories[catIndex].words;
}

// Select random word from available options
currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
window.usedWordsPerCategory[catIndex].push(currentWord);

console.log('Selected word:', currentWord, 'Used words count in category:', window.usedWordsPerCategory[catIndex].length);

    // Scramble letters
    scrambledWord = shuffle(currentWord.split(''));
    while (scrambledWord.join('').toLowerCase() === currentWord.toLowerCase()) {
      scrambledWord = shuffle(scrambledWord);
    }

    // Update interface with difficulty indicator
    let difficultyText = '';
    if (level <= 5) difficultyText = '🟢 Easy';
    else if (level <= 15) difficultyText = '🟡 Medium';
    else if (level <= 30) difficultyText = '🟠 Hard';
    else difficultyText = '🔴 Expert';

    levelLabel.textContent = `Level: ${level} (${difficultyText})`;
    categoryLabel.textContent = `Category: ${currentCategory}`;
    wordLengthLabel.textContent = `Word Length: ${currentWord.length}`;
    updateXpBar();
    renderScrambledWord();
    resetAnswer();
  }

// Reset game to initial state
function resetGame() {
  currentLevel = 1;
  xp = 0;
  xpToNextLevel = 100;
  clearInterval(timer);
  timerLabel.textContent = '--';
  window.usedWordsPerCategory = {};
  updateXpBar();
  resetAnswer();
  isPaused = false;
}

  // Start game function
function startGame() {
  if (isPlaying) return;
  console.log('Starting game...');
  isPlaying = true;
  resetGame(); // Reset to level 1 and clear state
  loadLevel(currentLevel);
  startTimer(getTimeLimitForLevel(currentLevel));
  console.log('Game started, isPlaying:', isPlaying);
  console.log('Current word:', currentWord);
  console.log('Scrambled word:', scrambledWord);
}

  // Exit game function
function exitGame() {
  showExitOverlay();
}

// Show exit confirmation overlay
function showExitOverlay() {
  const overlay = document.getElementById('exit-overlay');
  const exitLevel = document.getElementById('exit-level');
  const exitXp = document.getElementById('exit-xp');
  
  exitLevel.textContent = currentLevel;
  exitXp.textContent = xp;
  
  overlay.classList.remove('hidden');
}

// Hide exit overlay
function hideExitOverlay() {
  const overlay = document.getElementById('exit-overlay');
  overlay.classList.add('hidden');
}

// Confirm exit game
function confirmExit() {
  hideExitOverlay();
  isPlaying = false;
  clearInterval(timer);
  isPaused = false;
  timerLabel.textContent = '--';
  resetAnswer();
  scrambleContainer.innerHTML = '';
  xpBar.style.width = '0%';
  
  // Reset game state
  currentLevel = 1;
  xp = 0;
  xpToNextLevel = 100;
  window.globalUsedWords = [];
  
  // Update UI
  levelLabel.textContent = `Level: --`;
  categoryLabel.textContent = `Category: --`;
  wordLengthLabel.textContent = `Word Length: --`;
  
  alert('Thanks for playing SCRAMBLEX! Refresh the page to play again.');
}

// Handle physical keyboard input
function handleKeyDown(e) {
  if (!isPlaying) return;
  
  console.log('Physical key pressed:', e.key); // Debug log

  const key = e.key.toLowerCase();
  if (key === 'backspace') {
  e.preventDefault();
  // Remove last letter from answer
  if (answer.length > 0 && !isSubmitting) {
    const answerLetters = answerContainer.querySelectorAll('.answer-letter');
    const lastLetter = answerLetters[answerLetters.length - 1];
    
    if (lastLetter) {
      // Create upward animation effect
      createLetterMoveAnimation(lastLetter, 'up');
    }
    
    // Remove letter immediately
    answer.pop();
    updateAnswerDisplay();
    updateScrambleVisibility();
    sounds.backspace.currentTime = 0;
    sounds.backspace.play().catch(() => {});
  }
}
  
  else if (key === 'enter') {
    e.preventDefault();
    e.stopPropagation();
    // COMPLETE ENTER KEY PROTECTION
    if (isSubmitting) {
      console.log('Enter blocked - already submitting');
      return; // Block all Enter presses during animations
    }
    if (answer.length === 0) {
      console.log('Enter blocked - no answer');
      return; // Block Enter with empty answer
    }
    // Only allow ONE submission
    console.log('Enter allowed - submitting answer');
    checkAnswerComplete(true);
  } else if (key === ' ' || key === 'space') {
    e.preventDefault();
    // Space key now only does reshuffle when game is actively playing
    if (isPlaying && !isPaused) {
      // Reshuffle the scrambled word
      scrambledWord = shuffle([...scrambledWord]);
      // Make sure it's different from original word
      while (scrambledWord.join('').toLowerCase() === currentWord.toLowerCase()) {
        scrambledWord = shuffle(scrambledWord);
      }
      // Create shuffle particle effect
      createShuffleParticles();
      // Re-render with animation
      renderScrambledWordWithAnimation();
      // Play shuffle sound
      sounds.shuffle.currentTime = 0;
      sounds.shuffle.play().catch(() => {});
  }
    } else if (/^[a-z]$/.test(key)) {
    e.preventDefault();
    if (isSubmitting) return; // Don't add letters during submission
    
    // Check if letter exists in scrambled word and isn't already used
    const scrambledLetters = [...scrambledWord];
    const usedLetters = [...answer];
    
    // Count available letters
    const availableCount = scrambledLetters.filter(l => l.toLowerCase() === key.toLowerCase()).length;
    const usedCount = usedLetters.filter(l => l.toLowerCase() === key.toLowerCase()).length;
    
    if (availableCount > usedCount && answer.length < currentWord.length) {
      // Find the corresponding tile for animation
      const tiles = scrambleContainer.querySelectorAll('.letter-tile');
      const matchingTile = Array.from(tiles).find(tile => 
        tile.textContent.toLowerCase() === key.toLowerCase() && 
        !tile.classList.contains('used')
      );
      
      if (matchingTile) {
        createLetterMoveAnimation(matchingTile, 'down');
      }
      
      // Add letter immediately
      answer.push(key.toLowerCase());
      updateAnswerDisplay();
      updateScrambleVisibility();
      sounds.letterClick.currentTime = 0;
      sounds.letterClick.play().catch(() => {});
    }
  }
}

  // Play letter click sound safely
  function playLetterSound() {
    sounds.letterClick.currentTime = 0;
sounds.letterClick.play().catch(() => {});
  }


  // Fade effect between loading screen and game screen
function fadeOutLoadingScreen() {
  return new Promise((resolve) => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      gameContainer.classList.remove('hidden');
      gameContainer.style.transition = 'opacity 1s ease';
      gameContainer.style.opacity = '1';
      resolve();
    }, 1000);
  });
}

  // Animate the loading bar filler
  function animateLoadingBar() {
    return new Promise((resolve) => {
      let width = 0;
      const interval = setInterval(() => {
        width += Math.random() * 6;
        if (width >= 100) {
          width = 100;
          clearInterval(interval);
          loadingBar.style.width = '100%';
          resolve();
          return;
        }
        loadingBar.style.width = width + '%';
      }, 80);
    });
  }

  // Shake scrambled container on time up or incorrect
  function shakeScrambledWord() {
    scrambleContainer.classList.add('shake');
    setTimeout(() => {
      scrambleContainer.classList.remove('shake');
    }, 500);
  }

  // Initialize game
  async function init() {
    // Hide game over overlay initially
    const gameOverOverlay = document.getElementById('game-over-overlay');
    if (gameOverOverlay) {
      gameOverOverlay.classList.add('hidden');
    }
    


    // Animate loading bar then fade screens
    await animateLoadingBar();

    await fadeOutLoadingScreen();

    // Play bgm (try/catch for autoplay restrictions)
    try {
      await sounds.bgm.play();
    } catch {
      // User gesture needed
    }

    // Don't load level initially - wait for start button
    levelLabel.textContent = `Level: --`;
    categoryLabel.textContent = `Category: --`;
    wordLengthLabel.textContent = `Word Length: --`;
    scrambleContainer.innerHTML = '';
    answerContainer.innerHTML = '';
    timerLabel.textContent = '--';
  }

  // Add pause button functionality
function pauseButtonClick() {
  togglePause();
}

// Make pauseButtonClick available globally
window.pauseButtonClick = pauseButtonClick;

 startBtn.addEventListener('click', () => {
  if (!isPlaying) startGame();
});

exitBtn.addEventListener('click', () => {
  exitGame();
});

// Add pause button event listener
const pauseBtn = document.getElementById('pause-btn');
if (pauseBtn) {
  pauseBtn.addEventListener('click', togglePause);
}

  document.addEventListener('keydown', handleKeyDown);

  // Add play again button event listener
  document.addEventListener('DOMContentLoaded', () => {
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', restartGame);
    }
  });

  // Prevent double letter select when clicking scramble letters
  scrambleContainer.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Add click handler for answer container to remove letters
answerContainer.addEventListener('click', (e) => {
  if (!isPlaying || isSubmitting) return;
  if (e.target.classList.contains('answer-letter')) {
    const letterText = e.target.textContent.toLowerCase();
    const letterIndex = answer.findIndex(l => l === letterText);
    if (letterIndex !== -1) {
      // Create upward animation effect
      createLetterMoveAnimation(e.target, 'up');
      
      // Remove letter immediately
      answer.splice(letterIndex, 1);
      updateAnswerDisplay();
      updateScrambleVisibility();
      sounds.backspace.currentTime = 0;
      sounds.backspace.play().catch(() => {});
    }
  }
});

 // Add event listeners after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      console.log('Play again clicked!'); // Debug log
      restartGame();
    });
  }
  
  // Add resume button event listener
  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', resumeGame);
  }
  
  // Add exit overlay event listeners
  const confirmExitBtn = document.getElementById('confirm-exit-btn');
  const cancelExitBtn = document.getElementById('cancel-exit-btn');
  
  if (confirmExitBtn) {
    confirmExitBtn.addEventListener('click', confirmExit);
  }
  
  if (cancelExitBtn) {
    cancelExitBtn.addEventListener('click', hideExitOverlay);
  }
  
  const victoryPlayAgainBtn = document.getElementById('victory-play-again-btn');
  if (victoryPlayAgainBtn) {
    victoryPlayAgainBtn.addEventListener('click', () => {
      hideVictoryOverlay();
      restartGame();
    });
  }
});

  // Initialize game
  init();
})();

// Mouse Trail Effect (Pure visual enhancement)
document.addEventListener('mousemove', function(e) {
  const trail = document.getElementById('mouse-trail');
  const particle = document.createElement('div');
  particle.className = 'trail-particle';
  particle.style.left = e.clientX + 'px';
  particle.style.top = e.clientY + 'px';
  trail.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 1000);
});