import { Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useEffect, useMemo, useState } from 'react';

import { blankAddress, decodeAddressComponents } from '../../domains/map/addressComponents';
import AddressInput from '../Address/AddressInput';
import PlaceAutocomplete from '../Address/PlaceAutocomplete';

type Props = {
  value: { lat: number, lng: number };
  onChange: (location: { lat: number, lng: number }) => void;
}

export default function LocationPicker({ value, onChange }: Props) {
  const map = useMap('selection-map');
  const [selectedLocation, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [addressName, setAddressName] = useState('');
  const [address, setAddress] = useState(blankAddress());
  const [error, setError] = useState<string>('');
  const geocoder = useMemo(() => new google.maps.Geocoder(), []);
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
          onChange(location);
        },
        (error) => {
          setError('Unable to get location: ' + error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, [map, onChange]);

  return (
    <>
      {error && <div>{error}</div>}
      <PlaceAutocomplete onPlaceSelect={({ address: newAddress, location, place }) => {
        if (location) {
          map?.panTo(location);
          map?.setZoom(17);
          onChange(location);
        }
        setAddress(newAddress);
        setAddressName(place?.name || '');
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
              onChange({ lat: location.lat, lng: location.lng })
              setLocation({ lat: location.lat, lng: location.lng })
            }
            const placeId = e.detail.placeId;
            if (placeId) {
              places?.getDetails({ placeId }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                  setAddressName(results.name || '');
                  setAddress(decodeAddressComponents(results.address_components));
                }
              });
            } else if (location) {
              setAddressName('');
              void geocoder.geocode({ location }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results) {
                  const addressComponents = results[0].address_components;
                  setAddress(decodeAddressComponents(addressComponents));
                } else {
                  setAddress(decodeAddressComponents(undefined));
                }
              });
            }
          }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <AdvancedMarker position={value} />
        </Map>
      </div>
      <AddressInput
        address={address}
        onChange={setAddress}
        name={addressName}
        changeName={setAddressName} />
    </>
  )
}
