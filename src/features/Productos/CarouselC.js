import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../CSS/Carrusel.css'
import ProductCard from '../../Components/ProductsCard.js';
import LoadingSpinner from '../../Components/Loading/Loading.js';
import axios from 'axios';
import ApiConnection from '../../Components/Api/ApiConfig.js';


function CarouselC() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState(null);
    const URLConnetion = ApiConnection()
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await axios.get(`${URLConnetion}/products`);
                setProducts(response.data.filter(product => product.status === true && product.amount>0).slice(5,14));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);
    


    const settings = {
        accessibility: true,
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (loading) {
        return <LoadingSpinner />
    }
    return (
        <div className="w-3/4 justify-center rounded-xl m-auto">
            <div className="mt-2">
                <Slider {...settings}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} showAditional={false} />
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default CarouselC;
