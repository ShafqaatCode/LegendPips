import React from "react";
import { BannerWrapper, Overlay } from "./Banner.styles";
import BannerHeadingSet from "../SharedComponents/BannerHeadingSet";
import ButtonBase from "../SharedComponents/Button";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 2.svg";
interface BannerProps {
  backgroundImage?: string;
  upperText: string;
  bannerHeading: string;
  subText: string;
  buttonText?: string;
  // onButtonClick?: () => void; // Optional callback for button click
}

const Banner: React.FC<BannerProps> = ({
  backgroundImage,
  bannerHeading,
  upperText,
  subText,
  buttonText = "Signup For Free",
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
        <ButtonBase
          style={{ margin: "auto" }}
          color="#FBBF24"
          borderColor="#FBBF24"
          bgColor=""
        >
          {buttonText}
          <img src={ArrowIcon} alt="" />
        </ButtonBase>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
