// src/pages/OrderSteps/OneGoPage.jsx
import React, { useState } from 'react'
import api from '../../services/api'

// Import preset card design images (PNG previews)
import designHelloImg from '../../assets/imgs/card_design_1698411516.png'
import designWhaleImg from '../../assets/imgs/card_design_1698674248.png'
import designFrameImg from '../../assets/imgs/card_design_1738298907323.png'
import designGreenImg from '../../assets/imgs/card_design_1743519789927.png'

// Predefined message templates
const templates = [
  {
    id: 'happyHolidays',
    title: 'Happy Holidays',
    message: `Hello [[first_name]],

From my family to yours I wanted to reach out
and wish you Happy Holidays!
I hope you’ve had a great year full of memories
and really get to relax and reflect over the holidays!
You have always been such a pleasure to work with.
Happy Holidays and Happy New Year!

Warmly,`
  },
  {
    id: 'interestedBuyer',
    title: 'Interested Buyer',
    message: `Hello [[first_name]],

I know this is a little out of the blue, but I was
driving by after doing a showing with a family I’m
helping, and they absolutely love your home here.
The family really wants to buy a home in this area
and they love your pocket of the neighborhood.
I’d love to connect directly, given they are well
qualified and can be flexible on timing.
Either way, we’d love to just have a conversation.
Shoot me a text, email, or call anytime!

Thanks!`
  },
  {
    id: 'coldIntroduction',
    title: 'Cold Introduction',
    message: `Hello,

I know this is a little out of the blue, but I wanted
to introduce myself. As you can tell by this letter,
I'm not your typical agent who will list your home
on Zillow, sit back, and wait.
I am highly attentive with my clients and act as a
true “broker.” I use my personal connections and
work ethic to get you results beyond the typical
strategy of just listing your home on the MLS.

If you're curious about selling now or in the future,
I’d love to be a resource in any way I can.`
  }
]

// Card design options: image preview + zipPath in public folder
const designs = [
  { id: 'designHello', imageSrc: designHelloImg, zipPath: '/assets/imgs/standard-hello.zip', label: 'Hello' },
  { id: 'designWhale', imageSrc: designWhaleImg, zipPath: '/assets/imgs/standard-whale.zip', label: 'Whale Hello' },
  { id: 'designFrame', imageSrc: designFrameImg, zipPath: '/assets/imgs/standard-frame.zip', label: 'Floral Frame' },
  { id: 'designGreen', imageSrc: designGreenImg, zipPath: '/assets/imgs/standard-green.zip', label: 'Green Foliage' }
]

export default function OneGoPage({ onBack }) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id)
  const [showReturn, setShowReturn] = useState(false)
  const [returnAddress, setReturnAddress] = useState({ firstName: '', lastName: '', street: '', city: '', state: '', zip: '' })
  const [selectedDesign, setSelectedDesign] = useState(designs[0].id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTemplateChange = e => setSelectedTemplate(e.target.value)
  const handleReturnChange = e => setReturnAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleDesignSelect = id => setSelectedDesign(id)

  const handleSend = async () => {
    setLoading(true)
    setError('')
    try {
      const tmpl = templates.find(t => t.id === selectedTemplate)
      const design = designs.find(d => d.id === selectedDesign)

      const fd = new FormData()
      fd.append('message', tmpl.message)
      fd.append('amount', '0')
      // always include return_address fields (empty if untouched)
      Object.entries(returnAddress).forEach(([key, val]) => {
        fd.append(`return_address[${key}]`, val)
      })
      // fetch the zip from public and attach
      const zipUrl = encodeURI(design.zipPath)
      const zipResponse = await fetch(zipUrl)
      if (!zipResponse.ok) throw new Error(`ZIP fetch failed: ${zipResponse.status}`)
      const zipBlob = await zipResponse.blob()
      fd.append('attachment', zipBlob, `${design.id}.zip`)

      fd.append('campaign_type', 'one-time')
      fd.append('text_type', 'Short Text')
      fd.append('status', 'draft')

      const res = await api.post('/api/add-campaign-v2', fd)
      alert(`Campaign created! ID: ${res.data.data.campaign_id}`)
      onBack()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  const tmpl = templates.find(t => t.id === selectedTemplate)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 600, backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#111827' }}>Send in One Go</h2>

        {/* Template selector */}
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Choose Message Template</label>
        <select value={selectedTemplate} onChange={handleTemplateChange} style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }}>
          {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>

        {/* Message preview */}
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Message Preview</label>
        <div style={{ whiteSpace: 'pre-wrap', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', minHeight: '150px', color: '#111827', marginBottom: '1.5rem' }}>
          {tmpl.message}
        </div>

        {/* Return address toggle */}
        <button type="button" onClick={() => setShowReturn(r => !r)} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: showReturn ? '#d1d5db' : '#10b981', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {showReturn ? 'Hide Return Address' : 'Add Return Address'}
        </button>
        {showReturn && (
          <fieldset style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
            <legend style={{ padding: '0 0.5rem', fontWeight: '600', color: '#374151' }}>Return Address (optional)</legend>
            {Object.keys(returnAddress).map(key => (
              <div key={key} style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', color: '#374151', textTransform: 'capitalize' }}>{key}</label>
                <input name={key} value={returnAddress[key]} onChange={handleReturnChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem', color: '#111827' }} />
              </div>
            ))}
          </fieldset>
        )}

        {/* Design picker */}
        <h3 style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Select Card Design</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {designs.map(d => (
            <div key={d.id} onClick={() => handleDesignSelect(d.id)} style={{ cursor: 'pointer', border: selectedDesign === d.id ? '2px solid #4f46e5' : '2px solid transparent', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={d.imageSrc} alt={d.label} style={{ width: '100%', display: 'block' }} />
              <p style={{ textAlign: 'center', padding: '0.5rem', margin: 0, color: '#374151' }}>{d.label}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#d1d5db', color: '#374151', border: 'none', cursor: 'pointer' }}>Back</button>
          <button onClick={handleSend} disabled={loading} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Sending…' : 'Send'}</button>
        </div>
      </div>
    </div>
  )
}
