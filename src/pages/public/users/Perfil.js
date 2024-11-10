import React, { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import ApiConnection from '../../../Components/Api/ApiConfig';
import { useAuth } from '../../../Components/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import DomicilioUser from './Domicilio';

const Perfil = () => {
    const URLConnection = ApiConnection();

    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const uploadFileRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const { token } = useAuth()
    const [user, setUser] = useState([])
    const [address, setAddress] = useState([]);
    const [userToken, setUserToken] = useState([])
    const [editando, setEditando] = useState(false)
    const [usuarioEditado, setUsuarioEditado] = useState([])
    const [formType, setFormType] = useState('');
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [loadingCamera, setLoadingCamera] = useState(false); // Estado de carga de la cámara
    useEffect(() => {
        if (token) {
            const decodeToken = jwtDecode(token)
            setUserToken(decodeToken.user)
        }
    }, [token])


    useEffect(() => {
        if (userToken && userToken.idUser) {
            fetchUserInfo()
        }
    }, [userToken, token])

    const fetchUserInfo = async () => {
        if (userToken && userToken.idUser) {
            const id_user = userToken.idUser
            try {
                const response = await axios.get(`${URLConnection}/users/${id_user}`)
                const reponse2 = await axios.get(`${URLConnection}/address/${id_user}`)
                setUser(response.data)
                setUsuarioEditado(response.data)
                setAddress(reponse2.data)
            } catch (error) {
                console.log('Error getting user', error)
            }
        }
    }
    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        if (file && !['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
            toast.current.show({ severity: 'info', summary: 'Tipo de Archivo', detail: 'Solo se permiten archivos con formato png, jpg y jpeg', life: 3000 });
            return;
        }
        customBase64Uploader(file)
        //setFormData(prevFormData => ({ ...prevFormData, image: file }));
    }

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target
        console.log(name, value)
        setUsuarioEditado({ ...usuarioEditado, [name]: value })
    }

    const openCamera = () => {
        /* 
         */
        setCameraEnabled(true)
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play()
            }).catch((err) => {
                console.error('Error al habilitar la cámara', err)
            })
    }

    const captureImage = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext("2d");
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

            const image = canvasRef.current.toDataURL("image/png");
            customBase64Uploader(urlToFile(image, "captured.png"));
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            setCapturedImage(image);
            setCameraEnabled(false);
        }
    };
    const cancelCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        setCameraEnabled(false);
    };

    const urlToFile = (dataurl, filename) => {
        let arr = dataurl.split(",");
        let mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const customBase64Uploader = (file) => {
        const dataSend = new FormData()
        dataSend.append('image', file);
        try {
            setLoadingCamera(true)
            axios.put(`${URLConnection}/users/${userToken.idUser}`, dataSend,{
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            })

            .then(response => {
                if (response.status === 200) {
                    toast.current.show({ severity: 'success', summary: 'Imagen subida', detail: 'La imagen se ha subido correctamente', life: 3000 });
                    fetchUserInfo()
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error al subir imagen', detail: 'Ha ocurrido un error al subir la imagen', life: 3000 });
                }
            }).catch(error => {
                console.log('Error al subir la imagen: ', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error al subir imagen',
                    detail: 'Hubo un problema al subir la imagen',
                    life: 3000,
                });
            })
            .finally(() => {
                setLoadingCamera(false); // Desactivar el estado de carga
            });
        } catch (error) {
            console.log('Error al subir la imagen, ', error)
        }
        
    };

    const handleSelection = (type) => {
        if (type === 'uploadFile') {
            uploadFileRef.current.click()
        } else if (type === 'camera') {
            openCamera()
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8'>
            
            <Toast ref={toast} />
            <div className='max-w-6xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden'>
                <div className='md:flex'>
                {loadingCamera &&(<><i className="fa-solid fa-spinner animate-spin text-green-600"></i> Cargando Imagen...</>)}
                    {cameraEnabled && (
                        <div>
                            <video className=' m-4 rounded-lg object-cover' ref={videoRef} autoPlay></video>
                            <canvas ref={canvasRef} style={{ display: 'none' }} width='150' height='150'>

                            </canvas>
                            <div className="flex justify-between">
                                <Button
                                    label="Cancelar"
                                    severity="secondary"
                                    icon="pi pi-times"
                                    onClick={cancelCamera}
                                    className="mt-2 px-4 "
                                    style={{ color: "white", borderRadius: 10 }}
                                />
                                <Button
                                    label="Capturar imagen"
                                    severity="success"
                                    icon="pi pi-image"
                                    onClick={captureImage}
                                    className="mt-2 px-4"
                                    style={{ color: "white", borderRadius: 10 }}
                                />
                            </div>
                        </div>
                    )}
                    <div className='md:flex shrink-0 bg-purple-600 md:w-48 flex flex-col items-center justify-center p-6'>
                        <img className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg' src={user.image} alt={user.name} />
                        <h2 className='mt-4 text-xl font-semibold text-white'>{user.name} {user.last_name1}</h2>
                        <p className='mt-2 text-purple-200'>Cliente Frecuente</p>
                        {!cameraEnabled && (
                            <button className='px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-700 transition duration-300' onClick={() => setVisible(true)}>
                                Actualizar foto
                            </button>
                        )}

                        <input
                            ref={uploadFileRef}
                            type="file"
                            className="form-control"
                            name="image"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleChangeImage}
                        />
                    </div>
                    <div className='p-8 w-full'>
                        <div className='flex justify-between items-center mb-6'>
                            <h1 className='text-4xl font-bold text-gray-900'>Perfil de Usuario</h1>
                            {!editando ? (
                                <button className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300' onClick={() => setEditando(true)}>Editar Perfil</button>

                            ) : (
                                <div className="space-y-2 sm:space-x-2 sm:space-y-0 flex flex-col sm:flex-row">
                                    <button className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white text-sm sm:text-base rounded-md hover:bg-green-700 transition duration-300">
                                        Guardar
                                    </button>
                                    <button
                                        className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white text-sm sm:text-base rounded-md hover:bg-red-700 transition duration-300"
                                        onClick={() => setEditando(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>

                            )}
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <h3 className='text-2xl font-semibold text-gray-900 mb-2'>Información Personal</h3>
                                <div className='space-y-2'>
                                    <p className='text-gray-600'>
                                        <span className='font-semibold me-1'>Correo Electronico:</span>{editando ? (
                                            <input type='email' name='email' value={usuarioEditado.email} onChange={(e) => setUsuarioEditado({ ...usuarioEditado, email: e.target.value })}
                                                className='ml-2 p-1 border rounded'
                                            />
                                        ) : user.email}
                                    </p>
                                    <p className='text-gray-600'>
                                        <span className='font-semibold me-1'>Telefono:</span> {editando ? (
                                            <input name='telefono' id='telefono' type='tel' value={usuarioEditado.phone} onChange={(e) => handleChange(e)}
                                                className='ml-2 p-1 border rounded'
                                            />
                                        ) : user.phone}
                                    </p>
                                    <hr />
                                </div>
                            </div>
                            <div>
                                <p className='text-gray-600'>
                                    <span className='font-semibold me-1'>Dirección:</span>
                                    <span>{address ? `Calle ${address.street}, ${address.cologne}, ${address.municipality}, 43000` : 'Sin dirección agregada'}</span>

                                    <button className="ml-2 text-purple-600 hover:text-purple-800" onClick={() => { setFormType('Domicilio') }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                </p>
                                <hr className='mt-12' />
                            </div>
                        </div>
                        <div className='mt-8'>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mis citas Proximas</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className='max-w-6xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden mt-4'>

                {formType === 'Domicilio' && (

                    <DomicilioUser />
                )}
            </div>
            <ConfirmDialog group="declarative" visible={visible} onHide={() => setVisible(false)}
                message="¿Deseas tomar una foto ó elegir una del dispositivo?"
                header="Actualizar Foto Perfil" icon="pi pi-exclamation-triangle"
                acceptLabel='Usar la Camara'
                rejectLabel='Subir desde el dispositivo'
                accept={() => handleSelection('camera')}
                reject={() => handleSelection('uploadFile')}
            />

        </div>
    )
}

export default Perfil