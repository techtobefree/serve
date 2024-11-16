export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export function blankAddress(): Address {
  return {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  };
}

export function decodeAddressComponents(
  address_components: google.maps.places.PlaceResult['address_components']
): Address {
  const address: Address = blankAddress();

  address_components?.forEach(component => {
    const type = component.types[0];
    if (type === 'street_number') {
      address.street = component.long_name + ' ';
    }
    if (type === 'route') {
      address.street += component.long_name;
    }
    if (type === 'locality') {
      address.city = component.long_name;
    }
    if (type === 'administrative_area_level_1') {
      address.state = component.short_name;
    }
    if (type === 'postal_code') {
      address.zip = component.long_name;
    }
    if (type === 'country') {
      address.country = component.long_name;
    }
  });

  return address;
}
