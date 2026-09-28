import { Link } from "react-router-dom";
import styled from "styled-components";
import { useLocale } from "../../contexts/LocaleContext";

const TermsLink = styled(Link)`
  color: #e87511;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #c45f00;
  }
`;

type TermsAcceptLabelProps = {
  variant: "login" | "register";
};

const TermsAcceptLabel = ({ variant }: TermsAcceptLabelProps) => {
  const { t } = useLocale();
  const before =
    variant === "register" ? t("panel.authUnderstandBefore") : t("panel.authTermsBefore");

  const suffix =
    variant === "register" ? t("panel.authUnderstandSuffix") : t("panel.authTermsSuffix");

  return (
    <>
      {before}
      <TermsLink to="/terms" target="_blank" rel="noopener noreferrer">
        {t("panel.authTermsLink")}
      </TermsLink>
      {suffix}
    </>
  );
};

export default TermsAcceptLabel;
