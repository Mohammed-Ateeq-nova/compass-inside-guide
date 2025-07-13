import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Store } from '../../types';
import { Download, QrCode, Share2 } from 'lucide-react';

interface QRCodeGeneratorProps {
  store: Store;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ store }) => {
  const [qrSize, setQrSize] = useState(256);
  const customerUrl = `${window.location.origin}/customer?store=${store.id}`;

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = qrSize;
    canvas.height = qrSize;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `${store.name}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(customerUrl);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">QR Code Generator</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Display */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Access QR Code</h3>
            
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                <QRCode
                  id="qr-code"
                  value={customerUrl}
                  size={qrSize}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox="0 0 256 256"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Size
                </label>
                <select
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value={128}>Small (128px)</option>
                  <option value={256}>Medium (256px)</option>
                  <option value={512}>Large (512px)</option>
                  <option value={1024}>Extra Large (1024px)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadQR}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
                <button
                  onClick={copyUrl}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Copy URL
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">How to Use</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Download the QR code image above</li>
                <li>Print and display it at your store entrance</li>
                <li>Customers can scan it with their phone camera</li>
                <li>They'll be taken directly to your store's navigation app</li>
              </ol>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Store Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Store Name:</span>
                  <div className="text-gray-900">{store.name}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Address:</span>
                  <div className="text-gray-900">{store.address}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Customer URL:</span>
                  <div className="text-sm text-gray-700 break-all bg-gray-100 p-2 rounded font-mono">
                    {customerUrl}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Best Practices</h3>
              <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                <li>Place QR codes at eye level for easy scanning</li>
                <li>Ensure good lighting around the QR code</li>
                <li>Include instructions like "Scan for store navigation"</li>
                <li>Test the QR code regularly to ensure it works</li>
                <li>Consider multiple placement locations for visibility</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};