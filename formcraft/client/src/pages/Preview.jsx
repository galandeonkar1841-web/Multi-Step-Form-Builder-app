import React, { useState } from 'react'
import { useFormStore } from '../store/useFormStore'
import styles from './Preview.module.css'

function FieldRenderer({ field, value, onChange }) {
  switch (field.type) {
    case 'long_text':
      return (
        <textarea
          className={styles.textarea}
          placeholder={field.placeholder || field.label}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      )
    case 'dropdown':
      return (
        <select
          className={styles.select}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">{field.placeholder || 'Select an option'}</option>
          {(field.options || ['Option A', 'Option B', 'Option C']).map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    case 'checkbox':
      return (
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => onChange(e.target.checked)}
          />
          <span>{field.label}</span>
        </label>
      )
    case 'radio':
      return (
        <div className={styles.radioGroup}>
          {['Option 1', 'Option 2', 'Option 3'].map(opt => (
            <label key={opt} className={styles.checkLabel}>
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )
    case 'date':
      return (
        <input
          type="date"
          className={styles.input}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      )
    case 'number':
      return (
        <input
          type="number"
          className={styles.input}
          placeholder={field.placeholder || '0'}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      )
    case 'file':
      return <input type="file" className={styles.input} />
    default:
      return (
        <input
          type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
          className={styles.input}
          placeholder={field.placeholder || field.label}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      )
  }
}

export default function PreviewPage() {
  const { steps, formTitle } = useFormStore()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const current = steps[step]

  const setAnswer = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
    setErrors(prev => ({ ...prev, [fieldId]: null }))
  }

  const validate = () => {
    const newErrors = {}
    current.fields.forEach(f => {
      if (f.required && !answers[f.id]) {
        newErrors[f.id] = f.errorMessage || 'This field is required'
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const next = () => {
    if (!validate()) return
    if (step < steps.length - 1) setStep(s => s + 1)
    else setSubmitted(true)
  }

  const back = () => setStep(s => s - 1)

  if (submitted) {
    return (
      <div className={styles.wrap}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>Form Submitted!</h2>
          <p>Thank you for your response.</p>
          <button className={styles.btnPrimary} onClick={() => { setStep(0); setAnswers({}); setSubmitted(false) }}>
            Submit Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        {/* Progress bar */}
        <div className={styles.progress}>
          {steps.map((_, i) => (
            <div
              key={i}
              className={`${styles.progressDot} ${i < step ? styles.done : i === step ? styles.active : ''}`}
            />
          ))}
        </div>

        <div className={styles.meta}>
          <span className={styles.metaStep}>Step {step + 1} of {steps.length}</span>
          <span className={styles.metaForm}>{formTitle}</span>
        </div>

        <h2 className={styles.title}>{current.title}</h2>

        <div className={styles.fields}>
          {current.fields.map(field => (
            <div key={field.id} className={styles.fieldRow}>
              {field.type !== 'checkbox' && (
                <label className={styles.fieldLabel}>
                  {field.label}
                  {field.required && <span className={styles.required}> *</span>}
                </label>
              )}
              <FieldRenderer
                field={field}
                value={answers[field.id]}
                onChange={val => setAnswer(field.id, val)}
              />
              {errors[field.id] && (
                <span className={styles.error}>{errors[field.id]}</span>
              )}
            </div>
          ))}
        </div>

        <div className={styles.nav}>
          {step > 0
            ? <button className={styles.btn} onClick={back}>← Back</button>
            : <div />
          }
          <button className={styles.btnPrimary} onClick={next}>
            {step < steps.length - 1 ? 'Next →' : 'Submit Form'}
          </button>
        </div>
      </div>
    </div>
  )
}
