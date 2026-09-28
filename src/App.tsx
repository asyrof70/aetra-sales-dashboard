import React from 'react';
import MapView from './components/Map';

export default function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header Aplikasi Aetra */}
      <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">PT AETRA AIR TANGERANG - Sales Spreading Map</h1>
        <div className="flex gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Minat</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Tidak Minat</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Di Luar Jangkauan</span>
        </div>
      </header>

      {/* Tampilan Peta Utama */}
      <main className="flex-1">
        <MapView />
      </main>
    </div>
  );
}
