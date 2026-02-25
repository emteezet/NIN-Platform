"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function NinCard({
  userData,
  type = "full",
  serialNumber,
  qrCodeData,
  forwardedRef,
}) {
  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      if (qrCodeData) {
        try {
          const qrDataUrl = await QRCode.toDataURL(qrCodeData, {
            width: type === "premium" ? 150 : 200,
            margin: 1,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });
          setQrImage(qrDataUrl);
        } catch (err) {
          console.error("QR Code generation error:", err);
        }
      }
    };
    generateQR();
  }, [qrCodeData, type]);

  const formatNIN = (nin) => {
    if (!nin) return "";
    return nin.replace(/(\d{4})(\d{4})(\d{3})/g, "$1 $2 $3");
  };

  const formatDOB = (dob) => {
    if (!dob) return "";
    return new Date(dob).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fullName =
    [userData?.firstName, userData?.middleName, userData?.lastName]
      .filter(Boolean)
      .join(" ") || "Name Not Provided";

  if (type === "premium") {
    return (
      <div
        ref={forwardedRef}
        className="w-full aspect-video flex items-center justify-center p-4"
        style={{
          background: "white",
          maxWidth: "1024px",
          aspectRatio: "1.59",
        }}
      >
        <div
          className="w-full h-full rounded-lg overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #047857 100%)",
            display: "flex",
          }}
        >
          {/* Left Side - Information */}
          <div className="flex-1 p-8 text-white relative flex flex-col justify-between">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold mb-1">NATIONAL IDENTITY</h1>
              <p className="text-sm font-light mb-6">Digital NIN Slip</p>

              {/* Info Grid */}
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase opacity-75 mb-1">
                    National ID Number
                  </p>
                  <p className="text-lg font-semibold tracking-wider">
                    {formatNIN(userData?.nin)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase opacity-75 mb-1">Full Name</p>
                  <p className="text-sm font-medium">{fullName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase opacity-75 mb-1">Gender</p>
                    <p className="text-sm font-medium">
                      {userData?.gender || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase opacity-75 mb-1">DOB</p>
                    <p className="text-sm font-medium">
                      {formatDOB(userData?.dob)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase opacity-75 mb-1">State</p>
                    <p className="text-sm font-medium">
                      {userData?.state || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase opacity-75 mb-1">LGA</p>
                    <p className="text-sm font-medium">
                      {userData?.lga || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Serial Number */}
            <div className="text-xs opacity-75">
              <p>Serial: {serialNumber}</p>
              <p>
                {new Date().toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Right Side - Photo & QR */}
          <div className="w-48 p-6 flex flex-col justify-between items-center border-l border-white border-opacity-20">
            {/* Photo */}
            <div className="w-32 h-40 rounded-lg overflow-hidden bg-white bg-opacity-10 flex items-center justify-center">
              <img
                src={userData?.photo || "/placeholder-user.jpg"}
                alt="User Photo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-user.jpg";
                }}
              />
            </div>

            {/* QR Code */}
            {qrImage && (
              <div className="w-28 h-28 bg-white p-1 rounded">
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full Slip Design
  return (
    <div
      ref={forwardedRef}
      className="w-full bg-white p-6"
      style={{
        maxWidth: "900px",
        aspectRatio: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div className="border-b-4 border-gray-900 pb-4 mb-6 flex items-center gap-6">
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src="/coat-of-arms.png"
            alt="Coat of Arms"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold tracking-wider">
            NATIONAL IDENTIFICATION MANAGEMENT SYSTEM
          </h1>
          <p className="text-sm mt-1 font-semibold">NIN SLIP</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8">
        {/* NIN Number Prominent Display */}
        <div className="mb-6 p-4 bg-gray-100 border-2 border-gray-900">
          <p className="text-xs font-bold mb-1 text-gray-600">
            NATIONAL IDENTIFICATION NUMBER
          </p>
          <p className="text-3xl font-bold tracking-widest text-gray-900">
            {formatNIN(userData?.nin)}
          </p>
        </div>

        {/* Personal Information Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">FIRST NAME</p>
              <p className="text-sm font-semibold border-b border-gray-900 pb-1">
                {userData?.firstName || ""}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">
                MIDDLE NAME
              </p>
              <p className="text-sm font-semibold border-b border-gray-900 pb-1">
                {userData?.middleName || ""}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">LAST NAME</p>
              <p className="text-sm font-semibold border-b border-gray-900 pb-1">
                {userData?.lastName || ""}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">GENDER</p>
              <p className="text-sm font-semibold border-b border-gray-900 pb-1">
                {userData?.gender || ""}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">
                DATE OF BIRTH
              </p>
              <p className="text-sm font-semibold border-b border-gray-900 pb-1">
                {formatDOB(userData?.dob)}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">STATE</p>
              <p className="text-sm font-semibold border-b border-gray-900 pb-1">
                {userData?.state || ""}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">LGA</p>
              <p className="text-sm font-semibold border-b border-gray-900 pb-1">
                {userData?.lga || ""}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">SERIAL</p>
              <p className="text-sm font-semibold border-b border-gray-900 pb-1">
                {serialNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Photo and QR Code Row */}
        <div className="flex gap-8 mb-8">
          {/* Photo */}
          <div className="w-32 h-40 flex-shrink-0">
            <img
              src={userData?.photo || "/placeholder-user.jpg"}
              alt="User Photo"
              className="w-full h-full object-cover border-2 border-gray-900"
              onError={(e) => {
                e.target.src = "/placeholder-user.jpg";
              }}
            />
          </div>

          {/* QR Code */}
          <div className="flex items-center justify-center">
            {qrImage && (
              <div className="w-40 h-40 bg-white border-2 border-gray-900 p-2 flex items-center justify-center">
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Section */}
      <div className="border-t-4 border-gray-900 pt-4 text-xs">
        <p className="font-bold mb-2">NOTE:</p>
        <p className="text-gray-700 leading-relaxed">
          This NIN slip is generated as a simulation for educational and
          demonstration purposes. It does not represent an actual official
          identification from the National Identification Management System
          (NIMS). This service is not affiliated with or endorsed by NIMC or any
          government agency. Users should not rely on this simulated document
          for any official purposes. Always consult official government sources
          for verified identification information.
        </p>
      </div>
    </div>
  );
}
