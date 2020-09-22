import { AddLogModel } from '@/domain/models/log'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

export type AccountsCollection = Collection<AddAccountModel>
export const getAccountsCollection = async (): Promise<AccountsCollection> => await MongoHelper.getCollection('accounts')

export type SurveysCollection = Collection<AddSurveyModel>
export const getSurveysCollection = async (): Promise<SurveysCollection> => await MongoHelper.getCollection('surveys')

export type ErrorCollection = Collection<AddLogModel>
export const getErrorCollection = async (): Promise<ErrorCollection> => await MongoHelper.getCollection('errors')

export type SurveyResultsCollection = Collection<SaveSurveyResultModel>
export const getSurveyResultsCollection = async (): Promise<SurveyResultsCollection> => await MongoHelper.getCollection('surveyResults')
