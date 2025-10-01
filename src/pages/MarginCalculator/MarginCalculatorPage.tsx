import InstructionsSection from '../../components/Calculators/InstructionSet'
import MarginCalculator from '../../components/Calculators/MarginCalculator/MarginCalculator'
import TradingSlider from '../../components/TradingCard/TradingSlider'

function MarginCalculatorPage() {
  return (
    <div>
      <MarginCalculator />
      <TradingSlider />
      <InstructionsSection
        calculatorName="Margin"
        steps={[
          "Select your preferred trading pair.",
          "Deposit Currency Choose your account’s base currency (e.g., USD, EUR, GBP, AUD, CAD, CHF, JPY, NZD).",
          "Enter the trade size (in Units) you wish to open. The calculator will use this to compute the required margin for your position.",
          "Input the leverage applied to your account (e.g., 1:50, 1:100, 1:500). Leverage directly impacts the margin needed for each trade.",
         
        ]}
        footer="Click calculate to instantly see the exact margin required to open and maintain your trade, helping you manage risk responsibly."
      />

    </div>
  )
}

export default MarginCalculatorPage
