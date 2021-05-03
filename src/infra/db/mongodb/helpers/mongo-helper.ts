import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  },

  async disconnect() {
    await this.client.close()
    this.client = null
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) await this.connect(this.uri)

    return this.client.db().collection(name)
  },

  map: (mongoObject: any): any => {
    if (mongoObject) {
      const { _id, ...accountWithoutId } = mongoObject
      return { ...accountWithoutId, id: _id }
    }
  },

  mapArray: (mongoObject: any[]): any => {
    return mongoObject.map((mongoObject) => MongoHelper.map(mongoObject))
  },
}
