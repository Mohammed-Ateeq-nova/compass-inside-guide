class SpeechService {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis
  private isListening = false

  constructor() {
    this.synthesis = window.speechSynthesis
    
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition()
    }

    if (this.recognition) {
      this.recognition.continuous = false
      this.recognition.interimResults = false
    }
  }

  async startListening(language: 'en' | 'hi' | 'te' = 'en'): Promise<string> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported')
    }

    if (this.isListening) {
      throw new Error('Already listening')
    }

    const languageMap = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN'
    }

    this.recognition.lang = languageMap[language]
    this.isListening = true

    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not available'))
        return
      }

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        this.isListening = false
        resolve(transcript)
      }

      this.recognition.onerror = (event) => {
        this.isListening = false
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isListening = false
      }

      this.recognition.start()
    })
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  speak(text: string, language: 'en' | 'hi' | 'te' = 'en') {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not supported')
    }

    // Stop any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    const languageMap = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN'
    }

    utterance.lang = languageMap[language]
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    // Try to find a voice for the specific language
    const voices = this.synthesis.getVoices()
    const voice = voices.find(v => v.lang.startsWith(languageMap[language].split('-')[0]))
    if (voice) {
      utterance.voice = voice
    }

    this.synthesis.speak(utterance)
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  getIsListening() {
    return this.isListening
  }

  isSupported() {
    return !!(this.recognition && this.synthesis)
  }
}

export const speechService = new SpeechService()