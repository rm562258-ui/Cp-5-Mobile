const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Necessário para o Firebase JS SDK funcionar corretamente no Expo
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
