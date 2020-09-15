import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

const makeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  possibleAnswers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
}
)

interface SutTypes{
  sut: DbAddSurvey
  addSurveyRepository: AddSurveyRepository
}
const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {}
  }
  return new AddSurveyRepositoryStub()
}
const makeSut = (): SutTypes => {
  const addSurveyRepository = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepository)
  return {
    sut,
    addSurveyRepository
  }
}
describe('DbAddSurvey Usecase', () => {
  test('Should call AddSurveyRepository with corerect values', async () => {
    const { sut,addSurveyRepository } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepository,'add')
    const surveyData = makeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toBeCalledWith(surveyData)
  })
  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut,addSurveyRepository } = makeSut()
    jest.spyOn(addSurveyRepository,'add').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const resultPromise = sut.add(makeSurveyData())
    await expect(resultPromise).rejects.toThrow()
  })
})
