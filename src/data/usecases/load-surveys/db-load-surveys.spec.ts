import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'
import MockDate from 'mockdate'

const makeMockSurvey = (): SurveyModel => (
  {
    id: 'any_id',
    question: 'any_question',
    possibleAnswers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
)
const makeMockSurveysList = (): SurveyModel[] => [
  makeMockSurvey(),makeMockSurvey()
]

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return makeMockSurveysList()
    }
  }
  return new LoadSurveysRepositoryStub()
}
interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}
const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}
describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveysRepository', async () => {
    const { sut,loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub,'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
  test('Should throw if loadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub,'loadAll').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const surveysListPromise = sut.load()
    await expect(surveysListPromise).rejects.toThrow()
  })
  test('Should return a list of surveys on success', async () => {
    const { sut } = makeSut()
    const surveysList = await sut.load()
    expect(surveysList).toEqual(makeMockSurveysList())
  })
})
