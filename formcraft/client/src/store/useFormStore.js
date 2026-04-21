import { create } from 'zustand'

const DEFAULT_STEPS = [
  {
    id: 's1',
    title: 'Contact Info',
    fields: [
      { id: 'f1', type: 'short_text', label: 'Full Name', placeholder: 'e.g. Priya Sharma', required: true },
      { id: 'f2', type: 'email', label: 'Email Address', placeholder: 'name@example.com', required: true },
      { id: 'f3', type: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', required: false },
    ]
  },
  {
    id: 's2',
    title: 'Profile Details',
    fields: [
      { id: 'f4', type: 'short_text', label: 'Job Title', placeholder: 'e.g. Product Manager', required: false },
      { id: 'f5', type: 'dropdown', label: 'Department', placeholder: 'Select department', required: true, options: ['Engineering', 'Design', 'Marketing', 'Sales'] },
      { id: 'f6', type: 'checkbox', label: 'Subscribe to Newsletter', placeholder: '', required: false },
    ]
  },
  {
    id: 's3',
    title: 'Review & Submit',
    fields: [
      { id: 'f7', type: 'long_text', label: 'Any Comments?', placeholder: 'Tell us anything else...', required: false },
    ]
  }
]

let idCounter = 100
const uid = (prefix = 'f') => `${prefix}${++idCounter}`

export const useFormStore = create((set, get) => ({
  // State
  formId: null,
  formTitle: 'Contact Onboarding',
  steps: DEFAULT_STEPS,
  currentStep: 0,
  selectedFieldId: null,
  activeTab: 'builder',
  isSaving: false,
  saveError: null,

  // Tab
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Form meta
  setFormTitle: (title) => set({ formTitle: title }),

  // Steps
  goToStep: (idx) => set({ currentStep: idx, selectedFieldId: null }),

  addStep: () => set((state) => {
    const newStep = { id: uid('s'), title: 'New Step', fields: [] }
    return {
      steps: [...state.steps, newStep],
      currentStep: state.steps.length,
      selectedFieldId: null
    }
  }),

  deleteStep: () => set((state) => {
    if (state.steps.length === 1) return state
    const steps = state.steps.filter((_, i) => i !== state.currentStep)
    return { steps, currentStep: Math.max(0, state.currentStep - 1), selectedFieldId: null }
  }),

  updateStepTitle: (title) => set((state) => {
    const steps = state.steps.map((s, i) => i === state.currentStep ? { ...s, title } : s)
    return { steps }
  }),

  // Fields
  addField: (type, label, icon) => set((state) => {
    const newField = { id: uid(), type, label, placeholder: '', required: false }
    const steps = state.steps.map((s, i) =>
      i === state.currentStep ? { ...s, fields: [...s.fields, newField] } : s
    )
    return { steps, selectedFieldId: newField.id }
  }),

  deleteField: (fieldId) => set((state) => {
    const steps = state.steps.map((s, i) =>
      i === state.currentStep ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) } : s
    )
    return { steps, selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId }
  }),

  duplicateField: (fieldId) => set((state) => {
    const step = state.steps[state.currentStep]
    const idx = step.fields.findIndex(f => f.id === fieldId)
    const orig = step.fields[idx]
    const copy = { ...orig, id: uid(), label: orig.label + ' (copy)' }
    const fields = [...step.fields.slice(0, idx + 1), copy, ...step.fields.slice(idx + 1)]
    const steps = state.steps.map((s, i) => i === state.currentStep ? { ...s, fields } : s)
    return { steps }
  }),

  reorderFields: (oldIndex, newIndex) => set((state) => {
    const step = state.steps[state.currentStep]
    const fields = [...step.fields]
    const [moved] = fields.splice(oldIndex, 1)
    fields.splice(newIndex, 0, moved)
    const steps = state.steps.map((s, i) => i === state.currentStep ? { ...s, fields } : s)
    return { steps }
  }),

  selectField: (fieldId) => set({ selectedFieldId: fieldId }),

  updateField: (fieldId, key, value) => set((state) => {
    const steps = state.steps.map((s, i) =>
      i === state.currentStep
        ? { ...s, fields: s.fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f) }
        : s
    )
    return { steps }
  }),

  // Computed helpers
  getCurrentStep: () => get().steps[get().currentStep],
  getSelectedField: () => {
    const state = get()
    const step = state.steps[state.currentStep]
    return step?.fields.find(f => f.id === state.selectedFieldId) || null
  },

  // Save to backend
  saveForm: async () => {
    const state = get()
    set({ isSaving: true, saveError: null })
    try {
      const { formApi } = await import('../api/formApi')
      const payload = { title: state.formTitle, steps: state.steps }
      let res
      if (state.formId) {
        res = await formApi.update(state.formId, payload)
      } else {
        res = await formApi.create(payload)
        set({ formId: res.data._id })
      }
      set({ isSaving: false })
      return res.data
    } catch (err) {
      set({ isSaving: false, saveError: err.message })
      throw err
    }
  }
}))
