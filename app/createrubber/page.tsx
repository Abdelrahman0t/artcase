import Link from 'next/link';
import dynamic from 'next/dynamic';

// Lazy load a component
const HeavyComponent = dynamic(() => import('./createrubber'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function HomePage() {
  return (
 

      <HeavyComponent />

  );
}
