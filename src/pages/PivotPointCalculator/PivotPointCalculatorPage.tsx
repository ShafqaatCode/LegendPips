import InstructionsSection from '../../components/Calculators/InstructionSet'
import PivotPointCalculator from '../../components/Calculators/PivotpointCalculator/PivotPointCalculator'

import TradingSlider from '../../components/TradingCard/TradingSlider'

function PivotPointCalculatorPage() {
  return (
    <div>
    <PivotPointCalculator />
      <TradingSlider />
      <InstructionsSection
        calculatorName="Position Size"
        steps={[
          "Select your preferred pivot point method: Standard, Camarilla, Woodie’s, or DeMark’s. Each type uses a different formula to calculate support and resistance levels.",
          "High Price Enter the highest market price of the selected timeframe.",
          "Low Price Enter the lowest market price of the selected timeframe.",
          "Open Price Input the opening market price for the timeframe.",
          "Close Price Input the closing market price for the timeframe.",
          
        ]}
        footer="Calculate Click to generate the Pivot Point along with multiple Support (S1–S3) and Resistance (R1–R3) levels."
      />

    </div>
  )
}

export default PivotPointCalculatorPage
