export const metadata = {
  title: 'Burrito Lab - All-in-One Blockchain Services Hub',
  description:
    'Burrito Lab offers comprehensive multichain services for advanced transaction monitoring, analytics, and beyond, focusing on developing advanced technologies on the Terra Classic blockchain.',
  keywords:
    'Burrito Lab, Blockchain Services, Terra Classic blockchain, Transaction Monitoring, Analytics, Blockchain Hub',
};

import Hero from '@/components/hero-home';
import BusinessCategories from '@/components/business-categories';
import FeaturesPlanet from '@/components/features-planet';
import LargeTestimonial from '@/components/large-testimonial';
import Cta from '@/components/cta';
import BurritoNode from '@/components/BurritoNode';
import Disclaimer from '@/components/disclaimer';

export default function Home() {
  return (
    <>
      <Hero />
      <BusinessCategories />
      <FeaturesPlanet />
      <BurritoNode />
      <LargeTestimonial />
      <Disclaimer />
      <Cta />
    </>
  );
}
