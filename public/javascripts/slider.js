var slideIntervalId;
var SLIDER_INTERVAL = 6000;
var SLIDER_WIDTH = 938;
var isSliding = false;
var EASELONG = 1000;

function doSlide(slideNumber,duration,backease,textease){
	if(!slider.is(':animated')){
		//
		leftPos = -(slideNumber*SLIDER_WIDTH);
		//
		var acutalSlideNumber = jQuery.inArray($("#EasingIndex ul li.active")[0],$("#EasingIndex ul li"));
		// set active next slide index
		$("#EasingIndex ul li").removeClass('active');
		$($("#EasingIndex ul li")[slideNumber]).addClass('active');
		
		if(typeof backease == 'undefined')
			backease = "easeInBack";
			
		if(typeof textease == 'undefined')
			textease = "linear";
		
		$(sliderTextContents[acutalSlideNumber]).animate(
			{"left": -SLIDER_WIDTH}, 
			{
				"duration": duration,
				"easing": textease,
				"complete":function(){
					//
				}
			}
		);
		
		slider.animate(
			{"left": leftPos}, 
			{
				"duration": duration,
				"easing": backease,
				"complete":function(){
					$(sliderTextContents[acutalSlideNumber]).css('left' ,20);
					isSliding = false;
				}
			}
		);
	
		if(slideNumber < 3){
			slideIntervalId = setTimeout("doSlide("+(slideNumber+1)+",EASELONG);", SLIDER_INTERVAL);
		}else{
			slideIntervalId = setTimeout("doSlide(0,EASELONG);", SLIDER_INTERVAL);
		}
	}
}

$(document).ready( function(){	
	// Background Part of Slider
	slider = $('#EasingSlider');
	// Text Part pf Slider
	sliderTextContents = $('#EasingSlider .slideItem .text');
	
	slideIntervalId = setTimeout("doSlide(1,EASELONG)", SLIDER_INTERVAL);
	
	$("#EasingIndex ul li:not(.active)").live(clickEvent,function(){
		if(!isSliding){
			isSliding = true;
			clearInterval(slideIntervalId);
			var slideNumber = jQuery.inArray(this,$("#EasingIndex ul li"));
			doSlide(slideNumber,EASELONG);
		}
	});

});