import React from 'react';
import ContactForm from '@/components/contact-form';

export default function Page() {
  return (
    <div>
      <section className="pt-30 px-10">
        <h1 className="text-4xl ">Rolex Durable Watches Contact info</h1>
        <h3 className="mt-20">Retail Store Address</h3>
        <p>County Lane Plaza at 15501 Bustleton Ave Philadelphia,PA</p>
        <p>Email: contact@durablewatchessale.com</p>
        <p>HOURS (By Appointment Only) 9:00 am - 6:00 pm Monday - Saturday</p>
        <p className="mt-5">
          Our headquarters, which houses our retail store, is located in the
          Metro Detroit Area of South East Michigan. We are open Monday through
          Saturday, 9 a.m. to 6 p.m. (EST), the showroom hours are by
          appointment Monday through Friday 11 a.m. to 4:00 p.m. each day. The
          store is not open on Saturday or Sunday, but customers can shop at
          RolexDurableWatches.com 24/7. Due to the nature of dealing with Luxury
          timepieces, i.e., security and insurance concerns, customers must call
          to set up an appointment to view the watches displayed on site in
          store. That said, the majority of transactions are completed at
          rolexdurablewatches.com. Our goal is to make it easy for those
          shopping the best deal on a pre-owned Luxury Watch to buy, sell or
          trade online with us.
        </p>
        <ContactForm />
      </section>
    </div>
  );
}
