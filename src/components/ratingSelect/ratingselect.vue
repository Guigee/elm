<template>
    <div class="ratingselect">
        <div class="rating-type">
            <span @click="select(2,$event)" class="block positive" :class="{'active':type===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span @click="select(0,$event)" class="block positive" :class="{'active':type===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span @click="select(1,$event)" class="block negative" :class="{'active':type===1}">{{desc.negative}}<span class="count">{{negatives.lebgth}}</span></span>
        </div>
        <div @click="toggleContent" class="switch" :class="{'on':otype}">
            <span class="icon-check_circle"></span>
            <span class="text">只看内容的评价</span>
        </div>
    </div>
</template>

<script>
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
    props: {
        ratings: {
            type: Array,
            default() {
                return []
            }
        },
        selectType: {
            type: Number,
            default: ALL
        },
        onlyContent: {
            type: Boolean,
            default: false
        },
        desc: {
            type: Object,
            default() {
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            }   
        }
    },
    data() {
        return {
            type: this.selectType,
            otype: this.onlyContent
        }
    },
    computed: {
        positives(){
            return this.ratings.filter((rating) => {
                return rating.rateType === POSITIVE
            })
        },
        negatives(){
             return this.ratings.filter((rating) => {
                return rating.rateType === NEGATIVE
            })
        }
    },
    methods: {
        select(type,event){
            if(!event._constructed){
				return
            } 
            this.type = type
            this.$emit('ratingtypeselect',type)
        },
        toggleContent(event){
            if(!event._constructed){
				return
            } 
            this.otype = !this.otype
            this.$emit('contenttoggle',this.otype)
        }
    }
}
</script>

<style lang="stylus">
    .ratingselect
        .rating-type
            padding: 18px 18px 18px 0
            margin: 0 18px
            border-bottom: 1px solid rgb(7,17,27,0.1)
            font-size: 0
            .block
                display: inline-block
                padding: 8px 12px
                margin-right: 8px
                line-height: 16px
                border-radius: 1px
                font-size: 12px
                color: rgb(77,85,93)
                &.active
                    color: #fff
                .count
                    margin-left: 2px
                    font-size: 8px
                &.positive
                   background: rgba(0,160,220,0.2)
                   &.active
                        background: rgb(0,160,220)
                &.negative
                    background: rgba(77,85,93,0.2)
                    &.active
                        background: rgb(77,85,93)
        .switch
            padding: 12px 18px
            line-height: 24px
            border-bottom: 1px solid rgba(7,17,27,0.1)  
            color: rgb(147,153,159)
            font-size: 0
            &.on
                .icon-check_circle
                    background-image: url(checked2.png)
            .icon-check_circle
                display: inline-block
                background-image: url(checked.png)
                width: 24px
                height: 24px
                background-size: 24px 24px
                background-repeat: no-repeat
            .text   
                display: inline-block
                vertical-align: top
                font-size: 12px

</style>
