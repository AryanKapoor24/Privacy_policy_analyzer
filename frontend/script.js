async function uploadPDF() {
    const fileInput = document.getElementById('pdfInput');
    const resultDiv = document.getElementById('result');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a PDF file first.');
        return;
    }

    resultDiv.innerText = "Uploading and parsing...";

    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
            // Note: Do NOT set 'Content-Type' header here. 
            // The browser sets it automatically with the boundary for FormData.
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            // Display the JSON result
            resultDiv.innerText = JSON.stringify(data, null, 2);
        } else {
            resultDiv.innerText = 'Error: ' + (data.error || 'Unknown error');
        }

    } catch (error) {
        console.error('Upload failed:', error);
        resultDiv.innerText = 'Upload failed: ' + error.message;
    }
}
