import React from 'react';
import ProductCard from '../../Components/ProductsCard.js';

function Catalogo({ products }) {
    return (
        <div className="container mt-5 mx-auto px-4">
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} showAditional={true} />
                ))}
            </div>
        </div>
    );
}

export default Catalogo;
