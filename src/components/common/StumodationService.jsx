import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { FaClock, FaParking, FaWifi } from 'react-icons/fa'
import Header from './Header'
const StumodationService = () => {
  return (
    <>
    <Container className='mb-2'>
        <Header title={"Our Services"}/>

        <Row>
            <h4 className='text-center'>
                Services at <span className='hotel-color'> Stumodation </span>
                <span className='gap-2'>
                    <FaClock/> - 24-Hour Front Desk </span>
            </h4>
            <hr/>

            <Row xs={1} md={2} lg={3} className='g-4 mt-2'>
                <Col>
                  <Card>
                    <Card.Body>
                        <Card.Title className='hotel-color'>
                            <FaWifi/> Wifi
                        </Card.Title>
                        <Card.Text>Stay connected with high-speed internet access. </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col>
                  <Card>
                    <Card.Body>
                        <Card.Title className='hotel-color'>
                            <FaParking/> Parking
                        </Card.Title>
                        <Card.Text>Park your car conveniently in our-site parking lot. </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>


            </Row>

        </Row>

    </Container>
      
    </>
  )
}

export default StumodationService
