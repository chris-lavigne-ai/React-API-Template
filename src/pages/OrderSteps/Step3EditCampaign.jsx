// src/pages/OrderSteps/Step3EditCampaign.jsx
import React, { useState } from 'react'
import { editCampaignV2 } from '../../services/campaignApi'
import api from '../../services/api'

export default function Step3EditCampaign({ campaignId, onNext }) {
  const [textType, setTextType] = useState('Short Text')
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [returnAddress, setReturnAddress] = useState({
    firstName: '', lastName: '', street: '', city: '', state: '', zip: ''
  })
  const [loading, setLoading] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState([])
  const [error, setError] = useState('')

  const handleTextTypeChange = e => setTextType(e.target.value)
  const handleMessageChange = e => setMessage(e.target.value)
  const handleAttachmentChange = e => setAttachment(e.target.files[0])
  const handleReturnChange = e => {
    const { name, value } = e.target
    setReturnAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleShowPreview = async () => {
    setPreviewLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('subject', message)
      fd.append('textType', textType)
      fd.append('returnAddress', JSON.stringify(returnAddress))
      const res = await api.post('/api/get-preview-image', fd)
      const data = res.data.data || {}
      const urls = []
      if (data.letter_preview) urls.push(data.letter_preview)
      if (data.enevolope_preview) urls.push(data.enevolope_preview)
      if (urls.length === 0) throw new Error('No preview returned')
      setPreviewUrls(urls)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch preview images')
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleCloseModal = () => setPreviewUrls([])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await editCampaignV2({
        campaign_id: campaignId,
        text_type: textType,
        message,
        return_address: returnAddress,
        attachment,
        status: 'pending',
      })
      onNext()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 800, backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#111827' }}>Step 3: Customize Campaign</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#6b7280' }}>Campaign ID: <code style={{ background: '#f9fafb', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{campaignId}</code></p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <label htmlFor="message" style={{ flexGrow: 1, fontWeight: '600', color: '#374151' }}>
              Custom Message<span style={{ color: '#ef4444' }}> *</span>
            </label>
            <button
              type="button"
              onClick={handleShowPreview}
              disabled={previewLoading}
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', cursor: previewLoading ? 'not-allowed' : 'pointer' }}
            >
              {previewLoading ? 'Loading…' : 'Show Preview'}
            </button>
          </div>

          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            required
            style={{
              width: '550px',
              height: '350px', /* fixed height */
              resize: 'none', /* prevent manual resize */
              padding: '0px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '1rem',
              lineHeight: '1.5',
              color: '#111827',
              marginBottom: '1.5rem'
            }}
          />

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="textType" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Message Type</label>
            <select
              id="textType"
              value={textType}
              onChange={handleTextTypeChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', color: '#111827' }}
            >
              <option>Short Text</option>
              <option>Long Text</option>
            </select>
          </div>

          <fieldset style={{ marginBottom: '1.5rem', border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
            <legend style={{ padding: '0 0.5rem', fontWeight: '600', color: '#374151' }}>Return Address (optional)</legend>
            {['firstName','lastName','street','city','state','zip'].map(field => (
              <div key={field} style={{ marginBottom: '0.75rem' }}>
                <label htmlFor={field} style={{ display: 'block', marginBottom: '0.25rem', color: '#374151' }}>{field}</label>
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="attachment" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Upload Card Design (optional)</label>
            <input
              type="file"
              id="attachment"
              accept="image/*,application/zip"
              onChange={handleAttachmentChange}
              style={{ fontSize: '1rem', color: '#111827' }}
            />
            {attachment && <p style={{ marginTop: '0.5rem', color: '#374151' }}>Selected file: {attachment.name}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Saving…' : 'Save & Finish'}
          </button>
          {error && <p style={{ marginTop: '1rem', color: '#ef4444', textAlign: 'center' }}>{error}</p>}
        </form>

        {/* Preview Modal */}
        {previewUrls.length > 0 && (
          <div
            onClick={handleCloseModal}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}
          >
            <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1rem', maxWidth: '60%', maxHeight: '90%', overflowY: 'auto', textAlign: 'center' }}>
              <img src={previewUrls[0]} alt="Letter Preview" style={{ width: '50%', margin: '0 auto 1rem', objectFit: 'contain', display: 'block' }} />
              <img src={previewUrls[1]} alt="Envelope Preview" style={{ width: '50%', margin: '0 auto 1rem', objectFit: 'contain', display: 'block' }} />
              <button onClick={handleCloseModal} style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer' }}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}