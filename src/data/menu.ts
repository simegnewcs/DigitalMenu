export interface MenuSubItem {
  name: string;
  nameAmharic?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  nameAmharic: string;
  description: string;
  price: number;
  category: string;
  subItems?: MenuSubItem[];
}

export const categories = [
  { id: 'pizza', name: 'Pizza', nameAm: 'ጥሬ' },
  { id: 'lunch', name: 'Lunch', nameAm: 'ምሳ' },
  { id: 'burger', name: 'Burger & Sandwich', nameAm: 'በርገር እና ሳንድዊች' },
  { id: 'breakfast', name: 'Breakfast', nameAm: 'ቁርስ' },
  { id: 'soup', name: 'Soup', nameAm: 'ሾርባ' },
  { id: 'milkshake', name: 'Milk Shake', nameAm: 'የጥብስ ሻህ' },
  { id: 'juice', name: 'Juice', nameAm: 'ጭማ' },
  { id: 'hotdrinks', name: 'Hot Drinks', nameAm: 'ትኩስ መጠጥ' },
  { id: 'fruitea', name: 'Fruit Tea', nameAm: 'ፍራት ሻይ' },
  { id: 'cake', name: 'Cake', nameAm: 'ኬክ' },
  { id: 'beverages', name: 'Beverages', nameAm: 'መጠጦች' },
];

