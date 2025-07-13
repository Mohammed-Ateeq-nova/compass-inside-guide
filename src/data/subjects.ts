import { Subject } from '../types'

export const subjects: Subject[] = [
  {
    id: 'coding',
    name: 'Coding',
    nameHi: 'कोडिंग',
    nameTe: 'కోడింగ్',
    description: 'Learn programming fundamentals and build amazing projects',
    descriptionHi: 'प्रोग्रामिंग की बुनियादी बातें सीखें और अद्भुत प्रोजेक्ट बनाएं',
    descriptionTe: 'ప్రోగ్రామింగ్ ప్రాథమికాలను నేర్చుకోండి మరియు అద్భుతమైన ప్రాజెక్ట్‌లను రూపొందించండి',
    icon: '💻',
    color: 'from-blue-500 to-purple-600',
    lessons: [
      {
        id: 'intro-to-programming',
        title: 'Introduction to Programming',
        titleHi: 'प्रोग्रामिंग का परिचय',
        titleTe: 'ప్రోగ్రామింగ్ పరిచయం',
        content: 'Learn what programming is and why it\'s important in today\'s world.',
        contentHi: 'प्रोग्रामिंग क्या है और आज की दुनिया में यह क्यों महत्वपूर्ण है, यह जानें।',
        contentTe: 'ప్రోగ్రామింగ్ అంటే ఏమిటి మరియు నేటి ప్రపంచంలో ఇది ఎందుకు ముఖ్యమైనది అనేది తెలుసుకోండి.',
        type: 'text',
        duration: 15,
        difficulty: 'beginner',
        points: 50
      },
      {
        id: 'variables-and-data-types',
        title: 'Variables and Data Types',
        titleHi: 'वेरिएबल्स और डेटा टाइप्स',
        titleTe: 'వేరియబుల్స్ మరియు డేటా రకాలు',
        content: 'Understand how to store and manipulate data in programming.',
        contentHi: 'प्रोग्रामिंग में डेटा को कैसे स्टोर और मैनिपुलेट करना है, यह समझें।',
        contentTe: 'ప్రోగ్రామింగ్‌లో డేటాను ఎలా నిల్వ చేయాలి మరియు మార్చాలి అనేది అర్థం చేసుకోండి.',
        type: 'interactive',
        duration: 20,
        difficulty: 'beginner',
        points: 75
      },
      {
        id: 'control-structures',
        title: 'Control Structures',
        titleHi: 'कंट्रोल स्ट्रक्चर्स',
        titleTe: 'కంట్రోల్ స్ట్రక్చర్స్',
        content: 'Learn about if-else statements, loops, and decision making in code.',
        contentHi: 'if-else स्टेटमेंट्स, लूप्स और कोड में निर्णय लेने के बारे में जानें।',
        contentTe: 'if-else స్టేట్‌మెంట్‌లు, లూప్‌లు మరియు కోడ్‌లో నిర్ణయం తీసుకోవడం గురించి తెలుసుకోండి.',
        type: 'interactive',
        duration: 25,
        difficulty: 'intermediate',
        points: 100
      }
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    nameHi: 'गणित',
    nameTe: 'గణితం',
    description: 'Master mathematical concepts from basic arithmetic to advanced topics',
    descriptionHi: 'बुनियादी अंकगणित से लेकर उन्नत विषयों तक गणितीय अवधारणाओं में महारत हासिल करें',
    descriptionTe: 'ప్రాథమిక అంకగణితం నుండి అధునాతన అంశాల వరకు గణిత భావనలలో ప్రావీణ్యం సాధించండి',
    icon: '🔢',
    color: 'from-green-500 to-teal-600',
    lessons: [
      {
        id: 'basic-arithmetic',
        title: 'Basic Arithmetic',
        titleHi: 'बुनियादी अंकगणित',
        titleTe: 'ప్రాథమిక అంకగణితం',
        content: 'Learn addition, subtraction, multiplication, and division.',
        contentHi: 'जोड़, घटाव, गुणा और भाग सीखें।',
        contentTe: 'కూడిక, తీసివేత, గుణకారం మరియు భాగహారం నేర్చుకోండి.',
        type: 'interactive',
        duration: 20,
        difficulty: 'beginner',
        points: 50
      },
      {
        id: 'fractions-and-decimals',
        title: 'Fractions and Decimals',
        titleHi: 'भिन्न और दशमलव',
        titleTe: 'భిన్నాలు మరియు దశాంశాలు',
        content: 'Understand fractions, decimals, and how to work with them.',
        contentHi: 'भिन्न, दशमलव और उनके साथ कैसे काम करना है, यह समझें।',
        contentTe: 'భిన్నాలు, దశాంశాలు మరియు వాటితో ఎలా పని చేయాలో అర్థం చేసుకోండి.',
        type: 'interactive',
        duration: 25,
        difficulty: 'intermediate',
        points: 75
      },
      {
        id: 'algebra-basics',
        title: 'Algebra Basics',
        titleHi: 'बीजगणित की मूल बातें',
        titleTe: 'బీజగణిత ప్రాథమికాలు',
        content: 'Introduction to variables, equations, and algebraic expressions.',
        contentHi: 'चर, समीकरण और बीजगणितीय व्यंजकों का परिचय।',
        contentTe: 'వేరియబుల్స్, సమీకరణాలు మరియు బీజగణిత వ్యక్తీకరణల పరిచయం.',
        type: 'interactive',
        duration: 30,
        difficulty: 'intermediate',
        points: 100
      }
    ]
  },
  {
    id: 'general-knowledge',
    name: 'General Knowledge',
    nameHi: 'सामान्य ज्ञान',
    nameTe: 'సాధారణ జ్ఞానం',
    description: 'Explore science, history, geography, and current affairs',
    descriptionHi: 'विज्ञान, इतिहास, भूगोल और समसामयिक घटनाओं का अन्वेषण करें',
    descriptionTe: 'సైన్స్, చరిత్ర, భూగోళశాస్త్రం మరియు కరెంట్ అఫైర్స్‌ను అన్వేషించండి',
    icon: '🌍',
    color: 'from-orange-500 to-red-600',
    lessons: [
      {
        id: 'solar-system',
        title: 'Our Solar System',
        titleHi: 'हमारा सौर मंडल',
        titleTe: 'మన సౌర వ్యవస్థ',
        content: 'Learn about planets, stars, and the wonders of space.',
        contentHi: 'ग्रहों, तारों और अंतरिक्ष के चमत्कारों के बारे में जानें।',
        contentTe: 'గ్రహాలు, నక్షత్రాలు మరియు అంతరిక్ష అద్భుతాల గురించి తెలుసుకోండి.',
        type: 'video',
        duration: 20,
        difficulty: 'beginner',
        points: 50
      },
      {
        id: 'indian-history',
        title: 'Indian History',
        titleHi: 'भारतीय इतिहास',
        titleTe: 'భారతీయ చరిత్ర',
        content: 'Discover the rich history and culture of India.',
        contentHi: 'भारत के समृद्ध इतिहास और संस्कृति की खोज करें।',
        contentTe: 'భారతదేశం యొక్క గొప్ప చరిత్ర మరియు సంస్కృతిని కనుగొనండి.',
        type: 'text',
        duration: 25,
        difficulty: 'intermediate',
        points: 75
      },
      {
        id: 'environmental-science',
        title: 'Environmental Science',
        titleHi: 'पर्यावरण विज्ञान',
        titleTe: 'పర్యావరణ శాస్త్రం',
        content: 'Learn about ecosystems, climate change, and conservation.',
        contentHi: 'पारिस्थितिकी तंत्र, जलवायु परिवर्तन और संरक्षण के बारे में जानें।',
        contentTe: 'పర్యావరణ వ్యవస్థలు, వాతావరణ మార్పు మరియు పరిరక్షణ గురించి తెలుసుకోండి.',
        type: 'interactive',
        duration: 30,
        difficulty: 'intermediate',
        points: 100
      }
    ]
  }
]

export const achievements = [
  {
    id: 'first_lesson',
    name: 'First Steps',
    nameHi: 'पहला कदम',
    nameTe: 'మొదటి అడుగులు',
    description: 'Complete your first lesson',
    descriptionHi: 'अपना पहला पाठ पूरा करें',
    descriptionTe: 'మీ మొదటి పాఠాన్ని పూర్తి చేయండి',
    icon: '🎯',
    condition: 'first_lesson',
    points: 100
  },
  {
    id: 'ten_lessons',
    name: 'Dedicated Learner',
    nameHi: 'समर्पित शिक्षार्थी',
    nameTe: 'అంకితమైన అభ్యాసకుడు',
    description: 'Complete 10 lessons',
    descriptionHi: '10 पाठ पूरे करें',
    descriptionTe: '10 పాఠాలను పూర్తి చేయండి',
    icon: '📚',
    condition: 'ten_lessons',
    points: 500
  },
  {
    id: 'first_quiz',
    name: 'Quiz Master',
    nameHi: 'क्विज़ मास्टर',
    nameTe: 'క్విజ్ మాస్టర్',
    description: 'Complete your first quiz',
    descriptionHi: 'अपना पहला क्विज़ पूरा करें',
    descriptionTe: 'మీ మొదటి క్విజ్‌ను పూర్తి చేయండి',
    icon: '🧠',
    condition: 'first_quiz',
    points: 150
  },
  {
    id: 'perfect_quiz',
    name: 'Perfect Score',
    nameHi: 'परफेक्ट स्कोर',
    nameTe: 'పర్ఫెక్ట్ స్కోర్',
    description: 'Score 100% in a quiz',
    descriptionHi: 'क्विज़ में 100% स्कोर करें',
    descriptionTe: 'క్విజ్‌లో 100% స్కోర్ చేయండి',
    icon: '⭐',
    condition: 'perfect_quiz',
    points: 300
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    nameHi: 'सप्ताह योद्धा',
    nameTe: 'వారం యోధుడు',
    description: 'Maintain a 7-day learning streak',
    descriptionHi: '7 दिन की लर्निंग स्ट्रीक बनाए रखें',
    descriptionTe: '7 రోజుల అభ్యాస వరుసను కొనసాగించండి',
    icon: '🔥',
    condition: 'week_streak',
    points: 400
  },
  {
    id: 'thousand_points',
    name: 'Point Collector',
    nameHi: 'पॉइंट कलेक्टर',
    nameTe: 'పాయింట్ కలెక్టర్',
    description: 'Earn 1000 points',
    descriptionHi: '1000 पॉइंट अर्जित करें',
    descriptionTe: '1000 పాయింట్లు సంపాదించండి',
    icon: '💎',
    condition: 'thousand_points',
    points: 200
  },
  {
    id: 'level_five',
    name: 'Rising Star',
    nameHi: 'उभरता सितारा',
    nameTe: 'ఉదయిస్తున్న నక్షత్రం',
    description: 'Reach level 5',
    descriptionHi: 'स्तर 5 तक पहुंचें',
    descriptionTe: 'స్థాయి 5కి చేరుకోండి',
    icon: '🌟',
    condition: 'level_five',
    points: 600
  }
]