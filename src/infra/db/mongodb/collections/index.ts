import { AddLogModel } from '@/domain/models/log'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

export type AccountsCollection = Collection<AddAccountParams>
export const getAccountsCollection = async (): Promise<AccountsCollection> => await MongoHelper.getCollection('accounts')

export type SurveysCollection = Collection<AddSurveyParams>
export const getSurveysCollection = async (): Promise<SurveysCollection> => await MongoHelper.getCollection('surveys')

export type ErrorCollection = Collection<AddLogModel>
export const getErrorCollection = async (): Promise<ErrorCollection> => await MongoHelper.getCollection('errors')

export type SurveyResultsCollection = Collection<SaveSurveyResultParams>
export const getSurveyResultsCollection = async (): Promise<SurveyResultsCollection> => await MongoHelper.getCollection('surveyResults')
