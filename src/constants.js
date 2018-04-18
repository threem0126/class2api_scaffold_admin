import {GKErrorWrap} from 'class2api'

//如果内置的GKErrors不够用，封装的自定义扩展错误类型
export const ERROR_PERSONINFO_NOT_READY = GKErrorWrap(1000, '请先补充个人信息')

//项目常量定义
export const EXAMPLE = 'this is a example!'
