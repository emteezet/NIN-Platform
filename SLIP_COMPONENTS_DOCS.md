# NIN Slip Generator Components - Documentation

## Overview

This documentation covers the new high-fidelity NIN Slip Generator components system, which provides a pixel-perfect recreation of Nigerian NIN slip styles with PDF generation capabilities.

## Components

### 1. **SlipTemplate.jsx** (Parent Component)

The main coordinator component that manages slip type selection and coordinates between the visual renderer and PDF download functionality.

**Location:** `components/SlipTemplate.jsx`

**Props:**

```javascript
<SlipTemplate
  userData={{
    nin: "19691733426",
    firstName: "John",
    middleName: "Oluwaseun",
    lastName: "Adeyemi",
    gender: "Male",
    dob: "1995-05-15",
    state: "Lagos",
    lga: "Ikoyi",
    photo: "/path-to-photo.jpg",
  }}
  serialNumber="NIN2024002847"
/>
```

**Features:**

- Toggle between "Full" and "Premium" slip types
- Real-time preview switching
- Integrated download button
- Clean UI for type selection

### 2. **NinCard.jsx** (Visual Renderer)

Renders the actual NIN slip design in two styles: Full Slip and Premium Digital Slip.

**Location:** `components/NinCard.jsx`

**Props:**

```javascript
<NinCard
  userData={userData}
  type="full" // or "premium"
  serialNumber="NIN2024002847"
  qrCodeData="19691733426"
  forwardedRef={ref}
/>
```

**Features:**

#### Full Slip Design:

- 📄 National Identity Management System header
- 🏛️ Nigerian Coat of Arms (decorative)
- 📊 Personal information grid layout
- 📷 User photograph
- 🔗 2D QR barcode for verification
- 📝 Official disclaimer note section
- ✓ A4 page format

#### Premium Digital Slip:

- 💳 ID-1 card format (85.6mm x 53.98mm)
- 🎨 Emerald-green professional gradient
- 👤 Photo positioned top-right
- 🔗 Compact QR code
- ✨ Minimalist, clean design
- ✓ Print-ready (300 DPI output)

### 3. **DownloadButton.jsx** (PDF Handler)

Handles conversion from HTML canvas to PDF with high-resolution output.

**Location:** `components/DownloadButton.jsx`

**Props:**

```javascript
<DownloadButton
  templateRef={ref} // Reference to NinCard component
  fileName="NIN-Slip"
  slipType="full" // or "premium"
/>
```

**Features:**

- HTML to PNG canvas conversion (scale: 3 = 300 DPI)
- Smart PDF page sizing based on slip type
- Error handling and user feedback
- Loading state with spinner
- Automatic file naming with slip type suffix

## PDF Output Specifications

### Full Slip

- **Format:** A4 (210 x 297mm)
- **Orientation:** Portrait
- **Resolution:** 300 DPI (via html2canvas scale: 3)
- **Output:** `{fileName}-Full.pdf`

### Premium Digital Slip

- **Format:** ID-1 (85.6 x 53.98mm)
- **Orientation:** Landscape
- **Resolution:** 300 DPI (via html2canvas scale: 3)
- **Output:** `{fileName}-Premium.pdf`

## NIN Formatting

All NIN numbers are automatically formatted with spaces:

```
Input:  19691733426
Output: 1969 1733 426
```

## QR Code Integration

QR codes are generated dynamically using the `qrcode` library:

**Default QR Data:** NIN number (can be customized)
**Size:**

- Full Slip: 200px
- Premium Slip: 150px

**Example:**

```javascript
QRCode.toDataURL("19691733426", {
  width: 200,
  margin: 1,
  color: { dark: "#000000", light: "#ffffff" },
});
```

## Asset Requirements

Create these placeholder images in `/public`:

### 1. `/public/coat-of-arms.png`

- Nigerian Coat of Arms
- Size: 80x80px minimum
- Format: PNG with transparency
- Usage: Full Slip header decoration

### 2. `/public/placeholder-user.jpg`

- Default user placeholder
- Size: 130x160px (portrait)
- Format: JPG/PNG
- Usage: Fallback when no user photo provided

## Usage Examples

### Basic Integration

