import Faqs from '@/components/faqs';
import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white pt-20">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Shipping Policy
            </h1>
            <p className="text-lg text-gray-300 text-center mb-12 leading-relaxed">
              Learn about our shipping methods, delivery times, and policies for
              your luxury watch orders.
            </p>

            <div className="space-y-12">
              {/* Overview */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  OVERVIEW
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  At Rolex Durable Watches, we are committed to delivering your
                  luxury timepieces safely and efficiently. This shipping policy
                  outlines our shipping methods, delivery timeframes, costs, and
                  procedures to ensure you receive your watch in perfect
                  condition. All shipments are fully insured and require
                  signature confirmation for your security and peace of mind.
                </p>
              </section>

              {/* Shipping Methods */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 1 - SHIPPING METHODS
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    We offer multiple shipping options to meet your delivery
                    needs:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Standard Shipping (5-7 business days):</strong>{' '}
                      $15.00 - Reliable ground shipping with tracking
                    </li>
                    <li>
                      <strong>Express Shipping (2-3 business days):</strong>{' '}
                      $35.00 - Expedited delivery with priority handling
                    </li>
                    <li>
                      <strong>Overnight Shipping (1 business day):</strong>{' '}
                      $75.00 - Next business day delivery by 3 PM
                    </li>
                    <li>
                      <strong>
                        International Shipping (7-21 business days):
                      </strong>{' '}
                      Varies by destination - Customs duties may apply
                    </li>
                  </ul>
                  <p className="mt-4">
                    All domestic shipments include full insurance coverage up to
                    the declared value of your watch. Signature confirmation is
                    required for all deliveries to ensure secure receipt.
                  </p>
                </div>
              </section>

              {/* Processing Time */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 2 - ORDER PROCESSING TIME
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Orders are typically processed within 1-2 business days
                    after payment confirmation. Processing includes
                    authentication verification, quality inspection, and secure
                    packaging.
                  </p>
                  <p>
                    <strong>Processing Schedule:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Monday - Friday: Orders placed before 2 PM EST are
                      processed same day
                    </li>
                    <li>Weekend orders: Processed on the next business day</li>
                    <li>
                      Holiday periods: May require additional 1-2 business days
                    </li>
                  </ul>
                  <p>
                    You will receive an email confirmation with tracking
                    information once your order ships.
                  </p>
                </div>
              </section>

              {/* Shipping Costs */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 3 - SHIPPING COSTS AND FREE SHIPPING
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Shipping costs are calculated based on the delivery method
                    selected and destination. We offer free standard shipping on
                    orders over $2,500 within the continental United States.
                  </p>
                  <p>
                    <strong>Free Shipping Eligibility:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Orders $2,500 and above: Free standard shipping (5-7
                      business days)
                    </li>
                    <li>
                      Upgrade to express shipping: Pay only the difference
                      ($20.00)
                    </li>
                    <li>
                      Alaska and Hawaii: Additional $25.00 surcharge applies
                    </li>
                  </ul>
                  <p>
                    International shipping costs vary by destination and are
                    calculated at checkout. Customers are responsible for any
                    customs duties, taxes, or import fees.
                  </p>
                </div>
              </section>

              {/* Delivery Areas */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 4 - DELIVERY AREAS
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    We ship to addresses within the United States and select
                    international destinations.
                  </p>
                  <p>
                    <strong>Domestic Shipping:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All 50 United States</li>
                    <li>Washington D.C.</li>
                    <li>
                      Puerto Rico and U.S. territories (additional fees may
                      apply)
                    </li>
                  </ul>
                  <p>
                    <strong>International Shipping:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Canada, United Kingdom, European Union</li>
                    <li>Australia, New Zealand, Japan</li>
                    <li>
                      Select other countries (contact us for availability)
                    </li>
                  </ul>
                  <p>
                    We do not ship to P.O. boxes for security reasons. All
                    shipments require a physical address where someone can sign
                    for the package.
                  </p>
                </div>
              </section>

              {/* International Shipping */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 5 - INTERNATIONAL SHIPPING POLICY
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    International customers can enjoy our luxury timepieces with
                    worldwide shipping. Please note the following important
                    information:
                  </p>
                  <p>
                    <strong>Customs and Duties:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Customers are responsible for all customs duties, taxes,
                      and import fees
                    </li>
                    <li>
                      Declared value will reflect the actual purchase price
                    </li>
                    <li>Delivery may be delayed due to customs processing</li>
                  </ul>
                  <p>
                    <strong>Restricted Countries:</strong>
                  </p>
                  <p>
                    Due to shipping restrictions and regulations, we cannot ship
                    to certain countries. Please contact us to verify if we can
                    ship to your location.
                  </p>
                  <p>
                    <strong>Currency and Pricing:</strong>
                  </p>
                  <p>
                    All prices are displayed in USD. International customers may
                    incur currency conversion fees from their bank or credit
                    card company.
                  </p>
                </div>
              </section>

              {/* Tracking and Delivery */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 6 - TRACKING AND DELIVERY
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Once your order ships, you will receive a confirmation email
                    with tracking information. You can monitor your shipment's
                    progress using the provided tracking number.
                  </p>
                  <p>
                    <strong>Delivery Requirements:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Adult signature (21+) required for all deliveries</li>
                    <li>Valid government-issued photo ID must be presented</li>
                    <li>
                      Delivery attempts made during business hours (9 AM - 6 PM)
                    </li>
                    <li>
                      Package held at local facility if delivery unsuccessful
                      after 3 attempts
                    </li>
                  </ul>
                  <p>
                    If you will not be available to receive your package, you
                    may arrange for delivery to an alternate address or hold for
                    pickup at a carrier facility.
                  </p>
                </div>
              </section>

              {/* Packaging and Security */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 7 - PACKAGING AND SECURITY
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Your luxury timepiece deserves the highest level of
                    protection during transit. We use specialized packaging
                    designed for high-value items:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Tamper-evident security packaging</li>
                    <li>Shock-resistant cushioning materials</li>
                    <li>Discrete packaging with no external brand markings</li>
                    <li>Full insurance coverage included</li>
                  </ul>
                  <p>
                    All packages are tracked from our facility to your door, and
                    we maintain detailed records of the shipping process for
                    security and quality assurance.
                  </p>
                </div>
              </section>

              {/* Shipping Delays */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 8 - SHIPPING DELAYS AND ISSUES
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    While we strive to meet all delivery timeframes, certain
                    circumstances may cause delays:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Weather conditions and natural disasters</li>
                    <li>Carrier delays or service disruptions</li>
                    <li>Customs processing for international shipments</li>
                    <li>Incorrect or incomplete shipping addresses</li>
                    <li>Holiday shipping volumes</li>
                  </ul>
                  <p>
                    If your shipment is delayed, we will proactively contact you
                    with updates. For urgent delivery needs, please contact us.
                  </p>
                  <p>
                    <strong>Lost or Damaged Packages:</strong>
                  </p>
                  <p>
                    In the rare event that your package is lost or damaged
                    during transit, we will immediately file an insurance claim
                    and work to resolve the issue quickly. A replacement watch
                    will be sent at no additional cost to you.
                  </p>
                </div>
              </section>

              {/* Address Changes */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 9 - ADDRESS CHANGES AND DELIVERY INSTRUCTIONS
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Please ensure your shipping address is accurate before
                    completing your order. Address changes may not be possible
                    once the order has been processed.
                  </p>
                  <p>
                    <strong>Address Change Policy:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Changes must be requested within 2 hours of order
                      placement
                    </li>
                    <li>Address changes may incur additional shipping fees</li>
                    <li>No changes possible once package is in transit</li>
                  </ul>
                  <p>
                    <strong>Special Delivery Instructions:</strong>
                  </p>
                  <p>
                    If you have specific delivery requirements (business
                    address, gate codes, etc.), please include these details in
                    the order notes or contact us directly.
                  </p>
                </div>
              </section>

              {/* Holiday Shipping */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 10 - HOLIDAY SHIPPING
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    During peak holiday seasons, shipping volumes increase
                    significantly. We recommend placing orders early to ensure
                    timely delivery.
                  </p>
                  <p>
                    <strong>Holiday Shipping Guidelines:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Order by December 15th for Christmas delivery (standard
                      shipping)
                    </li>
                    <li>
                      Order by December 20th for Christmas delivery (express
                      shipping)
                    </li>
                    <li>
                      Order by December 22nd for Christmas delivery (overnight
                      shipping)
                    </li>
                    <li>
                      No shipments on major holidays (Christmas, New Year's Day,
                      etc.)
                    </li>
                  </ul>
                  <p>
                    Holiday cutoff dates are subject to change based on carrier
                    schedules. Check our website or contact us for the most
                    current information.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 11 - SHIPPING QUESTIONS AND CONTACT
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    If you have questions about shipping options, tracking your
                    order, or need assistance with delivery arrangements, our
                    customer service team is here to help.
                  </p>
                  <p>
                    <strong>Contact Information:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>(Monday - Friday, 9 AM - 6 PM EST)</li>
                    <li>Email: Use our contact form on the website</li>
                    <li>
                      County Lane Plaza at 15501 Bustleton Ave Philadelphia,PA
                    </li>
                  </ul>
                  <p>
                    For urgent shipping inquiries or delivery issues, please
                    call our customer service line. We are committed to ensuring
                    your complete satisfaction with our shipping service.
                  </p>
                </div>
              </section>

              {/* Policy Updates */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-teal-600">
                  SECTION 12 - POLICY UPDATES
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    This shipping policy may be updated periodically to reflect
                    changes in our shipping procedures, carrier services, or
                    regulatory requirements.
                  </p>
                  <p>
                    Any changes to this policy will be posted on this page with
                    an updated effective date. We encourage you to review this
                    policy before placing an order to ensure you understand our
                    current shipping terms and procedures.
                  </p>
                  <p className="text-sm text-gray-400 mt-8">
                    <strong>Last Updated:</strong>{' '}
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Faqs />
    </>
  );
}
