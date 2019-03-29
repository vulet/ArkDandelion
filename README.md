![Ark Dandelion](https://i.imgur.com/lgcXug3.png)

## What is Ark Dandelion?

The Dandelion browser extension is a decentralized messaging application built on the Ark network. The extension allows you to comment on any webpage. This is done through crafting deterministic ARK addresses, and then using this application as a directory system. The URLs are standardized through a [regular expression](https://github.com/vulet/ArkDandelion#Regex). This is then used to generate an ARK address using the URL as a `bip39` seed. The initial goal of Ark Dandelion was to create a browser extension that could act as a lite-client and also allow you to tip website owners. The lite-client was built, however, I have decided to push all transactions signing to QR codes. This means more functionality can be added to the QR builder given that an AIP like Munich's [AIP-26](https://github.com/ArkEcosystem/AIPs/blob/master/AIPS/aip-26.md) is rolled out. The tipping functionality is not supported at this time, which was done by placing a `.well-known/ark/address.json` file on your web server The schema for the .well-known file followed the same schema in the `/api/v2/wallets/<youraddress>` endpoint. Below, I list an example:
```json
{
  "data": {
    "address": "AZofKsJUY4xRAxmt7Ue5XtwxjnXH1kXHhP",
    "publicKey": "033927e0c6812056de9222e85ea5ad6da36f26b6b30b190f9cbb9e34993d1f2882",
    "username": "joan_of_ark",
    "secondPublicKey": null,
    "balance": 126837521378,
    "isDelegate": true,
    "vote": "02630c5942b003b2c4ec184862e4ac41578e0a79777da1332b384d3169f4d5eadd"
  }
}
```

This feature has been removed because of [extra permissions](https://github.com/EFForg/https-everywhere/issues/16377#issuecomment-415492846) it required to resolve CORS errors, even though validation is done on the input. It will be reimplemented given that we can find a way around the extra permissions, or alternatively pushed to another build. A CLI/script had been considered to form the .well-known file, but it seems out of scope, as there is too many different configurations that people use for their web servers. Essentially, you're placing the file where the rest of your public files are.

## Download from the store
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/ark-dandelion/)

[Chrome](https://chrome.google.com/webstore/detail/ark-dandelion/kloebenmmegdanbbhgmnololeelcclhe)

## Build from source
If you do not have `yarn`, you will need to install it.

`npm install -g yarn`

`git clone https://github.com/vulet/ArkDandelion`

` cd ArkDandelion && yarn install && yarn run build`

**Chrome**

1. [chrome://extensions/](chrome://extensions/)
2. Toggle developer options.
3. Load unpacked.
4. Select `build/chrome` directory.

**Firefox** 

1. [about:debugging](about:debugging)
2. Load temporary add-on.
2. Select the `manifest` file built in the `build/firefox` directory.


## Regex
URL to bip39 address - `replace(/^https?:\/\//, '');`

## Images

![Connect](https://i.imgur.com/FpxsTrI.png)

![Tip image](https://i.imgur.com/KuMtHY9.png)

