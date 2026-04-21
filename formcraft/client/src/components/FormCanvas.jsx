import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useFormStore } from '../store/useFormStore'
import styles from './FormCanvas.module.css'

function SortableField({ field }) {
  const { selectedFieldId, selectField, deleteField, duplicateField } = useFormStore()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const isSelected = selectedFieldId === field.id

  const renderMock = () => {
    switch (field.type) {
      case 'checkbox':
        return <div className={styles.checkRow}><input type="checkbox" readOnly /><span>{field.label}</span></div>
      case 'radio':
        return <div className={styles.checkRow}>
          <input type="radio" readOnly /><span>Option 1</span>&nbsp;&nbsp;
          <input type="radio" readOnly /><span>Option 2</span>
        </div>
      case 'dropdown':
        return <div className={`${styles.inputMock} ${styles.dropdownMock}`}>{field.placeholder || 'Select option'} <span>▾</span></div>
      case 'long_text':
        return <div className={`${styles.inputMock} ${styles.textareaMock}`}>{field.placeholder || ''}</div>
      default:
        return <div className={styles.inputMock}>{field.placeholder || field.label}</div>
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.fieldItem} ${isSelected ? styles.selected : ''} fade-in`}
      onClick={() => selectField(field.id)}
    >
      <div className={styles.dragHandle} {...attributes} {...listeners}>⠿</div>
      <div className={styles.fieldContent}>
        <div className={styles.fieldLabel}>
          {field.label}
          {field.required && <span className={styles.required}> *</span>}
          <span className={styles.typeBadge}>{field.type.replace('_', ' ')}</span>
        </div>
        {renderMock()}
      </div>
      <div className={styles.fieldActions}>
        <button onClick={e => { e.stopPropagation(); duplicateField(field.id) }} title="Duplicate">⧉</button>
        <button onClick={e => { e.stopPropagation(); deleteField(field.id) }} title="Delete" className={styles.deleteBtn}>✕</button>
      </div>
    </div>
  )
}

export default function FormCanvas() {
  const { steps, currentStep, goToStep, addStep, deleteStep, updateStepTitle, addField, reorderFields } = useFormStore()
  const [isDragOver, setIsDragOver] = useState(false)

  const step = steps[currentStep]

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIdx = step.fields.findIndex(f => f.id === active.id)
      const newIdx = step.fields.findIndex(f => f.id === over.id)
      reorderFields(oldIdx, newIdx)
    }
  }

  const handleDropFromPanel = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const type = e.dataTransfer.getData('componentType')
    const label = e.dataTransfer.getData('componentLabel')
    if (type) addField(type, label)
  }

  return (
    <main className={styles.canvas}>
      {/* Step Pills Nav */}
      <div className={styles.stepsNav}>
        {steps.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.stepPill} ${i === currentStep ? styles.active : ''}`}
            onClick={() => goToStep(i)}
          >
            <span className={styles.pillNum}>{i + 1}</span>
            {s.title}
          </button>
        ))}
        <button className={styles.addStepRound} onClick={addStep} title="Add step">+</button>
      </div>

      {/* Canvas card */}
      <div className={styles.canvasCard}>
        <div className={styles.canvasHeader}>
          <input
            className={styles.stepTitleInput}
            value={step.title}
            onChange={e => updateStepTitle(e.target.value)}
            placeholder="Step title..."
          />
          <button className={styles.deleteStepBtn} onClick={deleteStep}>Delete Step</button>
        </div>

        {/* Drop zone */}
        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''}`}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDropFromPanel}
        >
          {step.fields.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⬇</div>
              <p>Drag a component from the left panel to add a field</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={step.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                {step.fields.map(field => (
                  <SortableField key={field.id} field={field} />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </main>
  )
}
