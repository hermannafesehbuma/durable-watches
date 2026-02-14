import MotionSection from '@/components/motion-section';
import Aboutus from '@/components/aboutus';
import Products from '@/components/products';
import FeaturedProducts from '@/components/featured-products';
import LandingTestimonials from '@/components/landing-testimonials';

export default function Home() {
  return (
    <>
      <MotionSection />
      <Aboutus />
      <FeaturedProducts />
      <LandingTestimonials />
    </>
  );
}
