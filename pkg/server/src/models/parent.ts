import { Schema, model, Document, Types } from 'mongoose'
import { Person } from './person'
import { modelNames } from './model-names'

const ParentsSchema = new Schema({
  person: {type: Schema.Types.ObjectId, ref: modelNames.persons }
})

function populateModel() {
  this.populate('person')
}

ParentsSchema.pre('find', populateModel)
ParentsSchema.pre('findOne', populateModel)
ParentsSchema.pre('findOneAndUpdate', populateModel)

ParentsSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

export interface Parent extends Document {
  id: string
  person: Person
}

export default ParentsSchema