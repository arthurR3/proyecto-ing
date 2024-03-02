import React, { useState } from 'react';

const ZoomImage = ({ src, onDoubleClick }) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleMouseEnter = () => {
        setIsZoomed(true);
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
    };

    return (
        <div
            className="zoomable-image"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={onDoubleClick}

        >
            <img
                src={src}
                alt="Zoomable"
                style={{
                    width: isZoomed ? '100%' : '100%',
                    height: isZoomed ? '120%' : '100%',
                    objectFit: 'cover',
                    transition: 'width 0.25s, height 0.25s',
                }}
            />
        </div>
    );
};

export default ZoomImage;
