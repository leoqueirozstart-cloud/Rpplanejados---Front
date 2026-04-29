import { useState } from 'react';

function ProjectGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">Sem imagens disponíveis</p>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery-main">
        <img src={images[selectedIndex]} alt={`Imagem ${selectedIndex + 1}`} />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`gallery-thumb ${index === selectedIndex ? 'active' : ''}`}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectGallery;