const categoriesAndTags = [
  {
    category: "Pubs & Bars",
    tags: [
      "🍺 Beer", 
      "🍸 Cocktails", 
      "🍷 Wine", 
      "🎶 Live Music", 
      "🌙 Nightclub", 
      "🎤 Karaoke", 
      "🍻 Drinks", 
      "🥳 Party", 
      "🏖️ Bar by the Beach", 
      "🎧 DJ Music"
    ]
  },
  {
    category: "Sports",
    tags: [
      "⚽ Football", 
      "🥊 Muay Thai", 
      "🏀 Basketball", 
      "🏸 Badminton", 
      "🏃‍♂️ Running", 
      "🏊 Swimming", 
      "⛳ Golf", 
      "🚴‍♂️ Cycling", 
      "🎾 Tennis", 
      "🏎️ Motorsports"
    ]
  },
  {
    category: "Activities",
    tags: [
      "🏞️ Sightseeing", 
      "🚤 Island Hopping", 
      "🤿 Scuba Diving", 
      "🐘 Elephant Safari", 
      "🍳 Cooking Classes", 
      "🛍️ Shopping", 
      "🏯 Cultural Tours", 
      "🥾 Hiking", 
      "🌲 Zip Line", 
      "💆‍♂️ Spa & Wellness"
    ]
  },
  {
    category: "Restaurants",
    tags: [
      "🍛 Thai Food", 
      "🦀 Seafood", 
      "🍢 Street Food", 
      "🍽️ Buffet", 
      "🥗 Vegetarian", 
      "🍖 BBQ", 
      "🍴 Fine Dining", 
      "🍜 Noodles", 
      "🍣 Sushi", 
      "🍲 Hot Pot"
    ]
  },
  {
    category: "Cafe",
    tags: [
      "☕ Coffee", 
      "🍵 Tea", 
      "🍩 Pastries", 
      "🥤 Smoothies", 
      "🥑 Vegan", 
      "🍳 Brunch", 
      "🛋️ Cozy Atmosphere", 
      "📶 Wifi", 
      "🎂 Cake", 
      "🍪 Local Snacks"
    ]
  }
];

export default function getTagsByCategory(categoryName : string) {
  const category = categoriesAndTags.find(cat => cat.category === categoryName);
  return category ? category.tags : [];
}