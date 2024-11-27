// src/components/ProductCard.js
import React, { useContext, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import {Toast} from 'primereact/toast';
import { useAuth } from './Context/AuthContext';
import { CartContext } from './Context/CarritoContext';

const ProductCard = ({ product, showAditional = false }) => {
  const [quantity] = useState(1)
  //const quantity = 1;
   const toast = useRef(null)
/*   const context = useContext(CartContext);

  const { addToCart } = context;
  const { token } = useAuth(); */
  const handleToCart = (product) =>{
    console.log(product)
    if(null){
        //addToCart(product, quantity)
        toast.current.show({ severity: 'success', summary: 'Producto en Carrito', detail: 'Se agrego correctamente al carrito', life: 3000 });
    }else{
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Necesitas iniciar sesión.', life: 3000 });
    }
}

  return (
    <>
    <Toast ref={toast} />
    <div className="w-full max-w-sm overflow-hidden rounded-lg border-2 border-slate-200 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
    <img
        src={product.image}
        alt={product.name}
        className="w-32 h-32 object-cover"
        style={{ aspectRatio: "500/400", objectFit: "cover" }}
      />
      <Tag value={product.Categoria.name} severity="primary" icon='pi pi-slack ' className='m-3 mb-0' />
      <div className="p-6 bg-background">
        <h3 className="text-lg  mb-3">{product.name}</h3>
        {showAditional && (
          <>
            <p className="text-muted-foreground mb-4">
              {product.description}
            </p>
            {product.amount <= 0 ? (
              <div className="flex items-center justify-center mb-3 font-semibold">
                <span className="text-red-600">Stock no disponible</span>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-3 font-semibold">
                <span className="text-green-600">Stock disponible: </span>
                <span className="text-primary"> {product.amount} pzas. </span>
              </div>
            )}

          </>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl">${(product.price).toFixed(2)}</span>
          <Button label="Agregar" outlined rounded icon='pi pi-cart-minus' onClick={()=>handleToCart(product)} disabled={product.amount <=0 ? true : false} />
        </div>
      </div>
    </div>
    </>
  );
}

export default ProductCard;
