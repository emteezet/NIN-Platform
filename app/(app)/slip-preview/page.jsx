"use client";

import { useState } from "react";
import SlipTemplate from "@/components/SlipTemplate";

export default function SlipPreviewPage() {
  const [showPreview, setShowPreview] = useState(true);

  // Sample user data for demonstration
  const [sampleData, setSampleData] = useState({
    nin: "19691733426",
    firstName: "John",
    middleName: "Oluwaseun",
    lastName: "Adeyemi",
    gender: "Male",
    dob: "1995-05-15",
    state: "Lagos",
    lga: "Ikoyi",
    photo: "/placeholder-user.jpg",
  });

  const [serialNumber] = useState("NIN2024002847");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSampleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-[85vh] px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            NIN Slip Preview
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Preview and customize your NIN slip designs before downloading
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form Panel */}
          <div
            className="lg:col-span-1 glass-card p-6 rounded-xl h-fit"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2
              className="text-lg font-semibold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Sample Data
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  NIN
                </label>
                <input
                  type="text"
                  name="nin"
                  value={sampleData.nin}
                  onChange={handleInputChange}
                  maxLength="11"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={sampleData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={sampleData.middleName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={sampleData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Gender
                </label>
                <select
                  name="gender"
                  value={sampleData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={sampleData.dob}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={sampleData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  LGA
                </label>
                <input
                  type="text"
                  name="lga"
                  value={sampleData.lga}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Info Box */}
            <div
              className="mt-6 p-3 rounded-lg text-xs"
              style={{
                background: "rgba(13, 107, 13, 0.1)",
                color: "var(--text-secondary)",
              }}
            >
              <p className="font-semibold mb-1">💡 Tip:</p>
              <p>
                Edit the form to see real-time changes in the slip preview.
                Both slip types use the same data.
              </p>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-3">
            <SlipTemplate userData={sampleData} serialNumber={serialNumber} />
          </div>
        </div>

        {/* Feature Documentation */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Full Slip Features */}
          <div
            className="glass-card p-6 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              📄 Full Slip Features
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>✓ National Identity Management System header</li>
              <li>✓ Personal information grid layout</li>
              <li>✓ 2D barcode (QR code) for verification</li>
              <li>✓ Official disclaimer note section</li>
              <li>✓ User photo and metadata</li>
              <li>✓ A4 page format (high-resolution output)</li>
            </ul>
          </div>

          {/* Premium Slip Features */}
          <div
            className="glass-card p-6 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              💳 Premium Digital Slip Features
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>✓ Emerald-green professional theme</li>
              <li>✓ Compact ID-1 card format (85.6 x 53.98mm)</li>
              <li>✓ Photo on top right corner</li>
              <li>✓ QR code for mobile verification</li>
              <li>✓ Clean, minimalist design</li>
              <li>✓ Print-ready format (300 DPI)</li>
            </ul>
          </div>
        </div>

        {/* Technical Details */}
        <div
          className="mt-8 p-6 rounded-xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            🔧 Technical Implementation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                PDF Generation
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                Uses html2canvas (scale: 3) for 300 DPI output and jsPDF for format
                conversion. Ensures crisp text and image quality.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                QR Code
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                Dynamic QR generation using qrcode library. Links to NIN for easy
                verification via mobile or scanner devices.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Responsive Design
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                Built with Tailwind CSS v4. Optimized for both screen preview and
                PDF output across all devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
