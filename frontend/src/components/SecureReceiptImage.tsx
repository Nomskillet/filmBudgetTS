import React, { useEffect, useState } from 'react';

interface SecureReceiptImageProps {
  imageId: string;
}

const SecureReceiptImage: React.FC<SecureReceiptImageProps> = ({ imageId }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`/api/upload/image/id/${imageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch image:', res.status);
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        console.error('Error fetching secure image:', err);
      }
    };

    fetchImage();
  }, [imageId]);

  if (!imageUrl) return <p className="text-sm italic">Loading image...</p>;

  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600 italic mb-1">
        Current Receipt Preview:
      </p>
      <img
        src={imageUrl}
        alt="Uploaded Receipt"
        className="w-full max-w-xs border rounded max-h-60 object-contain"
      />
    </div>
  );
};

export default SecureReceiptImage;
