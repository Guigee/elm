<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
                <span class="inner icon-remove_circle_outline"></span>
            </div>
        </transition>
        
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add" @click="addCart">
            <span class="icon-add_circle"></span>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    props: {
        food:{
            type: Object
        }
    },
    methods: {
        addCart(event){
            if(!event._constructed){
                return;
            }
            if(!this.food.count){
                Vue.set(this.food,'count',1); //count属性是在这里添加的
            }else{
                this.food.count++
            }
            this.$emit('carta',event.target); // 1.0
        },
        decreaseCart(event){
            if(!event._constructed){
                return;
            }
            if(this.food.count){
                this.food.count--;
            }
        }
    }
}
</script>

<style lang="stylus">
    @import url('../../common/stylus/icon.styl')

    .cartcontrol{
        font-size: 0;
    }
    .cartcontrol 
        .cart-decrease
            display: inline-block
            padding: 1px
            padding-bottom: 6px
            &.move-enter-active, &.move-leave-active //进入与离开过程中变化（过渡），重点写！！！
                transition: all 0.4s linear
                .inner
                    transition: all 0.4s linear
            &.move-enter, &.move-leave-to //进入开始与离开结束时的状态
                opacity: 0
                transform: translate3D(24px,0,0) //24px代表移动的距离
                .inner
                    
                    transform: rotate(360deg) //旋转的角度
    .cartcontrol .cart-count{
        display: inline-block;
        vertical-align: top;
        width: 12px;
        font-size: 10px;
        line-height: 24px;
        color: rgb(147,153,159);
        text-align: center;
        padding-right: 2px;
    }
    .cartcontrol .cart-add{
        display: inline-block;
        padding: 1px;
        padding-bottom: 6px;
        
    }
    .cartcontrol .icon-add_circle{
        display: inline-block;
        background-image: url(icon-add2.png);
        width: 24px;
        height: 24px;
        background-size: 24px 24px;
        background-repeat: no-repeat;
    }
    .cartcontrol .icon-remove_circle_outline{
        display: inline-block;
        background-image: url(remove-circle-outline.png);
        width: 24px;
        height: 24px;
        background-size: 24px 24px;
        background-repeat: no-repeat;
    }
</style>
