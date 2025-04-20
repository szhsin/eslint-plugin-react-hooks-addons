import React, { useEffect, useState } from 'react';

export function App() {
  const [usedVar, setUsedVar] = useState('');
  const unusedVar = 'unused';
  const effectVar = 'effect';
  const shadowedVar = 'shadowed';

  useEffect(() => {
    setUsedVar('used');
    const shadowedVar = `no-unused-deps example ${usedVar}`;
    document.title = shadowedVar;
  }, [unusedVar, /* effect dep */ effectVar, shadowedVar]);

  React.useEffect(() => {
    setUsedVar('used');
    const shadowedVar = `no-unused-deps example ${usedVar}`;
    document.title = shadowedVar;
  }, [unusedVar, /* effect dep */ effectVar, shadowedVar]);

  return null;
}
