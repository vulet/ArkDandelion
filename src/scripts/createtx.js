import browser from 'webextension-polyfill';
import QRCode from 'qrcode';


document.addEventListener('DOMContentLoaded', () => {
  browser.storage.local.get(['network']).then((result) => {
    show_network.innerHTML = result.network;
  });

  const qrBuilder = async () => {
    const recipient = document.getElementById('recipient--value').value;
    const vendorField = document.getElementById('vendorfield--value').value;
    const amount = document.getElementById('amount--value').value;
    const byteCheck = Buffer.byteLength(vendorField);
    if (byteCheck > 64) {
      document.getElementById('container').innerHTML = `This is ${byteCheck} bytes, messages over 64`
       + ' are not supported at this time.';
      return;
    }
    QRCode.toCanvas(`ark:${recipient}?amount=${amount}&vendorField=${
      vendorField}`,
    { errorCorrectionLevel: 'H' }, (err, canvas) => {
      document.getElementById('container').innerHTML = null;
      document.getElementById('container').appendChild(canvas);
    });
  };

  // summon QR
  document.getElementById('button__confirm').addEventListener('click', () => {
    qrBuilder();
  });

  // display QR
  const displayTx = document.getElementById('displayTx');
  const confirm = document.getElementById('button__confirm');

  confirm.onclick = function () {
    displayTx.style.display = 'block';
  };

  window.onclick = function (event) {
    if (event.target === displayTx) {
      displayTx.style.display = 'none';
    }
  };
});
