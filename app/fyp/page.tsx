'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

// Lazy load a component
const HeavyComponent = dynamic(() => import('./fyp'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function HomePage() {
  return (
    <div>
      
      <HeavyComponent />
    </div>
  );
}
