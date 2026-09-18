/**
 * Geolocation & Reverse Geocoding Utility
 * Accurately detects current latitude/longitude and resolves the City/Locality name via Nominatim OpenStreetMap.
 */

export interface DetectedLocation {
  latitude: number;
  longitude: number;
  city: string;
  state?: string;
  formattedAddress: string;
}

export const detectCurrentCity = (): Promise<DetectedLocation> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Reverse geocoding error: ${response.statusText}`);
          }

          const data = await response.json();
          const addr = data.address || {};

          // Extract best matching city / municipality / district
          const city =
            addr.city ||
            addr.town ||
            addr.city_district ||
            addr.municipality ||
            addr.suburb ||
            addr.village ||
            addr.county ||
            addr.state_district ||
            addr.state ||
            '';

          resolve({
            latitude,
            longitude,
            city,
            state: addr.state,
            formattedAddress: data.display_name || city,
          });
        } catch (fetchErr) {
          console.warn('Reverse geocoding failed, returning coordinates:', fetchErr);
          resolve({
            latitude,
            longitude,
            city: '',
            formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        }
      },
      (geoError) => {
        let msg = 'Unable to retrieve location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access.';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable.';
        } else if (geoError.code === geoError.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};
