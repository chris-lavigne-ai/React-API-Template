// src/pages/OrderSteps/Step1CreateCampaign.jsx
import React, { useState } from 'react'
import { createCampaignIdV2 } from '../../services/campaignApi'

export default function Step1CreateCampaign({ onNext }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await createCampaignIdV2()
      const campaignId = res.data.data.campaign_id
      onNext({ campaignId })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 400, backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Step 1: Create Campaign</h2>
        <p style={{ marginBottom: '2rem', color: '#6b7280' }}>Click below to initialize a new campaign order and obtain its ID.</p>

        <button
          onClick={handleCreate}
          disabled={loading}
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating…' : 'Create Campaign'}
        </button>

        {error && <p style={{ marginTop: '1rem', color: '#ef4444' }}>{error}</p>}
      </div>
    </div>
  )
}
