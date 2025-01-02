const { google } = require('googleapis');
const sheets = google.sheets('v4');

// Replace with your Google Sheets API key
const API_KEY = 'AIzaSyCws4q38ZqWT2m74wKEhGXIQ1EXyKkEo7w';

// Replace with your Google Sheets ID and range
const SPREADSHEET_ID = '1nEdJlw-6wumA1jIEtVeLoO4zW5s5gkhezu8vlWp4v5c';
const RANGE = 'Stock'; // Adjust the range as needed

async function loadSheetData() {
    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();

    const request = {
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        auth: authClient,
    };

    try {
        const response = await sheets.spreadsheets.values.get(request);
        const rows = response.data.values;
        if (rows.length) {
            populateTable(rows);
        } else {
            console.log('No data found.');
        }
    } catch (err) {
        console.error('Error fetching data from Google Sheet:', err);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table data

    data.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        const newRow = tableBody.insertRow();
        row.forEach(cell => {
            const newCell = newRow.insertCell();
            newCell.textContent = cell;
        });
    });
}

document.addEventListener('DOMContentLoaded', loadSheetData);