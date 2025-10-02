import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 190px;
    height: 254px;
    background-color: #111214;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: 12px;
    gap: 12px;
    border-radius: 8px;
    cursor: pointer;
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    left: -5px;
    margin: auto;
    width: 200px;
    height: 264px;
    border-radius: 10px;
    background: linear-gradient(-45deg, #e81cff 0%, #40c9ff 100% );
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #fc00ff 0%, #00dbde 100% );
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
  }

  .heading {
    font-size: 20px;
    text-transform: capitalize;
    font-weight: 700;
    color: white;
    margin-bottom: 0;
  }

  .icon {
    width: 80px;
    height: 80px;
    align-self: center;
  }

  .card p:not(.heading) {
    font-size: 14px;
    color: white;
  }

  .card p:last-child {
    color: #e81cff;
    font-weight: 600;
  }

  .card:hover::after {
    filter: blur(30px);
  }

  .card:hover::before {
    transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  }

  /* Mobile responsive styles */
  @media (max-width: 320px) {
    .card {
      width: 240px;
      height: 280px;
      padding: 16px;
      gap: 16px;
    }

    .card::before {
      left: -6px;
      width: 252px;
      height: 292px;
    }

    .heading {
      font-size: 20px;
    }

    .icon {
      width: 80px;
      height: 80px;
    }

    .card p:not(.heading) {
      font-size: 16px;
    }
  }

  @media (min-width: 321px) and (max-width: 375px) {
    .card {
      width: 260px;
      height: 300px;
      padding: 18px;
      gap: 18px;
    }

    .card::before {
      left: -7px;
      width: 274px;
      height: 314px;
    }

    .heading {
      font-size: 22px;
    }

    .icon {
      width: 90px;
      height: 90px;
    }

    .card p:not(.heading) {
      font-size: 18px;
    }
  }

  @media (min-width: 376px) and (max-width: 425px) {
    .card {
      width: 150px;
      height: 190px;
      padding: 10px;
      gap: 10px;
    }

    .card::before {
      left: -4px;
      width: 158px;
      height: 198px;
    }

    .heading {
      font-size: 16px;
    }

    .icon {
      width: 60px;
      height: 60px;
    }

    .card p:not(.heading) {
      font-size: 12px;
    }
  }

  @media (min-width: 426px) and (max-width: 480px) {
    .card {
      width: 140px;
      height: 180px;
      padding: 8px;
      gap: 8px;
    }

    .card::before {
      left: -3px;
      width: 146px;
      height: 186px;
    }

    .heading {
      font-size: 14px;
    }

    .icon {
      width: 50px;
      height: 50px;
    }

    .card p:not(.heading) {
      font-size: 11px;
    }
  }
`;

const ServiceCard3D = ({ service }) => {
  const resolveUrl = (url) => {
    if (!url || url === 'null') return '';
    if (url.startsWith('/uploads/')) return `https://softech-api.webonly.io${url}`;
    return url;
  };

  const iconSrc = resolveUrl(service.icon);

  return (
    <Link to={`/services/${service.id}`} style={{ textDecoration: 'none' }}>
      <StyledWrapper>
        <div className="card">
          <img
            src={iconSrc}
            alt={service.name}
            className="icon"
          />
          <p className="heading">
            {service.name}
          </p>
          <p>
            {service.subtitle}
          </p>
        </div>
      </StyledWrapper>
    </Link>
  );
};

export default ServiceCard3D; 