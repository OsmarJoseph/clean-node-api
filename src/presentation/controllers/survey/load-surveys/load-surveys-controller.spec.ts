import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel, LoadSurveys } from './load-surveys-protocols'
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
const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return makeMockSurveysList()
    }
  }
  return new LoadSurveysStub()
}
interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}
describe('Load Suveys Controller',() => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveys', async () => {
    const { sut,loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub,'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
