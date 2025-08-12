'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type faqProps = {
  question: string;
  answer: string;
};
export type accordionProps = {
  faq: faqProps;
  isOpen: boolean;
  onClick: () => void;
};

const faqs = [
  {
    question: 'HOW DO I PURCHASE A WATCH?',
    answer:
      'We insist on making it easy to purchase a luxury watch in person or online. Customers can make an appointment to visit our retail store Monday-Friday in Bustleton Ave Philadelphia, or simply go to our website to purchase one of the watches listed and have it shipped straight to you.',
  },
  {
    question: 'WHAT IS YOUR RETURN POLICY?',
    answer:
      'We offer a 7 day return policy for watches not as described. Outside of the 7 day return policy we offer a buyback',
  },
  {
    question: 'DO YOU ACCEPT OFFERS?',
    answer:
      'The best price that we offer is our wire/cash price, which is the price listed. We do not offer any further discounts as we already provide the best pricing and product in the market. ',
  },
  {
    question: 'WHAT IS YOUR POLICY FOR INTERNATIONAL ORDERS?',
    answer:
      "For international orders (outside of USA) we accept wire transfer as payment only. International shipping rate varies based on location, our sales represenatative's can quote you on this. Your package will ship once payment is cleared and your order is approved. Delivery time is usually within 3-5 days once wire clears. We do not calculate duty, as that is the responsibility of the buyer.",
  },
  {
    question: 'DO YOU ACCEPT OFFERS?',
    answer:
      'The best price that we offer is our wire/cash price, which is the price listed. We do not offer any further discounts as we already provide the best pricing and product in the market. ',
  },
  {
    question: 'WHAT BRANDS DO YOU CARRY?',
    answer:
      'We speciliaze in Rolex. The majority of our IN STOCK inventory consist of Rolex, but we do stock the other brands mentioned here and can order/source any watch from any brand in a about 24-48 hours.',
  },
  {
    question: 'HOW DOES SOURCING A WATCH WORK?',
    answer:
      'We can source just about any watch from any brand within 24-48 hours.',
  },
  {
    question: 'ARE ALL YOUR WATCHES AUTHENTIC?',
    answer:
      'We guarantee that every watch on this site is 100% authentic unless otherwise noted. Further, all our watches that may have been serviced, are serviced with authentic Rolex parts. DURABLE WATCHES SALE stands behind this authenticity guarantee and offers a full refund on any watch not found to be completely authentic',
  },
  {
    question: 'HOW MUCH IS SHIPPING?',
    answer: `The following shipping rates are for FedEx Standard Overnight unless otherwise noted, all orders are fully insured for the order total. We offer flat rate shipping fee for all orders up to $150,000 shipping within the CONUS, see the below rates.`,
  },
  {
    question: 'HOW LONG WILL IT TAKE TO RECEIVE MY ORDER?',
    answer: `Orders paid by wire will be shipped on the day we receive confirmation of the funds cleared from our bank. The cut off time to receive incoming wires is 5pm ET (3pm PST). EX: If payment is wired on a Monday, and funds are received on Monday, they go into pending status until they are cleared the following business day. On Tuesday they will be listed as cleared status and the order will be prepared for overnight shipping with an expected delivery date of Wednesday. You will receive a tracking number via email.

Orders paid by credit card go through a fraud check that typically takes 24-48 hours to complete. Once the fraud check is complete the order will be prepared for shipping and your order will go out either that same day or the following business day based on if it met the shipping cutoff time of 2pm ET.

No orders are shipped or delivered on weekends or holidays. We cannot guarantee any particular delivery date. Items ordered together may ship separately.

`,
  },
  {
    question: 'WHERE DO YOU SEND MY ORDER?',
    answer: `All orders will be sent to the FedEx store nearest you. Someone from our shipping department will contact you to let you know which FedEx store the package is sent to, when you go to pickup you simply take your ID into the FedEx store and they will release the package to you. This is so that the package can be fully insured for the purchase price. Although this may seem inconvenient, this process is required by our insurance, greatly reduces any claims made, and is much more secure than sending to a residence. `,
  },
  {
    question: 'ARE YOUR PHOTOGRAPHS OF THE ACTUAL WATCH?',
    answer: `Yes, all photos are of the exact watch without editing done to the photo to enhance it or hide blemishes.`,
  },
  {
    question: 'WHAT ARE MY PAYMENT OPTIONS?',
    answer: `Our payment options are bank wire (bank transfer), cash, all major US credit/debit cards, and our payment plan offering is via third-party provider Affirm. For international orders, we accept wire payment only. All credit card payments go through a fraud check which can take about 24-48 hours to complete. 

For deposits (when sourcing a watch) we also accept Zelle, Crypto `,
  },
  {
    question: 'DO YOU OFFER PAYMENT PLANS?',
    answer: `We do not offer a payment plan directly. For payment plans you can choose Affirm at checkout and you will be redirected to their site for payment options. If you are not satisfied with their terms you can back out of the order at any time. If you have any questions about your Affirm payment, you will need to contact Affirm directly.


Note: Listed prices are advertised for wire transfer and already discounted 6.7% compared to the cost when using Affirm. Affirm orders will need to add 6.7% to the price you see advertised. EX: If a watch is listed at $10,000, when using affirm the total would be $10,670`,
  },
  {
    question: 'HOW DO I KNOW YOU HAVE RECEIVED MY PAYMENT?',
    answer: `We will notify you via email that wire has been received and that your watch is being processed to ship. If payment was made by credit card or 3rd party, we may call you with security questions. To ensure your order is not held up, please be sure to send a copy of your drivers license. Once your watch is ready to ship, you will receive tracking information.`,
  },
  {
    question: 'DO YOU ACCEPT CRYPTO CURRENCY?',
    answer: `Yes, we accpt Crypto Currency including BTC/BITCOIN, USDT, ETH, DOGE, amongst others. There is a 2% fee to process your Cypto Payment.`,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const AccordionItem = ({ faq, isOpen, onClick }: accordionProps) => (
  <div className="border-b border-gray-200 py-4">
    <motion.button
      className="w-full text-left flex justify-between items-center"
      onClick={onClick}
    >
      <span className="font-medium">{faq.question}</span>
      <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>▼</motion.span>
    </motion.button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 text-gray-600"
        >
          {faq.answer}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {faqs.map((faq, index) => (
          <motion.div key={index} variants={itemVariants}>
            <AccordionItem
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
