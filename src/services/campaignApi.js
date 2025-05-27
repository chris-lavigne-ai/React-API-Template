// src/services/campaignApi.js
import api from './api'

/**
 * Step 1: Create a fresh campaign (order) → returns { campaign_id }
 * Matches Postman “Create Campaign ID v2 (New)”
 */
export function createCampaignIdV2() {
  const form = new FormData()
  // Postman sends an (empty) email field, so we mirror that:
  form.append('email', '')
  return api.post('/api/create-campaign-id-v2', form)  // :contentReference[oaicite:0]{index=0}
}

/**
 * Step 2a: Add a single contact to a campaign
 * - Sends campaign_id + mailing_address + message_params as JSON strings
 * - Matches Postman “Add Contact” (add-contact-v3)
 */
export function addContactV3({ campaign_id, ...contactFields }) {
  const form = new FormData()
  form.append('campaign_id', campaign_id)
  // mailing_address and message_params both expect the same JSON blob
  const json = JSON.stringify(contactFields)
  form.append('mailing_address', json)
  form.append('message_params', json)
  return api.post('/api/add-contact-v3', form)  // :contentReference[oaicite:1]{index=1}
}

/**
 * Step 2b: Add many contacts in bulk
 * - Accepts either a raw JSON body or a file upload, depending on your UI
 * - Postman “Add Contacts Bulk (NEW)” uses JSON; if you pass FormData, axios will set multipart/form-data
 */
export function addContactsBulk(payload) {
  // If payload is a FormData (file upload), this will send multipart/form-data
  // If it’s a plain object, axios will serialize as JSON (application/json)
  return api.post('/api/add-contacts-bulk', payload)  // :contentReference[oaicite:2]{index=2}
}

/**
 * Step 3: Edit campaign details (message, return address, design, etc.)
 * - Builds form-data with nested return_address fields and optional file attachment
 * - Matches Postman “Edit Campaign” (edit-campaign-v2)
 */
export function editCampaignV2({
  campaign_id,
  text_type,
  message,
  return_address = {},    // e.g. { firstName, lastName, street, city, state, zip }
  attachment,             // optional File object (zip of images)
  status = 'draft',       // optional: 'draft' | 'paused' | 'pending'
}) {
  const form = new FormData()
  form.append('campaign_id', campaign_id)
  form.append('text_type', text_type)
  form.append('message', message)

  // flatten return_address into formdata keys like return_address[city]
  Object.entries(return_address).forEach(([key, val]) => {
    form.append(`return_address[${key}]`, val)
  })

  if (attachment) {
    form.append('attachment', attachment)
  }

  form.append('status', status)
  return api.post('/api/edit-campaign-v2', form)  // :contentReference[oaicite:3]{index=3}
}
