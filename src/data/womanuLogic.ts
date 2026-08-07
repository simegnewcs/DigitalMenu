import { menuItems } from './menu';

export const getWomanuPrice = (originalPrice: number) => {
  return Math.round(originalPrice * 1.10);
};

export const getConfidenceScore = (changes: number) => {
  if (changes === 0) return 90;
  if (changes === 1) return 75;
  if (changes === 2) return 60;
  if (changes === 3) return 40;
  if (changes >= 4) return 25;
  return 10;
};

// Maps categories/items to specific jokes and recommended item IDs
export const getRecommendation = (itemId: string, categoryId: string) => {
  // Find a target item to recommend based on category
  let recommendedCategory = 'pizza';
  let recommendedId = 'p1'; // Default fallback
  
  // Comedy logic map
  const logic = [
    {
      condition: categoryId === 'burger',
      recommendCategoryId: 'pizza',
      message: 'እሺ... ግን ለምን በርገር? 😂',
      subMessage: '🍕 ፒዛ መምረጥ ነበረብህ።',
      reasons: ['ምክንያቱም የበርገር ዳቦ እንደ ትራስ ስለሚቆጠር 🍞', 'ፒዛ ለደስታ የሚሆን ሰፊ ቦታ አለው 🍕', 'ጓደኛህ ብዙ በርገር እንደምትበላ ነግሮኛል 👀', 'በሳይንስ የተረጋገጠ ነው ፒዛ > በርገር 👨‍🔬'],
    },
    {
      condition: categoryId === 'pizza',
      recommendCategoryId: 'pizza', // Recommend another pizza
      message: 'ጥሩ ምርጫ! 👏 በመጨረሻም አንድ ሰው ትክክለኛ ውሳኔ አደረገ።',
      subMessage: 'ግን ከዚህ የተሻለ ምን እንደሆነ ታውቃለህ? ስፔሻል ፒዛ 😂',
      reasons: ['ምክንያቱም ልዩ እንክብካቤ ይገባሃል 👑', 'ሼፉ ዛሬ ተጨማሪ ሶስ አዘጋጅቷል 🍅', 'ስፔሻል መሆን ስትችል ለምን መደበኛ ትመርጣለህ ✨', 'እመነኝ፣ እኔ AI ነኝ 🤖'],
    },
    {
      condition: categoryId === 'lunch',
      recommendCategoryId: 'burger',
      message: 'አከብርሃለሁ። በጣም ባህላዊ ነው።',
      subMessage: 'ግን 🍔 በርገር እንደማትፈልግ እርግጠኛ ነህ? 😂',
      reasons: ['አንዳንዴ ባህላዊ ነገር አሰልቺ ነው 🥱', 'ቲኪቶክ እያዩ በርገር መብላት ይቀላል 📱', 'ፍሬንች ፍራይሱን እያየኸው እንደሆነ አይቻለሁ 🍟', 'ትላንትና ባህላዊ በልተሃል (ምናልባት) 🤔'],
    },
    {
      condition: categoryId === 'soup',
      recommendCategoryId: 'lunch',
      message: 'ሾርባ? በእውነት? 🍲',
      subMessage: 'ጠንከር ያለ ነገር ብትበላ ይሻላል። ለምሳሌ ሽሮ።',
      reasons: ['ሾርባ ማለት ጣዕም ያለው ሙቅ ውሃ ማለት ነው 💦', 'ማኘክ ልምምድ ያስፈልግሃል 🦷', 'ሽሮ በማንም የማይበገር ንጉስ ነው 👑', 'ደህና ነህ ግን? 🤒'],
    },
    {
      condition: categoryId === 'breakfast',
      recommendCategoryId: 'pizza',
      message: 'የቁርስ ምግብ ጥሩ ነው...',
      subMessage: 'ግን ፒዛ በማንኛውም ሰዓት አሪፍ ነው። 😂',
      reasons: ['ሰዓት የሰው ልጆች የፈጠሩት ነገር ነው 🕰️', 'ለቁርስ ፒዛ መብላት የጀግንነት ምልክት ነው 💪', 'እንቁላል ያን ያህል የተለየ ነገር የለውም 🥚', 'የፒዛ ሶስ ማለት እንደ ስሙዚ ነው 🍅'],
    },
    {
      condition: categoryId === 'hotdrinks',
      recommendCategoryId: 'cake',
      message: 'የሚገርም ምርጫ...',
      subMessage: 'ግን 🍰 ኬክ የሚያስፈልገው ሰው ትመስላለህ።',
      reasons: ['ትንሽ የጨነቀህ ትመስላለህ 😅', 'ስኳር ሁሉንም ነገር ያስተካክላል 🧁', 'እዚህ ቡና ያለ ኬክ መጠጣት ክልክል ነው 🚔', 'እራስህን ጋብዝ፣ ረጅም ቀን ነበር 🥺'],
    },
    {
      condition: categoryId === 'juice' || categoryId === 'milkshake',
      recommendCategoryId: 'juice', // Mocking logic for juice
      message: 'ጥሩ ምርጫ። በጣም ኃላፊነት የሚሰማው ሰው ነህ። 💧',
      subMessage: 'ግን ስፔሻል ጭማቂ መሞከር አለብህ።',
      reasons: ['መደበኛ ጭማቂ ለመደበኛ ሰዎች ነው 🥱', 'ስፔሻል ጭማቂ ሚስጥራዊ ኃይል አለው 🦸‍♂️', 'ልዩ ጥረት አድርገንበታል 🎨', 'ከገዛኸው እኔ ኮሚሽን አገኛለሁ 💸'],
    }
  ];

  const matchedLogic = logic.find(l => l.condition) || {
    recommendCategoryId: 'pizza',
    message: 'ይህ በእርግጥም ውሳኔ ነው።',
    subMessage: 'በአክብሮት ልንገርህ... ፒዛ ምረጥ። 😂',
    reasons: ['እኔ ስላልኩህ 🤖', 'ፒዛ መቼም አያሳዝንም 🍕', 'ለዚህኛው ምንም ምክንያት አላገኘሁም 🤷‍♂️', 'በቃ AIውን እመን 🧠'],
  };

  // Find an item from the recommended category
  const possibleItems = menuItems.filter(item => item.category === matchedLogic.recommendCategoryId && item.id !== itemId);
  
  if (possibleItems.length > 0) {
    // Pick the first or random item from the recommended category
    recommendedId = possibleItems[0].id;
  } else {
    // Fallback if category has no items
    const fallbackItems = menuItems.filter(item => item.id !== itemId);
    if(fallbackItems.length > 0) recommendedId = fallbackItems[0].id;
  }

  const recommendedItem = menuItems.find(item => item.id === recommendedId)!;

  return {
    recommendedItem,
    message: matchedLogic.message,
    subMessage: matchedLogic.subMessage,
    reasons: matchedLogic.reasons,
  };
};

export const getRejectionMessage = (changes: number) => {
  if (changes === 0) return { title: 'Are you sure? 👀', desc: '😐 Okay... But are you REALLY sure?' };
  if (changes === 1) return { title: 'Who convinced you? 😂', desc: 'Your taste buds have entered the chat.' };
  if (changes === 2) return { title: 'You changed your mind again?! 😭', desc: 'At this point the kitchen knows you personally.' };
  if (changes >= 3) return { title: 'CRITICAL WARNING 😂', desc: 'Please make a decision before the food gets cold.' };
  return { title: 'Are you sure? 👀', desc: 'Okay, I won\'t judge.' };
};
