"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FaMapMarkerAlt, FaDirections, FaStar, FaStore, FaLayerGroup } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export default function PharmacyMap() {
  const position = [24.8284347, 89.3543086];
  const googleMapsUrl =
    "https://www.google.com/maps/place/%E0%A6%B8%E0%A6%BE%E0%A6%95%E0%A6%BF%E0%A6%A8+%E0%A6%AB%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AE%E0%A7%87%E0%A6%B8%E0%A7%80/@24.8284347,89.3543086,17z";

  // MAP STYLES (No API Key Required)
  const mapStyles = {
    colorful: {
      name: "Colorful Street",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      name: "Satellite Hybrid",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
    topographic: {
      name: "Topographic",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    },
  };

  const [activeStyle, setActiveStyle] = useState("colorful");
  const [customIcon, setCustomIcon] = useState(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      // CUSTOM GREEN PHARMACY ICON
      const svgIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="
            background: #08781F;
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid #ffffff;
            box-shadow: 0 10px 20px rgba(8,120,31,0.4);
          ">
            <div style="transform: rotate(45deg); color: white; font-size: 18px; font-weight: bold;">
              ✚
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
      });
      setCustomIcon(svgIcon);
    });
  }, []);

  return (
    <section className="w-full px-2 py-4 sm:px-6 sm:py-8">
      {/* OUTER GLASS CONTAINER */}
      <div className="group relative z-0 h-[75vh] min-h-[520px] w-full overflow-hidden rounded-[2.5rem] border border-emerald-200/60 bg-white/40 p-2 sm:p-3 backdrop-blur-xl shadow-[0_20px_60px_rgba(8,120,31,0.15)] transition-all duration-500 hover:shadow-[0_30px_70px_rgba(8,120,31,0.22)]">
        
        {/* FLOATING HEADER OVERLAY */}
        <div className="absolute top-5 left-5 right-5 z-[400] sm:left-8 sm:right-auto sm:max-w-md">
          <div className="flex flex-col gap-2.5 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur-md transition hover:bg-white/95">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08781F] text-white shadow-lg shadow-emerald-700/30">
                  <FaStore className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    Sakin Pharmacy
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-[#08781F] animate-ping"></span>
                    <span>Verified Healthcare Partner</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/80 shadow-xs">
                <FaStar className="text-amber-500" />
                <span>5.0</span>
              </div>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-slate-600 flex items-start gap-1.5">
              <FaMapMarkerAlt className="shrink-0 text-[#08781F] mt-0.5 text-sm" />
              <span>Beside Shaheed Ziaur Rahman Medical College Hospital, Bogura</span>
            </p>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#08781F] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/25 transition-all hover:bg-[#066617] hover:shadow-lg hover:scale-[1.01]"
            >
              <FaDirections className="text-sm" />
              Get Directions in Google Maps
            </a>
          </div>
        </div>

        {/* STYLE SWITCHER CONTROLS */}
        <div className="absolute bottom-6 right-6 z-[400] flex gap-2 rounded-2xl border border-white/80 bg-white/85 p-1.5 shadow-xl backdrop-blur-md">
          {Object.keys(mapStyles).map((styleKey) => (
            <button
              key={styleKey}
              onClick={() => setActiveStyle(styleKey)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeStyle === styleKey
                  ? "bg-[#08781F] text-white shadow-md"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-[#08781F]"
              }`}
            >
              <FaLayerGroup className="text-[10px]" />
              {mapStyles[styleKey].name}
            </button>
          ))}
        </div>

        {/* MAP INNER WRAPPER */}
        <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
          {customIcon ? (
            <MapContainer
              center={position}
              zoom={16}
              scrollWheelZoom={false}
              className="h-full w-full z-0"
            >
              <TileLayer
                key={activeStyle}
                attribution={mapStyles[activeStyle].attribution}
                url={mapStyles[activeStyle].url}
              />
              <Marker position={position} icon={customIcon}>
                <Popup>
                  <div className="p-1 text-center font-sans">
                    <h4 className="text-base font-bold text-[#08781F]">
                      Sakin Pharmacy
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 font-medium">
                      সাকিন ফার্মেসী, বগুড়া
                    </p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-[#08781F] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#066617]"
                    >
                      <FaDirections /> Get Directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-emerald-50 font-semibold text-emerald-800">
              Loading Sakin Pharmacy Map...
            </div>
          )}
        </div>

      </div>
    </section>
  );
}