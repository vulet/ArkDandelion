import browser from 'webextension-polyfill';

browser.tabs.query({ active: true, lastFocusedWindow: true })
  .then((tabs) => {
    browser.storage.local.get(['server']).then((result) => {
      const { server } = result;
      const updateContent = (value) => {
        document.getElementById('nodeSymbol').textContent = value.data.data.symbol;
        document.getElementById('nodeToken').textContent = value.data.data.token;
        document.getElementById('nodeExplorer').textContent = value.data.data.explorer;
        document.getElementById('nodeVersion').textContent = value.data.data.version;
      };

      browser.runtime.sendMessage({
        msg: 'start',
        server: `${server}`,
      })
        .then((response) => {
          browser.storage.local.set({ network: response.data.data.token });
          updateContent(response);
          display('.buttons__content--holder');
        });
    });
  });

// current server
browser.storage.local.get(['server']).then((result) => {
  const server = `${result.server}`;
  if (server === 'undefined') {
    document.getElementById('user__server--value').value = '';
  } else {
    document.getElementById('user__server--value').value = server;
  }
});

const saveData = () => {
  const server = document.getElementById('user__server--value').value;
  // sanitize our user
  if (server.endsWith('/') === true) {
    if ((server.startsWith('http://')) || (server.startsWith('https://')) === true) {
      browser.storage.local.set({ server });
    } else {
      browser.storage.local.set({ server: `http://${server}` });
    }
  } else if ((server.startsWith('http://')) || (server.startsWith('https://')) === true) {
    browser.storage.local.set({ server: `${server}/` });
  } else {
    browser.storage.local.set({ server: `http://${server}/` });
  }

  // stay fresh
  browser.tabs.getCurrent().then((tabInfo) => {
    browser.tabs.reload(tabInfo.id);
  });
};

// go home
const closePage = () => {
  browser.tabs.getCurrent().then((tabInfo) => {
    browser.tabs.remove(tabInfo.id);
  });
};

function display(className) {
  const element = document.querySelector(className);
  element.classList.toggle('d-none');
}

// save button
document.getElementById('button__submit').addEventListener('click', () => {
  saveData();
});

// close button
document.getElementById('button__close').addEventListener('click', () => {
  closePage();
});

// quick fire
document.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    saveData();
  }
});
