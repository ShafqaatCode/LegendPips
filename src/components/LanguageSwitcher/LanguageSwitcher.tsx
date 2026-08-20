import React from "react";
import styled from "styled-components";
import { LOCALES } from "../../i18n/locales";
import { useLocale } from "../../contexts/LocaleContext";

const LanguageSwitcher: React.FC<{ compact?: boolean; light?: boolean }> = ({ compact, light }) => {
  const { locale, setLocale, t } = useLocale();
  return (
    <Wrap $compact={!!compact} $light={!!light}>
      <label htmlFor="lp-lang">{t("header.language")}</label>
      <select
        id="lp-lang"
        value={locale}
        aria-label={t("header.language")}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </Wrap>
  );
};

export default LanguageSwitcher;

const Wrap = styled.div<{ $compact: boolean; $light: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: ${({ $light }) => ($light ? "#132e58" : "#fff")};
  label {
    font-size: 0.7rem;
    font-weight: 600;
    opacity: 0.85;
    ${({ $compact }) => $compact && "display: none;"}
  }
  select {
    background: ${({ $light }) => ($light ? "#fff" : "rgba(255, 255, 255, 0.12)")};
    color: ${({ $light }) => ($light ? "#132e58" : "#fff")};
    border: 1px solid ${({ $light }) => ($light ? "#e2e8f0" : "rgba(255, 255, 255, 0.28)")};
    border-radius: 8px;
    padding: 0.28rem 0.45rem;
    font: inherit;
    font-size: 0.75rem;
    max-width: 9.5rem;
    cursor: pointer;
    option {
      color: #132e58;
    }
  }
`;
