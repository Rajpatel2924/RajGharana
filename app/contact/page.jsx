import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Contact = () => {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase text-orange-600">Contact Us</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-gray-900">
            We are here to help with your shopping questions.
          </h1>
          <p className="mt-6 text-gray-600 leading-7">
            Need help with a product, order, payment, or delivery question? Reach out and our
            support team will help you find the right answer.
          </p>
          <div className="mt-8 space-y-3 text-gray-700">
            <p>
              <span className="font-medium text-gray-900">Phone:</span> 9506794037
            </p>
            <p>
              <span className="font-medium text-gray-900">Email:</span> Rajpatel805233@gmail.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
