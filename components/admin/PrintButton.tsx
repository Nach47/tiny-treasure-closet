"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-primary fixed right-6 top-6 print:hidden"
    >
      Print
    </button>
  );
}
