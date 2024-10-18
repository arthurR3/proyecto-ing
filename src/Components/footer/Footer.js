import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de ajustar esto si estás usando Next.js o algún otro enrutador

const Footer = () => {
    return (
        <>
            <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900  text-white mt-12 md:py-12 w-full">
                <div className="container max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-5 mb-0 gap-8">
                    <div className="space-y-4  ml-12 ">
                        <h3 className="text-xl font-semibold">Contacto</h3>
                        <div className="space-y-2">
                            <p>
                                {/* Ícono de teléfono */}
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    height="1em"
                                    width="1em"
                                    className='w-5 h-5 inline-block mr-2'
                                >
                                    <path d="M11 1a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V2a1 1 0 011-1h6zM5 0a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V2a2 2 0 00-2-2H5z" />
                                    <path d="M8 14a1 1 0 100-2 1 1 0 000 2z" />
                                </svg>
                                +1 (555) 123-4567
                            </p>
                            <p>
                                {/* Ícono de correo */}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                    className='w-5 h-5 inline-block mr-2'
                                >
                                    <path d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                </svg>
                                estetica_principal@gmail.com
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Sobre Nosotros</h3>
                        <p className="text-muted-foreground">
                            Nuestra página web se caracteriza por un diseño limpio y minimalista, con una paleta de colores cálidos y una filosofía de simplicidad y elegancia.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Ubicación</h3>
                        <p className="text-muted-foreground">Calle Revolución, Centro, 43000 Huejutla de Reyes, Hgo, México</p>
                        <div className="w-full aspect-video rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2601869684854!2d-98.42363979007436!3d21.14204138379867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d727e7a837cbc5%3A0xe343765760364cc0!2sEst%C3%A9tica%20Principal%20Emma!5e0!3m2!1ses-419!2smx!4v1724541445075!5m2!1ses-419!2smx"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Redes sociales</h3>
                        <div className="flex space-x-4">
                            {/* Ícono de Facebook */}
                            <Link to="/productos" className="text-muted-foreground hover:text-primary" prefetch={false}>
                                <svg
                                    viewBox="0 0 860 1000"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                    className='w-6 h-6'
                                >
                                    <path d="M752 80c29.333 0 54.667 10.333 76 31s32 45.667 32 75v646c0 29.333-10.667 54.667-32 76s-46.667 32-76 32H590V630h114V496H590v-70c0-20 9.333-30 28-30h86V244h-96c-49.333 0-90.667 18-124 54s-50 80-50 132v66H330v134h104v310H108c-29.333 0-54.667-10.667-76-32S0 861.333 0 832V186c0-29.333 10.667-54.333 32-75s46.667-31 76-31h644" />
                                </svg>
                            </Link>
                            {/* Ícono de Twitter */}
                            <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                                <svg
                                    viewBox="0 0 1024 1024"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                    className='w-6 h-6'
                                >
                                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm215.3 337.7c.3 4.7.3 9.6.3 14.4 0 146.8-111.8 315.9-316.1 315.9-63 0-121.4-18.3-170.6-49.8 9 1 17.6 1.4 26.8 1.4 52 0 99.8-17.6 137.9-47.4-48.8-1-89.8-33-103.8-77 17.1 2.5 32.5 2.5 50.1-2a111 111 0 01-88.9-109v-1.4c14.7 8.3 32 13.4 50.1 14.1a111.13 111.13 0 01-49.5-92.4c0-20.7 5.4-39.6 15.1-56a315.28 315.28 0 00229 116.1C492 353.1 548.4 292 616.2 292c32 0 60.8 13.4 81.1 35 25.1-4.7 49.1-14.1 70.5-26.7-8.3 25.7-25.7 47.4-48.8 61.1 22.4-2.4 44-8.6 64-17.3-15.1 22.2-34 41.9-55.7 57.6z" />
                                </svg>
                            </Link>
                            {/* Ícono de Instagram */}
                            <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                                <svg
                                    viewBox="0 0 1024 1024"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                    className='w-6 h-6'
                                >
                                    <path d="M512 378.7c-73.4 0-133.3 59.9-133.3 133.3S438.6 645.3 512 645.3 645.3 585.4 645.3 512 585.4 378.7 512 378.7zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zM512 717.1c-113.5 0-205.1-91.6-205.1-205.1S398.5 306.9 512 306.9 717.1 398.5 717.1 512 625.5 717.1 512 717.1zm213.5-370.7c-26.5 0-47.9-21.4-47.9-47.9s21.4-47.9 47.9-47.9 47.9 21.4 47.9 47.9a47.84 47.84 0 01-47.9 47.9z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
            <footer className="bg-gray-200 py-8">
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                    <p className="text-gray-600 text-sm">&copy; 2024 Estética Principal Emma. Todos los derechos reservados. | Proyecto con Fines Educativos</p>
                    <div className="flex gap-4">
                        <Link
                            to="#"
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                            href="#"
                            prefetch={false}
                        >
                            Términos de Servicio
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                            href="#"
                            prefetch={false}
                        >
                            Política de Privacidad
                        </Link>
                    </div>
                </div>
            </footer>
        </>
    );
};

function FacebookIcons(props) {
    <svg
        {...props}
        xml></svg>
}

export default Footer;
