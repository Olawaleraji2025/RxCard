export const FIELDS = [
  { key: 'used', label: 'Used for', question: 'What is {name} used for?' },
  { key: 'dosage', label: 'Dosage', question: 'What is the dosage of {name}?' },
  { key: 'can', label: 'Who can use it', question: 'Who can use {name}?' },
  { key: 'cannot', label: 'Who cannot use it', question: 'Who cannot use {name}?' },
  { key: 'chemical_composition', label: 'Chemical composition', question: 'What is the chemical composition of {name}?' },
  { key: 'identification', label: 'Identification (how it looks, e.g. carton, sachet)', question: 'What does {name} look like?' },
  { key: 'notes', label: 'Notes', question: 'What else should you know about {name}?' },
]

export const FIELD_KEYS = FIELDS.map((field) => field.key)
