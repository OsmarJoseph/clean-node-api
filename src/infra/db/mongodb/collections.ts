import { AddLogParams } from '@/domain/models'
import { AddAccountParams , AddSurveyParams , SaveSurveyResultParams } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection } from 'mongodb'

export type AccountsCollection = Collection<AddAccountParams>
export const getAccountsCollection = async (): Promise<AccountsCollection> => await MongoHelper.getCollection('accounts')

export type SurveysCollection = Collection<AddSurveyParams>
export const getSurveysCollection = async (): Promise<SurveysCollection> => await MongoHelper.getCollection('surveys')

export type ErrorCollection = Collection<AddLogParams>
export const getErrorCollection = async (): Promise<ErrorCollection> => await MongoHelper.getCollection('errors')

export type SurveyResultsCollection = Collection<SaveSurveyResultParams>
export const getSurveyResultsCollection = async (): Promise<SurveyResultsCollection> => await MongoHelper.getCollection('surveyResults')
