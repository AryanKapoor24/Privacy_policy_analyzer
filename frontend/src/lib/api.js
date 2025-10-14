export async function analyzePdf(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Analyze request failed: ${response.status} ${text}`);
  }

  // Expected shape:
  // {
  //   originalText: string,
  //   simplifiedText: string,
  //   stats?: { complexityReduction?: number, keyPoints?: number, readingSpeedGain?: number }
  // }
  const data = await response.json();
  return data;
}
