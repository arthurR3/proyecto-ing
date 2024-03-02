import React from 'react'
import '../../CSS/citas.css'
import Img1 from '../../Image/image1.jpg'
function AgendarCita() {
  return (
    <div className='.citas-container'>
        <div className='d-flex mt-5 flex-md-wrap justify-content-around p-4'>
            <div className=''>
              <img
                src={Img1} alt='foto'
              />
            </div>
        </div>
    </div>
  )
}

export default AgendarCita