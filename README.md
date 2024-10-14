## eslint-plugin-react-hooks-addons

> ESLint rule to check unused and potentially unnecessary dependencies in React Hooks.

[![NPM](https://img.shields.io/npm/v/eslint-plugin-react-hooks-addons.svg)](https://www.npmjs.com/package/eslint-plugin-react-hooks-addons)
[![npm downloads](https://img.shields.io/npm/dt/eslint-plugin-react-hooks-addons)](https://www.npmjs.com/package/eslint-plugin-react-hooks-addons)

## Why?

[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) is awesome for linting the dependency array of React Hooks. But it doesn't do one thing: unused dependencies in the `useEffect` or `useLayoutEffect` hooks are not reported. Unused variables in `useEffect`'s dependency array are perfectly valid in some use cases. However, they might be unnecessary in some other cases which cause the effect hook to run unintentionally.

Take the following code as an example:

```js
const [user1, setUser1] = useState();
const [user2, setUser2] = useState();

useEffect(() => {
  fetch(`someUrl/${user1}`).then(/* ... */);
  fetch(`someUrl/${user2}`).then(/* ... */);
}, [user1, user2]);
```

Next day you update the code and remove the second `fetch` but forget to remove `user2` from the dependency array:

```js
const [user1, setUser1] = useState();
const [user2, setUser2] = useState();

useEffect(() => {
  fetch(`someUrl/${user1}`).then(/* ... */);
}, [user1, user2]);
```

Then the `useEffect` will run whenever `user1` or `user2` changes, which is probably not your intention. Similar errors occur more frequently when the hook callback function is large and there is a long dependency array. This eslint plugin checks and reports this kind of error.

**What if I have a value which is not used in the hook function scope but I want the effect hook to run whenever that value has changed?**
<br/>
<br/>
You could prepend a `/* effect dep */` comment to the value in dependency array then it will be skipped during linting. It brings an addition benefit: the value is explicitly marked as effectful so that other people coming across the code will understand it's not a programmatic error.

```diff
useEffect(() => {
  fetch(`someUrl/${user1}`).then(/* ... */);
- }, [user1, user2]);
+ }, [user1, /* effect dep */ user2]);
```

## Install

with npm

```bash
npm install -D eslint-plugin-react-hooks-addons
```

or with Yarn

```bash
yarn add -D eslint-plugin-react-hooks-addons
```

## Usage

### Flat config

```js
import reactHooksAddons from 'eslint-plugin-react-hooks-addons';

export default [
  reactHooksAddons.configs.recommended
  // other configs...
];
```

Or, use a custom configuration:

```js
import reactHooksAddons from 'eslint-plugin-react-hooks-addons';

export default [
  // other configs...
  {
    plugins: {
      'react-hooks-addons': reactHooksAddons
    },
    rules: {
      'react-hooks-addons/no-unused-deps': 'warn'
    }
  }
];
```

### Legacy config

```json
{
  "extends": ["plugin:react-hooks-addons/recommended-legacy"]
}
```

Or, use a custom configuration:

```json
{
  "plugins": ["react-hooks-addons"],
  "rules": {
    "react-hooks-addons/no-unused-deps": "warn"
  }
}
```

### Effect deps

Explicitly mark a dependency as effectful with `/* effect dep */` comment:

```js
useEffect(() => {
  // ...
}, [unusedVar, /* effect dep */ effectVar]);
```

Then only the `unusedVar` will be reported as an unused dependency.

### Options

#### `effectComment`

You can use a different comment to mark dependencies as effectful:

```json
"rules": {
  "react-hooks-addons/no-unused-deps": [
    "warn",
    {
      "effectComment": "effectful"
    }
  ]
}
```

#### `additionalHooks`

The rule checks `useEffect` and `useLayoutEffect` hooks by default. It can be configured to check dependencies of custom hooks with the `additionalHooks` option. This option accepts a `pattern` key which is a regex pattern. If you set the `replace` key to `true`, it would replace the default hooks.

```json
"rules": {
  "react-hooks-addons/no-unused-deps": [
    "warn",
    {
      "additionalHooks": {
        "pattern": "useMyCustomHook|useMyOtherCustomHook",
        "replace": true
      }
    }
  ]
}
```

_Note: this eslint plugin is supposed to work in tandem with [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks), as it doesn't check things that have already been reported by that plugin._

## License

[MIT](https://github.com/szhsin/eslint-plugin-react-hooks-addons/blob/master/LICENSE) Licensed.
