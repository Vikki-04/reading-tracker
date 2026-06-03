export const readBooks = {
  "Previous Years": [
    "Catching Fire", "Mockingjay", "Beasts and Beauty", "Instructions for Dancing"
  ],
  "2023": [
    "Luv Shuv in New York", "The Right Move", "Her Perfect", "Counting Down with You",
    "Once Upon a Kprom", "As Old as Time"
  ],
  "2024": [
    "A Whole New World", "Once Upon a Dream", "The Cruel Prince", "The Wicked King",
    "The Queen of Nothing", "How the King of Elfhame Learned to Hate Stories", "Behind the Net",
    "The Fake Out", "Heartstopper 1", "Heartstopper 2", "Heartstopper 3", "Heartstopper 4",
    "Heartstopper 5", "Nick and Charlie", "YOLO IJ Hidee", "WOLO IJ Hidee",
    "Egotistical Puckboy", "Irresponsible Puckboy", "The Class Prince",
    "Beauty and the Beast Lost in the Book", "Off the Ice Collide"
  ],
  "2025": [
    "Boyfriend Material", "Husband Material", "An Enchantment of Ravens", "You've Reached Sam",
    "The Trade Deadline", "The Nightmare Before Kissmas", "10 Things That Never Happened",
    "The Hunger Games", "Solitaire"
  ],
  "2026": [
    "You've Found Oliver", "I Hope This Doesn't Find You", "Two Can Play"
  ]
};

