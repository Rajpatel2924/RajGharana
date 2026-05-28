'use client'

const ProductSpecifications = ({ product }) => {
  const specs = [
    { label: 'Brand', value: product.name.split(' ')[0] },
    { label: 'Category', value: product.category },
    { label: 'Price', value: `$${product.price}` },
    { label: 'Offer Price', value: `$${product.offerPrice}` },
    { label: 'Discount', value: `${Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF` },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Specifications</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {specs.map((spec, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-gray-600 font-medium w-1/3 border-b border-gray-200">
                  {spec.label}
                </td>
                <td className="px-4 py-3 text-gray-800 border-b border-gray-200">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Features */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">About This Product</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Additional Info */}
      <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-lg">✓</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Ships from and sold by RajGharana</p>
            <p className="text-xs text-gray-500">2-3 day delivery available</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-lg">→</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Free Returns</p>
            <p className="text-xs text-gray-500">30 days return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecifications;