// src/pages/OrderSteps/OngoingCampaignPage.jsx
import React, { useState } from 'react'
import api from '../../services/api'

export default function OngoingCampaignPage({ onBack }) {
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [returnAddress, setReturnAddress] = useState({ firstName: '', lastName: '', street: '', city: '', state: '', zip: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMessageChange = (e) => setMessage(e.target.value)
  const handleAttachmentChange = (e) => setAttachment(e.target.files[0])
  const handleReturnChange = (e) => {
    const { name, value } = e.target
    setReturnAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('message', message)
      // append return address fields if provided
      Object.entries(returnAddress).forEach(([key, val]) => {
        fd.append(`return_address[${key}]`, val)
      })
      // append design ZIP if uploaded
      if (attachment) fd.append('attachment', attachment)

      const res = await api.post('/api/v1/create-ongoing-campaign', fd)
      // success
      onBack()
    } catch (err) {
      console.error('ERROR:', err)
      setError(err.response?.data?.message || err.message || 'Failed to create ongoing campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#fefce8', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 600, backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#92400e' }}>Create Ongoing Campaign</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#7c2d12' }}>Custom Message<span style={{ color: '#ef4444' }}> *</span></label>
            <textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              required
              rows={5}
              style={{ height: 400, width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', color: '#111827', marginBottom: '1rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="attachment" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#7c2d12' }}>Upload Card Design (ZIP)</label>
            <input type="file" id="attachment" accept="application/zip" onChange={handleAttachmentChange} style={{ fontSize: '1rem', color: '#213547' }} />
          </div>
          <fieldset style={{ marginBottom: '1.5rem', border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
            <legend style={{ padding: '0 0.5rem', fontWeight: '600', color: '#7c2d12' }}>Return Address (optional)</legend>
            {['firstName','lastName','street','city','state','zip'].map(field => (
              <div key={field} style={{ marginBottom: '0.75rem' }}>
                <label htmlFor={field} style={{ display: 'block', marginBottom: '0.25rem', color: '#7c2d12', textTransform: 'capitalize' }}>{field}</label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={returnAddress[field]}
                  onChange={handleReturnChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem', color: '#111827' }}
                />
              </div>
            ))}
          </fieldset>
          {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={onBack} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#fbbf24', color: '#92400e', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#fbbf24', color: '#fff', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}> {loading ? 'Creating…' : 'Create'} </button>
          </div>
        </form>
      </div>
    </div>
  )
}