import React, { useState } from 'react'
import { useFormStore } from '../store/useFormStore'
import styles from './ComponentPanel.module.css'

export const COMPONENTS = [
  { type: 'short_text', icon: '📝', label: 'Short Text' },
  { type: 'long_text',  icon: '📄', label: 'Long Text' },
  { type: 'email',      icon: '✉️',  label: 'Email' },
  { type: 'dropdown',   icon: '🔽', label: 'Dropdown' },
  { type: 'checkbox',   icon: '☑️',  label: 'Checkbox' },
  { type: 'radio',      icon: '🔘', label: 'Radio' },
  { type: 'number',     icon: '🔢', label: 'Number' },
  { type: 'date',       icon: '📅', label: 'Date' },
  { type: 'phone',      icon: '📞', label: 'Phone' },
  { type: 'file',       icon: '📎', label: 'File Upload' },
]

export default function ComponentPanel() {
  const [filter, setFilter] = useState('')
  const { steps, currentStep, goToStep, addStep } = useFormStore()

  const filtered = COMPONENTS.filter(c =>
    c.label.toLowerCase().includes(filter.toLowerCase())
  )

  const onDragStart = (e, comp) => {
    e.dataTransfer.setData('componentType', comp.type)
    e.dataTransfer.setData('componentLabel', comp.label)
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.section}>
        <div className={styles.panelTitle}>Components</div>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Filter..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <div className={styles.grid}>
          {filtered.map(comp => (
            <div
              key={comp.type}
              className={styles.card}
              draggable
              onDragStart={e => onDragStart(e, comp)}
              title={`Drag to add ${comp.label}`}
            >
              <div className={styles.icon}>{comp.icon}</div>
              <div className={styles.label}>{comp.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.panelTitle}>Steps</div>
        <div className={styles.stepList}>
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`${styles.stepItem} ${i === currentStep ? styles.active : ''}`}
              onClick={() => goToStep(i)}
            >
              <div className={styles.stepNum}>{i + 1}</div>
              <div className={styles.stepName}>{s.title}</div>
              <div className={styles.stepCount}>{s.fields.length}</div>
            </div>
          ))}
        </div>
        <button className={styles.addStepBtn} onClick={addStep}>+ Add Step</button>
      </div>
    </aside>
  )
}
