"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { bannerCarouselImages } from "@/data";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="">
      <Swiper
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        speed={2000}
        effect={"fade"}
        pagination={{
          dynamicBullets: true,
        }}
        // allowTouchMove={false}
        loop={true}
        modules={[EffectFade, Pagination, Autoplay]}
        className="mySwiper h-full lg:max-h-[calc(100vh-64px)]"
      >
        {bannerCarouselImages?.map(
          (item: { id: number; img: string; alt: string }, index: number) => (
            <SwiperSlide key={index} className="h-full ">
              <Image
                src={item.img}
                alt={item.alt}
                width={1920}
                height={1080}
                layout="responsive"
                className="object-cover w-full h-full "
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
};

export default Banner;
