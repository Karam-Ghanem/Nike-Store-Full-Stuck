import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  onChange: (coords: { lat: number; lng: number }) => void;
};

function ClickHandler({
  setPosition,
  onChange,
}: {
  setPosition: (coords: any) => void;
  onChange: (coords: any) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      // تحديث موقع الـ Marker
      setPosition({ lat, lng });

      // إرسال الإحداثيات للأب
      onChange({ lat, lng });
    },
  });

  return null;
}

function AutoLocate({
  setPosition,
  onChange,
}: {
  setPosition: (coords: any) => void;
  onChange: (coords: any) => void;
}) {
  const map = useMapEvents({});

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      // حط الـ Marker على موقع المستخدم
      setPosition({ lat: latitude, lng: longitude });

      // حرّك الخريطة لموقع المستخدم
      map.setView([latitude, longitude], 16);

      // رجّع الإحداثيات للأب
      onChange({ lat: latitude, lng: longitude });
    });
  }, []);

  return null;
}

export function LocationPicker({ onChange }: Props) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <MapContainer
        center={{ lat: 35.52, lng: 35.78 }}
        zoom={13}
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* تحديد تلقائي لموقع المستخدم */}
        <AutoLocate setPosition={setPosition} onChange={onChange} />

        {/* المستخدم يضغط على الخريطة لتغيير الموقع */}
        <ClickHandler setPosition={setPosition} onChange={onChange} />

        {/* Marker يظهر فقط إذا في موقع */}
        {position && <Marker position={position} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
}
