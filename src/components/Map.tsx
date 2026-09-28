import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';

// Setup ikon marker bawaan
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Ikon kustom bulat berwarna untuk status minat
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const statusColors: Record<string, string> = {
  minat: '#22c55e',          // Hijau
  tidak_minat: '#ef4444',    // Merah
  di_luar_jangkauan: '#f59e0b' // Kuning
};

export default function MapView() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [geoData, setGeoData] = useState<any>(null);

  // Ambil data survei dari Supabase
  useEffect(() => {
    async function fetchSurveys() {
      const { data, error } = await supabase.from('survey_responses').select('*');
      if (!error && data) {
        setSurveys(data);
      }
    }
    fetchSurveys();
  }, []);

  // Ambil data GeoJSON Batas Kecamatan
  useEffect(() => {
    fetch('/geojson/batas_kecamatan.json')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.log('File GeoJSON belum diupload/ditemukan'));
  }, []);

  return (
    <div style={{ height: 'calc(100vh - 70px)', width: '100%' }}>
      <MapContainer 
        center={[-6.1783, 106.5292]} // Koordinat Tengah Tangerang
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* Layer Peta Google Satellite */}
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
          attribution="&copy; Google Maps & PT Aetra Air Tangerang"
        />

        {/* Boundary Batas Kecamatan */}
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={{ color: '#3b82f6', weight: 2, fillOpacity: 0.1 }} 
          />
        )}

        {/* Marker Titik Hasil Spreading Sales */}
        {surveys.map((item) => {
          if (!item.latitude || !item.longitude) return null;
          const markerColor = statusColors[item.status] || '#6b7280';
          return (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={createCustomIcon(markerColor)}
            >
              <Popup>
                <div className="p-1 text-sm">
                  <p className="font-bold text-gray-800">{item.customer_name || 'Pelanggan'}</p>
                  <p><b>Sales:</b> {item.sales_name}</p>
                  <p><b>Status:</b> {item.status}</p>
                  <p><b>Kecamatan:</b> {item.kecamatan}</p>
                  <p><b>Alamat:</b> {item.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
