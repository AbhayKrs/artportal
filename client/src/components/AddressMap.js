import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const AddressMap = () => {
    const position = [12.9716, 77.5946];

    return (
        <MapContainer className='rounded-md' center={position} zoom={10} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default AddressMap;