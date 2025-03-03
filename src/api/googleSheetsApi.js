import axios from 'axios';

const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

// Define the expected headers for each sheet type
export const getSheetHeaders = (sheetType) => {
  const commonFields = [
    'KEYWORDS', 
    'WHO', 
    'WHO_TYPE', 
    'URL', 
    'DOMAIN', 
    'DATE_PUBLISHED'
  ];

  switch (sheetType.toLowerCase()) {
    case 'theory':
      return [
        'CATEGORY',
        'SOURCE_TYPE',
        'HEADLINE',
        'AUTHOR',
        'DOMAIN',
        'ABSTRACT',
        ...commonFields.slice(0, 3), // KEYWORDS, WHO, WHO_TYPE
        'URL',
        'DATE_PUBLISHED',
        'EXCERPTS'
      ];
    case 'reporting':
      return [
        'CATEGORY',
        'SOURCE_TYPE',
        'HEADLINE',
        'AUTHOR',
        'SPECTRUM',
        ...commonFields.slice(0, 3), // KEYWORDS, WHO, WHO_TYPE
        'URL',
        'DOMAIN',
        'DATE_PUBLISHED',
        'REGION'
      ];
    case 'cards':
      return [
        'WHO',
        'WHO_TYPE',
        'KEYWORDS',
        'URL',
        'NOTES'
      ];
    default:
      return commonFields;
  }
};

// Function to get data from a specific sheet
export const getSheetData = async (sheetName) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${SPREADSHEET_ID}/values/${sheetName}!A1:Z1000`,
      {
        params: {
          key: API_KEY,
          majorDimension: 'ROWS',
          valueRenderOption: 'UNFORMATTED_VALUE'
        }
      }
    );

    if (!response.data.values || response.data.values.length < 2) {
      console.warn(`No data found in sheet "${sheetName}"`);
      return [];
    }

    const headers = response.data.values[0];
    const rows = response.data.values.slice(1);

    return rows.map(row => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index] || '';
      });
      return rowData;
    });

  } catch (error) {
    console.error(`Error fetching ${sheetName} data:`, error);
    throw error;
  }
};

// Function to add a row to a sheet with proper field ordering
export const addRowToSheet = async (sheetName, rowData) => {
  try {
    console.log(`Adding row to ${sheetName}:`, rowData);
    
    // Get the expected headers for this sheet type
    const expectedHeaders = getSheetHeaders(sheetName);
    
    // Reorder the data to match the expected headers
    const orderedData = {};
    expectedHeaders.forEach(header => {
      orderedData[header] = rowData[header] || '';
    });
    
    alert(`Data would be saved to ${sheetName} sheet. In a production app, this would connect to a server endpoint.`);
    
    return {
      success: true,
      message: 'Row added successfully (simulated)',
      data: orderedData
    };
  } catch (error) {
    console.error('Error adding row to sheet:', error);
    throw error;
  }
};

// Function to update Google Sheets with the specified headers for each sheet according to the new schema
export const updateSheetHeaders = async (sheetName, newHeaders) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${SPREADSHEET_ID}/values/${sheetName}!1:1`,
      {
        majorDimension: 'ROWS',
        range: `${sheetName}!1:1`,
        valueInputOption: 'USER_ENTERED',
        values: [newHeaders]
      },
      {
        params: {
          key: API_KEY
        }
      }
    );

    console.log(`Updated headers for ${sheetName} sheet:`, newHeaders);
    
    return {
      success: true,
      message: 'Headers updated successfully',
      data: newHeaders
    };
  } catch (error) {
    console.error(`Error updating headers for ${sheetName} sheet:`, error);
    throw error;
  }
};

// Initialize sheets with the correct headers if needed
export const initializeSheetHeaders = async () => {
  try {
    // Update headers for each sheet type
    await updateSheetHeaders('theory', getSheetHeaders('theory'));
    await updateSheetHeaders('reporting', getSheetHeaders('reporting'));
    await updateSheetHeaders('CARDS', getSheetHeaders('cards'));
    
    return {
      success: true,
      message: 'All sheets initialized with correct headers'
    };
  } catch (error) {
    console.error('Error initializing sheet headers:', error);
    throw error;
  }
};