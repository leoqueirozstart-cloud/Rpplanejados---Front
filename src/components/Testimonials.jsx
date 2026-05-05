"use client"

import * as React from "react"

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EImagem não disponível%3C/text%3E%3C/svg%3E"

function ImageWithFallback({ src, alt, className }) {
  const [imgError, setImgError] = React.useState(false)
  return (
    <img 
      src={imgError || !src ? FALLBACK_IMG : src} 
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  )
}

export default function Testimonials({ testimonials }) {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section id="depoimentos" className="depoimentos-section">
      <div className="depoimentos-container">
        <div className="depoimentos-header">
          <span className="depoimentos-label">DEPOIMENTOS</span>
          <h2 className="depoimentos-title">O QUE NOSSOS CLIENTES DIZEM</h2>
        </div>

        <div className="depoimentos-carousel">
          <div className="depoimentos-track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {testimonials.map((t) => (
              <div key={t.id} className="depoimento-slide">
                <div className="depoimento-card">
                  <ImageWithFallback src={t.image_url || t.imageUrl || t.avatarUrl} alt={`Depoimento de ${t.name}`} className="depoimento-image" />
                </div>
              </div>
            ))}
          </div>

          <div className="depoimentos-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`depoimento-dot ${i === current ? 'active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Ver depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .depoimentos-section {
          background: linear-gradient(180deg, #F5F0E6 0%, #EBE8E0 100%);
          padding: 60px 20px;
          overflow: hidden;
        }
        
        .depoimentos-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .depoimentos-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .depoimentos-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 3px;
          color: #FF6A4D;
          margin-bottom: 12px;
        }

        .depoimentos-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }

        .depoimentos-carousel {
          position: relative;
          max-width: 320px;
          margin: 0 auto;
        }

        .depoimentos-track {
          display: flex;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .depoimento-slide {
          min-width: 100%;
          padding: 0 10px;
        }

        .depoimento-card {
          background: white;
          border-radius: 16px;
          padding: 8px;
          box-shadow: 
            0 16px 32px -8px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(0, 0, 0, 0.04);
        }

        .depoimento-image {
          width: 100%;
          height: 380px;
          object-fit: cover;
          object-position: top;
          display: block;
          border-radius: 10px;
        }

        .depoimentos-dots {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
        }

        .depoimento-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: #bbb;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .depoimento-dot.active {
          background: #FF6A4D;
          transform: scale(1.2);
        }

        .depoimento-dot:hover:not(.active) {
          background: #888;
        }

        @media (min-width: 768px) {
          .depoimentos-carousel {
            max-width: 380px;
          }
          
          .depoimentos-title {
            font-size: 38px;
          }

          .depoimento-image {
            height: 420px;
          }
        }
      `}</style>
    </section>
  )
}