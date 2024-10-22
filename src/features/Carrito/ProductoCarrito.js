import React from 'react'

const ProductoCarrito = (props) => {
    return (
        <div className='flex items-center justify-between py-4 border-b border-gray-300 last:border-b-0'>
            <div className='felxt items-center space-x-4'>
                <img src={props.image} className='object-cover rounded-md' width={64} height={64} />
                <div>
                    <h3 className='text-lg font-medium text-gray-800'>{props.name}</h3>
                    <p className='text-gray-600'>${(props.price).toFixed(2)}</p>
                </div>
            </div>
            <div className='flex items-center space-x-2'>
                <button className='p-1 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors'
                    onClick={props.Disminuir }
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={25}
                        height={25}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={'currentColor'}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <span className='text-lg font-semibold text-gray-800 w-8 text-center'>{props.quantity}</span>
                <button className='p-1 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors'
                    onClick={props.Aumentar}
                >
                
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
                <button className='p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors ml-2'
                    onClick={props.Remover}

                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default ProductoCarrito