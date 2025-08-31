import { returnAndRefundPolicy } from "@/data";

const RefundAndReturnPolicy = () => {
  const policy = returnAndRefundPolicy;

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-primary text-center font-bold mb-5 md:mb-8 lg:mb-10 xl:mb-12">
        {policy.title}
      </h1>
      {/* <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-[#646464] mb-1 md:mb-2 lg:mb-3">
        Privacy policy Statement
      </h2> */}
      <div className="space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7">
        {policy.sections.map((section, index) => (
          <div key={index}>
            {
              <div className="space-y-5 md:space-y-6 lg:space-y-7">
                {/* section title */}
                <h3 className="text-primary text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium">
                  {section.title}
                </h3>
                {/* section unordered list if exist */}
                <div className="text-[#646464] text-xs md:text-sm lg:text-base">
                  <p>{section.list?.title}</p>
                  <ul className="list-disc pl-7 md:pl-8 lg:pl-9 mb-1 md:mb-2 leading-4 md:leading-5 lg:leading-6">
                    {section.list?.listItem.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                {/* section introduction */}
                <div className="space-y-2 md:space-y-3 lg:space-y-4 text-[#646464] text-xs md:text-sm lg:text-base">
                  {section.introduction.map((content, index) => (
                    <p
                      className="leading-4 md:leading-5 lg:leading-6"
                      key={index}
                    >
                      {content}
                    </p>
                  ))}
                </div>
                {/* section subsections if exist */}
                <div className="space-y-4 md:space-y-5 lg:space-y-6 text-[#646464] text-xs md:text-sm lg:text-base">
                  {section.subSections?.map((subSection, index) => (
                    <div key={index} className="">
                      <h4 className=" text-sm md:text-base lg:text-lg font-bold">
                        {subSection.title}
                      </h4>
                      <div className=" space-y-4 md:space-y-5 lg:space-y-6">
                        <p className="text-xs md:text-sm lg:text-base mt-[2px] md:mt-[3px] lg:mt-[4px] ">
                          {subSection.subtitle}
                        </p>
                        <div className="space-y-1 md:space-y-2 lg:space-y-3">
                          {subSection.content.map((content, index) => (
                            <p
                              className="leading-2 md:leading-3 lg:leading-4"
                              key={index}
                            >
                              {content}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefundAndReturnPolicy;
