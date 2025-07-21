"use client";
import Image from "next/image";
import { brands } from "../../data/brands";
const Brands = ({ backgroundColorComponent, brandsTwo }) => {
  return (
    <section
      className={` ${
        brandsTwo ? "layout-pt-md" : "layout-pt-lg"
      }  layout-pb-md  ${
        backgroundColorComponent ? backgroundColorComponent : ""
      } `}
    >
      <div className="container">
        <div className="row justify-center">
          <div className="col text-center">
            <p className="text-lg text-dark-1">Trusted by the world’s best</p>
          </div>
        </div>
        <div
          className={`row y-gap-30 justify-between sm:justify-start items-center pt-60 md:pt-50`}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontWeight: 'bold', marginRight: '40px', fontSize:'30px' }}>Auto protection LTD</p>
            <p style={{ fontWeight: 'bold', fontSize:'30px' }}>OMS production</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
