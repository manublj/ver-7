import axios from 'axios';

const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

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

// Function to add a row to a sheet
export const addRowToSheet = async (sheetName, rowData) => {
  try {
    console.log(`Adding row to ${sheetName}:`, rowData);
    
    alert(`Data would be saved to ${sheetName} sheet. In a production app, this would connect to a server endpoint.`);
    
    return {
      success: true,
      message: 'Row added successfully (simulated)',
      data: rowData
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