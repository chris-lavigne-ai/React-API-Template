import React, { useState, useEffect } from 'react'
import api from '../../services/api'

// Ensure Bootstrap CSS/JS, jQuery, and Bootbox are included in index.html

export default function ViewCampaigns({ onBack }) {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addRecipientOrderId, setAddRecipientOrderId] = useState(null)
  const [recipientForm, setRecipientForm] = useState({
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  })
   // existing contacts for the list

  useEffect(() => {
    setLoading(true)
    api
      .get(`/api/v1/campaigns?page=1&per_page=10`)
      .then(res => setCampaigns(res.data.data || []))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [])

  const showImageModal = (url, title) => {
    if (window.bootbox) {
      window.bootbox.dialog({
        title,
        message: `<div class=\"text-center\"><img src=\"${url}\" class=\"img-fluid\" style=\"max-height:70vh;\"/></div>`,
        size: 'large',
        closeButton: true,
        backdrop: true,
        buttons: {}
      })
    }
  }

  // When opening Add Recipient form
  const openAddRecipient = (orderId, listId) => {
    setAddRecipientOrderId(orderId)
  }


  const handleRecipientChange = e => {
    const { name, value } = e.target
    setRecipientForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRecipientSubmit = (e, listId) => {
    e.preventDefault()
    api.post('/api/v1/add-contact-ongoing', {
      list_id: listId,
      ...recipientForm
    })
      .then(() => {
        alert('Recipient added successfully!')
        setAddRecipientOrderId(null)
        setRecipientForm({ first_name: '', last_name: '', address: '', city: '', state: '', zip: '' })
      })
      .catch(err => alert('Error adding recipient: ' + err.message))
  }

  
  if (loading) return <div className="text-center my-5">Loading campaigns...</div>
  if (error) return <div className="text-center text-danger my-5">Error: {error.message}</div>

  return (
    <div className="container mt-4">
      <button onClick={onBack} className="btn btn-secondary mb-3">
        ← Back
      </button>
      <h2 className="mb-4">Your Campaigns</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Preview</th>
              <th>Order ID</th>
              <th>User Email</th>
              <th>Campaign Name</th>
              <th>Type</th>
              <th>Text Type</th>
              <th>Font</th>
              <th>List ID</th>
              <th>List Count</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <React.Fragment key={c.order_id}>
                <tr>
                  <td>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => showImageModal(c.campaign_message, 'Message Preview')}
                    >Message</button>
                    {' | '}
                    <button
                      className="btn btn-link p-0"
                      onClick={() => showImageModal(c.main_design, 'Main Design')}
                    >Design</button>
                  </td>
                  <td>{c.order_id}</td>
                  <td>{c.user_email}</td>
                  <td>{c.campaign_name}</td>
                  <td>{c.campaign_type}</td>
                  <td>{c.text_type}</td>
                  <td>{c.font}</td>
                  <td>{c.list_id}</td>
                  <td>{c.list_count}</td>
                  <td>${c.order_amount}</td>
                  <td>
                    <span className={`badge ${
                      c.status === 'pending'
                        ? 'badge-warning'
                        : c.status === 'processing'
                          ? 'badge-info'
                          : 'badge-success'
                    }`}>{c.status}</span>
                  </td>
                  <td>{new Date(c.created_at).toLocaleString()}</td>
                  <td>{new Date(c.submitted_date).toLocaleString()}</td>
                  <td>
                    {((c.status === 'pending' && c.campaign_type === 'Ongoing') || c.status === 'draft') && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openAddRecipient(c.order_id, c.list_id)}
                      >Add Recipient</button>
                    )}
                  </td>
                </tr>
                {addRecipientOrderId === c.order_id && (
                  <tr>
                    <td colSpan="13">
                      <form onSubmit={(e) => handleRecipientSubmit(e, c.list_id)}>
  <div className="form-row mb-2">
    <div className="form-group col-md-6">
      <input
        type="text"
        name="first_name"
        value={recipientForm.first_name}
        onChange={handleRecipientChange}
        placeholder="First Name"
        className="form-control"
        required
      />
    </div>
    <div className="form-group col-md-6">
      <input
        type="text"
        name="last_name"
        value={recipientForm.last_name}
        onChange={handleRecipientChange}
        placeholder="Last Name"
        className="form-control"
        required
      />
    </div>
  </div>
  <div className="form-row mb-2">
    <div className="form-group col-md-3">
      <input
        type="text"
        name="address"
        value={recipientForm.address}
        onChange={handleRecipientChange}
        placeholder="Address"
        className="form-control"
        required
      />
    </div>
    <div className="form-group col-md-3">
      <input
        type="text"
        name="city"
        value={recipientForm.city}
        onChange={handleRecipientChange}
        placeholder="City"
        className="form-control"
        required
      />
    </div>
    <div className="form-group col-md-3">
      <input
        type="text"
        name="state"
        value={recipientForm.state}
        onChange={handleRecipientChange}
        placeholder="State"
        className="form-control"
        required
      />
    </div>
    <div className="form-group col-md-3">
      <input
        type="text"
        name="zip"
        value={recipientForm.zip}
        onChange={handleRecipientChange}
        placeholder="Zip"
        className="form-control"
        required
      />
    </div>
  </div>
  <button type="submit" className="btn btn-success btn-sm mr-2">Submit</button>
  <button
    type="button"
    className="btn btn-link btn-sm"
    onClick={() => setAddRecipientOrderId(null)}
  >Cancel</button>
</form>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
