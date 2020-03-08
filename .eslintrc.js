module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
  plugins: ["react-hooks"],
  settings: {
    "import/resolver": {
      "node": {
        "moduleDirectory": ["node_modules", "src/"],
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    'react/jsx-filename-extension': 0,
  },
}
