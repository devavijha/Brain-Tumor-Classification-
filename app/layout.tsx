import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brain Tumor Classifier | AI-Powered MRI Analysis',
  description: 'Advanced AI-powered brain tumor classification using deep learning and MRI images',
  keywords: 'brain tumor, MRI, AI, deep learning, classification, medical imaging',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}
