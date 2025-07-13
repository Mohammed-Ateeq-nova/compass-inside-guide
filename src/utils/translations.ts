export const getLocalizedContent = (
  content: { [key: string]: string },
  language: 'en' | 'hi' | 'te'
): string => {
  const key = language === 'en' ? 'content' : `content${language.charAt(0).toUpperCase() + language.slice(1)}`
  return content[key] || content.content || ''
}

export const getLocalizedTitle = (
  title: { [key: string]: string },
  language: 'en' | 'hi' | 'te'
): string => {
  const key = language === 'en' ? 'title' : `title${language.charAt(0).toUpperCase() + language.slice(1)}`
  return title[key] || title.title || ''
}

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const calculateLevel = (points: number): number => {
  return Math.floor(points / 1000) + 1
}

export const getPointsForNextLevel = (currentPoints: number): number => {
  const currentLevel = calculateLevel(currentPoints)
  return currentLevel * 1000 - currentPoints
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}