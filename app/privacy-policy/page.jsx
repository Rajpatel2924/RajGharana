import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase text-orange-600">Privacy Policy</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-gray-900">
            Your information should stay protected.
          </h1>
          <div className="mt-6 space-y-4 text-gray-600 leading-7">
            <p>
              RajGharana uses customer information only to support core ecommerce features such
              as account access, cart activity, order processing, payment verification, delivery,
              and customer support.
            </p>
            <p>
              Payment details are handled through secure payment providers. We do not expose or
              store private payment secrets in the browser.
            </p>
            <p>
              We may use contact details to send order updates, respond to support requests, and
              improve the shopping experience.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
