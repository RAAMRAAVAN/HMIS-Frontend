module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "node",
      args: "--experimental-loader node:module --enable-source-maps ./node_modules/next/dist/bin/next start -p 3000",
      cwd: "./",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
