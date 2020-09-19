import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'
import { LoadSurveys } from '../../../domain/usecases/load-surveys'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.loadAll()
  }
}
