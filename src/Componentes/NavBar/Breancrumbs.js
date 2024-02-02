import React from 'react'
import { Link } from 'react-router-dom'

const Breancrumbs =({breancrumbs}) => {
  return (
        <nav aria-label='breadcrumb'>
            <ol className='breadcrumb'>
                <li className='breadcrumb-item'>
                    <Link to='/'>Inicio</Link>
                </li>
                {breancrumbs.map((breadcrumb, index) =>(
                    <li key={index} className={breadcrumb.isLast ? 'breadcrumb-item active' : 'breadcrumb-item'}>
                        {breadcrumb.isLast ? (
                            breadcrumb.label
                        ) : (
                            <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
                        )
                    } 
                    </li>
                ))}
            </ol>

        </nav>
    )
}

export default Breancrumbs