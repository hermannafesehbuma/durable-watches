import React from 'react';
import Image from 'next/image';
import Button from './button';

export default function Products() {
  return (
    <section className="p-20">
      <div className="grid grid-cols-4 gap-10">
        <div>
          <div className="relative h-[50vh] rounded-md">
            {' '}
            <Image
              src="/product1.webp"
              fill
              alt="rolex"
              className="object-cover object-center rounded-md"
            />
          </div>
          <p className="text-xl font-light text-center mt-5">
            {' '}
            NEW 2025 Rolex GMT-Master II “Sprite” 40mm 126720VTNR Oyster
          </p>
          <div className="flex justify-center mt-5">
            <Button>View Product</Button>
          </div>
        </div>
        <div>i AMN bUMA HERMANN</div>
        <div>i AMN bUMA HERMANN</div>
        <div>i AMN bUMA HERMANN</div>
      </div>
    </section>
  );
}
