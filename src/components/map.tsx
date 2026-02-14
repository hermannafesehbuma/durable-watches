'use client';

import dynamic from 'next/dynamic';

// Dynamic import with no SSR
const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: '400px', width: '100%' }}
      className="bg-gray-200 flex items-center justify-center rounded-lg"
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Map() {
  return <LeafletMap />;
}
