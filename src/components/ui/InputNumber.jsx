import React, { useEffect, useRef } from 'react';

export default function InputNumber({ value, onChange, className, ...props }) {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const inputElement = inputRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
    };

    if (inputElement) {
      inputElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="number"
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      className={className}
      {...props}
    />
  );
}
