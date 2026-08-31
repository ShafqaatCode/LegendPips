import React from "react";
import styled from "styled-components";
import { FiGlobe } from "react-icons/fi";
import { LOCALES } from "../../i18n/locales";
import { useLocale } from "../../contexts/LocaleContext";

const LanguageSwitcher: React.FC<{ compact?: boolean; light?: boolean }> = ({ compact, light }) => {
  const { locale, setLocale, t } = useLocale();
  const current = LOCALES.find((l) => l.code === locale)?.native || "English";

  return (
    <Wrap $compact={!!compact} $light={!!light}>
      <FiGlobe size={13} aria-hidden />
      <select
        id={compact ? "lp-lang-mobile" : "lp-lang"}
        value={locale}
        aria-label={t("header.language")}
        title={t("header.language")}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
      {!compact && <VisuallyHidden>{current}</VisuallyHidden>}
    </Wrap>
  );
};

export default LanguageSwitcher;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const Wrap = styled.div<{ $compact: boolean; $light: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  height: 2rem;
  padding: 0 0.55rem 0 0.5rem;
  border-radius: 6px;
  border: 1px solid
    ${({ $light }) => ($light ? "#dbe3ef" : "rgba(255, 255, 255, 0.22)")};
  background: ${({ $light }) => ($light ? "#fff" : "rgba(255, 255, 255, 0.08)")};
  color: ${({ $light }) => ($light ? "#132e58" : "rgba(255, 255, 255, 0.92)")};
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: ${({ $light }) => ($light ? "#f8fafc" : "rgba(255, 255, 255, 0.14)")};
    border-color: ${({ $light }) => ($light ? "#cbd5e1" : "rgba(255, 255, 255, 0.4)")};
  }

  svg {
    flex-shrink: 0;
    opacity: 0.85;
    pointer-events: none;
  }

  select {
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    color: inherit;
    border: 0;
    outline: none;
    padding: 0 0.85rem 0 0;
    margin: 0;
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    max-width: ${({ $compact }) => ($compact ? "6.5rem" : "7.5rem")};
    cursor: pointer;
    background-image: ${({ $light }) =>
      $light
        ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23132e58' d='M1 1l4 4 4-4'/%3E%3C/svg%3E")`
        : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23ffffff' d='M1 1l4 4 4-4'/%3E%3C/svg%3E")`};
    background-repeat: no-repeat;
    background-position: right 0 center;
    background-size: 10px 6px;

    option {
      color: #132e58;
      background: #fff;
    }
  }
`;
