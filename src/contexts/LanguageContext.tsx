import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'hi' | 'te'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    subjects: 'Subjects',
    aiTutor: 'AI Tutor',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    
    // Common
    welcome: 'Welcome',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    continue: 'Continue',
    start: 'Start',
    complete: 'Complete',
    points: 'Points',
    level: 'Level',
    streak: 'Streak',
    
    // Home page
    heroTitle: 'Learn Coding, Math & More in Your Language',
    heroSubtitle: 'AI-powered education platform designed for Indian students',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    
    // Features
    aiTutorFeature: 'AI Tutor',
    aiTutorDesc: 'Get personalized help in Hindi, Telugu, or English',
    gamifiedFeature: 'Gamified Learning',
    gamifiedDesc: 'Earn points, badges, and compete with friends',
    offlineFeature: 'Offline Access',
    offlineDesc: 'Learn even without internet connection',
    
    // Subjects
    coding: 'Coding',
    mathematics: 'Mathematics',
    generalKnowledge: 'General Knowledge',
    
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    grade: 'Grade',
    school: 'School',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    forgotPassword: 'Forgot Password?',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    todayProgress: "Today's Progress",
    recentAchievements: 'Recent Achievements',
    continueLesson: 'Continue Lesson',
    takeQuiz: 'Take Quiz',
    
    // AI Tutor
    askQuestion: 'Ask me anything...',
    voiceInput: 'Voice Input',
    send: 'Send',
    listening: 'Listening...',
    
    // Quiz
    question: 'Question',
    of: 'of',
    timeLeft: 'Time Left',
    submit: 'Submit',
    nextQuestion: 'Next Question',
    quizComplete: 'Quiz Complete!',
    yourScore: 'Your Score',
    
    // Profile
    editProfile: 'Edit Profile',
    changeLanguage: 'Change Language',
    achievements: 'Achievements',
    statistics: 'Statistics',
    
    // Languages
    english: 'English',
    hindi: 'हिंदी',
    telugu: 'తెలుగు'
  },
  hi: {
    // Navigation
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    subjects: 'विषय',
    aiTutor: 'AI शिक्षक',
    profile: 'प्रोफाइल',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',
    
    // Common
    welcome: 'स्वागत है',
    loading: 'लोड हो रहा है...',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    continue: 'जारी रखें',
    start: 'शुरू करें',
    complete: 'पूरा करें',
    points: 'अंक',
    level: 'स्तर',
    streak: 'लगातार',
    
    // Home page
    heroTitle: 'अपनी भाषा में कोडिंग, गणित और अधिक सीखें',
    heroSubtitle: 'भारतीय छात्रों के लिए डिज़ाइन किया गया AI-संचालित शिक्षा मंच',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    
    // Features
    aiTutorFeature: 'AI शिक्षक',
    aiTutorDesc: 'हिंदी, तेलुगु या अंग्रेजी में व्यक्तिगत सहायता पाएं',
    gamifiedFeature: 'गेमिफाइड लर्निंग',
    gamifiedDesc: 'अंक, बैज अर्जित करें और दोस्तों के साथ प्रतिस्पर्धा करें',
    offlineFeature: 'ऑफलाइन एक्सेस',
    offlineDesc: 'इंटरनेट कनेक्शन के बिना भी सीखें',
    
    // Subjects
    coding: 'कोडिंग',
    mathematics: 'गणित',
    generalKnowledge: 'सामान्य ज्ञान',
    
    // Auth
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    fullName: 'पूरा नाम',
    grade: 'कक्षा',
    school: 'स्कूल',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    forgotPassword: 'पासवर्ड भूल गए?',
    
    // Dashboard
    welcomeBack: 'वापस स्वागत है',
    todayProgress: 'आज की प्रगति',
    recentAchievements: 'हाल की उपलब्धियां',
    continueLesson: 'पाठ जारी रखें',
    takeQuiz: 'क्विज़ लें',
    
    // AI Tutor
    askQuestion: 'मुझसे कुछ भी पूछें...',
    voiceInput: 'आवाज़ इनपुट',
    send: 'भेजें',
    listening: 'सुन रहा है...',
    
    // Quiz
    question: 'प्रश्न',
    of: 'का',
    timeLeft: 'समय बचा',
    submit: 'जमा करें',
    nextQuestion: 'अगला प्रश्न',
    quizComplete: 'क्विज़ पूरा!',
    yourScore: 'आपका स्कोर',
    
    // Profile
    editProfile: 'प्रोफाइल संपादित करें',
    changeLanguage: 'भाषा बदलें',
    achievements: 'उपलब्धियां',
    statistics: 'आंकड़े',
    
    // Languages
    english: 'English',
    hindi: 'हिंदी',
    telugu: 'తెలుగు'
  },
  te: {
    // Navigation
    home: 'హోమ్',
    dashboard: 'డాష్‌బోర్డ్',
    subjects: 'విషయాలు',
    aiTutor: 'AI గురువు',
    profile: 'ప్రొఫైల్',
    login: 'లాగిన్',
    register: 'రిజిస్టర్',
    logout: 'లాగౌట్',
    
    // Common
    welcome: 'స్వాగతం',
    loading: 'లోడ్ అవుతోంది...',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    continue: 'కొనసాగించండి',
    start: 'ప్రారంభించండి',
    complete: 'పూర్తి చేయండి',
    points: 'పాయింట్లు',
    level: 'స్థాయి',
    streak: 'వరుస',
    
    // Home page
    heroTitle: 'మీ భాషలో కోడింగ్, గణితం మరియు మరిన్ని నేర్చుకోండి',
    heroSubtitle: 'భారతీయ విద్యార్థుల కోసం రూపొందించిన AI-శక్తితో కూడిన విద్యా వేదిక',
    getStarted: 'ప్రారంభించండి',
    learnMore: 'మరింత తెలుసుకోండి',
    
    // Features
    aiTutorFeature: 'AI గురువు',
    aiTutorDesc: 'తెలుగు, హిందీ లేదా ఇంగ్లీష్‌లో వ్యక్తిగత సహాయం పొందండి',
    gamifiedFeature: 'గేమిఫైడ్ లెర్నింగ్',
    gamifiedDesc: 'పాయింట్లు, బ్యాడ్జ్‌లు సంపాదించండి మరియు స్నేహితులతో పోటీ పడండి',
    offlineFeature: 'ఆఫ్‌లైన్ యాక్సెస్',
    offlineDesc: 'ఇంటర్నెట్ కనెక్షన్ లేకుండా కూడా నేర్చుకోండి',
    
    // Subjects
    coding: 'కోడింగ్',
    mathematics: 'గణితం',
    generalKnowledge: 'సాధారణ జ్ఞానం',
    
    // Auth
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
    fullName: 'పూర్తి పేరు',
    grade: 'తరగతి',
    school: 'పాఠశాల',
    signIn: 'సైన్ ఇన్',
    signUp: 'సైన్ అప్',
    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    
    // Dashboard
    welcomeBack: 'తిరిగి స్వాగతం',
    todayProgress: 'నేటి పురోగతి',
    recentAchievements: 'ఇటీవలి విజయాలు',
    continueLesson: 'పాఠం కొనసాగించండి',
    takeQuiz: 'క్విజ్ తీసుకోండి',
    
    // AI Tutor
    askQuestion: 'నన్ను ఏదైనా అడగండి...',
    voiceInput: 'వాయిస్ ఇన్‌పుట్',
    send: 'పంపండి',
    listening: 'వింటోంది...',
    
    // Quiz
    question: 'ప్రశ్న',
    of: 'లో',
    timeLeft: 'మిగిలిన సమయం',
    submit: 'సమర్పించండి',
    nextQuestion: 'తదుపరి ప్రశ్న',
    quizComplete: 'క్విజ్ పూర్తయింది!',
    yourScore: 'మీ స్కోర్',
    
    // Profile
    editProfile: 'ప్రొఫైల్ సవరించండి',
    changeLanguage: 'భాష మార్చండి',
    achievements: 'విజయాలు',
    statistics: 'గణాంకాలు',
    
    // Languages
    english: 'English',
    hindi: 'हिंदी',
    telugu: 'తెలుగు'
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['en', 'hi', 'te'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}