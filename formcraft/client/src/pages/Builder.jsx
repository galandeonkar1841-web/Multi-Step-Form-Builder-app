import React from 'react'
import TopBar from '../components/TopBar'
import ComponentPanel from '../components/ComponentPanel'
import FormCanvas from '../components/FormCanvas'
import PropertiesPanel from '../components/PropertiesPanel'
import PreviewPage from './Preview'
import PublishPage from './Publish'
import { useFormStore } from '../store/useFormStore'
import styles from './Builder.module.css'

export default function Builder() {
  const { activeTab } = useFormStore()

  return (
    <div className={styles.app}>
      <TopBar />
      {activeTab === 'builder' && (
        <div className={styles.layout}>
          <ComponentPanel />
          <FormCanvas />
          <PropertiesPanel />
        </div>
      )}
      {activeTab === 'preview' && <PreviewPage />}
      {activeTab === 'publish' && <PublishPage />}
    </div>
  )
}
