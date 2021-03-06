import {GKSUCCESS, modelSetting, cacheAble, clearCache} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'
import {DataModel} from "./../tableloader";
import Auth from "./../model_private/Auth";
import * as types from './../constants'

@modelSetting({
    __Auth:async ({req})=>{
        //为了加速调试，可临时模拟指定UID
        // return {uID:921303}

        //非后台的用户验证，解析header中的token信息
        return await Auth.parseUserInfoFromRequest({req})
    }
})
class GKModelA {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    static async hello({name}) {
        //抛出错误...
        // throw types.ERROR_PERSONINFO_NOT_READY({name})
        return {message: `this is a message from Api: got name [${name}]`}
    }

    @cacheAble({
        cacheKeyGene: ({name}) => {
            return `hello-${name}`
        }
    })
    /**
     * 测试hello
     *
     * @param name
     * @returns {Promise.<{message: string}>}
     */
    static async getArticle({uID, name}) {
        console.log(GKErrors._SERVER_ERROR('错误1'))
        await DataModel.DemoUser.create({name:`huang.${Math.random()}`, age:Math.random()})
        let user = await DataModel.DemoUser.findOne({order:[["id","desc"]]})
        if (!user) {
            return {message: `hello.${name}: there are nobody!`}
        } else {
            return {message: `hello.${name}:there has one girl,name:${user.name} ${user.age} years old!`}
        }
    }

    static async customResponseResultStruck() {
        //TODO:.....

        //class2api内部会判断，如果API方法返回的是Function，则框架会把函数的运行执行结果返回给客户端，以实现自定义特殊的response结构
        return () => {
            return {data: {name: 'huangyong'}, errorCode: 123}
        }
    }

}

export default GKModelA