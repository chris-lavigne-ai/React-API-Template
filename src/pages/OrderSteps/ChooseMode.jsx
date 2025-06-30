// src/pages/OrderSteps/ChooseMode.jsx
import React from 'react'

export default function ChooseMode({ onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', textAlign: 'center', fontFamily: 'Arial, sans-serif', width: '100%', maxWidth: 400 }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Choose Send Mode</h2>
        <button
          onClick={() => onSelect('threeStep')}
          style={{
            width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer'
          }}
        >
          Send in 3 Steps
        </button>
        
        <button
          onClick={() => onSelect('oneGo')}
          style={{
            width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer'
          }}
        >
          Send in One Go
        </button>

        <button
          onClick={() => onSelect('ongoing')}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', backgroundColor: '#facc15', color: '#111827', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}
        >
          Create Ongoing Campaign
        </button>

        <button
          onClick={() => onSelect('viewCampaigns')}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#00aeff', color: '#111827', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}          
        >
          View Campaigns
        </button>
      </div>
    </div>
  )
}