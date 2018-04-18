import should from 'should';
import {ApiDesc, WebInvokeHepler, setApiRoot, save2Doc} from 'class2api/testhelper'

JSON.stringifyline = function (Obj) {
    return JSON.stringify(Obj, null, 2)
}

//跨用例的"全局"变量，保存测试期间的全局共享数据
//在用例执行过程中，也可以在上文用例中暂存数据在_run对象里，然后在下文用例中获取
let _run = {
    accounts: {
        user1: {
            //普通用户的权限token
            token: 'token-111'
        },
        admin: {
            //后台管理员的权限jwtoken
            jwtoken: 'jwtoken-333'
        }
    }
}
const remote_api = `http://127.0.0.1:3002`;

//配置远程请求endpoint
setApiRoot(remote_api)

describe('接口服务', function () {

    //region after 在本区块的所有测试用例之后执行
    after(function () {
        //将所有标记了ApiDesc实参的接口所执行的结果，汇总保存到Api文档
        save2Doc({save2File:'api.MD'})
    });
    //endregion

    it('/a2/hello 以get方式请求', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1, 'get')(
            '/a2/hello',
            {name: "haungyong"},
            ApiDesc(`hello测试方法`)
        )
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('haungyong').should.be.above(-1)
    })

    it('/gkmodela/getArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/gkmodela/getArticle', {name:"haungyong"})
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('hello').should.be.above(-1)
    })

    it('/gkmodela/getArticle With Cache ', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/gkmodela/getArticle', {name:"haungyong"})
        //console.log(response)
        let {err, result: {__fromCache}} = response
        __fromCache.should.be.eql(true)
    })

    it('/gkmodela/getArticle With force skip Cache ', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/gkmodela/getArticle', {name:"haungyong",__nocache:1})
        console.log(response)
        let {err, result: {__fromCache=false}} = response
        __fromCache.should.be.eql(false)
    })

    it('/a2/getArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/a2/getArticle', {name:Math.random()})
        //console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('hello').should.be.above(-1)
    })

})


