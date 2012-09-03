(function($){
	$.fn.YotpoReview = function(options){
		var defaults = {
			api_key : '',
			callback_function:ProcessReviews
		}
		
		var _Self = $(this);
		var options = $.extend(defaults,options);
		var _ProductUrl = 'http://api.yotpo.com/apps/'+defaults.api_key+'/products';
		var _ReviewUrl = 'http://api.yotpo.com/products/'+defaults.api_key+'/[DomainKey]/reviews';
		var _DataType = 'jsonp';
		var _ProductsImages = {};
		
		var init = function(){
			InitAjax(_ProductUrl,_DataType,ProcessProductResponse);
		};
		
		var InitAjax = function(url,dataType,callback){
			$.ajax({
				url:url,
				dataType:dataType,
				success:function(data){
					callback(data);
				}
			});
		};
		
		var ProcessProductResponse = function(data){
			//Details about product will be used from Reviews response.
			var products = data.response.products;
			$(products).each(function(index, product){
				var reviewUrl = _ReviewUrl.replace('[DomainKey]',product.domain_key);
				InitAjax(reviewUrl,_DataType,defaults.callback_function);
			});
		};
		
		function ProcessReviews(data){
			var reviews = data.response.reviews;
			var reviewList = [];
			$(reviews).each(function(index,review){
				if(!review.deleted){
					var YotPoReviewSummary = {
						ProductID:review.products[0].Product.id,
						ProductImage:review.products[0].Product.images[0].image_url,
						ProductName:review.products[0].Product.name,
						ProductPageUrl:review.products[0].Product.product_url,
						ProductScore:review.score,
						ReviewID:review.id,
						ReviewTitle:review.title,
						ReviewContent:review.content,
						ReviewerName:review.user.display_name,
						ReviewerPhoto:review.user.social_image
					};
					DisplayReviews(YotPoReviewSummary);
				}
			});
			
		};
		
		var DisplayReviews = function(r){
			var mainWrapper = $('<div class="yotpo-review"/>');
			var productimg = $('<div class="product-image"><a href="'+r.ProductPageUrl+'"><img src="'+ r.ProductImage +'"/></a></div>');
			var productName = $('<h2 class="product-name"><a href="'+r.ProductPageUrl+'">'+r.ProductName+'</a></h2>');
			var title = $('<h3>'+ r.ReviewTitle +'</h3>');
			var content = $('<p>'+r.ReviewContent+'</p>');
			var reviewDetailWrapper = $('<div class="review-wrapper"/>');
			var reviewerWrapper = $('<div class="user"><img class="uphoto" src="'+r.ReviewerPhoto+'"/><label class="uname">'+r.ReviewerName+'</label></div>');
			var scoreWrapper = $('<label class="score">'+r.ProductScore+'</label>');
            reviewDetailWrapper.append(title,content,scoreWrapper );
			mainWrapper.append(productimg,productName,reviewDetailWrapper,reviewerWrapper);
			_Self.append(mainWrapper);
		};
        
		var YotPoReviewSummary = {ProductID:null,ProductImage:null,ProductPageUrl:null,ProductName:null,ProductScore:null,ReviewID:null,ReviewTitle:null,ReviewContent:null,ReviewerName:null,ReviewerPhoto:null}
		
		init();

	};
})(jQuery);