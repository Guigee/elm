<template>
	<div>
		<div class="goods">
			<div class="menu-wrapper" ref="menuWrapper">
				<ul>
					<li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)"> 
						<!-- 此处'current'为一个对象 -->
						<span class="text">
							<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
							{{item.name}}
						</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper" ref="foodsWrapper">
				<ul>
					<li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
						<h1 class="title">{{item.name}}</h1>
						<ul>
							<li v-for="(food,index) in item.foods" :key="index" class="food-item" @click="slectFoodss(food,$event)">
								<div class="icon">
									<img width="57px" height="57px" :src="food.icon">
								</div>
								<div class="content">
									<h2 class="name">{{food.name}}</h2>
									<p class="desc">{{food.description}}</p>
									<div class="extra">
										<span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
									</div>
									<div class="price">
										<span class="new">${{food.price}}</span><span class="old" v-show="food.oldPrice">${{food.oldPrice}}</span>
									</div>
									<div class="cartcontrol-wrapper" @click.stop>
										<cartcontrol :food="food" @carta="cartAdd"></cartcontrol>
									</div>
								</div>
							</li>
						</ul> 
					</li>
				</ul>
			</div>
			<shopcart ref="shopcart" :selectFood="selectFood" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
		</div>
		<food :food="selectedFood" ref="food" @carta="cartAdd"></food>
	</div>
</template>

<script  type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import shopcart from '../shopcart/shopcart.vue'
	import cartcontrol from '../cartcontrol/cartcontrol.vue'
	import food from '../food/food.vue'

	const ERR_OK = 0
	export default {
		props: {
			seller:{
				type: Object
			} 
		},
		data:function() {
			return {
				goods: [],
				listHeight: [], //计算的右侧区间的高度，高度递增（固定的）
				scrollY: 0, //追踪右侧实时更新的高度
				selectedFood: {}
			}
		},
		computed: {
			currentIndex() {
				for(let i=0;i<this.listHeight.length;i++){
					let length1 = this.listHeight[i]
					let length2 = this.listHeight[i+1]
					if((this.scrollY>=length1&&this.scrollY<length2)||!length2){
						return i
					}
				}
				return 0 //注意
			},
			selectFood(){
				let foods = []
				this.goods.forEach(function(good){
					good.foods.forEach(function(food){
						if(food.count){
							foods.push(food)
						}
					})
				})
				return foods
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee']

			this.$http.get('/api/goods').then((response) =>{
				response = response.body
				if(response.errno === ERR_OK){
					this.goods = response.data
					this.$nextTick(() => {
						this._initScroll()
						this._calculateHeight()
					})
				}	
			})
		},
		methods: {
			selectMenu(index,event){
				if(!event._constructed){
					return;
				}
				let foodList = this.$refs.foodsWrapper.getElementsByClassName("food-list-hook")
				let el = foodList[index]
				this.foodsScroll.scrollToElement(el,300)
			},
			cartAdd(target){ //改动
		 		this._drop(target);
		 	},
			slectFoodss(food,event){
				if(!event._constructed){
					return;
				} 
				console.log('clicked')
				this.selectedFood = food
				this.$refs.food.show()
			},
			_drop(target){ // 1.0
				// 异步执行下落动画（优化）
				this.$nextTick(() => {
					this.$refs.shopcart.drop(target)
				})
			},
			_initScroll(){
				this.menuScroll = new BScroll(this.$refs.menuWrapper,{
					click: true
				})
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
					click: true,
					//当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，
					//而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
					probeType: 3
				})
				this.foodsScroll.on('scroll',(pos) => {
					this.scrollY = Math.abs(Math.round(pos.y)) //实时获取事件'scroll'滚动的高度
					// console.log(this.scrollY)
				})
			},
			_calculateHeight(){
				let foodList = this.$refs.foodsWrapper.getElementsByClassName("food-list-hook")
				let height = 0
				this.listHeight.push(height) //注意
				for(let i=0;i<foodList.length;i++){
					height += foodList[i].clientHeight
					this.listHeight.push(height)
				}
			}
			
		},
		components: {
			shopcart,
			cartcontrol,
			food
		}
		// 1.0
		// events: {
		// 	'cart.add'(target){
		// 		this._drop(target);
		// 	}
		// }
	}	
</script>

<style lang="stylus">
	.goods{
		display: flex;
		position: absolute;
		top: 174px;
		width: 100%;
		bottom: 46px;
		overflow: hidden;
	}
	.goods .menu-wrapper{
		width: 80px;
		flex: 0 0 80px;
		background: #f3f5f7;

	}
	.goods .foods-wrapper{
		flex: 1;
	}
	.goods .menu-wrapper .menu-item{
		display: table;
		height: 54px;
		width: 64px;
		line-height: 14px;
		margin: 0 8px;
		border-bottom: 0.5px solid rgba(7,17,27,0.1);
	}
	.goods .menu-wrapper .current{
		position: relative;
		z-index: 10;
		margin-top: -1px;
		background:  #fff;
		font-weight: 700;
	}
	
	.icon
		display: inline-block
		vertical-align: top
		width: 12px
		height: 12px
		margin-right: 2px
		background-size: 12px 12px
		background-repeat: no-repeat
		&.decrease
			background-image: url(decrease_3@2x.png)
		&.discount
			background-image: url(discount_3@2x.png)
		&.guarantee
			background-image: url(guarantee_3@2x.png)
		&.invoice
			background-image: url(invoice_3@2x.png)
		&.special
			background-image: url(special_3@2x.png)

	.goods .menu-wrapper .menu-item .text{
		font-size: 12px;
		font-weight: 100;
		line-height: 14px;
		display: table-cell;
		vertical-align: middle;
		text-align: center;
	}
	.foods-wrapper .title{
		padding-left: 14px;
		height: 26px;
		line-height: 26px;
		font-size: 12px;
		color: rgb(147,153,159);
		border-left: 2px solid #d9dde1;
		background: #f3f5f7;
	}
	.food-list{
		list-style: none;
	}
	.foods-wrapper .food-item{
		display: flex;
		margin: 18px;
		padding-bottom: 18px;
		border-bottom: 0.5px solid rgba(7,17,27,0.1);
	}
	.foods-wrapper .food-list:last-child{
		display: none;
		margin-bottom: 0;
	}
	.foods-wrapper .food-item .icon{
		flex: 0 0 57px;
		margin-right: 10px;
	}
	.foods-wrapper .food-item .content{
		position: relative;
		flex: 1;
	}
	.foods-wrapper .food-item .content .name{
		margin: 2px 0 8px 0px;
		font-size: 14px;
		line-height: 4px;
		color: rgb(7,17,27);
	}
	.foods-wrapper .food-item .content .desc{
		font-size: 10px;
		line-height: 12px;
		color: rgb(147,153,159);
		margin: 8px 0;
	}
	.foods-wrapper .food-item .content .extra{
		font-size: 10px;
		color: rgb(147,153,159);
		line-height: 10px;
		margin-top: 8px;
	}
	.foods-wrapper .food-item .content .extra .count{
		margin-right: 12px;
	}
	.foods-wrapper .food-item .content .price{
		font-weight: 700px;
		line-height: 24px;
	}
	.foods-wrapper .food-item .content .price .new{
		font-size: 14px;
		color: rgb(240,20,20);
		margin-right: 8px;
	}
	.foods-wrapper .food-item .content .price .old{
		font-size: 10px;
		color: rgb(147,153,159);
		text-decoration: line-through; 
	}
	.foods-wrapper .food-item .content .cartcontrol-wrapper{
		position: absolute;
		right: 0;
		bottom: -7px;
	}
</style>