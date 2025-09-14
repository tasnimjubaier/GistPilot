// app/app/create/page.tsx
'use client'

import '../create/wizard.css'
import CreateWizardV2 from '../../../components/wizard/WizardV2'

export default function CreatePage() {
  return (
    <div>
      <h2 style={{marginBottom:8}}>Create a Course</h2>
      <CreateWizardV2 />
    </div>
  )
}
