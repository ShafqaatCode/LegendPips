import React, { useEffect, useRef } from "react";
import styled from "styled-components";

type Props = {
  scriptSrc: string;
  config: Record<string, unknown>;
  className?: string;
  /** Explicit pixel height — required for TradingView autosize embeds. */
  minHeight?: number;
};

/**
 * Loads TradingView embed widgets.
 * Container MUST have an explicit height when config.autosize is true,
 * otherwise the iframe collapses to a blank white block.
 * @see https://www.tradingview.com/widget-docs/tutorials/set-widget-size/
 */
const TradingViewWidget: React.FC<Props> = ({
  scriptSrc,
  config,
  className,
  minHeight = 400,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const configKey = JSON.stringify(config);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    host.innerHTML = "";

    const widgetEl = document.createElement("div");
    widgetEl.className = "tradingview-widget-container__widget";
    widgetEl.style.width = "100%";
    widgetEl.style.height = `${minHeight}px`;
    host.appendChild(widgetEl);

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.type = "text/javascript";
    script.async = true;
    // TradingView reads JSON from the script body (same pattern as their docs).
    script.text = configKey;
    host.appendChild(script);

    return () => {
      host.innerHTML = "";
    };
  }, [scriptSrc, configKey, minHeight]);

  return (
    <Shell
      ref={containerRef}
      className={`tradingview-widget-container ${className || ""}`}
      $height={minHeight}
    />
  );
};

export default TradingViewWidget;

const Shell = styled.div<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  min-height: ${({ $height }) => $height}px;
  overflow: hidden;

  .tradingview-widget-container__widget {
    width: 100%;
    height: ${({ $height }) => $height}px !important;
    min-height: ${({ $height }) => $height}px !important;
  }

  iframe {
    width: 100% !important;
    height: ${({ $height }) => $height}px !important;
  }
`;
