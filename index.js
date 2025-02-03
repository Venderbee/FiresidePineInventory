const DATA_URL = '/.netlify/functions/readData';
const SAVE_URL = '/.netlify/functions/writeData';

function loadLocalData() {
    fetch(DATA_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateTable(data);
            initializeDataTable();
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

function updateLocalData(row, col, value) {
    fetch(DATA_URL)
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
    fetch(SAVE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        console.log('Data saved successfully:', result);
    })
    .catch(err => {
        console.error('Error saving data:', err);
    });
}

function initializeDataTable() {
    $(document).ready(function() {
        $('#inventoryTable').DataTable();
    });
}

// Load local data on page load
document.addEventListener('DOMContentLoaded', loadLocalData);
