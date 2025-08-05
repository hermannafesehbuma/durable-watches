import Faqs from '@/components/faqs';
import React from 'react';

export default function Page() {
  return (
    <>
      <div className="pt-30 px-10 xsm:w-full md:w-1/2 xsm:ml-0 md:ml-[25%] text-center">
        <h1 className="text-3xl font-bold mb-5">Refunds Policy</h1>
        <p>
          We have a 7-day return policy on watches, which means you have 7 days
          after receiving your watch to request a return for not as described
          items only. To be eligible for a return, your item must be in the same
          condition that you received it, with the same contents as when you
          received it, unworn or unused, with tags, and in its original
          packaging. You&apos;ll also need the receipt or proof of purchase.
          Worn items will not be eligible for return. To start a return, you can
          contact us at 323-389-5316. <br />
          <br /> Please note that returns will need to be sent to the following
          address: 21830 Greenfield Road, Oak Park MI 48237, United States If
          your return is accepted, we&apos;ll send you a return shipping label,
          as well as instructions on how and where to send your package. Items
          sent back to us without first requesting a return will not be
          accepted. You can always contact us for any return question at
          323-389-5316 or fill out the contact form. <br />
          <br /> Damages and issues Please inspect your order upon reception and
          contact us immediately if the item is defective, damaged or if you
          receive the wrong item, so that we can evaluate the issue and make it
          right. Right to cancel order(s) All orders, whether initial or
          additional, are subject to acceptance by and shall only become
          effective upon confirmation by My Watch LLC. Refunds We will notify
          you once we&apos;ve received and inspected your return, and let you
          know if the refund was approved or not.
          <br />
          <br /> If approved, you&apos;ll be refunded on your original payment
          method. Please remember it can take some time for your bank or credit
          card company to process and post the refund, refunds will be processed
          within 7 days. If more than 7 business days have passed since
          we&apos;ve approved your return, please contact us at 323-389-5316.
        </p>
      </div>
      <Faqs />
    </>
  );
}
