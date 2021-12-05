import { useEffect } from "react";

export function App() {
  const usedVar = "used";
  const unusedVar = "unused";
  const effectVar = "effect";
  const maskedVar = "masked";

  useEffect(() => {
    const maskedVar = `no-unused-deps example ${usedVar}`;
    document.title = maskedVar;
  }, [usedVar, unusedVar, /* effect dep */ effectVar, maskedVar]);

  return null;
}
