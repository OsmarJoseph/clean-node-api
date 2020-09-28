import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { getSurveyResultsCollection } from '@/infra/db/mongodb/collections'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultsCollection = await getSurveyResultsCollection()
    const { surveyId,accountId,answer,date } = surveyResultData
    await surveyResultsCollection.findOneAndUpdate(
      {
        surveyId,
        accountId
      },{
        $set: {
          answer,
          date
        }
      },{
        upsert: true
      })
    const surveyResult = await this.loadBySurveyId(surveyId)
    return surveyResult
  }

  private async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await getSurveyResultsCollection()
    const query = surveyResultCollection.aggregate([{
      $match: {
        surveyId
      }
    }, {
      $group: {
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        }
      }
    }, {
      $unwind: {
        path: '$data'
      }
    }, {
      $lookup: {
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      }
    }, {
      $unwind: {
        path: '$survey'
      }
    }, {
      $group: {
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.possibleAnswers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer']
              }
            }
          }
        },
        count: {
          $sum: 1
        }
      }
    }, {
      $unwind: {
        path: '$_id.answer'
      }
    }, {
      $addFields: {
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [{
            $divide: ['$count', '$_id.total']
          }, 100]
        }
      }
    }, {
      $group: {
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date'
        },
        answers: {
          $push: '$_id.answer'
        }
      }
    }, {
      $project: {
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      }
    }])
    const surveyResult = await query.toArray() as unknown as SurveyResultModel[]
    return surveyResult?.length ? surveyResult[0] : null
  }
}
