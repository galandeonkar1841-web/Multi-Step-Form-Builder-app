const Form = require('../models/Form.model')
const Submission = require('../models/Submission.model')

// GET /api/forms
exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find().select('title isPublished createdAt updatedAt steps').sort('-createdAt')
    res.json(forms)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/forms/:id
exports.getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
    if (!form) return res.status(404).json({ error: 'Form not found' })
    res.json(form)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/forms
exports.createForm = async (req, res) => {
  try {
    const { title, steps } = req.body
    const form = await Form.create({ title, steps, isPublished: true })
    res.status(201).json(form)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// PUT /api/forms/:id
exports.updateForm = async (req, res) => {
  try {
    const { title, steps, isPublished } = req.body
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { title, steps, isPublished, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
    if (!form) return res.status(404).json({ error: 'Form not found' })
    res.json(form)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// DELETE /api/forms/:id
exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id)
    if (!form) return res.status(404).json({ error: 'Form not found' })
    await Submission.deleteMany({ formId: req.params.id })
    res.json({ message: 'Form deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/forms/:id/submit
exports.submitForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
    if (!form) return res.status(404).json({ error: 'Form not found' })

    const submission = await Submission.create({
      formId: req.params.id,
      answers: req.body.answers || {},
      metadata: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      }
    })
    res.status(201).json({ message: 'Submission received', id: submission._id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// GET /api/forms/:id/submissions
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ formId: req.params.id }).sort('-submittedAt')
    res.json(submissions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
