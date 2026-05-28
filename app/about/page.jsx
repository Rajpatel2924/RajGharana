import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase text-orange-600">About RajGharana</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-gray-900">
            Shopping made simple, reliable, and rewarding.
          </h1>
          <p className="mt-6 text-gray-600 leading-7">
            RajGharana is an ecommerce destination for quality products across electronics,
            accessories, lifestyle essentials, and daily deals. We focus on a clean shopping
            experience, helpful product details, transparent pricing, and a checkout flow that
            lets customers buy with confidence.
          </p>
          <p className="mt-4 text-gray-600 leading-7">
            Our catalog is built to help shoppers compare, discover, save favorites, and quickly
            move from product discovery to secure payment.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;
