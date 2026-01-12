#!/bin/bash

# Test script for OCR service using curl
# Usage: ./test_ocr.sh

# Configuration
OCR_SERVICE_URL="http://localhost:8000/extract-text"
PDF_FILE="Trang_Duong_Resume.pdf"

# Check if PDF file exists
if [ ! -f "$PDF_FILE" ]; then
    echo "Error: PDF file '$PDF_FILE' not found in current directory"
    exit 1
fi

# Check if OCR service is running
echo "Checking if OCR service is running at $OCR_SERVICE_URL..."
if ! curl -s --head "$OCR_SERVICE_URL" > /dev/null; then
    echo "Error: OCR service is not running at $OCR_SERVICE_URL"
    echo "Please start the OCR service first (e.g., python main.py)"
    exit 1
fi

echo "OCR service is running. Starting test..."
echo "File to test: $PDF_FILE"
echo "Service URL: $OCR_SERVICE_URL"
echo ""

# Test the OCR service
echo "Sending request to OCR service..."
curl -X POST \
    -F "file=@$PDF_FILE" \
    -F "extract_text=true" \
    -F "extract_tables=true" \
    -F "extract_images=true" \
    "$OCR_SERVICE_URL"

echo ""
echo "Test completed."