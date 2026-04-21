const mongoose = require('mongoose')

const FieldSchema = new mongoose.Schema({
  id:          { type: String, required: true },
  type:        { type: String, required: true },
  label:       { type: String, required: true },
  placeholder: { type: String, default: '' },
  required:    { type: Boolean, default: false },
  options:     [String],
  minLength:   Number,
  maxLength:   Number,
  errorMessage:{ type: String, default: '' },
}, { _id: false })

const StepSchema = new mongoose.Schema({
  id:     { type: String, required: true },
  title:  { type: String, required: true },
  fields: [FieldSchema],
}, { _id: false })

const FormSchema = new mongoose.Schema({
  title:       { type: String, required: true, default: 'Untitled Form' },
  steps:       [StepSchema],
  isPublished: { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
})

FormSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Form', FormSchema)
