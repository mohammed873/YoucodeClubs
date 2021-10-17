module.exports = {
  reactStrictMode: false,
  env : {
    MONGO_URI : "mongodb+srv://mohammed:med@1997@cluster0.9acph.mongodb.net/youcodeClubs?retryWrites=true&w=majority",
    TOKEN_SuperAdmin : "secret_key_super_admin",
    ADMIN_EMAIL :"projectmailtestyc@gmail.com",
    ADMIN_PASSWORD : "youcode2020",
    TOKEN_SUPER_ADMIN : "AZFSDHGFBWUY12",
    TOKEN_ADMINS : "LKGT6DHGFBWGGDFD566",
    TOKEN_USER : "LKGT6DHGFBW67623"
  },
  webpack: (config) => {
    config.resolve.fallback = {fs : false ,  crypto: false , https : false , http : false , zlib : false,};
    return config
  },
}
