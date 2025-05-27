// src/App.jsx
import React, { useState } from 'react'
import Step1CreateCampaign from './pages/OrderSteps/Step1CreateCampaign'
import Step2AddContacts from './pages/OrderSteps/Step2AddContacts'
import Step3EditCampaign from './pages/OrderSteps/Step3EditCampaign'

export default function App() {
  const [step, setStep] = useState(1)
  const [campaignId, setCampaignId] = useState(null)

  const handleCampaignCreated = ({ campaignId }) => {
    setCampaignId(campaignId)
    setStep(2)
  }
  const handleContactsAdded = () => setStep(3)
  const handleCampaignEdited = () => setStep(4)
  const resetFlow = () => { setCampaignId(null); setStep(1) }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '1rem'
    }}>
      {step === 1 && (
        <Step1CreateCampaign onNext={handleCampaignCreated} />
      )}

      {step === 2 && (
        <Step2AddContacts
          campaignId={campaignId}
          onNext={handleContactsAdded}
        />
      )}

      {step === 3 && (
        <Step3EditCampaign
          campaignId={campaignId}
          onNext={handleCampaignEdited}
        />
      )}

      {step === 4 && (
        <div style={{
          width: '100%',
          maxWidth: 600,
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
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
              cursor: 'pointer'
            }}
          >
            Create Another Campaign
          </button>
        </div>
      )}
    </div>
  )
}
