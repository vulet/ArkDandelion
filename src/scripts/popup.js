import {crypto} from '@arkecosystem/crypto';
import axios from 'axios';
import QRCode from 'qrcode';
import browser from 'webextension-polyfill';


browser.tabs.query({'active': true, 'lastFocusedWindow': true})
.then((tabs) => {
  // the current tab regex'd down to domain (e.g. notreal.com )
  const webUrl = tabs[0].url;
  const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img;
  const domain = webUrl.match(regex);
  const knownUrl = domain+'/.well-known/ark/address.json';

browser.storage.local.get(['server', 'bip39', 'network'])
.then((result) => {
  
  const server = result.server;

  const updateStatus = (value) => {
    document.getElementById('status').textContent = value;
  };

  const updateDomain = (value) => {
    document.getElementById('webowner').innerHTML =
    domain+' has set a tipping address:<br><b>'+value+'</b>';
  };

  if (server !== '' && server !== undefined) {
    browser.runtime.sendMessage({msg: 'start', server: `${server}`})
    .then((response) => {
    /* Removed until there's a workaround on the extra permissions required
    in the manifest.
      axios.get(knownUrl)
      .then(function(response) {
        const domainArk = response.data.data.address;
        if (crypto.validateAddress(domainArk, 23) == true) {
          QRCode.toCanvas('ark:'+domainArk, {errorCorrectionLevel: 'H'},
            function(err, canvas) {
              document.getElementById('tipcontainer').appendChild(canvas);
            });
          updateDomain(domainArk);
        }
      }); */

      axios.get(result.server+'api/v2/transactions?recipientId='+result.bip39)
      .then(function(response) {
        for (let i = 4; i > -1; i--) {
          document.getElementById('tx'+i).innerText += 
          response.data.data[i].vendorField;
          display('.tx'+i);
        }
      });

      if (result.network !== 'ARK') {
        updateStatus('You are connected to the ' +result.network+ ' network. '+
          'Only the Ark network is supported at this time.');
      }
      else {
        updateStatus(result.bip39);
        display('.commands__content--holder');
      }
    });
  }

  else if (server === '' || server === undefined) {
    setTimeout(() => {
      browser.runtime.openOptionsPage();
    }, 500);
  }
});

document.getElementById('qrcode--holder').addEventListener('click', () => {
  const byteCheck = Buffer.byteLength(document.getElementById('vendorfield--value').value);
  if ( byteCheck > 64) {
    document.getElementById('container').innerHTML =
    'This is '+byteCheck+' bytes, messages over 64'+
    ' are not supported at this time.';
  }

  browser.storage.local.get(['bip39']).then((result) => {
    QRCode.toCanvas('ark:'+result.bip39+'?amount=0.00000001&vendorField='+
      document.getElementById('vendorfield--value').value,
      {errorCorrectionLevel: 'H'}, function(err, canvas) {
        document.getElementById('container').innerHTML = null;
        document.getElementById('container').appendChild(canvas);
      });
  });
});

document.getElementById('button__messages--holder').addEventListener('click', () => {
  display('.vendorfield__info--holder');
});

document.getElementById('button__createtx--holder').addEventListener('click', () => {
  browser.tabs.create({url: 'createtx.html'});
});

document.getElementById('webowner__content--holder').addEventListener('click', () => {
  display('.webowner__info--holder');
});

function display(className) {
  const element = document.querySelector(className);
  element.classList.toggle('d-none');
}
});