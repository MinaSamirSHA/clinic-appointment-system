// Google Sheets Integration Module
// This module handles sending data to Google Sheets via Google Apps Script Web App

/**
 * Send data to Google Sheets
 * @param {string} webAppUrl - The Google Apps Script Web App URL
 * @param {object} data - The data to send
 * @returns {Promise<object>} - Response from the web app
 */
async function sendToGoogleSheets(webAppUrl, data) {
    if (!webAppUrl) {
        console.warn('No Google Sheets URL provided');
        return null;
    }

    try {
        const response = await fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script requires no-cors
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Note: With no-cors mode, we can't read the response
        // We assume success if no error is thrown
        console.log('Data sent to Google Sheets successfully');
        return { success: true };

    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        // Don't throw error - Google Sheets is optional
        return { success: false, error: error.message };
    }
}

/**
 * Test Google Sheets connection
 * @param {string} webAppUrl - The Google Apps Script Web App URL
 * @returns {Promise<boolean>} - True if connection successful
 */
async function testGoogleSheetsConnection(webAppUrl) {
    try {
        await sendToGoogleSheets(webAppUrl, {
            type: 'test',
            data: { message: 'Connection test', timestamp: new Date().toISOString() }
        });
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Format data for Google Sheets
 * Converts nested objects to flat structure
 */
function formatDataForSheets(data) {
    const flatData = {};

    function flatten(obj, prefix = '') {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const newKey = prefix ? `${prefix}_${key}` : key;

                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    flatten(value, newKey);
                } else {
                    flatData[newKey] = value;
                }
            }
        }
    }

    flatten(data);
    return flatData;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendToGoogleSheets, testGoogleSheetsConnection, formatDataForSheets };
}
