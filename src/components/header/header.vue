<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img width="64px" height="64px" :src="seller.avatar">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<div v-if="seller.supports" class="support">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<span class="icon-right"></span>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<span class="icon-right"></span>
		</div>
		<div class="background">
			<img :src="seller.avatar" width="100%" height="100%">
		</div>
		<div v-show="hiddenDetail" class="detail" transition="fade">
			<div class="detail-wrapper clearfix">
				<div class="detail-main">
					<h1 class="name">{{seller.name}}</h1>
					<div class="star-wrapper">
						<star :size="48" :score="seller.score"></star>
					</div>
					<div class="title">
						<div class="line"></div>
						<div class="text">优惠信息</div>
						<div class="line"></div>
					</div>
					<ul v-if="seller.supports" class="supports">
						<li class="support-item" v-for="(item,index) in seller.supports" :key="index">
							<span class="icon" :class="classMap[seller.supports[index].type]"></span>
							<span class="text">{{seller.supports[index].description}}</span>
						</li>
					</ul>
					<div class="title">
						<div class="line"></div>
						<div class="text">商家活动</div>
						<div class="line"></div>
					</div>
					<div class="bulletin">
						<p class="content">{{seller.bulletin}}</p>
					</div>
				</div>
			</div>
			<div class="detail-close" @click="detailOff">
				<span class="icoclose"></span>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import star from '../star/star.vue'
	export default {
		props: {
			seller:{
				type: Object
			}
		},

		data: function(){
			return {
				hiddenDetail: false
			}
		},

		methods: {
			showDetail(){
				this.hiddenDetail = true
			},
			detailOff(){
				this.hiddenDetail = false
			}
		},

		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee']
		},

		components: {
			star
		}
	}
</script>

