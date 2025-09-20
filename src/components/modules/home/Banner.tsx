const Banner = () => {
  return (
    <div className="h-[200px] md:h-[460px] lg:h-[600px] w-full bg-cover bg-center bg-gradient-to-b from-primary-foreground to-primary py-5 md:py-10 px-3 flex flex-col justify-between">
      <div className="w-full h-full flex flex-col items-center justify-center text-center text-white  md:space-y-4 lg:space-y-5">
        <h2 className="text-2xl md:text-5xl lg:text-6xl font-medium tracking-wide md:tracking-wider">
          GRAND
        </h2>
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-semibold tracking-wider">
          OPENING
        </h1>
        <h5 className="text-sm md:text-2xl lg:text-3xl text-black/80 font-medium tracking-wider">
          OCTOBER 1, 2025
        </h5>
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-medium tracking-wide md:tracking-wider">
          FLAT 50% OFF
        </h1>
      </div>
      <div className="w-full flex justify-between text-white container mx-auto text-[10px] md:text-base lg:text-lg">
        <p>Available on weargic.com</p>
        <p>On all products</p>
      </div>
    </div>
  );
};

export default Banner;
