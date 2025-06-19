import React from "react";
import { BannerWrapper, Overlay } from "./Banner.styles";
import BannerHeadingSet from "../SharedComponents/BannerHeadingSet";

interface BannerProps {
  backgroundImage?: string;
  upperText: string;
  bannerHeading: string;
  subText: string;
}

const Banner: React.FC<BannerProps> = ({
  backgroundImage,
  bannerHeading,
  upperText,
  subText,
}) => {
  return (
    <BannerWrapper style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Overlay />
      <div className="content">
        <BannerHeadingSet
          mainHeading={bannerHeading}
          upperText={upperText}
          subText={subText}
        />
      </div>
    </BannerWrapper>
  );
};

export default Banner;
