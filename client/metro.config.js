const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("cjs");

const finalConfig = withNativewind(config);
const prev = finalConfig.resolver.resolveRequest;
const realReactNative = path.join(
  path.dirname(require.resolve("react-native/package.json")),
  "index.js"
);

// Keep expo-asset's `import { AssetRegistry } from 'react-native'` on the real RN module,
// so it shares the registry instance Metro's asset stubs write into.
finalConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native" && context.originModulePath.includes(`${path.sep}expo-asset${path.sep}`)) {
    return { type: "sourceFile", filePath: realReactNative };
  }
  return (prev ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = finalConfig;