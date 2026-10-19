import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  brokerLogoInitials,
  bundledBrokerLogo,
  resolveBrokerLogoUrl,
} from "../../utils/brokerLogoUrl";

type BrokerLogoProps = {
  src?: string | null;
  alt?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Extra class for the fallback initials box when image fails */
  fallbackClassName?: string;
  /**
   * Prefer circular-safe bundled partner logos (recommended for avatar stacks).
   * @default true
   */
  preferBundled?: boolean;
};

/**
 * Renders a broker logo with Brandfetch URL normalization, contain-fit friendly
 * loading, and initials fallback when the image fails to load.
 */
const BrokerLogo: React.FC<BrokerLogoProps> = ({
  src,
  alt,
  name,
  className,
  style,
  fallbackClassName,
  preferBundled = true,
}) => {
  const primary = useMemo(
    () => resolveBrokerLogoUrl(src, name || alt, { preferBundled }),
    [src, name, alt, preferBundled]
  );
  const bundled = useMemo(() => bundledBrokerLogo(name || alt), [name, alt]);
  const [failedPrimary, setFailedPrimary] = useState(false);

  useEffect(() => {
    setFailedPrimary(false);
  }, [primary]);

  const activeSrc =
    failedPrimary && bundled && bundled !== primary ? bundled : failedPrimary ? "" : primary;

  if (!activeSrc) {
    return (
      <Fallback
        className={fallbackClassName || className}
        style={style}
        aria-label={alt || name || "Broker"}
      >
        {brokerLogoInitials(name || alt)}
      </Fallback>
    );
  }

  return (
    <Frame className={className} style={style}>
      <img
        src={activeSrc}
        alt={alt || name || "Broker logo"}
        loading="lazy"
        decoding="async"
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => {
          if (!failedPrimary && primary === activeSrc) setFailedPrimary(true);
        }}
      />
    </Frame>
  );
};

const Frame = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  line-height: 0;

  img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    pointer-events: none;
  }
`;

const Fallback = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #132e58 0%, #1a3d6e 100%);
  color: #fff;
  font-weight: 800;
  font-size: 0.72em;
  letter-spacing: 0.02em;
  line-height: 1;
  user-select: none;
`;

export default BrokerLogo;
