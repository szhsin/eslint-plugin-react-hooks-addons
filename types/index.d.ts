import type { Linter } from 'eslint';
declare const plugin: {
    meta: {
        name: string;
        version: string;
    };
    configs: {
        recommended: Linter.Config;
        'recommended-legacy': Linter.LegacyConfig;
    };
    rules: {
        'no-unused-deps': import("eslint").Rule.RuleModule;
    };
};
export default plugin;
