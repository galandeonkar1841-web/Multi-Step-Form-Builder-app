import React from 'react'
import { useFormStore } from '../store/useFormStore'
import { COMPONENTS } from './ComponentPanel'
import styles from './PropertiesPanel.module.css'

export default function PropertiesPanel() {
  const { getSelectedField, updateField, selectedFieldId } = useFormStore()
  const field = getSelectedField()

  if (!field) {
    return (
      <aside className={styles.panel}>
        <div className={styles.panelTitle}>Properties</div>
        <div className={styles.empty}>Select a field to edit its properties</div>
      </aside>
    )
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.panelTitle}>Properties</div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Field Settings</div>
        <div className={styles.row}>
          <label className={styles.label}>Label</label>
          <input
            className={styles.input}
            value={field.label}
            onChange={e => updateField(field.id, 'label', e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Placeholder</label>
          <input
            className={styles.input}
            value={field.placeholder || ''}
            onChange={e => updateField(field.id, 'placeholder', e.target.value)}
          />
        </div>
        <div className={styles.toggleRow}>
          <span className={styles.label}>Required</span>
          <button
            className={`${styles.toggle} ${field.required ? styles.on : ''}`}
            onClick={() => updateField(field.id, 'required', !field.required)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Validation</div>
        <div className={styles.row}>
          <label className={styles.label}>Error Message</label>
          <input
            className={styles.input}
            placeholder="This field is required"
            value={field.errorMessage || ''}
            onChange={e => updateField(field.id, 'errorMessage', e.target.value)}
          />
        </div>
        {(field.type === 'short_text' || field.type === 'long_text') && (
          <>
            <div className={styles.row}>
              <label className={styles.label}>Min Length</label>
              <input className={styles.input} type="number" value={field.minLength || ''} onChange={e => updateField(field.id, 'minLength', e.target.value)} />
            </div>
            <div className={styles.row}>
              <label className={styles.label}>Max Length</label>
              <input className={styles.input} type="number" value={field.maxLength || ''} onChange={e => updateField(field.id, 'maxLength', e.target.value)} />
            </div>
          </>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Change Type</div>
        <div className={styles.tagGrid}>
          {COMPONENTS.map(c => (
            <span
              key={c.type}
              className={`${styles.tag} ${c.type === field.type ? styles.tagActive : ''}`}
              onClick={() => updateField(field.id, 'type', c.type)}
            >
              {c.icon} {c.label}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
