export interface MenuItem {
  id: string;
  name: string;
  nameAmharic: string;
  description: string;
  price: number;
  category: string;
}

export const categories = [
  { id: 'pizza', name: 'Pizza', nameAm: 'ጥሬ' },
  { id: 'lunch', name: 'Lunch', nameAm: 'ምሳ' },
  { id: 'burger', name: 'Burger & Sandwich', nameAm: 'በርገር እና ሳንድዊች' },
  { id: 'breakfast', name: 'Breakfast', nameAm: 'ቁርስ' },
  { id: 'soup', name: 'Soup', nameAm: 'ሾርባ' },
];

export const menuItems: MenuItem[] = [
  // Pizza
  { id: 'p1', name: 'Dagmaros Special Pizza', nameAmharic: 'የቤቷ ጥሬ', description: 'cheese, egg, minced beef, tomato, onion, seasoning served with home special chili sauce', price: 450, category: 'pizza' },
  { id: 'p2', name: 'Abyssinia Pizza', nameAmharic: 'አቢሲኒያ ጥሬ', description: 'Traditional Ethiopian style pizza', price: 425, category: 'pizza' },
  { id: 'p3', name: 'Beef Pizza', nameAmharic: 'ስጋ ጥሬ', description: 'Minced beef, cheese, onion, tomato, green chili, olive, oregano & garlic olive served with hot chili sauce', price: 395, category: 'pizza' },
  { id: 'p4', name: 'Vegetable Pizza', nameAmharic: 'አትክልት ጥሬ', description: 'Seasonal vegetable, tomato sauce, & garlic served with home special chili sauce', price: 295, category: 'pizza' },
  { id: 'p5', name: 'Tuna Pizza', nameAmharic: 'የአሳ ጥሬ', description: 'cheese, tuna fish, herbed tomato, onion, green chili, olive, oregano & garlic olive paste served with lemon flavor chili sauce', price: 415, category: 'pizza' },
  { id: 'p6', name: 'Chicken Pizza', nameAmharic: 'የዶሮ ጥሬ', description: 'Chicken meat, cheese, & garlic olive paste served with Chilly sauce', price: 425, category: 'pizza' },
  { id: 'p7', name: 'Special Vegetable Pizza', nameAmharic: 'የቤቷ አትክልት ጥሬ', description: 'Seasonal vegetable, fruit tomato sauce, & garlic served with home special chili sauce', price: 405, category: 'pizza' },
  { id: 'p8', name: 'Cheese Pizza', nameAmharic: 'ቺዝ ጥሬ', description: 'cheese, tomato, onion, green chili, seasoning sauce', price: 395, category: 'pizza' },
  
  // Lunch Items
  { id: 'l1', name: 'Shiro', nameAmharic: 'ሽሮ', description: 'Ethiopian ground chickpeas thick served with Enjera', price: 175, category: 'lunch' },
  { id: 'l2', name: 'Shiro Tegebino', nameAmharic: 'ሽሮ ተገቢኖ', description: 'Special Shiro with additional ingredients', price: 215, category: 'lunch' },
  { id: 'l3', name: 'Special Shiro', nameAmharic: 'የቤቷ ሽሮ', description: 'shiro wot Additionally seasonal vegetables served with homemade garnish', price: 235, category: 'lunch' },
  { id: 'l4', name: 'Shiro Bozena', nameAmharic: 'ሽሮ ቦዘና', description: 'All ingredients shiro wot additionally minced meat seasoned butter served with Enjera', price: 300, category: 'lunch' },
  { id: 'l5', name: 'Tomato Kurt', nameAmharic: 'ቲማቲም ቁርቶ', description: 'Fresh tomato based Ethiopian stew', price: 170, category: 'lunch' },
  { id: 'l6', name: 'Telba Fitfit', nameAmharic: 'ተልባ ፍትፍት', description: 'Ground flaxseed mixed with injera', price: 270, category: 'lunch' },
  { id: 'l7', name: 'Hafi Hafi', nameAmharic: 'ሀፊ ሀፊ', description: 'Light mixed dish', price: 250, category: 'lunch' },
  { id: 'l8', name: 'Fasting Fir Fir', nameAmharic: 'የፆም ፍርፍር', description: 'Scrambled Enjera in a specially made vegetarian hot sauce', price: 250, category: 'lunch' },
  { id: 'l9', name: 'Derkosh Fir Fir', nameAmharic: 'ደርቆስ ፍርፍር', description: 'Scrambled dry Enjera in a specially made vegetarian hot sauce & alech sauce', price: 260, category: 'lunch' },
  { id: 'l10', name: 'Special Fasting Fir Fir', nameAmharic: 'የቤቷ የፆም ፍርፍር', description: 'Scrambled Enjera in a specially made vegetarian hot sauce & alech sauce a layer of spinach served with Enjera', price: 230, category: 'lunch' },
  { id: 'l11', name: 'Msir Bedst', nameAmharic: 'ምስር በድስት', description: 'Red lentil stew', price: 195, category: 'lunch' },
  { id: 'l12', name: 'Kiki Bedst', nameAmharic: 'ክክ በድስት', description: 'Chickpea stew', price: 185, category: 'lunch' },
  { id: 'l13', name: 'Dagmaros Yefisk', nameAmharic: 'የቤቷ የፍስክ', description: 'Special fish dish', price: 2050, category: 'lunch' },
  { id: 'l14', name: 'Quanta FirFir', nameAmharic: 'ቋንጣ ፍርፍር', description: 'Dried meat with injera scramble', price: 385, category: 'lunch' },
  { id: 'l15', name: 'Non Fasting Combo', nameAmharic: 'የፆም ሳይሆን ኮምቦ', description: 'Mixed non-fasting dishes combo', price: 850, category: 'lunch' },
  { id: 'l16', name: 'Yefisk Full Agelgil', nameAmharic: 'የፍስክ ሙሉ አገልግል', description: 'Full fish serving', price: 1750, category: 'lunch' },
  { id: 'l17', name: 'Yefisk Hafi Agelgil', nameAmharic: 'የፍስክ ሀፊ አገልግል', description: 'Half fish serving', price: 1250, category: 'lunch' },
  { id: 'l18', name: 'Yefisk Special', nameAmharic: 'የቤቷ የፍስክ', description: 'Special fish preparation', price: 1750, category: 'lunch' },
  { id: 'l19', name: 'Derkosh With Quanta', nameAmharic: 'ደርቆስ በቋንጣ', description: 'Dried meat with special sauce', price: 395, category: 'lunch' },
  { id: 'l20', name: 'Derkosh With Meat', nameAmharic: 'ደርቆስ በስጋ', description: 'Meat with special sauce', price: 320, category: 'lunch' },
  { id: 'l21', name: 'Tibs FirFir', nameAmharic: 'ጥብስ ፍርፍር', description: 'Sautéed meat with injera', price: 450, category: 'lunch' },
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
  { id: 'b1', name: 'Dagmaros Special Burger', nameAmharic: 'የቤቷ በርገር', description: 'Beef burger with fried egg & cheese served French fries', price: 420, category: 'burger' },
  { id: 'b2', name: 'Burger', nameAmharic: 'በርገር', description: 'Traditionally beef burger served with French fries', price: 370, category: 'burger' },
  { id: 'b3', name: 'Chicken Burger', nameAmharic: 'የዶሮ በርገር', description: 'Grilled chicken pieces tossed in mini French baguette & served with French fries', price: 450, category: 'burger' },
  { id: 'b4', name: 'Cheese Burger', nameAmharic: 'ቺዝ በርገር', description: 'All ingredients beef burger additionally topped with cheese served with French fries', price: 385, category: 'burger' },
  { id: 'b5', name: 'Vegetable Burger', nameAmharic: 'አትክልት በርገር', description: 'Grilled seasonal vegetable in toasted burger bun served with French fries', price: 275, category: 'burger' },
  { id: 'b6', name: 'Special Vegetable Burger', nameAmharic: 'የቤቷ አትክልት በርገር', description: 'Special vegetable burger', price: 295, category: 'burger' },
  { id: 'b7', name: 'Club Sandwich', nameAmharic: 'ክለብ ሳንድዊች', description: 'Traditional club sandwich with chicken, beef, egg, cheese, lettuce served with French fries', price: 435, category: 'burger' },
  { id: 'b8', name: 'Egg Sandwich', nameAmharic: 'እንቁላል ሳንድዊች', description: 'Farm Egg, onion, tomato, chili, mayonnaise & ketchup served with French fries', price: 250, category: 'burger' },
  { id: 'b9', name: 'Vegetable Sandwich', nameAmharic: 'አትክልት ሳንድዊች', description: 'Grilled seasonal vegetable in toasted burger served with French fries', price: 210, category: 'burger' },
  { id: 'b10', name: 'Beef Sandwich', nameAmharic: 'ስጋ ሳንድዊች', description: 'Traditionally beef burger served with French fries', price: 335, category: 'burger' },
  { id: 'b11', name: 'Chicken Sandwich', nameAmharic: 'የዶሮ ሳንድዊች', description: 'Grilled chicken pieces tossed in mini French baguette & served with French fries', price: 415, category: 'burger' },
  { id: 'b12', name: 'French Fries', nameAmharic: 'ፍሬንች ፍራይስ', description: 'Crispy fried potato strips', price: 195, category: 'burger' },

  // Breakfast
  { id: 'br1', name: 'Chechebsa', nameAmharic: 'ቺቺብሳ', description: 'Traditionally made Ethiopian pan cakes cut & tossed in hot seasoned oil & chili powder', price: 215, category: 'breakfast' },
  { id: 'br2', name: 'Tefe Chechebsa', nameAmharic: 'ተፈ ቺቺብሳ', description: 'Chechebsa with tefe flour', price: 235, category: 'breakfast' },
  { id: 'br3', name: 'Special Chechebsa', nameAmharic: 'የቤቷ ቺቺብሳ', description: 'Special chechebsa preparation', price: 270, category: 'breakfast' },
  { id: 'br4', name: 'Special Tefe Chechebsa', nameAmharic: 'የቤቷ ተፈ ቺቺብሳ', description: 'Traditionally made Ethiopian pan cakes cut & tossed in hot seasoned & Egg chili powder', price: 275, category: 'breakfast' },
  { id: 'br5', name: 'Fatira', nameAmharic: 'ፋቲራ', description: 'Traditional breakfast pastry', price: 245, category: 'breakfast' },
  { id: 'br6', name: 'Special Fatira', nameAmharic: 'የቤቷ ፋቲራ', description: 'Special fatira preparation', price: 275, category: 'breakfast' },
  { id: 'br7', name: 'Scrambled Egg', nameAmharic: 'አሰልታ እንቁላል', description: 'Egg scrambled with onion, green chili & tomato, garlic served with bread or Enjera', price: 235, category: 'breakfast' },
  { id: 'br8', name: 'Egg Sels', nameAmharic: 'አሰልታ ሰልስ', description: 'Egg scrambled with onion, chili powder garlic & tomato served with bread or Enjera', price: 235, category: 'breakfast' },
  { id: 'br9', name: 'Omelette', nameAmharic: 'አረንጓዴ እንቁላል', description: 'Egg scrambled with onion, green chili, garlic & tomato served with bread', price: 245, category: 'breakfast' },
  { id: 'br10', name: 'Special Omelette', nameAmharic: 'የቤቷ አረንጓዴ', description: 'Egg with onion, green chili, garlic & tomato served with bread', price: 270, category: 'breakfast' },
  { id: 'br11', name: 'Egg with Meat', nameAmharic: 'እንቁላል በስጋ', description: 'Egg & scrambled meat with onion, green chili, garlic & tomato served with bread or Enjera', price: 275, category: 'breakfast' },
  { id: 'br12', name: 'Normal Full', nameAmharic: 'መደበኛ ሙሉ', description: 'bean with onion, green chili & tomato, garlic served with bread', price: 150, category: 'breakfast' },
  { id: 'br13', name: 'Fasting Special Full', nameAmharic: 'የቤቷ የፆም ሙሉ', description: 'Special fasting breakfast combo', price: 175, category: 'breakfast' },
  { id: 'br14', name: 'Non Fasting Special Full', nameAmharic: 'የፆም ያልሆነ የቤቷ ሙሉ', description: 'Special non-fasting breakfast combo', price: 225, category: 'breakfast' },
  { id: 'br15', name: 'Qenche', nameAmharic: 'ቅንጬ', description: 'Traditional Ethiopian breakfast', price: 150, category: 'breakfast' },

  // Soup
  { id: 's1', name: 'Meat Soup', nameAmharic: 'ስጋ ሾርባ', description: 'Rich meat-based soup', price: 250, category: 'soup' },
  { id: 's2', name: 'Tomato Soup', nameAmharic: 'ቲማቲም ሾርባ', description: 'Creamy tomato soup', price: 150, category: 'soup' },
  { id: 's3', name: 'Fish Soup', nameAmharic: 'የአሳ ሾርባ', description: 'Fish-based soup', price: 280, category: 'soup' },
  { id: 's4', name: 'Vegetable Soup', nameAmharic: 'አትክልት ሾርባ', description: 'Mixed vegetable soup', price: 265, category: 'soup' },
  { id: 's5', name: 'Minestrone Soup', nameAmharic: 'ሚኒስትሮን ሾርባ', description: 'Italian-style vegetable soup', price: 270, category: 'soup' },
  { id: 's6', name: 'Lentil Soup', nameAmharic: 'ምስር ሾርባ', description: 'Hearty lentil soup', price: 270, category: 'soup' },
];
