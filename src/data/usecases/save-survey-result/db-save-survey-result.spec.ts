import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultModel, SurveyResultModel, SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'

const makeSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeMockSurveyResult = (): SurveyResultModel => ({ ...makeSurveyResultData(), id: 'any_id' })

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepository: SaveSurveyResultRepository
}
const makeSaveSurveyResultRespository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeMockSurveyResult()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
const makeSut = (): SutTypes => {
  const saveSurveyResultRepository = makeSaveSurveyResultRespository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepository)
  return {
    sut,
    saveSurveyResultRepository
  }
}
describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut,saveSurveyResultRepository } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepository,'save')
    const surveyResultData = makeSurveyResultData()
    await sut.save(surveyResultData)
    expect(saveSpy).toBeCalledWith(surveyResultData)
  })
})
