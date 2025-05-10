/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                dns: false,
                child_process: false,
                stream: false,
                crypto: false,
                os: false,
                path: false,
                zlib: false,
                http: false,
                https: false,
                util: false,
                assert: false,
                url: false,
                buffer: false,
                process: false,
            };
        }
        return config;
    },
}

module.exports = nextConfig 