import { Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useEffect, useMemo, useState } from 'react';

import { Address, decodeAddressComponents } from '../../domains/map/addressComponents';
import AddressInput from '../Address/AddressInput';
import PlaceAutocomplete from '../Address/PlaceAutocomplete';

type Props = {
  location: { lat: number, lng: number };
  changeLocation: (location: { lat: number, lng: number }) => void;
  address: Address;
  changeAddress: (address: Address) => void;
  addressName: string;
  changeAddressName: (name: string) => void;
}

export default function LocationPicker({
  location, changeLocation,
  address, changeAddress,
  addressName, changeAddressName,
}: Props) {
  const map = useMap('selection-map');
  const [selectedLocation, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [error, setError] = useState<string>('');
  const places = useMemo(() => map ? new google.maps.places.PlacesService(map) : null, [map]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map?.panTo(location);
          changeLocation(location);
        },
        (error) => {
          setError('Unable to get location: ' + error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, [map, changeLocation]);

  return (
    <>
      {error && <div className='text-sm'>{error}</div>}
      <PlaceAutocomplete onPlaceSelect={({ address: newAddress, location, place }) => {
        if (location) {
          map?.panTo(location);
          map?.setZoom(17);
          changeLocation(location);
        }
        changeAddress(newAddress);
        changeAddressName(place?.name || '');
      }} />
      <div className='h-[50vh] w-full'>
        <Map
          id='selection-map'
          mapId='8093bbfaf47225d8'
          style={{ width: '100%', height: '100%' }}
          defaultCenter={selectedLocation || { lat: 40.25511147870447, lng: -111.66301131248474 }}
          defaultZoom={13}
          onClick={(e) => {
            const location = e.detail.latLng;
            if (location) {
              changeLocation({ lat: location.lat, lng: location.lng })
              setLocation({ lat: location.lat, lng: location.lng })
            }
            const placeId = e.detail.placeId;
            if (placeId) {
              places?.getDetails({ placeId }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                  changeAddressName(results.name || '');
                  changeAddress(decodeAddressComponents(results.address_components));
                } else {
                  changeAddress(decodeAddressComponents(undefined));
                  changeAddressName('');
                }
              });
            } else if (location) {
              void new google.maps.Geocoder().geocode({ location }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results) {
                  const addressComponents = results[0].address_components;
                  const newAddress = decodeAddressComponents(addressComponents);
                  changeAddress(newAddress);
                  changeAddressName(newAddress.street);
                } else {
                  changeAddress(decodeAddressComponents(undefined));
                  changeAddressName('');
                }
              });
            }
          }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <AdvancedMarker position={location} />
        </Map>
      </div>
      Ensure the pin is in the correct location, then fill in the address details:
      <AddressInput
        address={address}
        onChange={changeAddress}
        name={addressName}
        changeName={changeAddressName} />
    </>
  )
}
