type SurveyAnswer = {
  image?: string
  answer: string
}
export type SurveyModel = {
  id: string
  question: string
  possibleAnswers: SurveyAnswer[]
  date: Date
}