const TBR_TITLES = [
  "Reflection", "Part of Your World", "Mirror, Mirror", "Conceal, Don't Feel",
  "Straight on Till Morning", "So This is Love", "Unbirthday", "Go the Distance",
  "What Once Was Mine", "Almost There", "When You Wish Upon A Star", "Set in Stone",
  "Suddenly Super", "Fate Be Changed", "Princess of Thieves", "Sally's Lament",
  "Twisted Tale Anthology","Cruel Truth", "Be Prepared", "How Far I'll Go","Adventure Is Out There!", "Geekerella", "The Princess and the Fangirl", "Bookish and the Beast",
  "Morrighan", "The Kiss of Deception", "The Heart of Betrayal", "The Beauty of Darkness",
  "Sorcery of Thorns", "A Winter's Favor","Mysteries of Thorn Manor", "Aru Shah and the End of Time",
  "Aru Shah and the Song of Death", "Aru Shah and the Tree of Wishes",
  "Aru Shah and the City of Gold", "Aru Shah and the Nectar of Immortality",
  "A Court of Thorns and Roses", "A Court of Mist and Fury", "A Court of Wings and Ruin",
  "A Court of Frost and Starlight", "A Court of Silver Flames", "Renegades", "Archenemies",
  "Supernova", "The Queen", "The Prince","The Selection", "The Elite", "The Guard", "The Favorite", "The One", "The Epilogue", "The Maid", "The Heir", "The Crown",
  "Shatter Me", "Destroy Me", "Unravel Me", "Fracture Me","Ignite Me", "Restore Me", "Shadow Me","Defy Me", "Reveal Me", "Imagine Me", "Believe Me",
  "Frostblood", "Fireblood", "Nightblood", "The Glass Spare", "The Cursed Sea",
  "Wandfasted", "The Black Witch", "Light Mage", "The Iron Flower", "The Shadow Wand",
  "The Demon Tide", "The Dryad Storm", "The Rebel Mages", "The Young Elites", "The Rose Society",
  "The Midnight Star", "And I Darken", "Now I Rise", "Bright We Burn", "The Diabolic",
  "The Empress", "The Nemesis", "The Thousandth Floor", "The Dazzling Heights", "The Towering Sky",
  "Clockwork Angel", "Clockwork Prince", "Clockwork Princess", "City of Bones", "City of Ashes",
  "City of Glass", "City of Fallen Angels", "City of Lost Souls", "City of Heavenly Fire",
  "Six of Crows", "Crooked Kingdom", "A Darker Shore: Letters from Ketterdam","Powerless", "Powerful", "Reckless","Fearless", "Fearful",
  "Icicles Like Kindling","Snow Like Ashes", "Ice Like Fire", "Flames Like Vines", "Frost Like Night", "Decay Like Gold", "The Last Magician",
  "The Devil's Thief", "The Serpent's Curse", "The Shattered City", "Paper Princess",
  "Broken Prince", "Twisted Palace", "Tarnished Crown", "Fallen Heir", "Cracked Kingdom",
  "Bridge of Snow", "The Winner's Curse", "The Winner's Crime", "The Winner's Kiss",
  "Chain of Gold", "Chain of Iron", "Chain of Thorns", "The Assassin and the Pirate Lord",
  "The Assassin and the Healer", "The Assassin and the Desert", "The Assassin and the Underworld",
  "The Assassin and the Empire", "Throne of Glass", "Crown of Midnight", "Heir of Fire",
  "Queen of Shadows", "Empire of Storms", "Tower of Dawn", "Kingdom of Ash",
  "The Crown's Game", "The Crown's Fate", "A Curse So Dark and Lonely",
  "A Heart So Fierce and Broken", "A Vow So Bold and Deadly", "House of Earth and Blood",
  "House of Sky and Breath", "House of Flame and Shadow", "Bone Crier's Moon", "Bone Crier's Dawn",
  "A Shadow Bright and Burning", "A Poison Dark and Drowning", "A Sorrow Fierce and Falling",
  "Caraval", "Legendary", "Finale", "Spectacular", "Crimson Dagger: Parts I & II", "Falling Kingdoms", "Rebel Spring",
  "Gathering Darkness", "Frozen Tides", "Crystal Storm", "Immortal Reign", "Obsidian Blade", "The Raven Boys",
  "The Dream Thieves", "Blue Lily, Lily Blue", "The Raven King", "Lady Midnight",
  "Lord of Shadows", "Queen of Air and Darkness", "Ace of Shades", "King of Fools",
  "Queen of Volts", "Infinity Son", "Infinity Reaper", "Infinity Kings", "The Kinder Poison",
  "The Cruelest Mercy", "The Sweetest Betrayal", "The Shadows Between Us", "The Darkness Within Us",
  "Once Upon a Broken Heart", "The Ballad of Never After", "A Curse for True Love","The Mirror of Infinite Endings",
  "The Sweetest Oblivion",
  "The Maddest Obsession", "The Darkest Temptation", "The Purest Addiction",
  "Twisted Love", "Twisted Games", "Twisted Hate", "Twisted Lies", "The Wrong Mr. Right",
  "That Kind of Guy", "In Your Dreams, Holden Rhodes", "Finn Rhodes Forever",
  "Alive at Night", "Awake at Dawn", "Attached at Heart",  "The First to Die at the End", "They Both Die at the End", "The Survivor Wants to Die at the End",
 "The Same Backward as Forward","The Inheritance Games", "The Hawthorne Legacy",
  "The Final Gambit", "The Brothers Hawthorne", "The Grandest Game","Glorious Rivals", "The Gilded Blade", "Games Untold", 
  "Lightlark", "Nightbane",
  "Skyshade","Crowntide", "Oro", "Grim", "House of Marionne", "Shadows of Perl", "Fortress of Ambrose", "Belladonna", "Foxglove", "Wisteria","Holly",
  "Assistant to the Villain", "Apprentice to the Villain", "Adversary to the Villain", "The Cheat Sheet", "The Rule Book",
  "To Love Jason Thorn", "To Hate Adam Connor", "The Love Hypothesis", "Love Theoretically",
  "Love on the Brain", "Check and Mate", "Scythe", "Thunderhead", "The Toll", "Gleanings",
  "The Ballad of Songbirds and Snakes", "Sunrise on the Reaping",
  "The Song of Achilles", "Heartless", "King of Wrath", "King of Pride", "King of Greed",
  "King of Sloth", "King of Envy", "King of Gluttony", "King of Lust",
  "God of Malice", "God of Pain", "God of Wrath", "God of Ruin", "God of Fury", "God of War",
  "Binding 13", "Keeping 13", "Saving 6", "Redeeming 6", "Taming 7","Releasing 10",
  "Cruel King", "Deviant King", "Steel Princess", "Twisted Kingdom", "Black Knight",
  "Vicious Prince", "Ruthless Empire", "Royal Elite Epilogue",
  "Vicious", "Ruckus", "Scandalous", "Bane", "Today Tonight Tomorrow", "Past Present Future",
  "A Betrayal of Storms", "A Kingdom of Lies", "A Deception of Courts",
  "Wildcat", "Wild About You", "Wild Ever After", "In Your Wildest Dreams", "Forever Wild",
  "My Roommate is a Vampire", "My Vampire Plus-One", "Never Have I Ever", "Spin the Bottle",
  "Would You Rather", "Truth or Dare", "Good Game", "Forbidden Game", "Fake Game",
  "The Games Gods Play", "The Things Gods Break", "The Wrath Gods Reap", "Wings of Starlight", 
  "Dance of Thieves", "The Personal Librarian", "A Thousand Heartbeats", "Tall Royal Hater", 
  "Nightshade", "Daybreak", "I am Not Jessica Chen", "A Hue of Blue", "The Invisible Life of Addie LaRue", 
  "The Paradise Problem", "The Things We Leave Unfinished"
];

