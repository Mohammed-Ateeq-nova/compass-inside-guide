import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = 'AIzaSyAgqOzY7KU-kh8GxNN4Y8PSNUpqGqadP0U'
const genAI = new GoogleGenerativeAI(API_KEY)

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  async generateResponse(prompt: string, language: 'en' | 'hi' | 'te' = 'en', context?: string) {
    try {
      const languageInstructions = {
        en: 'Respond in English.',
        hi: 'हिंदी में जवाब दें। Use Devanagari script.',
        te: 'తెలుగులో జవాబు ఇవ్వండి। Use Telugu script.'
      }

      const systemPrompt = `You are Shiksha AI, a helpful AI tutor for Indian students. You specialize in teaching coding, mathematics, and general knowledge. ${languageInstructions[language]} 

Keep your responses:
- Educational and encouraging
- Age-appropriate for school students
- Clear and easy to understand
- Include examples when helpful
- Be patient and supportive

${context ? `Context: ${context}` : ''}

Student's question: ${prompt}`

      const result = await this.model.generateContent(systemPrompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error('Failed to generate response. Please try again.')
    }
  }

  async generateQuizQuestions(subject: string, difficulty: string, count: number, language: 'en' | 'hi' | 'te' = 'en') {
    try {
      const languageInstructions = {
        en: 'Generate questions in English.',
        hi: 'प्रश्न हिंदी में बनाएं।',
        te: 'ప్రశ్నలను తెలుగులో రూపొందించండి।'
      }

      const prompt = `Generate ${count} multiple choice questions about ${subject} at ${difficulty} level. ${languageInstructions[language]}

Format as JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct"
  }
]

Make questions educational, clear, and appropriate for Indian students.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      throw new Error('Failed to parse quiz questions')
    } catch (error) {
      console.error('Quiz generation error:', error)
      throw new Error('Failed to generate quiz questions. Please try again.')
    }
  }

  async explainConcept(concept: string, subject: string, language: 'en' | 'hi' | 'te' = 'en') {
    try {
      const languageInstructions = {
        en: 'Explain in English with simple language.',
        hi: 'हिंदी में सरल भाषा में समझाएं।',
        te: 'తెలుగులో సరళమైన భాషలో వివరించండి।'
      }

      const prompt = `Explain the concept of "${concept}" in ${subject}. ${languageInstructions[language]}

Structure your explanation:
1. Simple definition
2. Real-world example
3. Step-by-step breakdown if applicable
4. Common mistakes to avoid
5. Practice tip

Make it engaging and easy to understand for school students.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Concept explanation error:', error)
      throw new Error('Failed to explain concept. Please try again.')
    }
  }
}

export const geminiService = new GeminiService()