/* Wealth Quadrant Analyzer - PDF Profile Module
   Uses print CSS by injecting report sections into Analysis before print/PDF capture.
*/
window.WQPDFProfile = (() => {
  function prepareAnalysisForPrint() {
    window.WQAnalysisProfile?.injectIntoAnalysis?.();
    document.querySelectorAll('textarea[id^="cb-"]').forEach(ta => {
      const key = ta.id.replace('cb-', '');
      let printDiv = document.getElementById('cp-' + key);
      if (!printDiv) {
        printDiv = document.createElement('div');
        printDiv.className = 'commentary-print';
        printDiv.id = 'cp-' + key;
        ta.parentNode.insertBefore(printDiv, ta.nextSibling);
      }
      printDiv.textContent = ta.value || '';
    });
  }

  function printReport() {
    prepareAnalysisForPrint();
    window.print();
  }

  function patchExistingPrintButton() {
    const btn = document.getElementById('btn-pdf');
    if (!btn) return;
    btn.onclick = printReport;
  }

  return {
    prepareAnalysisForPrint,
    printReport,
    patchExistingPrintButton
  };
})();
