
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const GRAPHQL_ENDPOINT: string;
	export const WORDPRESS_URL: string;
	export const npm_package_devDependencies__storybook_addon_links: string;
	export const npm_package_devDependencies__storybook_test: string;
	export const _VOLTA_TOOL_RECURSION: string;
	export const npm_package_devDependencies_prettier: string;
	export const TERM_PROGRAM: string;
	export const npm_package_devDependencies_eslint_plugin_svelte: string;
	export const npm_package_devDependencies_schema_dts: string;
	export const npm_package_dependencies_cheerio: string;
	export const NODE: string;
	export const NVM_CD_FLAGS: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const npm_package_devDependencies_typescript: string;
	export const INIT_CWD: string;
	export const SHELL: string;
	export const TERM: string;
	export const npm_package_devDependencies__storybook_addon_essentials: string;
	export const npm_package_devDependencies_vite: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const npm_package_devDependencies_svelte_hamburgers: string;
	export const npm_package_scripts_lint: string;
	export const npm_package_peerDependencies_ts_node: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_scripts_dev: string;
	export const CURSOR_TRACE_ID: string;
	export const MallocNanoZone: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const VOLTA_HOME: string;
	export const npm_package_private: string;
	export const npm_package_devDependencies__storybook_addon_interactions: string;
	export const npm_package_devDependencies__storybook_blocks: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_registry: string;
	export const PNPM_HOME: string;
	export const ZSH: string;
	export const NVM_DIR: string;
	export const USER: string;
	export const npm_package_scripts_codegen: string;
	export const LS_COLORS: string;
	export const npm_package_scripts_check_watch: string;
	export const npm_package_devDependencies_graphql_tag: string;
	export const COMMAND_MODE: string;
	export const npm_package_scripts_build_storybook: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const SSH_AUTH_SOCK: string;
	export const npm_package_devDependencies_eslint_plugin_storybook: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_package_devDependencies__storybook_sveltekit: string;
	export const npm_package_devDependencies_eslint: string;
	export const npm_package_devDependencies_postcss: string;
	export const npm_package_devDependencies_tiny_invariant: string;
	export const npm_execpath: string;
	export const PAGER: string;
	export const npm_package_devDependencies_svelte: string;
	export const LSCOLORS: string;
	export const npm_package_devDependencies__graphql_codegen_cli: string;
	export const npm_config_frozen_lockfile: string;
	export const PATH: string;
	export const LaunchInstanceID: string;
	export const __CFBundleIdentifier: string;
	export const PWD: string;
	export const npm_package_devDependencies__storybook_addon_svelte_csf: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_package_dependencies_svelte_inview: string;
	export const npm_command: string;
	export const npm_package_scripts_preview: string;
	export const npm_lifecycle_event: string;
	export const LANG: string;
	export const npm_package_name: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_devDependencies_storybook: string;
	export const npm_package_dependencies__urql_svelte: string;
	export const npm_package_dependencies_svelte_bricks: string;
	export const NODE_PATH: string;
	export const npm_package_scripts_build: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const XPC_FLAGS: string;
	export const npm_package_devDependencies__chromatic_com_storybook: string;
	export const npm_package_devDependencies_eslint_config_prettier: string;
	export const npm_package_dependencies__graphql_codegen_typescript_generic_sdk: string;
	export const npm_config_node_gyp: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies__graphql_codegen_introspection: string;
	export const npm_package_devDependencies__graphql_codegen_typescript_document_nodes: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const HOME: string;
	export const SHLVL: string;
	export const npm_package_type: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const npm_package_scripts_storybook: string;
	export const npm_package_devDependencies__graphql_codegen_typescript: string;
	export const npm_package_devDependencies_graphql: string;
	export const HOMEBREW_PREFIX: string;
	export const npm_package_devDependencies__storybook_svelte: string;
	export const npm_package_devDependencies_ts_node: string;
	export const npm_package_peerDependencies__types_node: string;
	export const LESS: string;
	export const LOGNAME: string;
	export const npm_package_scripts_format: string;
	export const npm_lifecycle_script: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const NVM_BIN: string;
	export const npm_package_eslintConfig_extends_0: string;
	export const npm_config_user_agent: string;
	export const GIT_ASKPASS: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const npm_package_devDependencies__types_node: string;
	export const DISPLAY: string;
	export const npm_package_dependencies__urql_core: string;
	export const SECURITYSESSIONID: string;
	export const npm_package_scripts_check: string;
	export const COLORTERM: string;
	export const npm_package_devDependencies__graphql_codegen_typescript_operations: string;
	export const npm_node_execpath: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_SITE_URL: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		GRAPHQL_ENDPOINT: string;
		WORDPRESS_URL: string;
		npm_package_devDependencies__storybook_addon_links: string;
		npm_package_devDependencies__storybook_test: string;
		_VOLTA_TOOL_RECURSION: string;
		npm_package_devDependencies_prettier: string;
		TERM_PROGRAM: string;
		npm_package_devDependencies_eslint_plugin_svelte: string;
		npm_package_devDependencies_schema_dts: string;
		npm_package_dependencies_cheerio: string;
		NODE: string;
		NVM_CD_FLAGS: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		npm_package_devDependencies_typescript: string;
		INIT_CWD: string;
		SHELL: string;
		TERM: string;
		npm_package_devDependencies__storybook_addon_essentials: string;
		npm_package_devDependencies_vite: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		npm_package_devDependencies_svelte_hamburgers: string;
		npm_package_scripts_lint: string;
		npm_package_peerDependencies_ts_node: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_scripts_dev: string;
		CURSOR_TRACE_ID: string;
		MallocNanoZone: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		VOLTA_HOME: string;
		npm_package_private: string;
		npm_package_devDependencies__storybook_addon_interactions: string;
		npm_package_devDependencies__storybook_blocks: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_registry: string;
		PNPM_HOME: string;
		ZSH: string;
		NVM_DIR: string;
		USER: string;
		npm_package_scripts_codegen: string;
		LS_COLORS: string;
		npm_package_scripts_check_watch: string;
		npm_package_devDependencies_graphql_tag: string;
		COMMAND_MODE: string;
		npm_package_scripts_build_storybook: string;
		PNPM_SCRIPT_SRC_DIR: string;
		SSH_AUTH_SOCK: string;
		npm_package_devDependencies_eslint_plugin_storybook: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_package_devDependencies__storybook_sveltekit: string;
		npm_package_devDependencies_eslint: string;
		npm_package_devDependencies_postcss: string;
		npm_package_devDependencies_tiny_invariant: string;
		npm_execpath: string;
		PAGER: string;
		npm_package_devDependencies_svelte: string;
		LSCOLORS: string;
		npm_package_devDependencies__graphql_codegen_cli: string;
		npm_config_frozen_lockfile: string;
		PATH: string;
		LaunchInstanceID: string;
		__CFBundleIdentifier: string;
		PWD: string;
		npm_package_devDependencies__storybook_addon_svelte_csf: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_package_dependencies_svelte_inview: string;
		npm_command: string;
		npm_package_scripts_preview: string;
		npm_lifecycle_event: string;
		LANG: string;
		npm_package_name: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_devDependencies_storybook: string;
		npm_package_dependencies__urql_svelte: string;
		npm_package_dependencies_svelte_bricks: string;
		NODE_PATH: string;
		npm_package_scripts_build: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		XPC_FLAGS: string;
		npm_package_devDependencies__chromatic_com_storybook: string;
		npm_package_devDependencies_eslint_config_prettier: string;
		npm_package_dependencies__graphql_codegen_typescript_generic_sdk: string;
		npm_config_node_gyp: string;
		XPC_SERVICE_NAME: string;
		npm_package_version: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies__graphql_codegen_introspection: string;
		npm_package_devDependencies__graphql_codegen_typescript_document_nodes: string;
		npm_package_devDependencies_autoprefixer: string;
		npm_package_devDependencies_svelte_check: string;
		HOME: string;
		SHLVL: string;
		npm_package_type: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		npm_package_scripts_storybook: string;
		npm_package_devDependencies__graphql_codegen_typescript: string;
		npm_package_devDependencies_graphql: string;
		HOMEBREW_PREFIX: string;
		npm_package_devDependencies__storybook_svelte: string;
		npm_package_devDependencies_ts_node: string;
		npm_package_peerDependencies__types_node: string;
		LESS: string;
		LOGNAME: string;
		npm_package_scripts_format: string;
		npm_lifecycle_script: string;
		VSCODE_GIT_IPC_HANDLE: string;
		NVM_BIN: string;
		npm_package_eslintConfig_extends_0: string;
		npm_config_user_agent: string;
		GIT_ASKPASS: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		npm_package_devDependencies__types_node: string;
		DISPLAY: string;
		npm_package_dependencies__urql_core: string;
		SECURITYSESSIONID: string;
		npm_package_scripts_check: string;
		COLORTERM: string;
		npm_package_devDependencies__graphql_codegen_typescript_operations: string;
		npm_node_execpath: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_SITE_URL: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
