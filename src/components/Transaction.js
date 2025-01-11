import React, { useState } from "react";
import './css/Transaction.css'; // Import the Transaction-specific CSS file

const Transaction = () => {
  const [url, setUrl] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [email, setEmail] = useState("");
  const [qrCode, setQrCode] = useState("");

  const handleGenerateQR = () => {
    // QR code generation logic
    setQrCode("Generated QR Code Here");
  };

  const handlePrintReceipt = () => {
    // Print receipt logic
    alert("Receipt printed!");
  };

  return (
    <div className="transaction-content">
      <h3>Transaction</h3>

      <div className="input-field">
        <label htmlFor="url">Input URL:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="qr-code">
        <p>{qrCode ? qrCode : "QR Code will be displayed here"}</p>
      </div>

      <button onClick={handleGenerateQR}>Generate QR</button>

      <div className="input-field">
        <label htmlFor="privateKey">Input Private Key:</label>
        <input
          type="text"
          id="privateKey"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
      </div>

      <div className="input-field">
        <label htmlFor="email">Input Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button onClick={handlePrintReceipt}>Print Receipt</button>
    </div>
  );
};

export default Transaction;