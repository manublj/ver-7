import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addRowToSheet } from '../api/googleSheetsApi';

const EntryForm = ({ show, onHide, onSubmit, sheetType = 'theory', initialData = {}, children }) => {
  const [formData, setFormData] = useState({
    CATEGORY: 'theory',
    SOURCE_TYPE: '',
    HEADLINE: '',
    POST_CONTENT: '',
    EXCERPTS: '',
    AUTHOR: '',
    KEYWORDS: '',
    WHO: '',
    WHO_TYPE: '',
    URL: '',
    DOMAIN: '',
    DATE_PUBLISHED: new Date().toISOString().split('T')[0],
    SPECTRUM: '',
    ABSTRACT: '',
    REGION: '',
    PLATFORM: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save to the selected sheet based on category
      await addRowToSheet(formData.CATEGORY, formData);
      onSubmit();
      onHide();
      // Reset form
      setFormData({
        CATEGORY: 'theory',
        SOURCE_TYPE: '',
        HEADLINE: '',
        POST_CONTENT: '',
        EXCERPTS: '',
        AUTHOR: '',
        KEYWORDS: '',
        WHO: '',
        WHO_TYPE: '',
        URL: '',
        DOMAIN: '',
        DATE_PUBLISHED: new Date().toISOString().split('T')[0],
        SPECTRUM: '',
        ABSTRACT: '',
        REGION: '',
        PLATFORM: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value.split(',').map(item => item.trim())
    }));
  };

  const renderTheoryFields = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Category*</Form.Label>
        <Form.Select
          name="CATEGORY"
          value={formData.CATEGORY}
          onChange={handleChange}
          required
        >
          <option value="theory">Theory</option>
          <option value="reporting">Reporting</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Source Type*</Form.Label>
        <select className="form-select" aria-label="Source Type" name="SOURCE_TYPE" value={formData.SOURCE_TYPE} onChange={handleChange} required>
          <option value="social media post">Social Media Post</option>
          <option value="article">Article</option>
          <option value="book">Book</option>
          <option value="pdf">PDF</option>
        </select>
      </Form.Group>

      {formData.SOURCE_TYPE === 'social media post' ? (
        <Form.Group className="mb-3">
          <Form.Label>Post Content*</Form.Label>
          <Form.Control
            type="text"
            name="POST_CONTENT"
            value={formData.POST_CONTENT}
            onChange={handleChange}
            required
          />
        </Form.Group>
      ) : (
        <Form.Group className="mb-3">
          <Form.Label>Headline (title)*</Form.Label>
          <Form.Control
            type="text"
            name="HEADLINE"
            value={formData.HEADLINE}
            onChange={handleChange}
            required
          />
        </Form.Group>
      )}

      {formData.SOURCE_TYPE === 'social media post' && (
        <Form.Group className="mb-3">
          <Form.Label>Platform*</Form.Label>
          <Form.Select
            name="PLATFORM"
            value={formData.PLATFORM}
            onChange={handleChange}
            required
          >
            <option value="FB">Facebook</option>
            <option value="IG">Instagram</option>
            <option value="X">Twitter</option>
            <option value="YT">YouTube</option>
          </Form.Select>
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>AUTHOR*</Form.Label>
        <Form.Control
          type="text"
          name="AUTHOR"
          value={formData.AUTHOR}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {(formData.SOURCE_TYPE === 'article') && (
        <Form.Group className="mb-3">
          <Form.Label>Domain*</Form.Label>
          <Form.Control
            type="text"
            name="DOMAIN"
            value={formData.DOMAIN}
            onChange={handleChange}
            required
          />
        </Form.Group>
      )}

      {(formData.SOURCE_TYPE === 'article' || formData.SOURCE_TYPE === 'book' || formData.SOURCE_TYPE === 'pdf') && (
        <Form.Group className="mb-3">
          <Form.Label>Abstract*</Form.Label>
          <Form.Control
            type="text"
            name="ABSTRACT"
            value={formData.ABSTRACT}
            onChange={handleChange}
            required
          />
        </Form.Group>
      )}

      {(formData.SOURCE_TYPE === 'social media post' && formData.CATEGORY === 'theory') && (
        <Form.Group className="mb-3">
          <Form.Label>URL*</Form.Label>
          <Form.Control
            type="url"
            name="URL"
            value={formData.URL}
            onChange={handleChange}
            required
          />
        </Form.Group>
      )}

      {(formData.CATEGORY === 'theory' && formData.SOURCE_TYPE === 'post') && (
        <Form.Group className="mb-3">
          <Form.Label>URL*</Form.Label>
          <Form.Control
            type="url"
            name="URL"
            value={formData.URL}
            onChange={handleChange}
            required
          />
        </Form.Group>
      )}

      {(formData.CATEGORY === 'theory' && (formData.SOURCE_TYPE === 'book' || formData.SOURCE_TYPE === 'pdf')) && (
        <Form.Group className="mb-3">
          <Form.Label>URL*</Form.Label>
          <Form.Control
            type="url"
            name="URL"
            value={formData.URL}
            onChange={handleChange}
            required
          />
        </Form.Group>
      )}

      {(formData.CATEGORY === 'theory' && formData.SOURCE_TYPE === 'article') && (
        <Form.Group className="mb-3">
          <Form.Label>URL*</Form.Label>
          <Form.Control
            type="url"
            name="URL"
            value={formData.URL}
            onChange={handleChange}
            required
          />
        </Form.Group>
      )}

      {(formData.CATEGORY === 'reporting') && (
        <Form.Group className="mb-3">
          <Form.Label>URL*</Form.Label>
          <Form.Control
            type="url"
            name="URL"
            value={formData.URL}
            onChange={handleChange}
            required
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>WHO*</Form.Label>
        <Form.Control
          type="text"
          name="WHO"
          value={formData.WHO}
          onChange={(e) => handleMultiSelectChange('WHO', e.target.value)}
          required
          placeholder="Type names separated by commas"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>WHO_TYPE*</Form.Label>
        <Form.Select
          name="WHO_TYPE"
          value={formData.WHO_TYPE}
          onChange={handleChange}
          required
        >
          <option value="character">Character</option>
          <option value="party">Party</option>
          <option value="movement">Movement</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>SPECTRUM*</Form.Label>
        <Form.Select
          name="SPECTRUM"
          value={formData.SPECTRUM}
          onChange={handleChange}
          required
        >
          <option value="LEFT">LEFT</option>
          <option value="CENTRE">CENTRE</option>
          <option value="RIGHT">RIGHT</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Keywords*</Form.Label>
        <Form.Control
          type="text"
          name="KEYWORDS"
          value={formData.KEYWORDS}
          onChange={(e) => handleMultiSelectChange('KEYWORDS', e.target.value)}
          required
          placeholder="Type keywords separated by commas"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date Published</Form.Label>
        <Form.Control
          type="date"
          name="DATE_PUBLISHED"
          value={formData.DATE_PUBLISHED}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Excerpts</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="EXCERPTS"
          value={formData.EXCERPTS}
          onChange={handleChange}
        />
      </Form.Group>
    </>
  );

  const renderReportingFields = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Category*</Form.Label>
        <Form.Select
          name="CATEGORY"
          value={formData.CATEGORY}
          onChange={handleChange}
          required
        >
          <option value="theory">Theory</option>
          <option value="reporting">Reporting</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Source Type*</Form.Label>
        <select className="form-select" aria-label="Source Type" name="SOURCE_TYPE" value={formData.SOURCE_TYPE} onChange={handleChange} required>
          <option value="social media post">Social Media Post</option>
          <option value="article">Article</option>
        </select>
      </Form.Group>

      {formData.SOURCE_TYPE === 'social media post' && (
        <Form.Group className="mb-3">
          <Form.Label>Platform*</Form.Label>
          <Form.Select
            name="PLATFORM"
            value={formData.PLATFORM}
            onChange={handleChange}
            required
          >
            <option value="FB">Facebook</option>
            <option value="IG">Instagram</option>
            <option value="X">Twitter</option>
            <option value="YT">YouTube</option>
          </Form.Select>
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Headlines*</Form.Label>
        <Form.Control
          type="text"
          name="POST_CONTENT"
          value={formData.POST_CONTENT}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Region</Form.Label>
        <Form.Control
          type="text"
          name="REGION"
          value={formData.REGION}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Spectrum*</Form.Label>
        <Form.Select
          name="SPECTRUM"
          value={formData.SPECTRUM}
          onChange={handleChange}
          required
        >
          <option value="LEFT">LEFT</option>
          <option value="CENTRE">CENTRE</option>
          <option value="RIGHT">RIGHT</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>URL*</Form.Label>
        <Form.Control
          type="url"
          name="URL"
          value={formData.URL}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Author*</Form.Label>
        <Form.Control
          type="text"
          name="AUTHOR"
          value={formData.AUTHOR}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>WHO*</Form.Label>
        <Form.Control
          type="text"
          name="WHO"
          value={formData.WHO}
          onChange={(e) => handleMultiSelectChange('WHO', e.target.value)}
          required
          placeholder="Type names separated by commas"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>WHO_TYPE*</Form.Label>
        <Form.Select
          name="WHO_TYPE"
          value={formData.WHO_TYPE}
          onChange={handleChange}
          required
        >
          <option value="character">Character</option>
          <option value="party">Party</option>
          <option value="movement">Movement</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date Published</Form.Label>
        <Form.Control
          type="date"
          name="DATE_PUBLISHED"
          value={formData.DATE_PUBLISHED}
          onChange={handleChange}
        />
      </Form.Group>
    </>
  );

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {children ? (
            children
          ) : (
            formData.CATEGORY === 'theory' ? renderTheoryFields() : renderReportingFields()
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EntryForm;