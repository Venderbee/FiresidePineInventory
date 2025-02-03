function loadLocalData() {
    fetch('https://raw.githubusercontent.com/Venderbee/FiresidePineInventory/main/data.json')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(err => {
            console.error('Error loading local data:', err);
        });
}

function populateTable(data) {
    const tableBody = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table data

    data.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        const newRow = tableBody.insertRow();
        row.forEach((cell, cellIndex) => {
            const newCell = newRow.insertCell();
            newCell.contentEditable = true; // Make the cell editable
            if (cellIndex === 1) { // Assuming the second column contains image URLs
                const img = document.createElement('img');
                img.src = cell;
                img.alt = 'Item Image';
                img.style.width = '50px'; // Adjust the size as needed
                img.style.height = '50px'; // Adjust the size as needed
                newCell.appendChild(img);
            } else {
                newCell.textContent = cell;
            }

            // Add event listener to update the local data on cell edit
            newCell.addEventListener('blur', () => {
                updateLocalData(index, cellIndex, newCell.textContent);
            });
        });
    });
}

function updateSheetData(row, col, value) {
    const range = `Stock!${String.fromCharCode(65 + col)}${row}`;
    const values = [[value]];
    const body = { values };

    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'RAW',
        resource: body,
    }).then(response => {
        console.log('Cell updated:', response);
    }).catch(err => {
        console.error('Error updating cell:', err);
    });
}

function updateLocalData(row, col, value) {
    fetch('https://raw.githubusercontent.com/Venderbee/FiresidePineInventory/main/data.json')
        .then(response => response.json())
        .then(data => {
            data[row][col] = value;
            saveLocalData(data);
        })
        .catch(err => {
            console.error('Error updating local data:', err);
        });
}

function saveLocalData(data) {
    // This function would need to send the updated data to the server to save it.
    // For example, you could use a server-side script to handle the saving.
    console.log('Updated data:', data);
}

// Load local data on page load
document.addEventListener('DOMContentLoaded', loadLocalData);