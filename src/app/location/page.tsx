import Faqs from '@/components/faqs';
import Map from '@/components/map';
import React from 'react';

export default function Page() {
  return (
    <section className="xsm:p-10 md:p-30 ">
      <h1 className="text-4xl mb-10">Store Locator</h1>
      <div className="grid lg:grid-cols-2 gap-3 xsm: grid-cols-1">
        <div className="">
          <div className="border border-gray-600 ">
            <div className="py-5  border-l-6 border-teal-600 px-2">
              {' '}
              <p className="text-teal-600">DURABLE WATCHES SALE</p>
              <p>1719 Chestnut St, Unit 300, Philadelphia, PA 19103, United States</p>
            </div>
          </div>
        </div>
        <div>
          <Map />
        </div>
      </div>
      <Faqs />
    </section>
  );
}