<style lang="stylus" >
	@import url("../../common/stylus/icon.styl")
	@import url("../../common/stylus/mixin.styl")
	
	body{
		line-height: 1;
		font-weight: 200;
		font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light';
	}
	.header{
		overflow: hidden;
		position: relative;
		background: rgba(7,17,27,0.5);
		color: #fff;
	}
	.header .content-wrapper{
		position: relative;
		padding: 24px 12px 18px 24px;
		font-size: 0;
	}	
	.header .content-wrapper .avatar{
		vertical-align: top;
		display: inline-block;
		
	}
	.header .content-wrapper .avatar img{
		border-radius: 2px;
	}
	.header .content-wrapper .content{
		display: inline-block;
		margin-left: 16px;
	}
	.header .content-wrapper .support-count{
		position: absolute;
		right: 12px;
		bottom: 18px;
		padding: 0 8px;
		height: 24px;
		line-height: 24px;
		border-radius: 14px;
		background: rgba(0,0,0,0.2);
		text-align: center; 
	}
	.header .content-wrapper .content .title{
		margin: 2px 0 8px 0;
	}
	.header .content-wrapper .content .description{
		margin-bottom: 10px;
		line-height: 12px;
		font-size: 12px;
	}
	.header .content-wrapper .content .title .brand{
		display: inline-block;
		width: 30px;
		height: 14px;
		background-image: url(brand@2x.png);
		background-size: 30px 18px;
		background-repeat: no-repeat;
		vertical-align: top;
	}
	.header .content-wrapper .content .title .name{
		margin-left: 6px;
		font-size: 16px;
		line-height: 18px;
		font-weight: bold;
	}
	.header .content-wrapper .content .support .icon
		display: inline-block
		vertical-align: top
		width: 12px
		height: 12px
		margin-right: 4px
		background-size: 12px 12px
		background-repeat: no-repeat
		&.decrease
			background-image: url(decrease_1@2x.png)
		&.discount
			background-image: url(discount_1@2x.png)
		&.guarantee
			background-image: url(guarantee_1@2x.png)
		&.invoice
			background-image: url(invoice_1@2x.png)
		&.special
			background-image: url(special_1@2x.png)
	.header .content-wrapper .content .support .text{
		line-height: 12px;
		font-size: 10px;
	}
	.header .content-wrapper .support-count .count{
		vertical-align: top;
		font-size: 10px;
	}
	.header .content-wrapper .support-count .icon-right{
		display: inline-block;
		background-image: url("icon-right.png");
		background-size: 12px 12px;
		background-repeat: no-repeat;
		width: 12px;
		height: 12px;
		vertical-align: middle;
	}
	.bulletin-wrapper{
		position: relative;
		height: 28px;
		line-height: 28px;
		padding: 0 22px 0 12px;
		// 这里定义的时候有一个div的问题，不能包含一个间接的div,否则text-overflow会出问题
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		background: rgba(7,17,27,0.2);
	}
			
	.bulletin-wrapper .bulletin-title{
		vertical-align: top;
		margin-top: 8px;
		display: inline-block;
		width: 22px;
		height: 12px;
		background-image: url(bulletin@2x.png);
		background-size: 22px 12px;
		background-repeat: no-repeat;
	}
				
	.bulletin-wrapper .bulletin-text{
		vertical-align: top;
		margin: 0 4px;
		font-size: 10px;
	}		
	.bulletin-wrapper .icon-right{
		//问题
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate3d(0,-50%,0);
		display: inline-block;
		background-image: url("icon-right.png");
		background-size: 12px 12px;
		background-repeat: no-repeat;
		width: 12px;
		height: 12px;
	}		
	.header .background{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		filter: blur(10px);
	}
	.header .detail{
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		transition: all 0.5s;
		background: rgba(7,17,27,0.8);
	}	
	.clearfix
		display: inline-block
		&:after
			display: block
			content: "."
			height: 0
			line-height: 0
			clear: both
			visibility: hidden	
	.detail-wrapper{
		min-height: 100%;	
		width: 100%;
	}
	.header .detail .detail-main{
		margin-top: 64px;
		padding-bottom: 64px;
			
	}
	.detail-wrapper .detail-main .name{
		text-align: center;
		line-height: 16px;
		font-size: 16px;
		font-weight: 700;
		color: rgb(255,255,255);
	}
	.detail-close{
		position: relative;
		width: 32px;
		height: 32px;
		margin: -64px auto 0 auto
		clear: both
		font-size: 32px;
	}
	.icoclose{
		display: inline-block;
		background-image: url("pop_icon_close_6.png");
		background-size: 20px 20px;
		background-repeat: no-repeat;
		width: 20px;
		height: 20px;
	}
	.star-wrapper{
		margin-top: 14px;
		padding: 2px 0;
		text-align: center;
	}
	.detail-main .title{
		display: flex;
		margin: 28px auto 24px auto;
		width: 80%;
	}
	.detail-main .title .line{
		flex: 1;
		position: relative;
		top: -8px; 
		border-bottom: 1px solid rgba(255,255,255,0.2);
	}
	.detail-main .title .text{
		font-size: 14px;
		font-weight: 700;
		padding: 0 12px;
	}
	.detail-main .supports{
		width: 80%;
		margin: 0 auto;
	}
	.detail-main .supports .support-item{
		margin: 0 12px 12px 12px;
		font-size: 0;
		list-style: none;
	}
	.detail-main .supports .support-item:last-child{
		margin-bottom: 0;
	}
	.detail-main .supports .support-item .icon{
		display: inline-block;
		margin-right: 6px;
		width: 16px;
		height: 16px;
		vertical-align: top;
		background-size: 16px 16px;
		background-repeat: no-repeat;
	}
		
	
	.detail-main .supports .support-item  .decrease{

		background-image: url("decrease_2@2x.png");
	}
			
	.detail-main .supports .support-item  .discount{
		background-image: url("discount_2@2x.png");
	}
		
	.detail-main .supports .support-item  .guarantee{
		background-image: url("guarantee_2@2x.png");
	}
	
	.detail-main .supports .support-item  .invoice{
		background-image: url("invoice_2@2x.png");
	}
			
	.detail-main .supports .support-item  .special{
		background-image: url("special_2@2x.png");
	}
	.detail-main .supports .support-item .text{
		line-height: 12px;
		font-size: 12px;
	}
	.detail-main .bulletin{
		width: 80%;
		margin: 0 auto;
	}
	.detail-main .bulletin .content{
		padding: 0px 12px;
		font-size: 12px;
		font-weight: 100;
		line-height: 24px;
	}
</style>