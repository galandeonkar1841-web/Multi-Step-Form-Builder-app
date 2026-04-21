import React from 'react'
import { useFormStore } from '../store/useFormStore'
import styles from './TopBar.module.css'

export default function TopBar() {
  const { activeTab, setActiveTab, formTitle, setFormTitle, saveForm, isSaving } = useFormStore()

  const handleSave = async () => {
    try {
      await saveForm()
      alert('Form saved successfully!')
    } catch {
      alert('Failed to save. Is the backend running?')
    }
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.logo}>Form<span>Craft</span></div>

      <input
        className={styles.titleInput}
        value={formTitle}
        onChange={e => setFormTitle(e.target.value)}
        placeholder="Form title..."
      />

      <div className={styles.tabs}>
        {['builder', 'preview', 'publish'].map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.btn} onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setActiveTab('publish')}>
          Publish
        </button>
      </div>
    </header>
  )
}
