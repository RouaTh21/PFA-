import React, { useEffect, useState } from 'react'
import RoomCard from './RoomCard'
import { Col, Container, Row } from 'react-bootstrap'
import RoomPaginator from '../common/RoomPaginator'
import RoomFilter from '../common/RoomFilter'
import { getAllRooms } from '../utils/ApiFunctions'
const Room = () => {
    const[data, setData] = useState([])
    const[error, setError] = useState(null)
    const[isLoading, setIsLoding] = useState(false)
    const[currentPage, setCurrentPage] = useState(1)
    const[roomPerPge] = useState(6)
    const[filteredData, setFilterdData] = useState([{id: ""}])

    useEffect(() =>{
        setIsLoding(true)
        getAllRooms().then((data) => {
            setData(data)
            setFilterdData(data)
            setIsLoding(false)
        }).catch((error)=>{
            setError(error.message)
            setIsLoding(false)

        })
    }, [])
    if(isLoading){
        return <div>Loding rooms...</div>
    }
    if(error){
        return <div className='text-danger'>Error : {error}</div>
    }
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const totalPages = Math.ceil(filteredData.length / roomPerPge)
    const renderRooms = () =>{
        const startIndex = (currentPage -1) * roomPerPge
        const endIndex = startIndex + roomPerPge
        return filteredData.slice(startIndex, endIndex)
        .map((room) => <RoomCard key={room.id} room={room}/>)
    }
  return (
    <Container>
        <Row>
            <Col md={6} className="mb-3 mb-md-0">
                <RoomFilter data={data} setFilterdData={setFilterdData}/>
            </Col>
            <Col md={6} className="d-flex align-items-centerjustify-content-end">
                <RoomPaginator
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                />
            </Col>
        </Row>

        <Row>{renderRooms()}</Row>


        <Row>
            <Col md={6} className="d-flex align-items-centerjustify-content-end">
                <RoomPaginator
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                />
            </Col>
        </Row>


      
    </Container>
  )
}

export default Room
//6:57