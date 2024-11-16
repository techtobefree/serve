import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useRef, useEffect } from "react";

import './autocomplete.css';
import { Address, decodeAddressComponents } from "../../domains/map/addressComponents";

type PlaceAutocompleteProps = {
  onPlaceSelect: ({
    place,
    address,
    location
  }: {
    place: google.maps.places.PlaceResult | null,
    address: Address,
    location?: {
      lat: number,
      lng: number
    }
  }) => void;
}

export default function PlaceAutocomplete({ onPlaceSelect }: PlaceAutocompleteProps) {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'address_components']
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace();

      const location = {
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng()
      }

      onPlaceSelect({
        place,
        address: decodeAddressComponents(place.address_components),
        location: location.lat && location.lng ?
          location as { lat: number, lng: number } :
          undefined
      });
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <input ref={inputRef}
      className='p-2 mt-2 mb-2 rounded w-full'
      placeholder="Search for a location" />
  );
}
