export type LogModel ={
  errorStack: string
  date: Date
  id: string
}

export type AddLogParams =Omit<LogModel,'id'>
