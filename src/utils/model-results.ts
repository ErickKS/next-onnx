interface ResultsProps {
  label: number;
  confidence: number;
}

const labels = ["bike-left", "bike-right", "crown", "handlebar", "saddle", "wheel"];

export function resultTransform(results: ResultsProps[]) {
  const transformedValues = results.map((result) => {
    const labelValue = result.label;
    const stringValue = labels[labelValue];

    const roundedValue = +result.confidence.toFixed(2);

    return { ...result, label: stringValue, confidence: roundedValue };
  });

  return transformedValues;
}
