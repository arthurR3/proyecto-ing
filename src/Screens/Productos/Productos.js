import React from 'react'
import '../../CSS/productos.css'
import Tinte1 from '../../Image/tinte1.jpg'
import Tinte2 from '../../Image/tinte2.png'
import Tinte3 from '../../Image/tinte3.jpeg'

function Productos() {
    return (
        <div className='wrapper d-flex align-items-center justify-content-center'>
            <div class="containerProds">
                <div class="products-section">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="product-card">
                                <div class="card-body">
                                <img src={Tinte1} alt="Producto 1" class="img"/>
                                    <h5 class="card-title">Tinte 1</h5>
                                    <p class="card-text">Categoría: Tintes para Cabello</p>
                                    <p class="card-text">Precio: $5.00</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="product-card">
                                <div class="card-body">
                                <img src={Tinte2} alt="Producto 2" class="img"/>
                                    <h5 class="card-title">Tinte 2</h5>
                                    <p class="card-text">Categoría: Tintes para Cabello</p>
                                    <p class="card-text">Precio: $5.00</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="product-card">
                                <div class="card-body">
                                <img src={Tinte3} alt="Producto 3" class="card-img-top"/>
                                    <h5 class="card-title">Tinte 3</h5>
                                    <p class="card-text">Categoría: Tintes para Cabello</p>
                                    <p class="card-text">Precio: $5.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Productos