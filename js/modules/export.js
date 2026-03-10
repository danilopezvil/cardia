export async function exportAsPng(targetNode, filename = 'business-card.png') {
  if (!window.html2canvas) throw new Error('html2canvas unavailable');
  const canvas = await window.html2canvas(targetNode, {
    backgroundColor: null,
    scale: 3,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
