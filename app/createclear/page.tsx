'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

// Lazy load a component
const HeavyComponent = dynamic(() => import('./createclear'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function HomePage() {
  return (
 

      <HeavyComponent />

  );
}
