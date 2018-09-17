<template>
<div>
    <div class="shopcart">
        <div class="content">
            <div class="content-left">
                <div class="logo-wrapper" @click="toggleList">
                    <div class="logo" :class="{'heightlight':totalCount>0}">
                        <span class="icon-shopping_cart" :class="{'heightlight':totalCount>0}"></span>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'heightlight':totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right" @click="pay">
                <div class="pay" :class="payClass">
                   {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
            <div v-for="(ball,index) in balls" :key="index">
                <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                    <div v-show="ball.show" class="ball">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
            </div>
        </div>
        <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="listContent">
                <ul>
                    <li class="food" v-for="(food,index) in selectFood" :key="index">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <span>￥{{food.price*food.count}}</span>
                        </div>
                        <div class="cartcontrol-wrapper" :food=food>
                            <cartcontrol :food="food"></cartcontrol>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        </transition>
        
    </div>
    <transition name='fade'>
    <div class="listMark" v-show="listShow" @click="hiddenListMark"></div>
    </transition>
    </div>
</template>

<script type="ecmascript-6">
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol.vue'

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
                {show:false},
                {show:false},
                {show:false},
                {show:false},
                {show:false}
            ],
            dropBalls: [],// 1.0
            fold: true
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
        },
        listShow() {
            if(!this.totalCount){
                this.fold = true
                return false
            }
            let show = !this.fold
            if(show){
                this.$nextTick(function(){
                    if(!this.scroll){
                        this.scroll = new BScroll(this.$refs.listContent,{
                            click: true
                        })  
                    } else{
                        this.scroll.refresh()
                    }
                })
            }
            return show
        }
    },
    methods: {
        // 1.0
        drop(el){
           for(let i=0;i<this.balls.length;i++){
               let ball = this.balls[i]
               if(!ball.show){
                   ball.show = true //触发动画
                   ball.el = el
                   this.dropBalls.push(ball)
                   return
               }
           }
        },
        beforeDrop(el){
            let count =this.balls.length;
            while(count--){
                let ball = this.balls[count];
                if(ball.show){
                    let rect = ball.el.getBoundingClientRect();
                    let x = rect.left - 32;
                    let y = -(window.innerHeight - rect.top - 22);
                    el.style.display = '';
                    el.style.webkitTransform = 'translate3d(0,${y}px,0)';
                    el.style.transform = 'translate3d(0,${y}px,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(${x}px,0,0)';
                    inner.style.transform = 'translate3d(${x}px,0,0)';
                }
            }
        },
        dropping(el,done){
            let rf = el.offsetHeight;
            this.$nextTick(() => {
                el.style.webkitTransform = 'translate3d(0,0,0)';
                el.style.transform = 'translate3d(0,0,0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
                el.addEventListener('transitionend',done)
            })
        },
        afterDrop(el){
            let ball = rhis.dropBalls.shift();
            if(ball){
                ball.show = false;
                el.style.display = 'none';
            }
        },
        toggleList() {
            if(!this.totalCount){
                return; 
            }
            this.fold = !this.fold
        },
        empty(){
            this.selectFood.forEach(function(food){
                food.count = 0
            })
        },
        hiddenListMark(){
            this.fold = true
        },
        pay(){
            if(this.totalPrice<this.minPrice){
                return
            }
            alert("支付"+this.totalPrice+"元")
        }
    },
    components: {
        cartcontrol
    }
    
    // transitions: { // 1.0
    //     drop: {
    //         beforeDrop(el){
    //             let count =this.balls.length;
    //             while(count--){
    //                 let ball = this.balls[count];
    //                 if(ball.show){
    //                     let rect = ball.el.getBoundingClientRect();
    //                     let x = rect.left - 32;
    //                     let y = -(window.innerHeight - rect.top - 22);
    //                     el.style.display = '';
    //                     el.style.webkitTransform = 'translate3d(0,${y}px,0)';
    //                     el.style.transform = 'translate3d(0,${y}px,0)';
    //                     let inner = el.getElementsByClassName('inner-hook')[0];
    //                     inner.style.webkitTransform = 'translate3d(${x}px,0,0)';
    //                     inner.style.transform = 'translate3d(${x}px,0,0)';
    //                 }
    //             }
    //         },
    //         dropping(el,done){
    //             let rf = el.offsetHeight;
    //             this.$nextTick(() => {
    //                 el.style.webkitTransform = 'translate3d(0,0,0)';
    //                     el.style.transform = 'translate3d(0,0,0)';
    //                     let inner = el.getElementsByClassName('inner-hook')[0];
    //                     inner.style.webkitTransform = 'translate3d(0,0,0)';
    //                     inner.style.transform = 'translate3d(0,0,0)';
    //                     el.addEventListener('transitionend',done)
    //             })
    //         },
    //         afterDrop(el){
    //             let ball = rhis.dropBalls.shift();
    //             if(ball){
    //                 ball.show = false;
    //                 el.style.display = 'none';
    //             }
    //         }
    //     }
    // }
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
        z-index: 50;
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
                    transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
                    .inner
                        width: 16px
                        height: 16px
                        border-radius: 50%
                        background: rgb(0,160,220)
                        transition: all 0.4s linear
        .shopcart-list
            position: absolute
            left: 0
            bottom: 48px
            
            z-index: 10
            width: 100%
            &.fold-enter-active,&.fold-leave-active
                transition: all .5s
                // transform: translate3d(0,-100%,0)
           
                // transform: translate3d(0,-100%,0)
            &.fold-leave-to, &.fold-enter
                transform: translate3d(0,100%,0)
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7,17,27,0.1)
                .title
                    float: left
                    font-size: 14px
                    color: rgb(7,17,27)
                .empty
                    float: right
                    font-size: 12px;
                    color: rgb(0,160,220)
            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background: #ffffff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    border: 0.5px solid rgba(7,17,27,0.1)
                    list-style: none
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7,17,27)
                    .price
                        position: absolute 
                        right: 90px
                        bottom: 12px
                        line-height: 24px
                        font-size: 14px
                        font-weight: 700
                        color: rgb(240,20,20)
                    .cartcontrol-wrapper
                        position: absolute 
                        right: 0
                        bottom: 6px
    .listMark
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        -webkit-backdrop-filter: blur(10px)
        transition: all 0.5s
        //opacity: 1
        background: rgba(7,17,27,0.6)
</style>