export const menuItems: MenuItem[] = [
  // Pizza
  { 
    id: 'p1', 
    name: 'Dagmaros Special Pizza', 
    nameAmharic: 'የቤቷ ጥሬ', 
    description: 'served with home special chili sauce', 
    price: 450, 
    category: 'pizza',
    subItems: [
      { name: 'Cheese', nameAmharic: 'ቺዝ' },
      { name: 'Egg', nameAmharic: 'እንቁላል' },
      { name: 'Minced Beef', nameAmharic: 'የተቦረሰ ስጋ' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Seasoning', nameAmharic: 'ቅመም' },
    ]
  },
  { 
    id: 'p2', 
    name: 'Abyssinia Pizza', 
    nameAmharic: 'አቢሲኒያ ጥሬ', 
    description: 'Traditional Ethiopian style pizza', 
    price: 425, 
    category: 'pizza',
    subItems: [
      { name: 'Cheese', nameAmharic: 'ቺዝ' },
      { name: 'Beef', nameAmharic: 'ስጋ' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
    ]
  },
  { 
    id: 'p3', 
    name: 'Beef Pizza', 
    nameAmharic: 'ስጋ ጥሬ', 
    description: 'served with hot chili sauce', 
    price: 395, 
    category: 'pizza',
    subItems: [
      { name: 'Minced Beef', nameAmharic: 'የተቦረሰ ስጋ' },
      { name: 'Cheese', nameAmharic: 'ቺዝ' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
      { name: 'Olive', nameAmharic: 'ወይን' },
      { name: 'Oregano', nameAmharic: 'ኦሬጋኖ' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
    ]
  },
  { 
    id: 'p4', 
    name: 'Vegetable Pizza', 
    nameAmharic: 'አትክልት ጥሬ', 
    description: 'served with home special chili sauce', 
    price: 295, 
    category: 'pizza',
    subItems: [
      { name: 'Seasonal Vegetable', nameAmharic: 'የወቅት አትክልት' },
      { name: 'Tomato Sauce', nameAmharic: 'የቲማቲም ስጋ' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
    ]
  },
  { 
    id: 'p5', 
    name: 'Tuna Pizza', 
    nameAmharic: 'የአሳ ጥሬ', 
    description: 'served with lemon flavor chili sauce', 
    price: 415, 
    category: 'pizza',
    subItems: [
      { name: 'Cheese', nameAmharic: 'ቺዝ' },
      { name: 'Tuna Fish', nameAmharic: 'የአሳ ዓይነት' },
      { name: 'Herbed Tomato', nameAmharic: 'ቅመም ቲማቲም' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
      { name: 'Olive', nameAmharic: 'ወይን' },
      { name: 'Oregano', nameAmharic: 'ኦሬጋኖ' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
    ]
  },
  { 
    id: 'p6', 
    name: 'Chicken Pizza', 
    nameAmharic: 'የዶሮ ጥሬ', 
    description: 'served with Chilly sauce', 
    price: 425, 
    category: 'pizza',
    subItems: [
      { name: 'Chicken Meat', nameAmharic: 'የዶሮ ስጋ' },
      { name: 'Cheese', nameAmharic: 'ቺዝ' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
      { name: 'Olive Paste', nameAmharic: 'የወይን ዱቄት' },
    ]
  },
  { 
    id: 'p7', 
    name: 'Special Vegetable Pizza', 
    nameAmharic: 'የቤቷ አትክልት ጥሬ', 
    description: 'served with home special chili sauce', 
    price: 405, 
    category: 'pizza',
    subItems: [
      { name: 'Seasonal Vegetable', nameAmharic: 'የወቅት አትክልት' },
      { name: 'Fruit Tomato Sauce', nameAmharic: 'የፍራት ቲማቲም ስጋ' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
    ]
  },
  { 
    id: 'p8', 
    name: 'Cheese Pizza', 
    nameAmharic: 'ቺዝ ጥሬ', 
    description: 'Classic cheese pizza with seasoning sauce', 
    price: 395, 
    category: 'pizza',
    subItems: [
      { name: 'Cheese', nameAmharic: 'ቺዝ' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
      { name: 'Seasoning', nameAmharic: 'ቅመም' },
    ]
  },
  
  // Lunch Items
  { 
    id: 'l1', 
    name: 'Shiro', 
    nameAmharic: 'ሽሮ', 
    description: 'served with Enjera', 
    price: 175, 
    category: 'lunch',
    subItems: [
      { name: 'Ground Chickpeas', nameAmharic: 'የተፈጨ ክክ' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
      { name: 'Ginger', nameAmharic: 'ዘንጅብል' },
    ]
  },
  { 
    id: 'l2', 
    name: 'Shiro Tegebino', 
    nameAmharic: 'ሽሮ ተገቢኖ', 
    description: 'Special shiro with additional ingredients', 
    price: 215, 
    category: 'lunch',
    subItems: [
      { name: 'Ground Chickpeas', nameAmharic: 'የተፈጨ ክክ' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
      { name: 'Ginger', nameAmharic: 'ዘንጅብል' },
      { name: 'Butter', nameAmharic: 'ቅቤ' },
    ]
  },
  { 
    id: 'l3', 
    name: 'Special Shiro', 
    nameAmharic: 'የቤቷ ሽሮ', 
    description: 'served with homemade garnish', 
    price: 235, 
    category: 'lunch',
    subItems: [
      { name: 'Ground Chickpeas', nameAmharic: 'የተፈጨ ክክ' },
      { name: 'Seasonal Vegetables', nameAmharic: 'የወቅት አትክልት' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
      { name: 'Ginger', nameAmharic: 'ዘንጅብል' },
    ]
  },
  { 
    id: 'l4', 
    name: 'Shiro Bozena', 
    nameAmharic: 'ሽሮ ቦዘና', 
    description: 'served with Enjera', 
    price: 300, 
    category: 'lunch',
    subItems: [
      { name: 'Ground Chickpeas', nameAmharic: 'የተፈጨ ክክ' },
      { name: 'Minced Meat', nameAmharic: 'የተቦረሰ ስጋ' },
      { name: 'Seasoned Butter', nameAmharic: 'ቅቤ' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
      { name: 'Ginger', nameAmharic: 'ዘንጅብል' },
    ]
  },
  { 
    id: 'l5', 
    name: 'Tomato Kurt', 
    nameAmharic: 'ቲማቲም ቁርቶ', 
    description: 'Fresh tomato based Ethiopian stew', 
    price: 170, 
    category: 'lunch',
    subItems: [
      { name: 'Fresh Tomato', nameAmharic: 'የጣፋጭ ቲማቲም' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
    ]
  },
  { 
    id: 'l6', 
    name: 'Telba Fitfit', 
    nameAmharic: 'ተልባ ፍትፍት', 
    description: 'Ground flaxseed mixed with injera', 
    price: 270, 
    category: 'lunch',
    subItems: [
      { name: 'Ground Flaxseed', nameAmharic: 'የተፈጨ ተልባ' },
      { name: 'Injera', nameAmharic: 'እንጀራ' },
      { name: 'Spices', nameAmharic: 'ቅመሞች' },
    ]
  },
  { 
    id: 'l7', 
    name: 'Hafi Hafi', 
    nameAmharic: 'ሀፊ ሀፊ', 
    description: 'Light mixed dish', 
    price: 250, 
    category: 'lunch',
    subItems: [
      { name: 'Injera Pieces', nameAmharic: 'የእንጀራ ቁራጭ' },
      { name: 'Spices', nameAmharic: 'ቅመሞች' },
      { name: 'Butter', nameAmharic: 'ቅቤ' },
    ]
  },
  { 
    id: 'l8', 
    name: 'Fasting Fir Fir', 
    nameAmharic: 'የፆም ፍርፍር', 
    description: 'Scrambled Enjera in vegetarian hot sauce', 
    price: 250, 
    category: 'lunch',
    subItems: [
      { name: 'Scrambled Injera', nameAmharic: 'የተበላሸ እንጀራ' },
      { name: 'Vegetarian Sauce', nameAmharic: 'የፆም ወጥ' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
    ]
  },
  { 
    id: 'l9', 
    name: 'Derkosh Fir Fir', 
    nameAmharic: 'ደርቆስ ፍርፍር', 
    description: 'Scrambled dry Enjera in hot & alech sauce', 
    price: 260, 
    category: 'lunch',
    subItems: [
      { name: 'Dry Injera', nameAmharic: 'ደርቆስ' },
      { name: 'Hot Sauce', nameAmharic: 'ቀይ ወጥ' },
      { name: 'Alech Sauce', nameAmharic: 'የአረንጓዴ ወጥ' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
    ]
  },
  { 
    id: 'l10', 
    name: 'Special Fasting Fir Fir', 
    nameAmharic: 'የቤቷ የፆም ፍርፍር', 
    description: 'served with Enjera', 
    price: 230, 
    category: 'lunch',
    subItems: [
      { name: 'Scrambled Injera', nameAmharic: 'የተበላሸ እንጀራ' },
      { name: 'Spinach', nameAmharic: 'ጎመን' },
      { name: 'Hot Sauce', nameAmharic: 'ቀይ ወጥ' },
      { name: 'Alech Sauce', nameAmharic: 'የአረንጓዴ ወጥ' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
    ]
  },
  { 
    id: 'l11', 
    name: 'Msir Bedst', 
    nameAmharic: 'ምስር በድስት', 
    description: 'Red lentil stew', 
    price: 195, 
    category: 'lunch',
    subItems: [
      { name: 'Red Lentil', nameAmharic: 'ምስር' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
      { name: 'Berbere', nameAmharic: 'በርበሬ' },
    ]
  },
  { 
    id: 'l12', 
    name: 'Kiki Bedst', 
    nameAmharic: 'ክክ በድስት', 
    description: 'Chickpea stew', 
    price: 185, 
    category: 'lunch',
    subItems: [
      { name: 'Chickpeas', nameAmharic: 'ክክ' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
      { name: 'Ginger', nameAmharic: 'ዘንጅብል' },
    ]
  },
  { id: 'l13', name: 'Dagmaros Yefisk', nameAmharic: 'የቤቷ የፍስክ', description: 'Special fish dish', price: 2050, category: 'lunch' },
  { 
    id: 'l14', 
    name: 'Quanta FirFir', 
    nameAmharic: 'ቋንጣ ፍርፍር', 
    description: 'Dried meat with injera scramble', 
    price: 385, 
    category: 'lunch',
    subItems: [
      { name: 'Dried Meat', nameAmharic: 'ቋንጣ' },
      { name: 'Scrambled Injera', nameAmharic: 'የተበላሸ እንጀራ' },
      { name: 'Hot Sauce', nameAmharic: 'ቀይ ወጥ' },
      { name: 'Spices', nameAmharic: 'ቅመሞች' },
    ]
  },
  { id: 'l15', name: 'Non Fasting Combo', nameAmharic: 'የፆም ሳይሆን ኮምቦ', description: 'Mixed non-fasting dishes combo', price: 850, category: 'lunch' },
  { id: 'l16', name: 'Yefisk Full Agelgil', nameAmharic: 'የፍስክ ሙሉ አገልግል', description: 'Full fish serving', price: 1750, category: 'lunch' },
  { id: 'l17', name: 'Yefisk Hafi Agelgil', nameAmharic: 'የፍስክ ሀፊ አገልግል', description: 'Half fish serving', price: 1250, category: 'lunch' },
  { id: 'l18', name: 'Yefisk Special', nameAmharic: 'የቤቷ የፍስክ', description: 'Special fish preparation', price: 1750, category: 'lunch' },
  { id: 'l19', name: 'Derkosh With Quanta', nameAmharic: 'ደርቆስ በቋንጣ', description: 'Dried meat with special sauce', price: 395, category: 'lunch' },
  { id: 'l20', name: 'Derkosh With Meat', nameAmharic: 'ደርቆስ በስጋ', description: 'Meat with special sauce', price: 320, category: 'lunch' },
  { 
    id: 'l21', 
    name: 'Tibs FirFir', 
    nameAmharic: 'ጥብስ ፍርፍር', 
    description: 'Sautéed meat with injera', 
    price: 450, 
    category: 'lunch',
    subItems: [
      { name: 'Sautéed Meat', nameAmharic: 'ጥብስ' },
      { name: 'Scrambled Injera', nameAmharic: 'የተበላሸ እንጀራ' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
    ]
  },
  { id: 'l22', name: 'Ship Dulet', nameAmharic: 'ሽፕ ዱለት', description: 'Spicy tripe mix', price: 295, category: 'lunch' },
  { id: 'l23', name: 'Ktifo', nameAmharic: 'ክትፎ', description: 'Traditional dish', price: 685, category: 'lunch' },
  { id: 'l24', name: 'Special Ktifo', nameAmharic: 'የቤቷ ክትፎ', description: 'Special ktifo preparation', price: 850, category: 'lunch' },
  { id: 'l25', name: 'Sega FirFir', nameAmharic: 'ስጋ ፍርፍር', description: 'Meat with scrambled injera', price: 325, category: 'lunch' },
  { id: 'l26', name: 'Special Quanta FirFir', nameAmharic: 'የቤቷ ቋንጣ ፍርፍር', description: 'Special dried meat dish', price: 405, category: 'lunch' },
  { id: 'l27', name: 'Nashufe', nameAmharic: 'ናሹፌ', description: 'Traditional Ethiopian dish', price: 200, category: 'lunch' },
  { id: 'l28', name: 'Chicken Cotelet', nameAmharic: 'የዶሮ ኮትሌት', description: 'Chicken cutlet', price: 370, category: 'lunch' },
  { id: 'l29', name: 'Full Roasted Chicken', nameAmharic: 'የዶሮ አረንጓዴ ሙሉ', description: 'Whole roasted chicken', price: 1700, category: 'lunch' },
  { id: 'l30', name: 'Hafi Roasted Chicken', nameAmharic: 'የዶሮ አረንጓዴ ሐፍሐፍ', description: 'Half roasted chicken', price: 950, category: 'lunch' },

  // Burger & Sandwich
  { 
    id: 'b1', 
    name: 'Dagmaros Special Burger', 
    nameAmharic: 'የቤቷ በርገር', 
    description: 'served with French fries', 
    price: 420, 
    category: 'burger',
    subItems: [
      { name: 'Beef Patty', nameAmharic: 'የስጋ ጎማ' },
      { name: 'Fried Egg', nameAmharic: 'የተጠበሰ እንቁላል' },
      { name: 'Cheese', nameAmharic: 'ቺዝ' },
      { name: 'Bun', nameAmharic: 'የበርገር ዳቦ' },
      { name: 'French Fries', nameAmharic: 'ፍሬንች ፍራይስ' },
    ]
  },
  { 
    id: 'b2', 
    name: 'Burger', 
    nameAmharic: 'በርገር', 
    description: 'served with French fries', 
    price: 370, 
    category: 'burger',
    subItems: [
      { name: 'Beef Patty', nameAmharic: 'የስጋ ጎማ' },
      { name: 'Bun', nameAmharic: 'የበርገር ዳቦ' },
      { name: 'Lettuce', nameAmharic: 'ሳሎት' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'French Fries', nameAmharic: 'ፍሬንች ፍራይስ' },
    ]
  },
  { 
    id: 'b3', 
    name: 'Chicken Burger', 
    nameAmharic: 'የዶሮ በርገር', 
    description: 'served with French fries', 
    price: 450, 
    category: 'burger',
    subItems: [
      { name: 'Grilled Chicken', nameAmharic: 'የተጠበሰ ዶሮ' },
      { name: 'Baguette', nameAmharic: 'ፈረንሳዊ ዳቦ' },
      { name: 'Lettuce', nameAmharic: 'ሳሎት' },
      { name: 'Mayonnaise', nameAmharic: 'ማዮኔዝ' },
      { name: 'French Fries', nameAmharic: 'ፍሬንች ፍራይስ' },
    ]
  },
  { 
    id: 'b4', 
    name: 'Cheese Burger', 
    nameAmharic: 'ቺዝ በርገር', 
    description: 'served with French fries', 
    price: 385, 
    category: 'burger',
    subItems: [
      { name: 'Beef Patty', nameAmharic: 'የስጋ ጎማ' },
      { name: 'Cheese', nameAmharic: 'ቺዝ' },
      { name: 'Bun', nameAmharic: 'የበርገር ዳቦ' },
      { name: 'Lettuce', nameAmharic: 'ሳሎት' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'French Fries', nameAmharic: 'ፍሬንች ፍራይስ' },
    ]
  },
  { 
    id: 'b5', 
    name: 'Vegetable Burger', 
    nameAmharic: 'አትክልት በርገር', 
    description: 'served with French fries', 
    price: 275, 
    category: 'burger',
    subItems: [
      { name: 'Seasonal Vegetable', nameAmharic: 'የወቅት አትክልት' },
      { name: 'Bun', nameAmharic: 'የበርገር ዳቦ' },
      { name: 'Lettuce', nameAmharic: 'ሳሎት' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'French Fries', nameAmharic: 'ፍሬንች ፍራይስ' },
    ]
  },
  { id: 'b6', name: 'Special Vegetable Burger', nameAmharic: 'የቤቷ አትክልት በርገር', description: 'Special vegetable burger', price: 295, category: 'burger' },
  { id: 'b7', name: 'Club Sandwich', nameAmharic: 'ክለብ ሳንድዊች', description: 'Traditional club sandwich with chicken, beef, egg, cheese, lettuce served with French fries', price: 435, category: 'burger' },
  { id: 'b8', name: 'Egg Sandwich', nameAmharic: 'እንቁላል ሳንድዊች', description: 'Farm Egg, onion, tomato, chili, mayonnaise & ketchup served with French fries', price: 250, category: 'burger' },
  { id: 'b9', name: 'Vegetable Sandwich', nameAmharic: 'አትክልት ሳንድዊች', description: 'Grilled seasonal vegetable in toasted burger served with French fries', price: 210, category: 'burger' },
  { id: 'b10', name: 'Beef Sandwich', nameAmharic: 'ስጋ ሳንድዊች', description: 'Traditionally beef burger served with French fries', price: 335, category: 'burger' },
  { id: 'b11', name: 'Chicken Sandwich', nameAmharic: 'የዶሮ ሳንድዊች', description: 'Grilled chicken pieces tossed in mini French baguette & served with French fries', price: 415, category: 'burger' },
  { id: 'b12', name: 'French Fries', nameAmharic: 'ፍሬንች ፍራይስ', description: 'Crispy fried potato strips', price: 195, category: 'burger' },

  // Breakfast
  { 
    id: 'br1', 
    name: 'Chechebsa', 
    nameAmharic: 'ቺቺብሳ', 
    description: 'Traditional Ethiopian pan cakes', 
    price: 215, 
    category: 'breakfast',
    subItems: [
      { name: 'Wheat Flour', nameAmharic: 'የስንዴ ዱቄት' },
      { name: 'Seasoned Oil', nameAmharic: 'ቅቤ' },
      { name: 'Chili Powder', nameAmharic: 'በርበሬ' },
      { name: 'Honey', nameAmharic: 'ማር' },
    ]
  },
  { 
    id: 'br2', 
    name: 'Tefe Chechebsa', 
    nameAmharic: 'ተፈ ቺቺብሳ', 
    description: 'Chechebsa with tefe flour', 
    price: 235, 
    category: 'breakfast',
    subItems: [
      { name: 'Teff Flour', nameAmharic: 'የጤፍ ዱቄት' },
      { name: 'Seasoned Oil', nameAmharic: 'ቅቤ' },
      { name: 'Chili Powder', nameAmharic: 'በርበሬ' },
      { name: 'Honey', nameAmharic: 'ማር' },
    ]
  },
  { id: 'br3', name: 'Special Chechebsa', nameAmharic: 'የቤቷ ቺቺብሳ', description: 'Special chechebsa preparation', price: 270, category: 'breakfast' },
  { id: 'br4', name: 'Special Tefe Chechebsa', nameAmharic: 'የቤቷ ተፈ ቺቺብሳ', description: 'Traditionally made Ethiopian pan cakes cut & tossed in hot seasoned & Egg chili powder', price: 275, category: 'breakfast' },
  { id: 'br5', name: 'Fatira', nameAmharic: 'ፋቲራ', description: 'Traditional breakfast pastry', price: 245, category: 'breakfast' },
  { id: 'br6', name: 'Special Fatira', nameAmharic: 'የቤቷ ፋቲራ', description: 'Special fatira preparation', price: 275, category: 'breakfast' },
  { 
    id: 'br7', 
    name: 'Scrambled Egg', 
    nameAmharic: 'አሰልታ እንቁላል', 
    description: 'served with bread or Enjera', 
    price: 235, 
    category: 'breakfast',
    subItems: [
      { name: 'Egg', nameAmharic: 'እንቁላል' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
    ]
  },
  { id: 'br8', name: 'Egg Sels', nameAmharic: 'አሰልታ ሰልስ', description: 'Egg scrambled with onion, chili powder garlic & tomato served with bread or Enjera', price: 235, category: 'breakfast' },
  { 
    id: 'br9', 
    name: 'Omelette', 
    nameAmharic: 'አረንጓዴ እንቁላል', 
    description: 'served with bread', 
    price: 245, 
    category: 'breakfast',
    subItems: [
      { name: 'Egg', nameAmharic: 'እንቁላል' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
    ]
  },
  { id: 'br10', name: 'Special Omelette', nameAmharic: 'የቤቷ አረንጓዴ', description: 'Egg with onion, green chili, garlic & tomato served with bread', price: 270, category: 'breakfast' },
  { 
    id: 'br11', 
    name: 'Egg with Meat', 
    nameAmharic: 'እንቁላል በስጋ', 
    description: 'served with bread or Enjera', 
    price: 275, 
    category: 'breakfast',
    subItems: [
      { name: 'Egg', nameAmharic: 'እንቁላል' },
      { name: 'Minced Meat', nameAmharic: 'የተቦረሰ ስጋ' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
    ]
  },
  { 
    id: 'br12', 
    name: 'Normal Full', 
    nameAmharic: 'መደበኛ ሙሉ', 
    description: 'served with bread', 
    price: 150, 
    category: 'breakfast',
    subItems: [
      { name: 'Fava Beans', nameAmharic: 'ባቄላ' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Green Chili', nameAmharic: 'አረንጓዴ ሚጥሚጣ' },
      { name: 'Tomato', nameAmharic: 'ቲማቲም' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
    ]
  },
  { id: 'br13', name: 'Fasting Special Full', nameAmharic: 'የቤቷ የፆም ሙሉ', description: 'Special fasting breakfast combo', price: 175, category: 'breakfast' },
  { id: 'br14', name: 'Non Fasting Special Full', nameAmharic: 'የፆም ያልሆነ የቤቷ ሙሉ', description: 'Special non-fasting breakfast combo', price: 225, category: 'breakfast' },
  { id: 'br15', name: 'Qenche', nameAmharic: 'ቅንጬ', description: 'Traditional Ethiopian breakfast', price: 150, category: 'breakfast' },

  // Soup
  { 
    id: 's1', 
    name: 'Meat Soup', 
    nameAmharic: 'ስጋ ሾርባ', 
    description: 'Rich meat-based soup', 
    price: 250, 
    category: 'soup',
    subItems: [
      { name: 'Beef', nameAmharic: 'ስጋ' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Carrot', nameAmharic: 'ካሮት' },
      { name: 'Potato', nameAmharic: 'ድንች' },
      { name: 'Spices', nameAmharic: 'ቅመሞች' },
    ]
  },
  { 
    id: 's2', 
    name: 'Tomato Soup', 
    nameAmharic: 'ቲማቲም ሾርባ', 
    description: 'Creamy tomato soup', 
    price: 150, 
    category: 'soup',
    subItems: [
      { name: 'Fresh Tomato', nameAmharic: 'የጣፋጭ ቲማቲም' },
      { name: 'Cream', nameAmharic: 'ክሬም' },
      { name: 'Onion', nameAmharic: 'ሽንኩርት' },
      { name: 'Garlic', nameAmharic: 'ነጭ ሽንኩርት' },
    ]
  },
  { id: 's3', name: 'Fish Soup', nameAmharic: 'የአሳ ሾርባ', description: 'Fish-based soup', price: 280, category: 'soup' },
  { id: 's4', name: 'Vegetable Soup', nameAmharic: 'አትክልት ሾርባ', description: 'Mixed vegetable soup', price: 265, category: 'soup' },
  { id: 's5', name: 'Minestrone Soup', nameAmharic: 'ሚኒስትሮን ሾርባ', description: 'Italian-style vegetable soup', price: 270, category: 'soup' },
  { id: 's6', name: 'Lentil Soup', nameAmharic: 'ምስር ሾርባ', description: 'Hearty lentil soup', price: 270, category: 'soup' },

  // Milk Shake
  { 
    id: 'ms1', 
    name: 'Milk shake Strawberry', 
    nameAmharic: 'የጥብስ ሻህ ስትሮበሪ', 
    description: 'Creamy strawberry milkshake', 
    price: 225, 
    category: 'milkshake',
    subItems: [
      { name: 'Fresh Milk', nameAmharic: 'ባለሙገሰ ወተት' },
      { name: 'Strawberry', nameAmharic: 'ስትሮበሪ' },
      { name: 'Ice Cream', nameAmharic: 'አይስ ክሬም' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
    ]
  },
  { 
    id: 'ms2', 
    name: 'Milk shake Mango', 
    nameAmharic: 'የጥብስ ሻህ ማንጎ', 
    description: 'Fresh mango milkshake', 
    price: 225, 
    category: 'milkshake',
    subItems: [
      { name: 'Fresh Milk', nameAmharic: 'ባለሙገሰ ወተት' },
      { name: 'Mango', nameAmharic: 'ማንጎ' },
      { name: 'Ice Cream', nameAmharic: 'አይስ ክሬም' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
    ]
  },
  { 
    id: 'ms3', 
    name: 'Milk shake Guava', 
    nameAmharic: 'የጥብስ ሻህ ጓቫ', 
    description: 'Tropical guava milkshake', 
    price: 225, 
    category: 'milkshake',
    subItems: [
      { name: 'Fresh Milk', nameAmharic: 'ባለሙገሰ ወተት' },
      { name: 'Guava', nameAmharic: 'ጓቫ' },
      { name: 'Ice Cream', nameAmharic: 'አይስ ክሬም' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
    ]
  },
  { id: 'ms4', name: 'Milk shake Vanilla', nameAmharic: 'የጥብስ ሻህ ቫኒላ', description: 'Classic vanilla milkshake', price: 225, category: 'milkshake' },
  { id: 'ms5', name: 'Milk shake special', nameAmharic: 'የጥብስ ሻህ ስፔሻል', description: 'Special house milkshake', price: 240, category: 'milkshake' },
  { id: 'ms6', name: 'Milk shake Chocolate', nameAmharic: 'የጥብስ ሻህ ቸኮሌት', description: 'Rich chocolate milkshake', price: 235, category: 'milkshake' },
  { id: 'ms7', name: 'Milk shake Banana', nameAmharic: 'የጥብስ ሻህ ሙዝ', description: 'Creamy banana milkshake', price: 225, category: 'milkshake' },

  // Juice
  { 
    id: 'j1', 
    name: 'Avocado Juice', 
    nameAmharic: 'አቮካዶ ጭማ', 
    description: 'Fresh avocado juice', 
    price: 185, 
    category: 'juice',
    subItems: [
      { name: 'Fresh Avocado', nameAmharic: 'የጣፋጭ አቮካዶ' },
      { name: 'Water', nameAmharic: 'ውሃ' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
      { name: 'Lime', nameAmharic: 'ሎሚ' },
    ]
  },
  { 
    id: 'j2', 
    name: 'Mango Juice', 
    nameAmharic: 'ማንጎ ጭማ', 
    description: 'Fresh mango juice', 
    price: 185, 
    category: 'juice',
    subItems: [
      { name: 'Fresh Mango', nameAmharic: 'የጣፋጭ ማንጎ' },
      { name: 'Water', nameAmharic: 'ውሃ' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
    ]
  },
  { 
    id: 'j3', 
    name: 'Pineapple Juice', 
    nameAmharic: 'አናናስ ጭማ', 
    description: 'Fresh pineapple juice', 
    price: 200, 
    category: 'juice',
    subItems: [
      { name: 'Fresh Pineapple', nameAmharic: 'የጣፋጭ አናናስ' },
      { name: 'Water', nameAmharic: 'ውሃ' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
    ]
  },
  { id: 'j4', name: 'Papaya Juice', nameAmharic: 'ፓፓያ ጭማ', description: 'Fresh papaya juice', price: 185, category: 'juice' },
  { 
    id: 'j5', 
    name: 'Special Juice', 
    nameAmharic: 'የቤቷ ጭማ', 
    description: 'House special mixed juice', 
    price: 230, 
    category: 'juice',
    subItems: [
      { name: 'Mixed Fruits', nameAmharic: 'ቅልቅል ፍራቶች' },
      { name: 'Water', nameAmharic: 'ውሃ' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
      { name: 'Ice', nameAmharic: 'በረዶ' },
    ]
  },
  { id: 'j6', name: 'Spice Juice', nameAmharic: 'ስፒስ ጭማ', description: 'Spiced fruit juice', price: 200, category: 'juice' },
  { id: 'j7', name: 'Fruit punch', nameAmharic: 'ፍራት ፓንች', description: 'Mixed fruit punch', price: 250, category: 'juice' },
  { id: 'j8', name: 'Mixed salad Juice', nameAmharic: 'ሚክስድ ሳላድ ጭማ', description: 'Mixed fruit salad juice', price: 275, category: 'juice' },
  { id: 'j9', name: 'Watermelon Juice', nameAmharic: 'ዋተርሜሎን ጭማ', description: 'Fresh watermelon juice', price: 140, category: 'juice' },
  { id: 'j10', name: 'Telba Juice', nameAmharic: 'ተልባ ጭማ', description: 'Traditional flaxseed juice', price: 160, category: 'juice' },
  { id: 'j11', name: 'Telba Smuz Juice', nameAmharic: 'ተልባ ስሙዝ ጭማ', description: 'Flaxseed smoothie juice', price: 180, category: 'juice' },
  { id: 'j12', name: 'Mojito', nameAmharic: 'ሞሂቶ', description: 'Fresh mint mojito', price: 200, category: 'juice' },

  // Hot Drinks
  { id: 'hd1', name: 'Tea', nameAmharic: 'ሻይ', description: 'Traditional Ethiopian tea', price: 50, category: 'hotdrinks' },
  { id: 'hd2', name: 'Tea Correnti', nameAmharic: 'ሻይ ኮረንቲ', description: 'Strong black tea', price: 65, category: 'hotdrinks' },
  { id: 'hd3', name: 'Spice Tea', nameAmharic: 'ሻይ ስፒስ', description: 'Spiced tea', price: 60, category: 'hotdrinks' },
  { id: 'hd4', name: 'Double Spice', nameAmharic: 'ድብል ስፒስ', description: 'Extra spiced tea', price: 75, category: 'hotdrinks' },
  { 
    id: 'hd5', 
    name: 'Special tea', 
    nameAmharic: 'የቤቷ ሻይ', 
    description: 'House special tea', 
    price: 120, 
    category: 'hotdrinks',
    subItems: [
      { name: 'Black Tea', nameAmharic: 'ጥቁር ሻይ' },
      { name: 'Spices', nameAmharic: 'ቅመሞች' },
      { name: 'Ginger', nameAmharic: 'ዘንጅብል' },
      { name: 'Cloves', nameAmharic: 'ክረከሮ' },
    ]
  },
  { id: 'hd6', name: 'Loze Tea', nameAmharic: 'ሎዘ ሻይ', description: 'Milk tea', price: 105, category: 'hotdrinks' },
  { id: 'hd7', name: 'Loze With Coffee', nameAmharic: 'ሎዘ በቡና', description: 'Tea with coffee', price: 75, category: 'hotdrinks' },
  { id: 'hd8', name: 'Special Loze', nameAmharic: 'የቤቷ ሎዘ', description: 'Special milk tea', price: 85, category: 'hotdrinks' },
  { id: 'hd9', name: 'Coffee', nameAmharic: 'ቡና', description: 'Ethiopian coffee', price: 100, category: 'hotdrinks' },
  { id: 'hd10', name: 'Traditional Coffee', nameAmharic: 'የቤት ቡና', description: 'Traditional Ethiopian coffee', price: 65, category: 'hotdrinks' },
  { id: 'hd11', name: 'Double coffee', nameAmharic: 'ድብል ቡና', description: 'Double strength coffee', price: 50, category: 'hotdrinks' },
  { 
    id: 'hd12', 
    name: 'Coffee Latte', 
    nameAmharic: 'ኮፊ ላቴ', 
    description: 'Coffee with steamed milk', 
    price: 130, 
    category: 'hotdrinks',
    subItems: [
      { name: 'Espresso', nameAmharic: 'ኤስፕሬሶ' },
      { name: 'Steamed Milk', nameAmharic: 'የተሞቀ ወተት' },
      { name: 'Foam', nameAmharic: 'ፎም' },
    ]
  },
  { id: 'hd13', name: 'Macchiato', nameAmharic: 'ማኪያቶ', description: 'Espresso with milk foam', price: 85, category: 'hotdrinks' },
  { id: 'hd14', name: 'Double macchiato', nameAmharic: 'ድብል ማኪያቶ', description: 'Double macchiato', price: 80, category: 'hotdrinks' },
  { id: 'hd15', name: 'Fasting macchiato', nameAmharic: 'የፆም ማኪያቶ', description: 'Fasting style macchiato', price: 140, category: 'hotdrinks' },
  { id: 'hd16', name: 'Double fasting macchiato', nameAmharic: 'ድብል የፆም ማኪያቶ', description: 'Double fasting macchiato', price: 85, category: 'hotdrinks' },
  { 
    id: 'hd17', 
    name: 'Special Macchiato', 
    nameAmharic: 'የቤቷ ማኪያቶ', 
    description: 'House special macchiato', 
    price: 165, 
    category: 'hotdrinks',
    subItems: [
      { name: 'Espresso', nameAmharic: 'ኤስፕሬሶ' },
      { name: 'Milk Foam', nameAmharic: 'የወተት ፎም' },
      { name: 'Cocoa Powder', nameAmharic: 'የኮኮድ ዱቄት' },
      { name: 'Special Syrup', nameAmharic: 'ስፔሻል ሲሮፕ' },
    ]
  },
  { id: 'hd18', name: 'Milk', nameAmharic: 'ወተት', description: 'Hot milk', price: 95, category: 'hotdrinks' },
  { id: 'hd19', name: 'Cappuccino', nameAmharic: 'ካፑቺኖ', description: 'Cappuccino coffee', price: 85, category: 'hotdrinks' },
  { id: 'hd20', name: 'Fasting Cappuccino', nameAmharic: 'የፆም ካፑቺኖ', description: 'Fasting style cappuccino', price: 120, category: 'hotdrinks' },
  { id: 'hd21', name: 'Hot Chocolate', nameAmharic: 'ሆት ቸኮሌት', description: 'Rich hot chocolate', price: 130, category: 'hotdrinks' },

  // Fruit Tea
  { 
    id: 'ft1', 
    name: 'Orange Tea', 
    nameAmharic: 'ብርቱካን ሻይ', 
    description: 'Orange flavored tea', 
    price: 75, 
    category: 'fruitea',
    subItems: [
      { name: 'Black Tea', nameAmharic: 'ጥቁር ሻይ' },
      { name: 'Orange Flavor', nameAmharic: 'የብርቱካን ስሜት' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
    ]
  },
  { 
    id: 'ft2', 
    name: 'Lemon Tea', 
    nameAmharic: 'ሎሚ ሻይ', 
    description: 'Lemon flavored tea', 
    price: 55, 
    category: 'fruitea',
    subItems: [
      { name: 'Black Tea', nameAmharic: 'ጥቁር ሻይ' },
      { name: 'Lemon', nameAmharic: 'ሎሚ' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
    ]
  },
  { 
    id: 'ft3', 
    name: 'Mango Tea', 
    nameAmharic: 'ማንጎ ሻይ', 
    description: 'Mango flavored tea', 
    price: 75, 
    category: 'fruitea',
    subItems: [
      { name: 'Black Tea', nameAmharic: 'ጥቁር ሻይ' },
      { name: 'Mango Flavor', nameAmharic: 'የማንጎ ስሜት' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
    ]
  },
  { id: 'ft4', name: 'Pineapple Tea', nameAmharic: 'አናናስ ሻይ', description: 'Pineapple flavored tea', price: 75, category: 'fruitea' },
  { 
    id: 'ft5', 
    name: 'Zengebel Tea', 
    nameAmharic: 'ዘንጅብል ሻይ', 
    description: 'Ginger tea', 
    price: 75, 
    category: 'fruitea',
    subItems: [
      { name: 'Black Tea', nameAmharic: 'ጥቁር ሻይ' },
      { name: 'Ginger', nameAmharic: 'ዘንጅብል' },
      { name: 'Sugar', nameAmharic: 'ስኳር' },
      { name: 'Lemon', nameAmharic: 'ሎሚ' },
    ]
  },

  // Cake
  { 
    id: 'ck1', 
    name: 'Black forest', 
    nameAmharic: 'ብላክ ፎረስት', 
    description: 'Black forest cake', 
    price: 100, 
    category: 'cake',
    subItems: [
      { name: 'Chocolate Sponge', nameAmharic: 'ቸኮሌት ኬክ' },
      { name: 'Whipped Cream', nameAmharic: 'የተደለቀ ክሬም' },
      { name: 'Cherries', nameAmharic: 'ቸሪ' },
      { name: 'Chocolate Shavings', nameAmharic: 'ቸኮሌት ቁራጭ' },
    ]
  },
  { 
    id: 'ck2', 
    name: 'White forest', 
    nameAmharic: 'ዋይት ፎረስት', 
    description: 'White forest cake', 
    price: 100, 
    category: 'cake',
    subItems: [
      { name: 'Vanilla Sponge', nameAmharic: 'ቫኒላ ኬክ' },
      { name: 'Whipped Cream', nameAmharic: 'የተደለቀ ክሬም' },
      { name: 'Cherries', nameAmharic: 'ቸሪ' },
      { name: 'White Chocolate', nameAmharic: 'ነጭ ቸኮሌት' },
    ]
  },
  { id: 'ck3', name: 'Sliced Cake', nameAmharic: 'ስላይስድ ኬክ', description: 'Sliced cake portion', price: 100, category: 'cake' },
  { 
    id: 'ck4', 
    name: 'Orange Cake', 
    nameAmharic: 'ኦራንጅ ኬክ', 
    description: 'Orange flavored cake', 
    price: 75, 
    category: 'cake',
    subItems: [
      { name: 'Orange Flavor', nameAmharic: 'የብርቱካን ስሜት' },
      { name: 'Sponge Cake', nameAmharic: 'ኬክ' },
      { name: 'Sugar Glaze', nameAmharic: 'የስኳር ቅባት' },
    ]
  },
  { id: 'ck5', name: 'Torta Cake 1kg', nameAmharic: 'ቶርታ ኬክ 1 ኪ.ግ', description: 'Torta cake 1 kilogram', price: 950, category: 'cake' },
  { id: 'ck6', name: 'Torta Cake 1.5kg', nameAmharic: 'ቶርታ ኬክ 1.5 ኪ.ግ', description: 'Torta cake 1.5 kilogram', price: 1350, category: 'cake' },
  { id: 'ck7', name: 'Torta Cake 2kg', nameAmharic: 'ቶርታ ኬክ 2 ኪ.ግ', description: 'Torta cake 2 kilogram', price: 1750, category: 'cake' },
  { id: 'ck8', name: 'Torta Cake 3kg', nameAmharic: 'ቶርታ ኬክ 3 ኪ.ግ', description: 'Torta cake 3 kilogram', price: 2850, category: 'cake' },
  { id: 'ck9', name: 'Torta Cake 4kg', nameAmharic: 'ቶርታ ኬክ 4 ኪ.ግ', description: 'Torta cake 4 kilogram', price: 3750, category: 'cake' },

  // Beverages - Beer, Soft Drinks, Mineral Water, Wine
  { 
    id: 'bv1', 
    name: 'Dashan, Harere, Walya, Habesha, Smoll Bedela', 
    nameAmharic: 'ዳሻን, ሃረሬ, ዋልያ, ሃበሻ, ትንሽ በደላ', 
    description: 'Local Ethiopian beers', 
    price: 140, 
    category: 'beverages',
    subItems: [
      { name: 'Ethiopian Beer', nameAmharic: 'የሃበሻ ቢራ' },
    ]
  },
  { id: 'bv2', name: 'Big Special Bedela', nameAmharic: 'ትልቅ ስፔሻል በደላ', description: 'Large special Bedela beer', price: 150, category: 'beverages' },
  { id: 'bv3', name: 'Big Special Walya', nameAmharic: 'ትልቅ ስፔሻል ዋልያ', description: 'Large special Walya beer', price: 150, category: 'beverages' },
  { id: 'bv4', name: 'Heniken Beer', nameAmharic: 'ሄኒከን ቢራ', description: 'Heineken beer', price: 150, category: 'beverages' },
  { id: 'bv5', name: 'Coca cola, Sprite, Fanta', nameAmharic: 'ኮካ ኮላ, ስፕራይት, ፋንታ', description: 'Soft drinks', price: 70, category: 'beverages' },
  { id: 'bv6', name: 'Ambo Water', nameAmharic: 'አምቦ ውሃ', description: 'Sparkling mineral water', price: 70, category: 'beverages' },
  { id: 'bv7', name: 'Soft Malta', nameAmharic: 'ሶፍት ማልታ', description: 'Non-alcoholic malt drink', price: 95, category: 'beverages' },
  { id: 'bv8', name: 'Mineral Water 0.5L', nameAmharic: 'የማይናራል ውሃ 0.5ሊ', description: 'Mineral water half liter', price: 50, category: 'beverages' },
  { id: 'bv9', name: 'Mineral Water 1L', nameAmharic: 'የማይናራል ውሃ 1ሊ', description: 'Mineral water 1 liter', price: 70, category: 'beverages' },
  { id: 'bv10', name: 'Mineral Water 2L', nameAmharic: 'የማይናራል ውሃ 2ሊ', description: 'Mineral water 2 liter', price: 85, category: 'beverages' },
  { id: 'bv11', name: 'Kamila Wine', nameAmharic: 'ካሚላ ወይን', description: 'Kamila wine', price: 1050, category: 'beverages' },
  { id: 'bv12', name: 'Guder Wine', nameAmharic: 'ጉደር ወይን', description: 'Guder wine', price: 850, category: 'beverages' },
  { id: 'bv13', name: 'Axumit Wine', nameAmharic: 'አክሱሚት ወይን', description: 'Axumit wine', price: 1000, category: 'beverages' },
  { id: 'bv14', name: 'Guder Smoll Wine', nameAmharic: 'ጉደር ትንሽ ወይን', description: 'Small Guder wine', price: 550, category: 'beverages' },
  { id: 'bv15', name: 'Axumit Smoll Wine', nameAmharic: 'አክሱሚት ትንሽ ወይን', description: 'Small Axumit wine', price: 550, category: 'beverages' },
  { id: 'bv16', name: 'Awash Wine', nameAmharic: 'አዋሽ ወይን', description: 'Awash wine', price: 800, category: 'beverages' },
  { id: 'bv17', name: 'Acaica Wine Red, White, Rose', nameAmharic: 'አካካ ወይን ሬድ, ነጭ, ሮዝ', description: 'Acaica wine selection', price: 1700, category: 'beverages' },
];
