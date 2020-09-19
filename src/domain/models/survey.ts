export interface SurveyAnswer{
  image?: string
  answer: string
}
export interface SurveyModel{
  id: string
  question: string
  possibleAnswers: SurveyAnswer[]
  date: Date
}
