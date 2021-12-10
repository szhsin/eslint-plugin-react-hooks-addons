## eslint-plugin-react-hooks-addons

> ESLint plugin that finds unused dependencies in React Hooks.

[![NPM](https://img.shields.io/npm/v/eslint-plugin-react-hooks-addons.svg)](https://www.npmjs.com/package/eslint-plugin-react-hooks-addons)

## Why?

[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) is awesome for linting the dependency array of React Hooks. But it doesn't do one thing: unused dependencies in the `useEffect` or `useLayoutEffect` hooks are not reported. Variables, which are included in `useEffect`'s dependency array but not used in its function scope, are perfectly valid in certain use cases. However, it might also be a programmatic error which causes the effect hook to run unintentionally.

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

Then the `useEffect` will run whenever `user1` or `user2` changes, which is probably not your intention. Similar errors occur more frequently when the hook updater function is large and there is a long dependency array. This eslint plugin checks and reports this kind of error.

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

In your ESLint configuration file:

```json
{
  "plugins": ["react-hooks-addons"],
  "rules": {
    "react-hooks-addons/no-unused-deps": "warn"
  }
}
```

Explicitly mark a dependency as effectful with `/* effect dep */` comment:

```js
useEffect(() => {
  // ...
}, [unusedVar, /* effect dep */ effectVar]);
```

Then only the `unusedVar` will be reported as an unused dependency.

### Options
#### `customComment`
You can use a different comment to mark dependencies as effectful:
```json
"rules": {
  "no-unused-deps": ["warn", { "customComment": "effectful" }]
}
```

_Note: this eslint plugin is supposed to work in tandem with [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks), as it doesn't check things that have already been reported by that plugin._

## License

[MIT](https://github.com/szhsin/eslint-plugin-react-hooks-addons/blob/master/LICENSE) Licensed.
