/** @type {import('next').NextConfig} */

const nextConfig = {
    sassOptions: {
        prependData: `@import "@/app/variables.scss";`,
    }
};

export default nextConfig;
