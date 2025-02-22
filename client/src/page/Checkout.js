import React, { useState, useEffect, useContext} from 'react'
import Button from '../components/Button'
import Tag from '../components/Tag'
import { useHistory } from 'react-router'
import axios from 'axios'
import { RadioGroup, Radio } from 'react-radio-group'
import { useParams } from 'react-router'
import Alert from '../components/Alert'
import { GlobalContext } from '../context/GlobalContext';
import ConfirmationModal from '../components/ConfirmationModal'



const dataKost = { 
    nama: "Kost InBandung 78",
    updateAt: "20 March 2021",
    harga: 1700000 
}


const DetailKost = () => {
    const [data, setData] = useState() 
    const [banks, setBanks] = useState([{}])
    const [status, setStatus] = useState([{}])
    const [error, setError] = useState("")
    const [show, setShow] = useState(false)
    const [radioValue, setRadioValue] = useState("")
    const [openDanger, setOpenDanger] = useState(false)
    const [open, setOpen] = useState(false)
    const { id } = useParams()
    const { user } = useContext(GlobalContext);
    const history = useHistory()
    const fetchKostData = async () => {
        try {
            const response = await axios.get("/kost/getKostById", {
                params : {
                    id: id
                }
            })
            setData(response.data)

            const responseRekening = await axios.get("/pemilik/getPemilikRekening", {
                params : {
                    id: response.data.id_pemilik,
                }
            })
            setBanks(responseRekening.data)
            const responseUserStatus = await axios.get("/pembayaran/getUserKostStatus", {
                params: {
                    id_penyewa: user.id,
                    id_kost: id
                }
            })
            setStatus(responseUserStatus.data)

            
        } catch (error) {
            setError(error)
        }
    }
    const fetchAvailalePayment = async () => {
        try {
            const response = await axios.get("/bank/getAllBank")
            setBanks(response.data)
        } catch (error) {
            setError(error)
        }
    }
    const handleRadio = (value) => {
        setRadioValue(value)
    }
    const handleBookNow = async () => {
        try {
            if (radioValue === "") { throw new Error('Radio value not selected') }
            const dataPembayaran = {
                id_rekening: radioValue,
                id_kost: id,
                id_penyewa: user.id,
                id_pemilik: data.id_pemilik,
                total_pembayaran: data.harga,
            }   
            await axios.post("/pembayaran/addPembayaran", dataPembayaran)
            setOpen(true)
            setShow(false)
            setTimeout(() => {
                setOpen(false)
                history.push("/history")
            }, 2500);
        } catch (error) {
            setError(error)
            setOpenDanger(true)
            setShow(false)
            setTimeout(() => {
                setOpenDanger(false)
            }, 2500);
        }
    }

    useEffect(() => {
        fetchAvailalePayment()
        fetchKostData() 
    }, []) //eslint-disable-line

    return (
        
        <>
        <Alert name="alert-success" variant='success' open={open} handleClose={() => setOpen(false)}>Kost successfuly booked!</Alert>
        <Alert name="alert-danger" variant='danger' open={openDanger} handleClose={() => setOpenDanger(false)}>Error occured</Alert>
        <ConfirmationModal show={show} setShow={setShow} message={"Are you sure you want to book this kost?"} onContinue={(e) => handleBookNow(e)}/>
        {data !== undefined && (
            
            <div className="container grid grid-cols-1 my-32 gap-3 md:grid-cols-3 lg:grid-cols-3 px-6 md:px-6 lg:px-0">
                <div className=" bg-white z-10 col-span-1 md:col-span-2 border p-5 rounded-xl">
                    <div>
                        <h1 className="text-green-dark text-2xl font-bold mb-3">Checkout</h1>
                        <div className="inline-flex gap-5">
                            <img className="w-1/3" alt="logo" src={process.env.PUBLIC_URL + `/kosts/${data.img}`} />
                            <div>
                                <h1 className="text-xl font-bold text-green-dark">{data.nama_kost}</h1>
                                <div className="flex my-3">
                                    <Tag>{data.jenis_kost}</Tag>
                                    <span className="p-2"></span>
                                    <Tag>{data.nama_kota}</Tag>
                                </div>
                                <div className="mb-5 ">
                                    <h1 className="font-bold text-green-dark">Nama Pemilik</h1>
                                    <p className="text-gray-900">{data.nama_awal} {data.nama_akhir}</p>
                                </div>
                                <div className="mb-5 ">
                                    <h1 className="font-bold text-green-dark">Contact</h1>
                                    <p className="text-gray-900">{data.no_hp}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" bg-white z-10 border p-5 rounded-xl">
                    <div className="mb-5">
                        <h1 className="font-semibold text-green-dark text-xl">Kost Name</h1>
                        <p className="text-gray-500">{data.nama_kost}</p>
                    </div>
                    
                    <div className="mb-5">
                        <h1 className="font-semibold text-green-dark text-xl">Bank</h1>
                        <RadioGroup
                            className="mt-3"
                            name="fruit"
                            selectedValue={radioValue}
                            onChange={handleRadio}>
                            { banks.length !== 0 && banks.map((value, i) => {
                                return (
                                    <>
                                        <div key={i} className="inline-flex gap-5 items-center">
                                            <Radio value={value.id_rekening} />
                                            <label className="text-gray-500">{value.nama_bank}</label>
                                        </div> <br/>
                                    </>
                                )
                            }) }
                        </RadioGroup>
                       
                                
                    </div>
                    <div className="mb-5">
                        <h1 className="font-semibold text-green-dark text-xl">Total Price</h1>
                        <h1 className="text-2xl text-green-dark font-bold">
                            Rp {new Intl.NumberFormat(['ban', 'id']).format(data.harga)} 
                            <span className="font-normal">/months</span>
                        </h1>
                    </div>
                    {
                        status ? (
                            <div className="flex mt-7"  >
                                <Button variant="disabled" size="lg">Book now</Button>
                            </div>
                        ) : (
                            <div className="flex mt-7"  >
                                <Button onClick={() => setShow(true)} variant="primary" size="lg">Book now</Button>
                            </div>
                        )
                    }
                </div>

            </div>
        )}

        </>
    )
}

export default DetailKost
