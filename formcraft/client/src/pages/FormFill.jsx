import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formApi } from '../api/formApi'
import styles from './Preview.module.css'

function FieldRenderer({ field, value, onChange }) {
  switch (field.type) {
    case 'long_text':
      return <textarea className={styles.textarea} placeholder={field.placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />
    case 'dropdown':
      return (
        <select className={styles.select} value={value || ''} onChange={e => onChange(e.target.value)}>
          <option value="">{field.placeholder || 'Select…'}</option>
          {(field.options || ['Option A', 'Option B', 'Option C']).map(o => <option key={o}>{o}</option>)}
        </select>
      )
    case 'checkbox':
      return <label className={styles.checkLabel}><input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} /><span>{field.label}</span></label>
    case 'radio':
      return <div className={styles.radioGroup}>{['Option 1', 'Option 2', 'Option 3'].map(o => <label key={o} className={styles.checkLabel}><input type="radio" name={field.id} value={o} checked={value === o} onChange={() => onChange(o)} /><span>{o}</span></label>)}</div>
    case 'date':
      return <input type="date" className={styles.input} value={value || ''} onChange={e => onChange(e.target.value)} />
    case 'number':
      return <input type="number" className={styles.input} placeholder={field.placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />
    default:
      return <input type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'} className={styles.input} placeholder={field.placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />
  }
}

export default function FormFill() {
  const { formId } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    formApi.getOne(formId)
      .then(r => setForm(r.data))
      .catch(() => setError('Form not found.'))
      .finally(() => setLoading(false))
  }, [formId])

  if (loading) return <div className={styles.wrap}><p style={{ color: 'var(--muted)' }}>Loading form…</p></div>
  if (error) return <div className={styles.wrap}><p style={{ color: 'var(--accent2)' }}>{error}</p></div>

  const current = form.steps[step]

  const setAnswer = (fieldId, val) => {
    setAnswers(p => ({ ...p, [fieldId]: val }))
    setFieldErrors(p => ({ ...p, [fieldId]: null }))
  }

  const validate = () => {
    const errs = {}
    current.fields.forEach(f => { if (f.required && !answers[f.id]) errs[f.id] = f.errorMessage || 'Required' })
    setFieldErrors(errs)
    return !Object.keys(errs).length
  }

  const next = async () => {
    if (!validate()) return
    if (step < form.steps.length - 1) { setStep(s => s + 1); return }
    try {
      await formApi.submit(formId, answers)
      setSubmitted(true)
    } catch { alert('Submission failed.') }
  }

  if (submitted) return (
    <div className={styles.wrap}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <h2>Submitted!</h2>
        <p>Thank you for your response.</p>
      </div>
    </div>
  )

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.progress}>
          {form.steps.map((_, i) => <div key={i} className={`${styles.progressDot} ${i < step ? styles.done : i === step ? styles.active : ''}`} />)}
        </div>
        <div className={styles.meta}><span className={styles.metaStep}>Step {step + 1} of {form.steps.length}</span><span className={styles.metaForm}>{form.title}</span></div>
        <h2 className={styles.title}>{current.title}</h2>
        <div className={styles.fields}>
          {current.fields.map(field => (
            <div key={field.id} className={styles.fieldRow}>
              {field.type !== 'checkbox' && <label className={styles.fieldLabel}>{field.label}{field.required && <span className={styles.required}> *</span>}</label>}
              <FieldRenderer field={field} value={answers[field.id]} onChange={val => setAnswer(field.id, val)} />
              {fieldErrors[field.id] && <span className={styles.error}>{fieldErrors[field.id]}</span>}
            </div>
          ))}
        </div>
        <div className={styles.nav}>
          {step > 0 ? <button className={styles.btn} onClick={() => setStep(s => s - 1)}>← Back</button> : <div />}
          <button className={styles.btnPrimary} onClick={next}>{step < form.steps.length - 1 ? 'Next →' : 'Submit'}</button>
        </div>
      </div>
    </div>
  )
}
