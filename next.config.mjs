/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Set to false to disable type-checking during build
    ignoreBuildErrors: true,
  }, 
    images: {
        domains: ['res.cloudinary.com'], // Allow images from Cloudinary
      },

      
};

export default nextConfig;
