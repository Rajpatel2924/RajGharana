'use client'
import { useState } from 'react';
import Image from 'next/image';

const ImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="px-5 lg:px-16 xl:px-20">
      {/* Main Image */}
      <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 relative">
        <div
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          className="relative overflow-hidden bg-gray-100 flex items-center justify-center"
          style={{ height: '500px' }}
        >
          <Image
            src={images[selectedImage]}
            alt={productName}
            className={`object-cover w-full h-full transition-transform duration-300 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            width={500}
            height={500}
          />
        </div>
        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 transition-all ${
              selectedImage === index
                ? 'ring-2 ring-orange-600'
                : 'ring-1 ring-gray-200 hover:ring-orange-400'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} ${index + 1}`}
              className="w-full h-auto object-cover mix-blend-multiply"
              width={120}
              height={120}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;