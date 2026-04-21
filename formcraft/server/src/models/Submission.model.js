const mongoose = require('mongoose')

const SubmissionSchema = new mongoose.Schema({
  formId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers:     { type: mongoose.Schema.Types.Mixed, default: {} },
  submittedAt: { type: Date, default: Date.now },
  metadata: {
    ip:        String,
    userAgent: String,
  }
})

module.exports = mongoose.model('Submission', SubmissionSchema)
