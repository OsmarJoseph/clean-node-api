import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    surveys: [Survey!]! @auth
  }

  type Survey {
    id: ID!
    question: String!
    possibleAnswers: [SurveyAnswer!]!
    date: DateTime!
  }
  type SurveyAnswer {
    image: String
    answer: String!
  }
`
