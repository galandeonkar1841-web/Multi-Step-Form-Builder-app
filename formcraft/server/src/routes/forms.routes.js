const express = require('express')
const router = express.Router()
const {
  getAllForms,
  getForm,
  createForm,
  updateForm,
  deleteForm,
  submitForm,
  getSubmissions,
} = require('../controllers/forms.controller')

router.get('/',              getAllForms)
router.post('/',             createForm)
router.get('/:id',           getForm)
router.put('/:id',           updateForm)
router.delete('/:id',        deleteForm)
router.post('/:id/submit',   submitForm)
router.get('/:id/submissions', getSubmissions)

module.exports = router
