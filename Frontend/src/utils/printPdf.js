/**
 * Dedicated isolated iframe print utility for Form T/351 E-Circular
 * Clones only the Form T/351 circular and prints cleanly in A4 portrait format
 * constrained to exactly 1 single sheet of paper.
 */
export const handlePrintPdf = () => {
  const printElement = document.getElementById("printable-t351-circular");
  if (!printElement) {
    window.print();
    return;
  }

  // Create a hidden iframe for isolated, clean printing
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  // Write standalone document with standard railway styling and compact 1-page A4 layout
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>FORM T/351 - JOINT BLOCK SANCTION ORDER</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
          body {
            background: #ffffff !important;
            color: #111827 !important;
            margin: 0 !important;
            padding: 4mm 8mm !important;
            font-size: 10px !important;
            line-height: 1.3 !important;
          }
          #printable-t351-circular, #possession-circular-document {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            position: relative !important;
          }
          h1, h2, .doc-title {
            font-size: 14px !important;
            margin: 4px 0 !important;
            line-height: 1.2 !important;
          }

          /* Official Header Crest / Logo */
          .header-logo, svg.national-crest {
            width: 48px !important;
            height: 48px !important;
            margin-bottom: 8px !important;
            display: inline-block !important;
            position: static !important;
            opacity: 1 !important;
          }

          /* Faint Center Background Watermark */
          .watermark-emblem, svg[data-watermark="true"] {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 220px !important;
            height: 220px !important;
            opacity: 0.04 !important;
            z-index: 0 !important;
            pointer-events: none !important;
          }

          /* Text Stamp Watermark (AI Generated Draft / Sanctioned) */
          .watermark-emblem + div, div:has(> .rotate-\[-18deg\]) {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            opacity: 0.04 !important;
            pointer-events: none !important;
            z-index: 0 !important;
          }
          div:has(> .rotate-\[-18deg\]) .rotate-\[-18deg\] {
            font-size: 20px !important;
            padding: 8px 16px !important;
          }

          /* Compact Table Formatting */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 8px 0 !important;
          }
          th, td {
            border: 1px solid #94a3b8 !important;
            padding: 4px 6px !important;
            font-size: 9.5px !important;
            line-height: 1.25 !important;
            color: #0f172a !important;
            background: transparent !important;
          }
          th {
            background-color: #f1f5f9 !important;
            font-weight: 700 !important;
          }

          /* Section II Mandate Box */
          .mandate-box {
            padding: 6px 8px !important;
            margin-top: 6px !important;
            border-color: #94a3b8 !important;
            border-width: 1px 0 !important;
          }

          /* Spacing Reductions for Strict 1-Page A4 Fit */
          .space-y-3 > * + *, .space-y-4 > * + * {
            margin-top: 4px !important;
          }
          .pb-6, .py-4, .py-5 {
            padding-top: 4px !important;
            padding-bottom: 4px !important;
          }
          .my-5 {
            margin-top: 4px !important;
            margin-bottom: 4px !important;
          }
          .mt-5, .mt-3, .mt-2 {
            margin-top: 4px !important;
          }
          .p-4, .p-5, .p-6, .p-10 {
            padding: 6px 8px !important;
          }

          /* Neutralize dark-mode classes in the print clone */
          [class*="text-amber-"], [class*="text-emerald-"], [class*="text-slate-"], [class*="text-blue-"] {
            color: #0f172a !important;
          }
          [class*="bg-"] {
            background-color: transparent !important;
          }
          .border {
            border-color: #94a3b8 !important;
          }
          .print\\:hidden, [class*="print:hidden"] {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${printElement.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Trigger print cleanly after rendering
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    // Cleanup iframe after print dialog resolves
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);
  }, 250);
};

export default handlePrintPdf;
