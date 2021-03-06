var slideIntervalId;
var SLIDER_INTERVAL = 6000;
var SLIDER_WIDTH = 938;
var isSliding = false;
var EASELONG = 1000;

function doSlide(slideNumber,duration,continueSliding,backease,textease){
	if(!slider.is(':animated')){
		//
		var loopEnd = false;
		//
		var leftPos = 0;
		//
		var acutalSlideNumber = jQuery.inArray($("#EasingIndex ul li.active")[0],$("#EasingIndex ul li"));
		// set active next slide index
		$("#EasingIndex ul li").removeClass('active');
		$($("#EasingIndex ul li")[slideNumber]).addClass('active');
		
		if(typeof backease == 'undefined')
			backease = "easeInExpo";
			
		if(typeof textease == 'undefined')
			textease = "linear";
		
		if( continueSliding && slideNumber== 0 && acutalSlideNumber == 3 )
			loopEnd = true;
		leftPos = (loopEnd)?-(4*SLIDER_WIDTH):-(slideNumber*SLIDER_WIDTH);
		
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
					if(loopEnd)
						slider.css('left' ,0);
				}
			}
		);
		
		if(continueSliding){
			if(slideNumber < 3){
				slideIntervalId = setTimeout("doSlide("+(slideNumber+1)+",EASELONG,true);", SLIDER_INTERVAL);
			}else{
				slideIntervalId = setTimeout("doSlide(0,EASELONG,true);", SLIDER_INTERVAL);
			}
		}
		
	}
}

$(document).ready( function(){	
	// Background Part of Slider
	slider = $('#EasingSlider');
	// Text Part pf Slider
	sliderTextContents = $('#EasingSlider .slideItem .text');
	// Start Sliding
	slideIntervalId = setTimeout("doSlide(1,EASELONG,true)", SLIDER_INTERVAL);
	
	$("#EasingIndex ul li:not(.active)").live(clickEvent,function(){
		if(!isSliding){
			isSliding = true;
			clearInterval(slideIntervalId);
			var slideNumber = jQuery.inArray(this,$("#EasingIndex ul li"));
			doSlide(slideNumber,EASELONG);
		}
	});

});