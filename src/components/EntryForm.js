import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { addRowToSheet, getSheetData } from '../api/googleSheetsApi';

const CATEGORIES = [
  { value: 'THEORY', label: 'Theory' },
  { value: 'REPORTING', label: 'Reporting' }
];

const SOURCE_TYPES = [
  { value: 'post', label: 'Social Media Post' },
  { value: 'article', label: 'Article' },
  { value: 'book', label: 'Book' },
  { value: 'pdf', label: 'PDF' }
];

const POST_PLATFORMS = [
  { value: 'IG', label: 'Instagram' },
  { value: 'FB', label: 'Facebook' },
  { value: 'X', label: 'Twitter/X' },
  { value: 'YT', label: 'YouTube' }
];

const SPECTRUM_OPTIONS = [
  { value: 'LEFT', label: 'Left' },
  { value: 'CENTRE', label: 'Centre' },
  { value: 'RIGHT', label: 'Right' }
];

const EntryForm = ({ show, onHide, onSubmit, sheetType = '', initialData = {} }) => {
  const [formData, setFormData] = useState({
    CATEGORY: 'THEORY',
    KEYWORDS: '',
    SRC_TYPE: 'article',
    POST: '',
    POST_CONTENT: '',
    HEADLINE: '',
    DOMAIN: '',
    HIGHLIGHTS: '',
    WHO: '',
    WHO_TYPE: '',
    SPECTRUM: '',
    DATE_PUBLISHED: new Date().toISOString().split('T')[0],
    REGION: '',
    URL: '',
    ...initialData
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    WHO: [],
    WHO_TYPE: [],
    KEYWORDS: [],
    DOMAIN: []
  });

  useEffect(() => {
    // Fetch dropdown options from existing data
    const fetchDropdownOptions = async () => {
      try {
        const [theoryData, reportingData, whoData] = await Promise.all([
          getSheetData('theory'),
          getSheetData('reporting'),
          getSheetData('WHO')
        ]);
        
        // Extract unique values for dropdowns
        const uniqueWho = [...new Set([
          ...theoryData.map(item => item.WHO),
          ...reportingData.map(item => item.WHO)
        ])].filter(Boolean);
        
        const uniqueWhoTypes = [...new Set([
          ...theoryData.map(item => item.WHO_TYPE),
          ...reportingData.map(item => item.WHO_TYPE),
          ...whoData.map(item => item.WHO_TYPE)
        ])].filter(Boolean);

        const uniqueKeywords = [...new Set(
          theoryData.map(item => item.KEYWORDS)
        )].filter(Boolean);

        const uniqueDomains = [...new Set([
          ...theoryData.map(item => item.DOMAIN),
          ...reportingData.map(item => item.DOMAIN)
        ])].filter(Boolean);
        
        setDropdownOptions({
          WHO: uniqueWho,
          WHO_TYPE: uniqueWhoTypes,
          KEYWORDS: uniqueKeywords,
          DOMAIN: uniqueDomains
        });
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    };
    
    if (show) {
      fetchDropdownOptions();
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Determine target sheet from formData or prop
      const targetSheet = sheetType || formData.CATEGORY.toLowerCase();
      
      // Transform data if needed
      const dataToSubmit = { ...formData };
      
      // Save to the selected sheet
      await addRowToSheet(targetSheet, dataToSubmit);
      onSubmit();
      onHide();
      
      // Reset form to initial state, preserving any initialData
      setFormData({
        CATEGORY: 'THEORY',
        KEYWORDS: '',
        SRC_TYPE: 'article',
        POST: '',
        POST_CONTENT: '',
        HEADLINE: '',
        DOMAIN: '',
        HIGHLIGHTS: '',
        WHO: '',
        WHO_TYPE: '',
        SPECTRUM: '',
        DATE_PUBLISHED: new Date().toISOString().split('T')[0],
        REGION: '',
        URL: '',
        ...initialData
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Theory specific fields based on source type
  const renderTheoryFields = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Keywords</Form.Label>
        <Form.Select
          name="KEYWORDS"
          value={formData.KEYWORDS}
          onChange={handleChange}
        >
          <option value="">Select or type new</option>
          {dropdownOptions.KEYWORDS.map((keyword, index) => (
            <option key={index} value={keyword}>
              {keyword}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Source Type*</Form.Label>
        <Form.Select
          name="SRC_TYPE"
          value={formData.SRC_TYPE}
          onChange={handleChange}
          required
        >
          {SOURCE_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {formData.SRC_TYPE === 'post' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Platform*</Form.Label>
            <Form.Select
              name="POST"
              value={formData.POST}
              onChange={handleChange}
              required
            >
              <option value="">Select Platform</option>
              {POST_PLATFORMS.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Post Content*</Form.Label>
            <Form.Control
              as="textarea"
              name="POST_CONTENT"
              value={formData.POST_CONTENT}
              onChange={handleChange}
              rows={3}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="AUTHOR"
              value={formData.AUTHOR}
              onChange={handleChange}
            />
          </Form.Group>
        </>
      )}

      {formData.SRC_TYPE === 'article' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Headline*</Form.Label>
            <Form.Control
              type="text"
              name="HEADLINE"
              value={formData.HEADLINE}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Domain</Form.Label>
            <Form.Select
              name="DOMAIN"
              value={formData.DOMAIN}
              onChange={handleChange}
            >
              <option value="">Select or type new</option>
              {dropdownOptions.DOMAIN.map((domain, index) => (
                <option key={index} value={domain}>
                  {domain}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Highlights/Excerpts</Form.Label>
            <Form.Control
              as="textarea"
              name="HIGHLIGHTS"
              value={formData.HIGHLIGHTS}
              onChange={handleChange}
              rows={3}
              placeholder="Highlighted text from the article"
            />
          </Form.Group>
        </>
      )}
    </>
  );

  // Reporting specific fields based on source type
  const renderReportingFields = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Headline*</Form.Label>
        <Form.Control
          type="text"
          name="HEADLINE"
          value={formData.HEADLINE}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Region*</Form.Label>
        <Form.Control
          type="text"
          name="REGION"
          value={formData.REGION}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Source Type*</Form.Label>
        <Form.Select
          name="SRC_TYPE"
          value={formData.SRC_TYPE}
          onChange={handleChange}
          required
        >
          {SOURCE_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {formData.SRC_TYPE === 'post' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Platform*</Form.Label>
            <Form.Select
              name="POST"
              value={formData.POST}
              onChange={handleChange}
              required
            >
              <option value="">Select Platform</option>
              {POST_PLATFORMS.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="AUTHOR"
              value={formData.AUTHOR}
              onChange={handleChange}
            />
          </Form.Group>
        </>
      )}

      {formData.SRC_TYPE === 'article' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Domain</Form.Label>
            <Form.Select
              name="DOMAIN"
              value={formData.DOMAIN}
              onChange={handleChange}
            >
              <option value="">Select or type new</option>
              {dropdownOptions.DOMAIN.map((domain, index) => (
                <option key={index} value={domain}>
                  {domain}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Highlights</Form.Label>
            <Form.Control
              as="textarea"
              name="HIGHLIGHTS"
              value={formData.HIGHLIGHTS}
              onChange={handleChange}
              rows={3}
              placeholder="Highlighted text from the article"
            />
          </Form.Group>
        </>
      )}

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
    </>
  );

  // Render CARDS form if specified by sheetType
  const renderCardsForm = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Entity Name (WHO)*</Form.Label>
        <Form.Select
          name="WHO"
          value={formData.WHO}
          onChange={handleChange}
          required
        >
          <option value="">Select or type new</option>
          {dropdownOptions.WHO.map((who, index) => (
            <option key={index} value={who}>
              {who}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Entity Type*</Form.Label>
        <Form.Select
          name="WHO_TYPE"
          value={formData.WHO_TYPE}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Character">Character</option>
          <option value="Political Party">Political Party</option>
          <option value="Movement">Movement</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Spectrum*</Form.Label>
        <Form.Select
          name="SPECTRUM"
          value={formData.SPECTRUM}
          onChange={handleChange}
          required
        >
          <option value="">Select Spectrum</option>
          {SPECTRUM_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </>
  );

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {sheetType === 'CARDS' ? 'Add New Entity Card' : 'Add New Entry'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {sheetType === 'CARDS' ? (
            renderCardsForm()
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Category*</Form.Label>
                <Form.Select
                  name="CATEGORY"
                  value={formData.CATEGORY}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {formData.CATEGORY === 'THEORY' ? renderTheoryFields() : renderReportingFields()}

              {/* Common fields for both categories */}
              <Form.Group className="mb-3">
                <Form.Label>WHO</Form.Label>
                <Form.Select
                  name="WHO"
                  value={formData.WHO}
                  onChange={handleChange}
                >
                  <option value="">Select or type new</option>
                  {dropdownOptions.WHO.map((who, index) => (
                    <option key={index} value={who}>
                      {who}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>WHO Type</Form.Label>
                <Form.Select
                  name="WHO_TYPE"
                  value={formData.WHO_TYPE}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="Pokémon">Pokémon</option>
                  <option value="Trainer">Trainer</option>
                  <option value="Item">Item</option>
                  <option value="Character">Character</option>
                  <option value="Political Party">Political Party</option>
                  <option value="Movement">Movement</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Spectrum</Form.Label>
                <Form.Select
                  name="SPECTRUM"
                  value={formData.SPECTRUM}
                  onChange={handleChange}
                >
                  <option value="">Select Spectrum</option>
                  {SPECTRUM_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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