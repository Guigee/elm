<template>
    <div>
        <transition name="move">
            <div v-show="showFlag" class="food" ref="food">
                <div class="food-content">
                    <div class="image-header">
                        <img :src="food.image"> 
                        <div class="back" @click="hide">
                            <span class="icon-arrow_lift"></span>
                        </div>
                    </div>
                    <div class="content">
                        <h1 class="title">{{food.name}}</h1>
                        <div class="detail">
                            <span class="sell-count">月售{{food.sellCount}}份</span>
                            <span class="rating">好评率{{food.rating}}%</span>
                        </div>
                        <div class="price">
                            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice>0">￥{{food.oldPrice}}</span>
                        </div> 
                         <div class="cartcontrol-wrapper">
                            <cartcontrol :food="food"></cartcontrol>
                        </div>
                        <div class="buy" v-show="!food.count || food.count===0" @click="addFirst">加入购物车</div>
                    </div>
                    <split></split>
                    <div class="info" v-show="food.info">
                        <h1 class="title">商品信息</h1>
                        <p class="text">{{food.info}}</p>
                    </div>
                    <split></split>
                    <div class="rating">
                        <h1 class="title">商品评价</h1>
                        <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings" @ratingtypeselect="ratingtypeselect" @contenttoggle="contenttoggle"></ratingselect>
                        <div class="rating-wrapper">
                            <ul v-show="food.ratings && food.ratings.length">
                                <li v-show="needShow(rating.rateType,rating.text)" class="rating-item" v-for="(rating,index) in food.ratings" :key="index">
                                    <div class="user">
                                        <span class="name">{{rating.username}}</span>
                                        <img class="avatar" width="12" height="12" :src="rating.avatar">
                                    </div>
                                    <div class="time">{{rating.rateTime || formatDate}}</div>
                                    <p class="text">
                                        <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                                        {{rating.text}}
                                    </p>
                                </li>
                            </ul>
                            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
                                暂无评价
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol.vue'
import Vue from 'vue'
import {formatDate} from '../../common/js/date'
import split from '../split/split.vue'
import ratingselect from '../ratingSelect/ratingselect.vue'


// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2
export default {
    props: {
        food: {
            type: Object
        }
    },
    data(){
        return {
            showFlag: false,
            selectType: ALL,
            onlyContent: true,
            desc:{
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        }
    },
    methods: {
        show() {
            this.showFlag = true
            this.selectType = ALL
            this.onlyContent = true
            this.$nextTick(function(){
                if(!this.scroll){
                    this.scroll = new BScroll(this.$refs.food,{
                        click: true
                    })
                }else{
                    this.scroll.refresh()
                }
            })
        },
        hide() {
            this.showFlag = false
        },
        addFirst(event){
            if(!event._constructed){
				return
            } 
            this.$emit('carta',event.target)
            Vue.set(this.food,'count',1) //设置food的count为1
        },
        needShow(type,text){ //这里的逻辑有问题
            if(this.onlyContent && !text){
                return false
            }
            if(this.selectType === ALL){
                return true
            }else{
                return type === this.selectType
            }
        },
        ratingtypeselect(type){ //子组件已传入事件，父组件需要写入的两个事件方法
            this.selectType = type
            this.$nextTick(() => {
                this.scroll.refresh()
            })
        },
        contenttoggle(onlyContent){
            this.onlyContent = onlyContent
            this.$nextTick(() => {
                this.scroll.refresh()
            })
        }
    },
    // events: { //此处是1.0的写法，2.0已废除
    //     'ratingtype.select'(type){
    //         this.selectType = type
    //         this.$nextTick(() => {
    //             this.scroll.refresh()
    //         })
            
    //     },
    //     'content.toggle'(onlyContent){
    //         this.onlyContent = onlyContent
    //         this.$nextTick(() => {
    //             this.scroll.refresh()
    //         })
    //     }
    // },
    filters: { //此处formatDate有问题
        formatDate(time){
            let date = new Date(time)
            return formatDate(date, 'yyyy-MM-dd hh:mm')
        }
    },
    components: {
        cartcontrol,
        split,
        ratingselect
    }
}
</script>

<style lang="stylus">
    .food
        position: fixed 
        left: 0
        top: 0
        bottom: 48px
        z-index: 30
        width: 100%
        background: #fff
        &.move-enter
            transform: translate3d(100%,0,0)
        &.move-enter-active,&.move-leave-active
            transition: all .5s linear 
        &.move-leave
            transform: translate3d(0,0,0)
        .image-header
            position: relative
            width: 100%
            height: 0
            padding-top: 100%
            img
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
            .back
                position: absolute 
                top: 10px
                left: 0
                .icon-arrow_lift
                    display: inline-block
                    background-image: url(icon_arrow_l.png)
                    width: 30px
                    height: 30px
                    background-size: 30px 30px
                    background-repeat: no-repeat
        .content
            position: relative
            padding: 18px
            .title
                line-height: 14px
                margin-bottom: 8px
                font-size: 14px
                font-weight: 700
                color: rgb(7,17,27)
            .detail
                margin-bottom: 18px
                line-height: 10px
                font-size: 0
                height: 10px
                .sell-count, .rating
                    font-size: 10px
                    color: rgb(147,153,159)
                .sell-count
                    margin-right: 12px
            .price
                font-weight: 700
                line-height: 24px
                .now
                    margin-right: 8px
                    font-size: 14px
                    color: rgb(240,20,20)
                .old
                    text-decoration: line-through
                    font-size: 10px
                    color: rgb(147,153,159)
        .cartcontrol-wrapper
            position: absolute
            right: 12px
            bottom: 12px
        .buy
            position: absolute
            right: 18px 
            bottom: 18px
            z-index: 10
            height: 24px
            line-height: 24px
            padding: 0 12px
            box-sizing: border-box
            border-radius: 12px
            font-size: 10px
            color: #ffffff
            background: rgb(0,160,220)
        .info
            padding: 18px
            .title
                line-height: 14px
                margin-bottom: 6px
                font-size: 14px
                color: rgb(7,17,27)
            .text 
                font-size: 12px
                line-height: 24px
                padding: 0 8px
                color: rgb(77,85,93)
        .rating
            padding-top: 18px
            .title
                line-height: 14px
                margin-left: 18px
                font-size: 14px
                color: rgb(7,17,27)
            .rating-wrapper
                padding: 0 18px
                .rating-item
                    position: relative
                    padding: 16px 0
                    border-bottom: 1px solid rgba(7,17,27,0.1)
                    list-style: none
                    .user
                        position: absolute 
                        right: 0
                        top: 16px
                        line-height: 12px
                        font-size: 0
                        .name   
                            display: inline-block
                            vertical-align: top
                            margin-right: 6px
                            font-size: 10px
                            color: rgb(147,153,159)
                        .avatar
                            border-radius: 50%
                    .time
                        margin-bottom: 6px
                        line-height: 12px
                        font-size: 10px
                        color: rgb(147,153,159)    
                    .text   
                        line-height: 16px
                        font-size: 12px
                        color: rgb(7,17,27)
                        .icon-thumb_up, .icon-thumb_down
                            margin-right: 4px
                            line-height: 16px
                            font-size: 12px
                            display: inline-block
                            width: 12px
                            height: 12px
                            background-size: 12px 12px
                            background-repeat: no-repeat;
                        .icon-thumb_up
                            background-image: url(ios-thumbs-up.png)
                        .icon-thumb_down
                            background-image: url(thumbs-down.png)
                .no-rating
                    padding: 16px 0
                    font-size: 12px
                    color: rgb(147,153,159)         
</style>
