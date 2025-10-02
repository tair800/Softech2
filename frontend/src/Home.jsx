import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./contexts/LanguageContext.jsx";
import "./Home.css";
import prevIcon from "/assets/prev.png";
import nextIcon from "/assets/next.png";
import logoIcon from "/assets/logo-icon.png";
import logoText from "/assets/logo-text.png";

function CircularProgress({ currentIndex, totalSlides, slides, language, onSliderClick }) {
  const [dimensions, setDimensions] = React.useState({ width: 400, height: 320 });

  React.useEffect(() => {
    const update = () => {
      const el = document.querySelector(".circular-progress");
      if (!el) return;
      const cs = window.getComputedStyle(el);
      setDimensions({
        width: parseInt(cs.width, 10),
        height: parseInt(cs.height, 10),
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const base = Math.max(200, Math.min(dimensions.width, dimensions.height));
  const isSmall = base <= 360;
  const isMedium = base > 360 && base <= 540;

  const radiusFactor = isSmall ? 0.42 : isMedium ? 0.50 : 0.58;
  const radius = base * radiusFactor;
  const strokeW = Math.max(4, base * (isSmall ? 0.006 : 0.01));
  const cx = Math.max(0, dimensions.width / 2);
  const cy = Math.max(0, dimensions.height / 2);

  const rotationAngle = -(totalSlides ? (currentIndex * 360) / totalSlides : 0);

  const isLarge = typeof window !== "undefined" && window.innerWidth >= 1920;

  // >>> Daha böyük başlanğıc ölçülər
  const baseFontRaw =
    isLarge ? Math.max(22, base * 0.055) : Math.max(12, base * (isSmall ? 0.032 : 0.042));

  // Qövsdə “balacalaşma” hissini kompensasiya üçün güclü boost
  const curveBoost = 1.35;          // əvvəlki 1.18-dən böyük
  const activeExtraBoost = 1.15;     // aktiv label üçün əlavə

  const desiredBaseFont = baseFontRaw * curveBoost;
  const maxScale = isLarge ? 1.65 : isSmall ? 1.25 : 1.45;
  const desiredActiveFont = desiredBaseFont * maxScale * activeExtraBoost;

  // Mətni dairədən bir az da uzaqlaşdır (böyümə üçün yer açılsın)
  const textGap = base * (isSmall ? 0.06 : 0.11);
  const textRadius = radius + textGap;

  // Pad — konservativ şəkildə geniş
  const pad = Math.ceil(desiredActiveFont * 1.35 + strokeW + textGap + 12);

  // Dairəvi path
  const circlePathD = `
    M ${cx},${cy}
    m -${textRadius},0
    a ${textRadius},${textRadius} 0 1,1 ${textRadius * 2},0
    a ${textRadius},${textRadius} 0 1,1 -${textRadius * 2},0
  `;

  // ——— Per-label auto-fit: sığmayan halda YALNIZ bir az kiçilt ———
  const circumference = 2 * Math.PI * textRadius;
  const slotArc = totalSlides ? circumference / totalSlides : circumference;
  const availableArc = slotArc * 0.92; // azca boşluq

  // sadə uzunluq təxmini: 1em ≈ 0.56 * fontSize * charCount
  const CHAR_FACTOR = 0.56;

  const getFittedFont = (label, wantedFont) => {
    const estLen = (label?.length || 0) * wantedFont * CHAR_FACTOR;
    if (estLen <= availableArc) return wantedFont;
    const factor = availableArc / Math.max(1, estLen);
    return Math.max(10, wantedFont * factor); // minimum təhlükəsiz limit
  };

  return (
    <div className="circular-progress">
      <div className="circle-logo">
        <img src={logoIcon} alt="Logo" className="circle-logo-icon" />
      </div>

      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`${-pad} ${-pad} ${dimensions.width + pad * 2} ${dimensions.height + pad * 2}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `rotate(${rotationAngle}deg)`,
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "visible",
        }}
        textRendering="geometricPrecision"
        shapeRendering="geometricPrecision"
      >
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="22.5%" stopColor="rgba(0, 123, 255, 0.7)" />
            <stop offset="80.89%" stopColor="rgba(23, 219, 252, 0.7)" />
          </linearGradient>

          <path id="circleTextPath" d={circlePathD} fill="none" pathLength="100" />
        </defs>

        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="url(#circleGradient)"
          strokeWidth={strokeW}
          className="progress-circle"
        />

        {(slides || []).map((slide, index) => {
          const isActive = index === currentIndex;

          const per = totalSlides ? (index / totalSlides) * 100 : 0;
          const startOffset = `${(per + 25) % 100}%`; // üstdən mərkəzlə

          const label = (() => {
            const az = (slide.name || "").trim();
            const en = (slide.nameEn || "").trim();
            const ru = (slide.nameRu || "").trim();
            if (language === "en") return en || az || ru;
            if (language === "ru") return ru || az || en;
            return az || en || ru;
          })();

          // İstənilən böyük ölçü:
          const targetFont = isActive ? desiredActiveFont : desiredBaseFont;
          // Sığmırsa, avtomatik cüzi kiçilt:
          const finalFont = getFittedFont(label, targetFont);

          return (
            <text
              key={slide.id ?? index}
              className={`slider-name ${isActive ? "active" : ""} ${slide.productId ? "clickable" : ""}`}
              dominantBaseline="middle"
              style={{
                fontSize: finalFont,
                fontWeight: isActive ? 700 : 600,
                fill: isActive ? "#17DBFC" : "#ffffff",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: slide.productId ? "pointer" : "default",
                userSelect: "none",
                pointerEvents: "auto",
                letterSpacing: isActive ? "0.02em" : "0.01em",
                whiteSpace: "pre",
              }}
              onClick={() => slide.productId && onSliderClick && onSliderClick(slide)}
            >
              <textPath
                href="#circleTextPath"
                startOffset={startOffset}
                method="align"
                spacing="auto"
                textAnchor="middle"
                dy={isActive ? -0.5 : 0}
              >
                {label}
              </textPath>
            </text>
          );
        })}
      </svg>
    </div>
  );
}



export default function Home() {
  const scrollerRef = useRef(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");
  const [imageWidth, setImageWidth] = useState(window.innerWidth / 3);
  const [slides, setSlides] = useState([]);

  // Handle slider click to navigate to product
  const handleSliderClick = (slide) => {
    if (slide.productId) {
      navigate(`/product/${slide.productId}`);
    }
  };

  // Fetch sliders from API
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch(
          "https://softech-api.webonly.io/api/sliders"
        );
        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);
          // Transform API data to match frontend expectations
          const transformedSlides = data.map((slide) => ({
            id: slide.id,
            img: slide.imageUrl
              ? `https://softech-api.webonly.io${slide.imageUrl}`
              : "/assets/slider1.png",
            name: slide.name || "Default",
            nameEn: slide.nameEn || "Default",
            nameRu: slide.nameRu || "По умолчанию",
            productId: slide.productId || null,
          }));
          console.log("Transformed Slides:", transformedSlides);
          setSlides(transformedSlides);
        } else {
          console.error("Failed to fetch sliders:", response.statusText);
          // Fallback to fake data if API fails
          setSlides([
            {
              id: 1,
              img: "/assets/slider1.png",
              name: "Texnologiya",
              nameEn: "Technology",
              nameRu: "Технология",
            },
            {
              id: 2,
              img: "/assets/slider2.png",
              name: "İnnovasiya",
              nameEn: "Innovation",
              nameRu: "Инновация",
            },
            {
              id: 3,
              img: "/assets/slider3.png",
              name: "Keyfiyyət",
              nameEn: "Quality",
              nameRu: "Качество",
            },
            {
              id: 4,
              img: "/assets/slider4.png",
              name: "Etibarlılıq",
              nameEn: "Reliability",
              nameRu: "Надежность",
            },
            {
              id: 5,
              img: "/assets/slider5.png",
              name: "Müasirlik",
              nameEn: "Modernity",
              nameRu: "Современность",
            },
            {
              id: 6,
              img: "/assets/slider6.png",
              name: "Peşəkar",
              nameEn: "Professional",
              nameRu: "Профессиональный",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
        // Fallback to fake data if API fails
        setSlides([
          {
            id: 1,
            img: "/assets/slider1.png",
            name: "Texnologiya",
            nameEn: "Technology",
            nameRu: "Технология",
          },
          {
            id: 2,
            img: "/assets/slider2.png",
            name: "İnnovasiya",
            nameEn: "Innovation",
            nameRu: "Инновация",
          },
          {
            id: 3,
            img: "/assets/slider3.png",
            name: "Keyfiyyət",
            nameEn: "Quality",
            nameRu: "Качество",
          },
          {
            id: 4,
            img: "/assets/slider4.png",
            name: "Etibarlılıq",
            nameEn: "Reliability",
            nameRu: "Надежность",
          },
          {
            id: 5,
            img: "/assets/slider5.png",
            name: "Müasirlik",
            nameEn: "Modernity",
            nameRu: "Современность",
          },
          {
            id: 6,
            img: "/assets/slider6.png",
            name: "Peşəkar",
            nameEn: "Professional",
            nameRu: "Профессиональный",
          },
        ]);
      }
    };

    fetchSliders();
  }, []);

  // Update image width on window resize
  useEffect(() => {
    const handleResize = () => {
      setImageWidth(window.innerWidth / 3);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-advance slider with infinite loop - DISABLED
  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         if (!isTransitioning) {
  //             setDirection('next');
  //             setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  //         }
  //     }, 4000);

  //     return () => clearInterval(interval);
  // }, [isTransitioning]);

  // Update transform for smooth scrolling
  useEffect(() => {
    if (scrollerRef.current && slides.length > 0) {
      // Check if we're on 393x852 screen size
      const is393x852 = window.innerWidth === 393 && window.innerHeight === 852;
      const gapWidth = is393x852 ? 0 : 20; // No gap for 393x852, 20px for others
      const slideWidth = is393x852 ? window.innerWidth : imageWidth; // Full width for 393x852
      const totalItemWidth = slideWidth + gapWidth;

      // Debug logging
      console.log("Slider Debug:", {
        currentIndex,
        imageWidth,
        slideWidth,
        totalItemWidth,
        slidesLength: slides.length,
        viewportWidth: window.innerWidth,
        is393x852,
      });

      // Let's try a different approach
      // We want the active slide to appear in the center of the viewport
      // The viewport width is window.innerWidth
      // Each slide should take 1/3 of the viewport width
      // We need to position the scroller so that the active slide is centered

      // Calculate the center position of the viewport
      const viewportCenter = window.innerWidth / 2;

      // Calculate the position of the active slide in the middle copy
      const middleCopyStart = slides.length * totalItemWidth;
      const activeSlidePosition =
        middleCopyStart + currentIndex * totalItemWidth;

      // Calculate how much we need to move the scroller to center the active slide
      const slideCenter = activeSlidePosition + slideWidth / 2;
      const scrollPosition = slideCenter - viewportCenter;

      console.log("Viewport center:", viewportCenter);
      console.log("Active slide position:", activeSlidePosition);
      console.log("Slide center:", slideCenter);
      console.log("Scroll position:", scrollPosition);

      scrollerRef.current.style.transform = `translateX(-${scrollPosition}px)`;
    }
  }, [currentIndex, imageWidth, slides.length]);

  const nextSlide = () => {
    if (!isTransitioning && slides.length > 0) {
      setIsTransitioning(true);
      setDirection("next");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning && slides.length > 0) {
      setIsTransitioning(true);
      setDirection("prev");
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
      );

      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }
  };

  return (
    <div className="home-container">
      <div className="circle-background-left"></div>
      <div className="circle-background-right"></div>

      {/* Logo text positioned absolutely */}
      <div className="home-logo-text">
        <img
          src={logoText}
          alt="Logo Text"
          className="home-logo-text-background"
        />
      </div>

      <div className="slider-container">
        <div className="top-ellipse">
          <svg
            className="ellipse-svg"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1920 147"
          >
            <ellipse cx="960" cy="73.5" fill="#111214" rx="960" ry="73.5" />
          </svg>
        </div>

        <div className="image-scroller-wrapper">
          <div className="image-scroller-container">
            <div
              ref={scrollerRef}
              className="image-scroller"
              style={{
                width: `${slides.length *
                  (window.innerWidth === 393 && window.innerHeight === 852
                    ? window.innerWidth
                    : imageWidth + 20)
                  }px`,
              }}
            >
              {[...slides, ...slides, ...slides].map((slide, index) => (
                <div
                  key={`${index}-${slide.id}`}
                  className={`image-slide ${slide.productId ? 'clickable' : ''}`}
                  style={{
                    width: `${window.innerWidth === 393 && window.innerHeight === 852
                        ? window.innerWidth
                        : imageWidth
                      }px`,
                    backgroundImage: `url('${slide.img}')`,
                    cursor: slide.productId ? 'pointer' : 'default',
                  }}
                  onClick={() => slide.productId && handleSliderClick(slide)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-ellipse">
          <svg
            className="ellipse-svg"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1920 147"
          >
            <ellipse cx="960" cy="73.5" fill="#111214" rx="960" ry="73.5" />
          </svg>
        </div>
      </div>

      <div className="circular-progress-container">
        <button
          className="slider-nav-btn slider-prev-btn"
          onClick={prevSlide}
          disabled={isTransitioning}
        >
          <img src={prevIcon} alt="Previous" className="slider-nav-icon" />
        </button>
        <CircularProgress
          currentIndex={currentIndex}
          totalSlides={slides.length}
          slides={slides}
          language={language}
          onSliderClick={handleSliderClick}
        />
        <button
          className="slider-nav-btn slider-next-btn"
          onClick={nextSlide}
          disabled={isTransitioning}
        >
          <img src={nextIcon} alt="Next" className="slider-nav-icon" />
        </button>
      </div>
    </div>
  );
}
