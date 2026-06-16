'use client';

import React, { useState, useEffect } from 'react';

interface CounterWrapperProps {
  targetCount: number;
  title: string;
  icon: string;
}

export default function CounterWrapper({ targetCount, title, icon }: CounterWrapperProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepTime = duration / steps;
    const increment = Math.ceil(targetCount / steps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetCount]);

  return (
    <div className="media-style my-2">
      <div className="media-inner d-flex align-items-center justify-content-center flex-column flex-sm-row">
        <span className="counter-icon mb-3 mb-sm-0 me-sm-3">
          <img src={icon} alt="icon" style={{ width: '45px' }} />
        </span>
        <div className="media-counter text-center text-sm-start">
          <div className="media-count d-flex align-items-center justify-content-center justify-content-sm-start">
            <h2 className="media-title h3 counter-number mb-0 fw-bold">{count}</h2>
            <span className="count-icon text-success fw-bold fs-4 ms-1">+</span>
          </div>
          <p className="media-text text-muted mb-0 small">{title}</p>
        </div>
      </div>
    </div>
  );
}
