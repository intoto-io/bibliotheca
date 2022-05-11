# eslint-config-intoto

Shared eslint config for Intoto projects using JavaScript / TypeScript. It's based on [eslint-config-airbnb]()

## Usage

First install the package including the package's peer dependency to our project:

```bash
npx install-peerdeps --dev @intoto-dev/eslint-config-intoto
```

Then we can use the config in our project by adding the following to our eslint config (most likely in `.eslintrc` or `package.json`):

```json
{
  "extends": ["@intoto-dev/eslint-config-intoto"]  
}
```
