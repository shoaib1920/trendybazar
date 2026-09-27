import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CityInfo {
  name: string;
  eta: string;
  codAvailable: boolean;
  courier: string;
}

const POPULAR_PAKISTANI_CITIES: CityInfo[] = [
  { name: 'Lahore', eta: '24-48 Hours (Same/Next Day)', codAvailable: true, courier: 'Trax / Direct Courier' },
  { name: 'Karachi', eta: '2-3 Working Days', codAvailable: true, courier: 'Trax Logistics / Leopards' },
  { name: 'Islamabad / Rawalpindi', eta: '1-2 Working Days', codAvailable: true, courier: 'Trax Logistics' },
  { name: 'Faisalabad', eta: '1-2 Working Days', codAvailable: true, courier: 'Trax Logistics' },
  { name: 'Multan', eta: '2-3 Working Days', codAvailable: true, courier: 'Leopards Courier' },
  { name: 'Peshawar', eta: '2-3 Working Days', codAvailable: true, courier: 'Trax / PostEx' },
  { name: 'Sialkot / Gujranwala', eta: '1-2 Working Days', codAvailable: true, courier: 'Trax Logistics' },
  { name: 'Quetta', eta: '3-4 Working Days', codAvailable: true, courier: 'Leopards Courier' },
  { name: 'Hyderabad / Sukkur', eta: '2-3 Working Days', codAvailable: true, courier: 'Trax Logistics' },
  { name: 'Other Pakistan City / Tehsil', eta: '3-4 Working Days', codAvailable: true, courier: 'Trax / Leopards' }
];

export const CityDeliveryChecker: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Lahore');

  const currentInfo = POPULAR_PAKISTANI_CITIES.find((c) => c.name === selectedCity) || POPULAR_PAKISTANI_CITIES[0];

  return (
    <div className="bg-[#F7F3EC]/60 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 text-xs">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 font-bold text-[#1A1A1A]">
          <MapPin className="w-4 h-4 text-[#F2B705]" />
          <span>Check Delivery Time & COD</span>
        </div>
        <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
          All Pakistan COD Active
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-white border border-gray-300 rounded-xl py-2 px-3 text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#F2B705] flex-1 cursor-pointer"
        >
          {POPULAR_PAKISTANI_CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-amber-200/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-700">
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-[#F2B705]" />
          <span>Estimated Delivery: <strong>{currentInfo.eta}</strong></span>
        </div>
        <div className="flex items-center gap-1 text-emerald-700 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Cash on Delivery (COD) Available</span>
        </div>
      </div>
    </div>
  );
};
