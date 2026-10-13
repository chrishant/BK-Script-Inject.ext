// Central registry: add or edit supported routes and their controller scripts here.
// The service worker imports this file; keep it free of DOM-dependent code.
globalThis.BK_INJECTOR_CONFIG = {
  targets: [
    {
      id: "bk-bom-assistant",
      name: "BK BOM Assistant",
      protocol: "https:",
      host: "windeson.bluekaktus.com",
      pathname: "/Dashboard/Index",
      hash: "#/order/bom",
      scriptUrl:
        "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/material-assistant.js",
    },
    {
      id: "bk-po-assist",
      name: "PO Assistant",
      protocol: "https:",
      host: "windeson.bluekaktus.com",
      pathname: "/Dashboard/Index",
      hash: "#/procurement/purchase-order",
      scriptUrl:
        "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/USE-IT.js",
    },
  ],
};
