import { LoadSurveys } from '@/domain/usecases'
import { LoadSurveysRepository } from '@/data/protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load(): Promise<LoadSurveys.Result> {
    return await this.loadSurveysRepository.loadAll()
  }
}
