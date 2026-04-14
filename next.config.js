/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite que el webhook de MP reciba el body sin parsear
  experimental: {
    serverComponentsExternalPackages: ['mercadopago'],
  },
}

module.exports = nextConfig