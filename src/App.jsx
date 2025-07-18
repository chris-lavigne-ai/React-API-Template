// src/App.jsx
import React, { useState } from 'react'
import ChooseMode from './pages/OrderSteps/ChooseMode'
import Step1CreateCampaign from './pages/OrderSteps/Step1CreateCampaign'
import Step2AddContacts from './pages/OrderSteps/Step2AddContacts'
import Step3EditCampaign from './pages/OrderSteps/Step3EditCampaign'
import OneGoPage           from './pages/OrderSteps/OneGoPage'
import OngoingCampaignPage from './pages/OrderSteps/OngoingCampaignPage'
import ViewCampaigns from './pages/OrderSteps/ViewCampaigns'
import ContactListPage from './pages/OrderSteps/ContactListPage'

export default function App() {
  // “mode” is null until the user picks one of the two options
  const [mode, setMode] = useState(null)
  const [step, setStep] = useState(1)
  const [campaignId, setCampaignId] = useState(null)

  // Handlers for the 3-step flow
  const handleCampaignCreated = ({ campaignId }) => {
    setCampaignId(campaignId)
    setStep(2)
  }
  const handleContactsAdded = () => setStep(3)
  const handleCampaignEdited = () => setStep(4)
  const resetFlow = () => {
    setCampaignId(null)
    setStep(1)
    setMode(null)      // go back to the “ChooseMode” screen
  }

  // Before anything else, let the user choose
  if (!mode) {
    return <ChooseMode onSelect={setMode} />
  }

  // If they chose the 3-step flow...
  if (mode === 'threeStep') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          padding: '1rem',
        }}
      >
        {step === 1 && <Step1CreateCampaign onNext={handleCampaignCreated} />}
        {step === 2 && (
          <Step2AddContacts campaignId={campaignId} onNext={handleContactsAdded} />
        )}
        {step === 3 && (
          <Step3EditCampaign campaignId={campaignId} onNext={handleCampaignEdited} />
        )}
        {step === 4 && (
          <div
            style={{
              width: '100%',
              maxWidth: 600,
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              textAlign: 'center',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <h2 style={{ color: '#111827' }}>🎉 Campaign Ready!</h2>
            <p style={{ color: '#6b7280' }}>
              Your campaign <code>{campaignId}</code> has been fully configured.
            </p>
            <button
              onClick={resetFlow}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Create Another Campaign
            </button>
          </div>
        )}
      </div>
    )
  }

  // If they chose the “one-go” flow, show your single-page component:
  // (you’ll need to build this; here’s a placeholder)
  if (mode === 'oneGo') {
    return (
      <OneGoPage
        onBack={resetFlow}
      />
    )
  }

  if (mode === 'ongoing') {
    return <OngoingCampaignPage onBack={resetFlow} />
  }

  if (mode === 'viewCampaigns') {
    return <ViewCampaigns onBack={resetFlow} />
  }

  if (mode === 'contactList') {
    return <ContactListPage onBack={resetFlow} />
  }

  return null
}
