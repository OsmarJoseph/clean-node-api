import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { AddAccountRepository, AddSurveyRepository, SaveSurveyResultRepository, LogErrorRepository } from '@/data/protocols'
import { Collection } from 'mongodb'

export type AccountsCollection = Collection<AddAccountRepository.Params>
export const getAccountsCollection = async (): Promise<AccountsCollection> => await MongoHelper.getCollection('accounts')

export type SurveysCollection = Collection<AddSurveyRepository.Params>
export const getSurveysCollection = async (): Promise<SurveysCollection> => await MongoHelper.getCollection('surveys')

export type ErrorsCollection = Collection<LogErrorRepository.Params & {date: Date}>
export const getErrorsCollection = async (): Promise<ErrorsCollection> => await MongoHelper.getCollection('errors')

export type SurveyResultsCollection = Collection<SaveSurveyResultRepository.Params>
export const getSurveyResultsCollection = async (): Promise<SurveyResultsCollection> => await MongoHelper.getCollection('surveyResults')
