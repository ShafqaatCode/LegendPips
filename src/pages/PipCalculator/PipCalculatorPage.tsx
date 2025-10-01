import InstructionsSection from '../../components/Calculators/InstructionSet'

import PipCalculator from '../../components/Calculators/PipsCalculator/PipCalculator'
import TradingSlider from '../../components/TradingCard/TradingSlider'

function PipCalculatorPage() {
  return (
    <div>
      <PipCalculator />
      <TradingSlider />
      <InstructionsSection
        calculatorName="Pip"
        steps={[
        
          "Instrument Select your preferred trading pair from our available options.",
          "Deposit Currency Choose your account’s base currency (e.g., USD, EUR, GBP, AUD, CAD, CHF, JPY, NZD).",
          "Enter the trade size (in lots) you plan to open. This allows the calculator to compute the pip value accurately based on your position size.",
         
        ]}
        footer="That’s it! Click calculate to instantly see the pip value for your chosen instrument and lot size, helping you better understand the impact of price movements on your trades."
      />

    </div>
  )
}

export default PipCalculatorPage
