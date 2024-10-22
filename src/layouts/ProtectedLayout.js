import React, { useEffect, useRef } from 'react'
import { useAuth } from '../Components/Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast';
import PublicLayout from './PublicLayout';

const ProtectedLayout = ({ children }) => {
    const {token} = useAuth()
    const toast = useRef(null)
    const navigate = useNavigate()

    useEffect(() =>{
        if(!token){
            navigate('/')
            setTimeout(() => {
              if (toast.current) {
                  toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debes iniciar sesión.', life: 3000 });
              }
          }, 500);
        }
    }, [token])
    
  return (
    <>
    <Toast ref={toast} />
    <PublicLayout>{children}</PublicLayout>
    </>
  )
}

export default ProtectedLayout