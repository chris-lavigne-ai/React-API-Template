import React, { useState } from 'react';
import './ContactListPage.css';

const mockContacts = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-1234',
    address: '123 Main St, Springfield, IL 62704',
    company: 'Acme Corp',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 555-5678',
    address: '456 Oak Ave, Metropolis, NY 10001',
    company: 'Smith Consulting',
  },
  {
    id: 3,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1 555-9012',
    address: '789 Pine Rd, Gotham, NJ 07001',
    company: 'Wayne Enterprises',
  },
];

function ContactListPage() {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="contact-list-page">
      <h2>Contact List</h2>
      <table className="contact-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {mockContacts.map((contact) => (
            <tr key={contact.id} className={selectedContact && selectedContact.id === contact.id ? 'selected-row' : ''}>
              <td>{contact.firstName}</td>
              <td>{contact.lastName}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                <button onClick={() => setSelectedContact(contact)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedContact && (
        <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="modal contact-modal" onClick={e => e.stopPropagation()}>
            <div className="contact-modal-header">
              <div className="contact-avatar">
                {selectedContact.firstName[0]}{selectedContact.lastName[0]}
              </div>
              <div className="contact-info-main">
                <div className="contact-name">{selectedContact.firstName} {selectedContact.lastName}</div>
                <div className="contact-company">{selectedContact.company || 'Company Name'}</div>
                <div className="contact-email-row">
                  <span className="contact-email">{selectedContact.email}</span>
                  <button className="copy-btn" title="Copy Email" onClick={() => navigator.clipboard.writeText(selectedContact.email)}>📋</button>
                </div>
              </div>
            </div>
            <div className="contact-actions-row">
              <button className="action-btn">📝<span>Note</span></button>
              <button className="action-btn">✉️<span>Email</span></button>
              <button className="action-btn">📞<span>Call</span></button>
              <button className="action-btn">✅<span>Task</span></button>
              <button className="action-btn">📅<span>Meeting</span></button>
              <button className="action-btn">🪶<span>Letter</span></button>
            </div>
            <div className="contact-details-section">
              <div className="section-header">
                <span>About this contact</span>
              </div>
              <div className="contact-details-list">
                <div className="detail-row"><span>Email</span><span>{selectedContact.email}</span></div>
                <div className="detail-row"><span>Phone number</span><span>{selectedContact.phone || '--'}</span></div>
                <div className="detail-row"><span>Address</span><span>{selectedContact.address || '--'}</span></div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setSelectedContact(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactListPage; 