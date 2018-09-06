<template>
    <div class="shopcart">
        <div class="content">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'heightlight':totalCount>0}">
                        <span class="icon-shopping_cart" :class="{'heightlight':totalCount>0}"></span>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'heightlight':totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right">
                <div class="pay" :class="payClass">
                   {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
           <transition-group name="drop">
                <div v-for="(ball,index) in balls" :key="index" v-show="ball.show" class="ball">
                    <div class="inner"></div>
                </div>
           </transition-group>
        </div>
    </div>
</template>

<script type="ecmascript-6">
export default {
    props: {
        selectFood:{
            type: Array,
            default(){
                return []
            }
        },
        deliveryPrice:{
            type: Number,
            default: 0
        },
        minPrice:{
            type: Number,
            default: 0
        }
    },
    data: function(){
        return {
            balls: [
                {show:true},
                {show:false},
                {show:false},
                {show:false},
                {show:false}
            ]
        }
    },
    computed: {
        totalPrice(){
            let total = 0;
            this.selectFood.forEach(function(food){
                total += food.price * food.count;
            })
            return total;
        },
        totalCount(){
            let count = 0;
            this.selectFood.forEach(function(food){
                count += food.count;
            })
            return count;
        },
        payDesc(){
            if(this.totalPrice===0){
                return '￥'+this.minPrice+'元起送'
            }else if(this.totalPrice<this.minPrice){
                let dis = this.minPrice - this.totalPrice
                return '还差￥'+dis+'元起送'
            }else{
                return '去结算'
            }
        },
        payClass(){
            if(this.totalPrice>=this.minPrice){
                return 'enough'
            }else{
                return 'noEnough'
            }
        }
    }
}
</script>

<style lang="stylus">
    @import url('../../common/stylus/icon.styl') 
    .shopcart{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 48px;
        z-index: 50;
    }
    .shopcart .content{
        background: #141d27;
        display: flex;
        font-size: 0;
    }
    .shopcart .content .content-left{
        flex: 1;
    }
    .shopcart .content .content-left .logo-wrapper{
        position: relative;
        display: inline-block;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height : 56px;
        box-sizing: border-box;
        vertical-align: top;
        border-radius: 50%;
        background: #141d27;
    }
    .shopcart .content .content-left .logo-wrapper .logo{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        text-align: center;
        background: #2b343c;
    }
    .shopcart .content .content-left .logo-wrapper .heightlight{
        background: rgb(0,160,220);    
    }
    //  .shopcart
    //     .content 
    //         .content-left 
    //             .logo-wrapper 
    //                 .logo 
    //                     .icon-shopping_cart 
    //                         &.heightlight
    //                             background-image: url(shopping-cart2.png)
    .shopcart .content .content-left .logo-wrapper .num{
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 16px;
        font-size: 9px;
        font-weight: 700;
        color: rgb(255,255,255);
        line-height: 16px; //保持垂直居中（height与line-height相等）
        background-color: rgb(240,20,20);
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);   
        border-radius: 16px; 
        text-align: center; //保持水平居中
    }
     .shopcart .content .content-left .logo-wrapper .logo .icon-shopping_cart{
        display: inline-block;
        position: relative;
        background-image: url(shopping-cart.png);
        width: 30px;
        height: 30px;
        background-size: 30px 30px;
        background-repeat: no-repeat;
        bottom: -6px;
    }
     .shopcart .content .content-left .logo-wrapper .logo .heightlight{
        background-image: url(shopping-cart2.png);
    }//zheli
                                
    .shopcart .content .content-left .price{
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        padding-right: 12px;
        line-height: 24px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255,255,255,0.1);
        font-size: 16px;
        font-weight: 700;
        color: rgba(255,255,255,0.4);    
    }
    .shopcart .content .content-left .heightlight{
        color: #fff;
    } //zheli
                       
    .shopcart .content .content-left .desc{
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: 10px;
        color: rgba(255,255,255,0.4);
    }
    .shopcart .content .content-right{
        flex: 0 0 105px;
        width: 105px;    
    }
    .shopcart .content .content-right .pay{
            font-size: 12px;
            color: rgba(255,255,255,0.4);
            font-weight: 700;
            line-height: 48px;
            height: 48px;
            text-align: center;
    }
    .shopcart .content .content-right .enough{
        background: #00b43c;
        color: #fff;
    }
    .shopcart .content .content-right .noEnough{
         background: #2b333b;
    }
    .shopcart
        .ball-container
            .ball
                position: fixed
                left: 32px
                bottom: 22px
                z-index: 200
                &.drop-transition
                    transition: all 0.4s 
                    .inner
                        width: 16px
                        height: 16px
                        border-radius: 50%
                        background: rgb(0,160,220)
                        transition: all 0.4s 
</style>

