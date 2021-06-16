module.exports = {
  extends: [
    "@cybozu",
    "@cybozu/eslint-config/globals/kintone",
    "@cybozu/eslint-config/presets/prettier",
  ],
  globals: {
    KintoneRestAPIClient: "readonly",
    kintoneUIComponent: "readonly",
    cybozu:"readonly",
  },

  rules: {},
};
