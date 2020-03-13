
import {mapState } from 'vuex';  
export default{
    computed: {
        ...mapState(['hasLogin',"domainName",'userInfo'])
    },
    data(){
        return {
                       //设置默认的分享参数
            share:{
                title:'多多客礼券商城',
                path:'/pages/share/share',
                path2:'/pages/index/index',
                imageUrl:'',
                desc:'',
                content:''
            }
        }
    },
    onShareAppMessage(res) {
        let p ;
        console.log(this.hasLogin)
        if(this.hasLogin){
            p = this.share.path2+`?shotId=${this.userInfo.shotId}`
        }else{
            p = this.share.path2
        }
        return {
            title:this.share.title,
            path:p,
            imageUrl:this.share.imageUrl,
            desc:this.share.desc,
            content:this.share.content,
            success(res){
                uni.showToast({
                    title:'分享成功'
                })
            },
            fail(res){
                uni.showToast({
                    title:'分享失败',
                    icon:'none'
                })
            }
        }
    }
}