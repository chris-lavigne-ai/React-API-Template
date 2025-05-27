// src/pages/OrderSteps/Step2AddContacts.jsx
import React, { useState } from 'react'
import { addContactV3, addContactsBulk } from '../../services/campaignApi'
import * as XLSX from 'xlsx'

const requiredFields = [
  'first_name',
  'last_name',
  'company_name',
  'contact_email',
  'phone',
  'street',
  'city',
  'state',
  'zip',
]
const optionalFields = ['company_name', 'contact_email', 'phone']

export default function Step2AddContacts({ campaignId, onNext }) {
  const [mode, setMode] = useState('single')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // single contact form state
  const [formData, setFormData] = useState(
    requiredFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  )

  // bulk upload state
  const [rawDataAll, setRawDataAll] = useState([])
  const [columns, setColumns] = useState([])
  const [sampleRows, setSampleRows] = useState([])
  // mapping from field -> column
  const [columnMapping, setColumnMapping] = useState(
    requiredFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  )

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setError('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      if (raw.length < 2) {
        setError('No data found in sheet')
        return
      }
      const hdr = raw[0].map(String)
      setColumns(hdr)
      setRawDataAll(raw.slice(1))
      setSampleRows(raw.slice(1, 6))
      // initialize mapping defaults
      const initial = {}
      requiredFields.forEach((f, i) => {
        initial[f] = optionalFields.includes(f) ? '' : hdr[i] || ''
      })
      setColumnMapping(initial)
    }
    reader.readAsArrayBuffer(file)
  }

  // map a given column to a field
  const handleColumnSelect = (column, field) => {
    setColumnMapping(prev => {
      const updated = {}
      requiredFields.forEach(f => {
        if (f === field) updated[f] = column
        else if (prev[f] === column) updated[f] = ''
        else updated[f] = prev[f]
      })
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'single') {
        await addContactV3({ campaign_id: campaignId, ...formData })
      } else {
        const contacts = rawDataAll.map(row => {
          const obj = {}
          requiredFields.forEach(field => {
            const col = columnMapping[field]
            const idx = columns.indexOf(col)
            const val = idx >= 0 ? row[idx] : ''
            obj[field] = val == null ? '' : String(val)
          })
          return obj
        })
        await addContactsBulk({ campaign_id: campaignId, contacts })
      }
      onNext()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error adding contacts')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 800, backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#111827' }}>Step 2: Add Contacts</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#6b7280' }}>
          Campaign ID: <code style={{ background: '#f9fafb', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{campaignId}</code>
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <button onClick={() => handleModeChange('single')} disabled={mode === 'single'} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: mode === 'single' ? '2px solid #4f46e5' : '1px solid #d1d5db', backgroundColor: mode === 'single' ? '#eef2ff' : '#ffffff', cursor: 'pointer', fontWeight: '600', color: '#4f46e5' }}>Send Individual Letter</button>
          <button onClick={() => handleModeChange('bulk')} disabled={mode === 'bulk'} style={{ marginLeft: '1rem', padding: '0.75rem 1.5rem', borderRadius: '8px', border: mode === 'bulk' ? '2px solid #4f46e5' : '1px solid #d1d5db', backgroundColor: mode === 'bulk' ? '#eef2ff' : '#ffffff', cursor: 'pointer', fontWeight: '600', color: '#4f46e5' }}>Send Multiple Letters</button>
        </div>

        {mode === 'bulk' && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="fileUpload" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Upload CSV or XLSX:</label>
              <input type="file" id="fileUpload" accept=".csv, .xlsx" onChange={handleFileChange} style={{ fontSize: '1rem', color: '#111827' }} />
            </div>

            {columns.length > 0 && (
              <>
                <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Map Columns <span style={{ color: '#6b7280', fontWeight: '400' }}>(First 5 Rows Preview)</span></h3>
                <div style={{ overflowX: 'auto', maxWidth: '100%', marginBottom: '1rem' }}>
                  <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                    <thead>
                      {/* Mapping row */}
                      <tr>
                        {columns.map((col) => {
                          const mappedField = Object.keys(columnMapping).find(f => columnMapping[f] === col) || ''
                          return (
                            <th key={col} style={{ border: '1px solid #d1d5db', padding: '0.5rem', backgroundColor: '#f9fafb' }}>
                              <select
                                value={mappedField}
                                onChange={e => handleColumnSelect(col, e.target.value)}
                                style={{ width: '100%', padding: '0.25rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                              >
                                <option value="">--</option>
                                {requiredFields.map(f => (
                                  <option key={f} value={f}>{f.replace('_', ' ')}</option>
                                ))}
                              </select>
                            </th>
                          )
                        })}
                      </tr>
                      {/* Header row */}
                      <tr>
                        {columns.map(col => (
                          <th key={'hdr-'+col} style={{ position: 'sticky', top: '2.5rem', backgroundColor: '#e5e7eb', color: '#374151', border: '1px solid #d1d5db', padding: '0.5rem', textAlign: 'left' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sampleRows.map((row, i) => (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                          {columns.map((col, j) => (
                            <td key={j} style={{ border: '1px solid #d1d5db', padding: '0.5rem', color: '#111827' }}>{row[j]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Submitting…' : 'Next'}</button>
              </>
            )}
            {error && <p style={{ marginTop: '1rem', color: '#ef4444', textAlign: 'center' }}>{error}</p>}
          </form>
        )}

        {mode === 'single' && (
          <form onSubmit={handleSubmit}>
            {requiredFields.map(field => (
              <div key={field} style={{ marginBottom: '0.75rem' }}>
                <label htmlFor={field} style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#374151', textTransform: 'capitalize' }}>{field.replace('_', ' ')}{!optionalFields.includes(field) && <span style={{ color: '#ef4444' }}> *</span>}</label>
                <input type="text" id={field} name={field} value={formData[field]} onChange={handleInputChange} required={!optionalFields.includes(field)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem', color: '#111827' }} />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', borderRadius: '8px', backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Submitting…' : 'Next'}</button>
            {error && <p style={{ marginTop: '1rem', color: '#ef4444', textAlign: 'center' }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  )
}