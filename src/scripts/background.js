import {crypto} from '@arkecosystem/crypto';
import axios from 'axios';
import browser from 'webextension-polyfill';


let currentTab;
let hasTX;

browser.runtime.onMessage.addListener(async (request, sender, response) => {
  if (request.msg == 'start') {
  // notification handling
    const tx = 'read';
    browser.storage.local.set({tx: tx}).then(() => {
      updateTab();
    });
    return getNodeConfig(request.server)
        .then((config) => {
          return config;
        });
  }
});

async function getNodeConfig(server) {
  const config = await axios({
    url: server+'api/v2/node/configuration',
  });
  return config;
};

/* Address generation,
derived from URL */
const updateBip39 = () => {
  browser.tabs.query({'active': true, 'lastFocusedWindow': true}).then((tabs) => {
    // light regex to standardize
    const bip39regex = tabs[0].url.replace(/^https?:\/\//, '');
    const bip39 = crypto.getAddress(crypto.getKeys(bip39regex).publicKey, 23);
    browser.storage.local.set({bip39: bip39});
  });
};

// notification icon
function updateIcon() {
  browser.browserAction.setIcon({
    path: hasTX ? {
      // bell icon
      38: 'assets/notification.png',
    } : {
      // default icon
      38: 'assets/favicon-32.png',
    },
    tabId: currentTab.id,
  });
  browser.browserAction.setTitle({
    title: hasTX ? 'New notification' : 'Ark Dandelion',
    tabId: currentTab.id,
  });
}

/*
where we are, whether to notify. */
function updateTab(tabs) {
  function checkTab(tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];
      browser.storage.local.get(['server', 'bip39', 'tx']).then((result) => {
        axios.get(result.server+'api/v2/transactions?recipientId='+result.bip39)
            .then((response) => {
              const tx = response.data.data[0].id;
              if (result.tx !== (undefined || tx || 'read')) {
                // we add a new notification
                hasTX = response.data.data[0].id;
                browser.storage.local.set({tx: tx});
                updateIcon();
              }
              if (result.tx == 'read' || undefined) {
                // we reset icon
                hasTX = undefined;
                updateIcon();
              }
            });
      });
    }
  }

  // running, running..
  updateBip39();
  const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then(checkTab);
}

// tab movement
browser.tabs.onUpdated.addListener(updateTab);
browser.tabs.onActivated.addListener(updateTab);
browser.windows.onFocusChanged.addListener(updateTab);
updateTab();


