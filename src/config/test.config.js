/*
 */

export const config = {
    appName: '{projectName}',
    PORT: 3002,
    mysql: {
        host: "{host}",
        port: process.env.SQLPORT || "{port}",
        user: "{user}",
        password: "{password}",
        charset: "{charset}",
        database: "{database}",
        reset_key: {
            key1: '123234537569',
            key2: 'wrq5hfoiuy12344376'
        }
    },
    redis: {
        host: "127.0.0.1",
        port: 6379,
        cache_prefx: '{cache_prefx}',
        defaultExpireSecond: 10 * 60
    }
}

if(config.redis.cache_prefx === '{cache_prefx}')
    console.error(`请修改config配置中redis的key前缀（${ __dirname }）`)
if(config.mysql.host === '{host}')
    console.error(`请修改config配置中mysql链接信息（${ __dirname }）`)