const TBR_SERIES_BY_TITLE = {
  "A Whole New World": "Twisted Tales",
  "Once Upon a Dream": "Twisted Tales",
  "As Old as Time": "Twisted Tales",
  "Reflection": "Twisted Tales",
  "Part of Your World": "Twisted Tales",
  "Mirror, Mirror": "Twisted Tales",
  "Conceal, Don't Feel": "Twisted Tales",
  "Straight on Till Morning": "Twisted Tales",
  "So This is Love": "Twisted Tales",
  "Unbirthday": "Twisted Tales",
  "Go the Distance": "Twisted Tales",
  "What Once Was Mine": "Twisted Tales",
  "Almost There": "Twisted Tales",
  "When You Wish Upon A Star": "Twisted Tales",
  "Set in Stone": "Twisted Tales",
  "Suddenly Super": "Twisted Tales",
  "Fate Be Changed": "Twisted Tales",
  "Princess of Thieves": "Twisted Tales",
  "Sally's Lament": "Twisted Tales",
  "Twisted Tale Anthology": "Twisted Tales",
  "Cruel Truth": "Twisted Tales",
  "Be Prepared": "Twisted Tales",
  "How Far I'll Go": "Twisted Tales",
  "Adventure is Out There!": "Twisted Tales",

  "Geekerella": "Once Upon a Con",
  "The Princess and the Fangirl": "Once Upon a Con",
  "Bookish and the beast": "Once Upon a Con",

  "The Cheat Sheet": "Sara Adams",
  "The Rule Book": "Sara Adams",

  "Morrighan": "The Remnant Chronicles",
  "The Kiss of Deception": "The Remnant Chronicles",
  "The Heart of Betrayal": "The Remnant Chronicles",
  "The Beauty of Darkness": "The Remnant Chronicles",

  "To Love Jason Thorn": "Ella Maise",
  "To Hate Adam Connor": "Ella Maise",

  "Sorcery of thorns": "Sorcery of Thorns",
  "A Winter's Favor": "Sorcery of Thorns",
  "Mysteries of Thorn Manor": "Sorcery of Thorns",


  "Aru Shah and the End of Time": "Aru Shah",
  "Aru Shah and the Song of Death": "Aru Shah",
  "Aru Shah and the Tree of Wishes": "Aru Shah",
  "Aru Shah and the City of Gold": "Aru Shah",
  "Aru Shah and the Nectar of Immortality": "Aru Shah",

  "A Court of Thorns and Roses": "A Court of Thorns and Roses",
  "A Court of Mist and Fury": "A Court of Thorns and Roses",
  "A court of Wings and ruin": "A Court of Thorns and Roses",
  "A Court of Frost and Starlight": "A Court of Thorns and Roses",
  "A Court of Silver Flames": "A Court of Thorns and Roses",

  "Renegades": "Renegades",
  "Archenemies": "Renegades",
  "Supernova": "Renegades",

  "The Queen": "The Selection",
  "The Prince": "The Selection",
  "The Selection": "The Selection",
  "The Elite": "The Selection",
  "The Guard": "The Selection",
  "The Favorite": "The Selection",
  "The One": "The Selection",
  "The Epilogue": "The Selection",
  "The Maid": "The Selection",
  "The Heir": "The Selection",
  "The Crown": "The Selection",

  "Shatter me": "Shatter Me",
  "Destroy Me": "Shatter Me",
  "Unravel Me": "Shatter Me",
  "Fracture Me": "Shatter Me",
  "Ignite Me": "Shatter Me",
  "Restore Me": "Shatter Me",
  "Shadow Me": "Shatter Me",
  "Defy Me": "Shatter Me",
  "Reveal Me": "Shatter Me",
  "Imagine Me": "Shatter Me",
  "Believe Me": "Shatter Me",

  "Cruel King": "Royal Elite",
  "Deviant King": "Royal Elite",
  "Steel Princess": "Royal Elite",
  "Twisted Kingdom": "Royal Elite",
  "Black Knight": "Royal Elite",
  "Vicious Prince": "Royal Elite",
  "Ruthless Empire": "Royal Elite",
  "Royal Elite Epilogue": "Royal Elite",

  "Frostblood": "Frostblood",
  "Fireblood": "Frostblood",
  "Nightblood": "Frostblood",

  "Wildcat": "Wildcat",
  "Wild About you": "Wildcat",
  "Wild Ever After": "Wildcat",
  "In Your Wildest Dreams": "Wildcat",
  "Forever Wild": "Wildcat",

  "The Glass Spare": "The Glass Spare",
  "The Cursed Sea": "The Glass Spare",

  "Wandfasted": "The Black Witch Chronicles",
  "The Black Witch": "The Black Witch Chronicles",
  "Light Mage": "The Black Witch Chronicles",
  "The Iron Flower": "The Black Witch Chronicles",
  "The Shadow Wand": "The Black Witch Chronicles",
  "The Demon Tide": "The Black Witch Chronicles",
  "The Dryad Storm": "The Black Witch Chronicles",
  "The Rebel Mages": "The Black Witch Chronicles",

  "The young elites": "The Young Elites",
  "The Rose Society": "The Young Elites",
  "The Midnight Star": "The Young Elites",

  "Chain of Gold": "The Last Hours",
  "Chain of Iron": "The Last Hours",
  "Chain of Thorns": "The Last Hours",

  "And i darken": "The Conqueror's Saga",
  "Now I Rise": "The Conqueror's Saga",
  "Bright We Burn": "The Conqueror's Saga",

  "The Diabolic": "The Diabolic",
  "The Empress": "The Diabolic",
  "The Nemesis": "The Diabolic",

  "The thousandth floor": "The Thousandth Floor",
  "The Dazzling Heights": "The Thousandth Floor",
  "The Towering Sky": "The Thousandth Floor",

  "Clockwork Angel": "The Infernal Devices",
  "Clockwork Prince": "The Infernal Devices",
  "Clockwork Princess": "The Infernal Devices",

  "City Of Bones": "The Mortal Instruments",
  "City Of Ashes": "The Mortal Instruments",
  "City Of Glass": "The Mortal Instruments",
  "City Of Fallen Angels": "The Mortal Instruments",
  "City Of Lost Souls": "The Mortal Instruments",
  "City Of Heavenly Fire": "The Mortal Instruments",

  "Six of crows": "Six of Crows",
  "Crooked Kingdom": "Six of Crows",
  "A Darker Shore: Letters from Ketterdam": "Six of Crows",

  "Good game": "The System",
  "Forbidden game": "The System",
  "Fake game": "The System",

  "Powerless": "Powerless",
  "Powerful": "Powerless",
  "Reckless": "Powerless",
  "Fearless": "Powerless",
  "Fearful": "Powerless",

  "A betrayal of storms": "Realm of Fey",
  "A kingdom of lies": "Realm of Fey",
  "A deception of courts": "Realm of Fey",

  "Icicles Like Kindling": "Snow Like Ashes",
  "Snow Like Ashes": "Snow Like Ashes",
  "Ice Like Fire": "Snow Like Ashes",
  "Flames Like Vines": "Snow Like Ashes",
  "Frost Like Night": "Snow Like Ashes",
  "Decay Like Gold": "Snow Like Ashes",

  "Today tonight tomorrow": "Today Tonight Tomorrow",
  "Past present future": "Today Tonight Tomorrow",

  "The last magician": "The Last Magician",
  "The Devil's Thief": "The Last Magician",
  "The Serpent's Curse": "The Last Magician",
  "The Shattered City": "The Last Magician",

  "Paper Princess": "The Royals",
  "Broken Prince": "The Royals",
  "Twisted Palace": "The Royals",
  "Tarnished Crown": "The Royals",
  "Fallen Heir": "The Royals",
  "Cracked Kingdom": "The Royals",

  "Bridge of Snow": "The Winner's Trilogy",
  "The Winner's Curse": "The Winner's Trilogy",
  "The Winner's Crime": "The Winner's Trilogy",
  "The Winner's Kiss": "The Winner's Trilogy",

  "The Crown's Game": "The Crown's Game",
  "The Crown's Fate": "The Crown's Game",

  "A Curse So Dark and Lonely": "Cursebreaker",
  "A Heart So Fierce and broken": "Cursebreaker",
  "A Vow So Bold and Deadly": "Cursebreaker",

  "House of Earth and Blood": "Crescent City",
  "House of Sky and Breath": "Crescent City",
  "House of Flame and Shadow": "Crescent City",

  "Bone Crier's Moon": "Bone Grace",
  "Bone Crier's Dawn": "Bone Grace",

  "A Shadow Bright and Burning": "Kingdom on Fire",
  "A Poison Dark and Drowning": "Kingdom on Fire",
  "A Sorrow Fierce and Falling": "Kingdom on Fire",

  "Caraval": "Caraval",
  "Legendary": "Caraval",
  "Finale": "Caraval",
  "Spectacular": "Caraval",
  
  "Crimson Dagger: Parts I & II":"Falling Kingdoms",
  "Falling Kingdoms": "Falling Kingdoms",
  "Rebel Spring": "Falling Kingdoms",
  "Gathering Darkness": "Falling Kingdoms",
  "Frozen Tides": "Falling Kingdoms",
  "Crystal Storm": "Falling Kingdoms",
  "Immortal Reign": "Falling Kingdoms",
  "Obsidian Blade": "Falling Kingdoms",

  "The Raven Boys": "The Raven Cycle",
  "The Dream Thieves": "The Raven Cycle",
  "Blue Lily, Lily Blue": "The Raven Cycle",
  "The Raven King": "The Raven Cycle",

  "Lady Midnight": "The Dark Artifices",
  "Lord of Shadows": "The Dark Artifices",
  "Queen of Air and Darkness": "The Dark Artifices",

  "Ace of Shades": "The Shadow Game",
  "King of Fools": "The Shadow Game",
  "Queen of Volts": "The Shadow Game",

  "Infinity Son": "Infinity Cycle",
  "Infinity Reaper": "Infinity Cycle",
  "Infinity Kings": "Infinity Cycle",

  "The Kinder Poison": "The Kinder Poison",
  "The Cruelest Mercy": "The Kinder Poison",
  "The Sweetest Betrayal": "The Kinder Poison",

  "The shadows between us": "The Stathos Sisters",
  "The Darkness Within Us": "The Stathos Sisters",

  "Once Upon a Broken Heart": "Once Upon a Broken Heart",
  "The Ballad of Never After": "Once Upon a Broken Heart",
  "A Curse for True Love": "Once Upon a Broken Heart",
  "The Mirror of Infinite Endings": "Once Upon a Broken Heart",

  "The Sweetest Oblivion": "Made",
  "The Maddest Obsession": "Made",
  "The Darkest Temptation": "Made",
  "The Purest Addiction": "Made",

  "Twisted Love": "Twisted (Ana Huang)",
  "Twisted Games": "Twisted (Ana Huang)",
  "Twisted Hate": "Twisted (Ana Huang)",
  "Twisted Lies": "Twisted (Ana Huang)",

  "The Wrong Mr. Right": "Finn Rhodes",
  "That Kind of Guy": "Finn Rhodes",
  "In your dreams, Holden Rhodes": "Finn Rhodes",
  "Finn rhodes forever": "Finn Rhodes",

  "Alive At Night": "Alive at Night",
  "Awake at Dawn": "Alive at Night",
  "Attached at Heart": "Alive at Night",

  "The first to die at the end": "They Both Die at the End",
  "They both die at the end": "They Both Die at the End",
  "The Survivor Wants to Die at the End": "They Both Die at the End",
  

  "The Same Backward as Forward": "The Inheritance Games",
  "The Inheritance Games": "The Inheritance Games",
  "The Hawthorne Legacy": "The Inheritance Games",
  "The Final Gambit": "The Inheritance Games",
  "The Brothers Hawthorne": "The Inheritance Games",
  "The Grandest Game": "The Inheritance Games",
  "Glorious Rivals": "The Inheritance Games",
  "The Gilded Blade": "The Inheritance Games",
  "Games Untold": "The Inheritance Games",

  "The Grandest Game": "The Grandest Game",
  "Glorious Rivals": "The Grandest Game",
  "The Gilded Blade": "The Grandest Game",

  "Lightlark": "Lightlark",
  "Nightbane": "Lightlark",
  "Skyshade": "Lightlark",
  "Crowntide": "Lightlark",
  "Oro": "Lightlark",
  "Grim": "Lightlark",

  "House of Marionne": "House of Marionne",
  "Shadows of Perl": "House of Marionne",
  "Fortress of Ambrose": "House of Marionne",

  "Belladonna": "Belladonna",
  "Foxglove": "Belladonna",
  "Wisteria": "Belladonna",
  "Holly": "Belladonna",

  "Assistant to the villain": "Assistant to the Villain",
  "Apprentice to the villain": "Assistant to the Villain",
  "Adversary to the villain": "Assistant to the Villain",

  "The love hypothesis": "Ali Hazelwood",
  "Love theoretically": "Ali Hazelwood",
  "Love on the brain": "Ali Hazelwood",
  "Check and mate": "Ali Hazelwood",
  "Two Can Play": "Ali Hazelwood",

  "King of wrath": "Kings of Sin",
  "King of pride": "Kings of Sin",
  "King of greed": "Kings of Sin",
  "King of sloth": "Kings of Sin",
  "King of envy": "Kings of Sin",
  "King of gluttony": "Kings of Sin",
  "King of lust": "Kings of Sin",

  "Scythe": "Arc of a Scythe",
  "Thunderhead": "Arc of a Scythe",
  "The Toll": "Arc of a Scythe",
  "Gleanings": "Arc of a Scythe",

  
  "The Ballad of Songbirds and Snakes": "The Hunger Games",
  "Sunrise on the Reaping": "The Hunger Games",
  "The Hunger Games": "The Hunger Games",
  "Catching Fire": "The Hunger Games",
  "Mockingjay": "The Hunger Games",

  "Never have I ever": "Never Have I Ever",
  "Spin the bottle": "Never Have I Ever",
  "Would you rather": "Never Have I Ever",
  "Truth or dare": "Never Have I Ever",

  "My Roommate is a Vampire": "My Roommate is a Vampire",
  "My Vampire Plus-One": "My Roommate is a Vampire",

  "The Assassin and the Pirate Lord": "Throne of Glass",
  "The Assassin and the Healer": "Throne of Glass",
  "The Assassin and the Desert": "Throne of Glass",
  "The Assassin and the Underworld": "Throne of Glass",
  "The Assassin and the Empire": "Throne of Glass",

  "Throne of Glass": "Throne of Glass",
  "Crown of Midnight": "Throne of Glass",
  "Heir of Fire": "Throne of Glass",
  "Queen of Shadows": "Throne of Glass",
  "Empire of Storms": "Throne of Glass",
  "Tower of Dawn": "Throne of Glass",
  "Kingdom of Ash": "Throne of Glass",

  "Defy LJ Shen": "Sinners of Saint",
  "Vicious": "Sinners of Saint",
  "Ruckus": "Sinners of Saint",
  "Scandalous": "Sinners of Saint",
  "Bane": "Sinners of Saint",

  "God of malice": "Legacy of Gods",
  "God of pain": "Legacy of Gods",
  "God of wrath": "Legacy of Gods",
  "God of ruin": "Legacy of Gods",
  "God of fury": "Legacy of Gods",
  "God of war": "Legacy of Gods",

  "Binding 13": "Boys of Tommen",
  "Keeping 13": "Boys of Tommen",
  "Saving 6": "Boys of Tommen",
  "Redeeming 6": "Boys of Tommen",
  "Taming 7": "Boys of Tommen",
  "Releasing 10": "Boys of Tommen",

  "The Games Gods Play": "The Crucible",
  "The Things Gods Break": "The Crucible",
  "The Wrath Gods Reap": "The Crucible",

  "Nightshade": "Sorrowsong University",
  "Daybreak": "Sorrowsong University",

  "Wings of Starlight": null,
  "Dance of Thieves": null,
  "The song of Achilles": null,
  "Heartless": null,
  "The Personal Librarian": null,
  "A Thousand Heartbeats": null,
  "Tall Royal Hater": null,
  "I am Not Jessica Chen": null,
  "A Hue of Blue": null,
  "The Invisible Life of Addie LaRue": null,
  "The Paradise Problem": null,
  "The Things We Leave Unfinished": null,


};

function normalizeTitleKey(title) {
  return String(title ?? '').trim().toLowerCase()
}

const TBR_SERIES_BY_NORMALIZED_TITLE = Object.fromEntries(
  Object.entries(TBR_SERIES_BY_TITLE).map(([title, series]) => [normalizeTitleKey(title), series ?? null]),
)

/** All known title → series mappings (includes read-log titles not on the TBR list). */
export const seriesByNormalizedTitle = TBR_SERIES_BY_NORMALIZED_TITLE

/** Series name → catalog titles (full series definitions, not just TBR queue). */
export function buildSeriesCatalog() {
  const map = new Map()
  for (const [title, series] of Object.entries(TBR_SERIES_BY_TITLE)) {
    if (!series) continue
    if (!map.has(series)) map.set(series, [])
    map.get(series).push(title)
  }
  return map
}

export const tbrBooks = TBR_TITLES.map((title) => ({
  title,
  series: TBR_SERIES_BY_NORMALIZED_TITLE[normalizeTitleKey(title)] ?? null,
}));
