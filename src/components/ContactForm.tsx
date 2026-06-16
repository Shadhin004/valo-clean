'use client';

import React, { useState } from 'react';

interface ContactFormProps {
  dict: any;
}

export default function ContactForm({ dict }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Mock API submission
    setTimeout(() => {
      try {
        console.log('Form submitted: ', formData);
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="contact-form-wrap">
      {status === 'success' && (
        <div className="alert alert-success mb-4" role="alert" style={{ fontSize: '15px' }}>
          <i className="fas fa-check-circle me-2"></i>
          {dict.contact.success_msg}
        </div>
      )}

      {status === 'error' && (
        <div className="alert alert-danger mb-4" role="alert" style={{ fontSize: '15px' }}>
          <i className="fas fa-exclamation-circle me-2"></i>
          {dict.contact.error_msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ajax-contact">
        <div className="row">
          {/* Name Field */}
          <div className="form-group col-md-6 mb-4">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder={dict.contact.name_label}
              required
              value={formData.name}
              onChange={handleChange}
              disabled={status === 'loading'}
              style={{
                height: '55px',
                borderRadius: '5px',
                padding: '10px 20px',
                border: '1px solid #eee',
              }}
            />
          </div>

          {/* Email Field */}
          <div className="form-group col-md-6 mb-4">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder={dict.contact.email_label}
              required
              value={formData.email}
              onChange={handleChange}
              disabled={status === 'loading'}
              style={{
                height: '55px',
                borderRadius: '5px',
                padding: '10px 20px',
                border: '1px solid #eee',
              }}
            />
          </div>

          {/* Phone Field */}
          <div className="form-group col-md-6 mb-4">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder={dict.contact.phone_label}
              required
              value={formData.phone}
              onChange={handleChange}
              disabled={status === 'loading'}
              style={{
                height: '55px',
                borderRadius: '5px',
                padding: '10px 20px',
                border: '1px solid #eee',
              }}
            />
          </div>

          {/* Subject Field */}
          <div className="form-group col-md-6 mb-4">
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder={dict.contact.subject_label}
              required
              value={formData.subject}
              onChange={handleChange}
              disabled={status === 'loading'}
              style={{
                height: '55px',
                borderRadius: '5px',
                padding: '10px 20px',
                border: '1px solid #eee',
              }}
            />
          </div>

          {/* Message Field */}
          <div className="form-group col-12 mb-4">
            <textarea
              name="message"
              className="form-control"
              placeholder={dict.contact.message_label}
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              disabled={status === 'loading'}
              style={{
                borderRadius: '5px',
                padding: '15px 20px',
                border: '1px solid #eee',
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="form-group col-12">
            <button
              type="submit"
              className="vs-btn2 w-100"
              disabled={status === 'loading'}
              style={{
                height: '55px',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {status === 'loading' ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {dict.contact.sending}
                </>
              ) : (
                <>
                  {dict.contact.send_btn}
                  <i className="far fa-long-arrow-right ms-2"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
