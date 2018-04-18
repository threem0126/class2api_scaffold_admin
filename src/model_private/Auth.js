import Promise from 'bluebird'
import request from 'request'
import {setting_redisConfig, cacheAble} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'
import _config from "./../config.js" ;


let {redis} = _config
setting_redisConfig(redis)
 
Promise.promisifyAll(request)

const querySiteUserInfoByApi = async ({studentInfo}) => {
    try {
        //TODO:查询用户账户数据库
        return null
    } catch (err) {
        return null
    }
}

const getUserFromDebugToken = async ({token})=> {
    if (token === 'asdqwerzxcsdfg123445765687') {
        console.log(require("./../fixture/user.json"))
        return require("./../fixture/user.json")
    } else {
        return null
    }
}

export default class {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    @cacheAble({
        cacheKeyGene: ({req}) => {
            return req.header('token') || ''
        }
    })
    static async parseUserInfoFromRequest({req}) {
        let token = req.header('token') || req.cookies.student || ''
        if (token.split(",").length === 3) {
            //从赶考主站接口中查询用户信息
            let gankaouserInfo = await querySiteUserInfoByApi({studentInfo: token})
            //如果主站中信息不存在，则取模拟信息
            if (!gankaouserInfo) {
                gankaouserInfo = await getUserFromDebugToken({token})
            }
            if (!gankaouserInfo) {
                return {user_id: 0, userInfo: null}
            } else {
                let {error} = gankaouserInfo
                if (error) {
                    throw new Error(JSON.stringify(error))
                }
            }
            console.log(gankaouserInfo)

            //region 返回数据结构（此处仅示例，各个项目实现都不同）

            // { user:
            //     { id: '773995',
            //         nick_name: 'Bob',
            //         mobile: '13795251962',
            //         real_name: '李波',
            //         user_type: '学生',
            //         logo: 'http://q.qlogo.cn/qqapp/101234783/21297FB5A571E119A14217B63D559AE3/100',
            //         userTypeId: 1 },
            //         loginMode:
            //             [ { id: '52677',
            //                 openid: 'o_eB6wWE8tZqGJ3ThZEqDPsYQx-k',
            //                 way: '2',
            //                 unionId: 'oT0z5sp763Bk6b7ODuxcuLgyBI5Y',
            //                 wayName: '微信',
            //                 openids: [] },
            //                 { id: '187619',
            //                     openid: '21297FB5A571E119A14217B63D559AE3',
            //                     way: '1',
            //                     unionId: null,
            //                     wayName: 'QQ',
            //                     openids: [] },
            //                 { id: '354330',
            //                     openid: 'o_eB6wXWVY_7BdXM4_SqTnFAZ0eY',
            //                     way: '2',
            //                     unionId: 'oT0z5ssW6X58qXL2FFLQCRpOepqU',
            //                     wayName: '微信',
            //                     openids: [] } ],
            //                 grades: [ { id: '11', name: '高二' } ] }

            //endregion

            let {user} = gankaouserInfo
            return {user_id: user.id, userInfo: gankaouserInfo};
        } else {
            //throw GKErrors._PARAMS_VALUE_EXPECT({token})
            console.error(`解析cookie中token时，值的格式不符(${token})，期待的是2个逗号间隔的字符串`)
            return {user_id: 0, userInfo: null};
        }
    }
}


