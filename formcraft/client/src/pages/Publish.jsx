import React, { useState } from 'react'
import { useFormStore } from '../store/useFormStore'
import styles from './Publish.module.css'

function Toggle({ on, onChange }) {
  return (
    <button
      className={`${styles.toggle} ${on ? styles.on : ''}`}
      onClick={() => onChange(!on)}
    />
  )
}

export default function PublishPage() {
  const { formId, formTitle, saveForm, isSaving } = useFormStore()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    progressBar: true,
    allowBack: false,
    savePartial: false,
  })
  const [published, setPublished] = useState(false)
  const [publishedId, setPublishedId] = useState(formId)

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }))

  const handlePublish = async () => {
    try {
      const result = await saveForm()
      setPublishedId(result._id)
      setPublished(true)
    } catch {
      alert('Save failed — make sure your backend is running on port 5000.')
    }
  }

  const shareUrl = publishedId
    ? `${window.location.origin}/fill/${publishedId}`
    : 'Save the form first to get a link'

  const embedCode = publishedId
    ? `<iframe src="${shareUrl}" width="100%" height="600px" frameborder="0"></iframe>`
    : '—'

  const copy = (text) => { navigator.clipboard.writeText(text); alert('Copied!') }

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Publish Your Form</h2>
        <p className={styles.sub}>Share your multi-step form anywhere once saved.</p>

        {!published ? (
          <div className={styles.publishPrompt}>
            <p>Save & publish <strong>{formTitle}</strong> to get your shareable link.</p>
            <button className={styles.btnPrimary} onClick={handlePublish} disabled={isSaving}>
              {isSaving ? 'Publishing…' : '🚀 Save & Publish'}
            </button>
          </div>
        ) : (
          <div className={styles.successBanner}>✓ Form published successfully!</div>
        )}

        <div className={styles.card}>
          <h3>Share Link</h3>
          <p>Anyone with this link can fill out your form.</p>
          <div className={styles.codeBlock}>{shareUrl}</div>
          <button className={styles.btn} onClick={() => copy(shareUrl)}>Copy Link</button>
        </div>

        <div className={styles.card}>
          <h3>Embed Code</h3>
          <p>Paste this snippet into any website to embed the form.</p>
          <div className={styles.codeBlock}>{embedCode}</div>
          <button className={styles.btn} onClick={() => copy(embedCode)}>Copy Embed</button>
        </div>

        <div className={styles.card}>
          <h3>Form Settings</h3>
          {[
            { key: 'emailNotifications', label: 'Email Notifications', sub: 'Get notified on each submission' },
            { key: 'progressBar', label: 'Show Progress Bar', sub: 'Visible step indicator for users' },
            { key: 'allowBack', label: 'Allow Back Navigation', sub: 'Let users go to previous steps' },
            { key: 'savePartial', label: 'Save Partial Responses', sub: 'Auto-save if user leaves the form' },
          ].map(({ key, label, sub }) => (
            <div key={key} className={styles.settingsRow}>
              <div>
                <div className={styles.settingsLabel}>{label}</div>
                <div className={styles.settingsSub}>{sub}</div>
              </div>
              <Toggle on={settings[key]} onChange={() => toggle(key)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
