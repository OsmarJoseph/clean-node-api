export type LogModel ={
  errorStack: string
  date: Date
  id: string
}

export type AddLogModel =Omit<LogModel,'id'>