```javascript
import SlipTemplate from "@/components/SlipTemplate";

export default function MyPage() {
  const userData = {
    nin: "19691733426",
    firstName: "John",
    lastName: "Adeyemi",
    gender: "Male",
    dob: "1995-05-15",
    state: "Lagos",
    lga: "Ikoyi",
    photo: userPhotoUrl,
  };

  return <SlipTemplate userData={userData} serialNumber="NIN2024002847" />;
}
```

### Advanced Implementation (Individual Components)

```javascript
import { useRef } from "react";
import NinCard from "@/components/NinCard";
import DownloadButton from "@/components/DownloadButton";

export default function AdvancedPreview() {
  const cardRef = useRef(null);
  const [type, setType] = useState("full");

  return (
    <>
      <NinCard
        userData={userData}
        type={type}
        serialNumber={serialNumber}
        qrCodeData={userData.nin}
        forwardedRef={cardRef}
      />
      <DownloadButton
        templateRef={cardRef}
        fileName={`NIN-${userData.nin}`}
        slipType={type}
      />
    </>
  );
}
```

## Preview Page

A complete preview/demo page is available at:

**URL:** `/slip-preview`

**Features:**

- Live form editing with real-time preview
- Toggle between slip types
- Sample data fields
- Feature documentation
- Technical implementation details

## Dependencies

Ensure these packages are installed:

```json
{
  "dependencies": {
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "qrcode": "^1.5.3",
    "tailwindcss": "^4.0.0"
  }
}
```

**Installation:**

```bash
npm install html2canvas jspdf qrcode
```

## Styling & Theming

All components use CSS variables for consistent theming:

```css
--bg-card: Card background --bg-secondary: Secondary background
  --text-primary: Primary text color --text-secondary: Secondary text color
  --border-color: Border color --accent-green: Primary green (#0d6b0d);
```

## Error Handling

### Common Issues & Solutions

**Issue:** QR Code not showing

- **Solution:** Check `qrCodeData` prop is not empty
- **Alternative:** Component handles missing data gracefully

**Issue:** Photo not loading

- **Solution:** Verify image path is correct
- **Fallback:** Component uses placeholder image automatically

**Issue:** PDF generation fails

- **Solution:** Check browser console for html2canvas errors
- **Common cause:** Cross-origin image restrictions
- **Fix:** Use local images or CORS-enabled URLs

## Performance Optimization

### Canvas Rendering

- Scale 3 (300 DPI) provides high quality at the cost of processing time
- For faster preview, consider scale 2 (200 DPI) during development
- Production should always use scale 3

### Image Optimization

- Compress user photos before upload (recommend: <500KB)
- Use modern formats: WebP for browsers that support it
- Lazy load images outside viewport

## Browser Compatibility

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Note:** Requires modern JavaScript (ES6+) and Canvas API support

## Security Considerations

1. **Data Validation:** All user data should be validated server-side
2. **Image Uploads:** Scan for malicious content
3. **Rate Limiting:** Limit PDF generation requests
4. **Disclaimer:** All components display clear educational/simulation warnings

## Future Enhancements

Potential improvements:

- [ ] Multi-language support (Hausa, Yoruba, etc.)
- [ ] Additional slip styles (Standard, Corporate)
- [ ] Batch PDF generation
- [ ] Download as ZIP archive
- [ ] Email delivery integration
- [ ] Cloud storage integration

## Testing

Test both slip types with various data:

```javascript
// Test with minimal data
const minimalData = {
  nin: "12345678901",
  firstName: "Test",
};

// Test with complete data
const completeData = {
  nin: "19691733426",
  firstName: "John",
  middleName: "Oluwaseun",
  lastName: "Adeyemi",
  gender: "Male",
  dob: "1995-05-15",
  state: "Lagos",
  lga: "Ikoyi",
  photo: "/path-to-photo.jpg",
};

// Test with missing photo
const noPhotoData = { ...completeData, photo: null };
```

## Support & Troubleshooting

For issues or questions:

1. Check the `/slip-preview` page for working examples
2. Review browser console for error messages
3. Verify all dependencies are installed
4. Ensure asset files exist in `/public`
5. Check image paths are accessible

## License & Attribution

This component system is built for the NIN Slip Generator project. All Nigerian government imagery is used for educational/simulation purposes only.

**Disclaimer:** This is a simulation/educational tool. It is NOT affiliated with NIMC (National Identification Management System) or any government agency.
