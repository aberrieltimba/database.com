var slideIntervalId;
var SLIDER_INTERVAL = 6000;
var SLIDER_WIDTH = 938;
var isSliding = false;
var EASELONG = 1000;

function doSlide(leftPos,duration,backease,textease){
	var finalPosition;
	// Normalize leftPos
	finalPosition = leftPos.replace(/[^0-9]/g,'');
	// Calculate the next slide
	if(leftPos.indexOf('=') != -1){
		if(leftPos.indexOf('+') != -1){
			finalPosition = slider.position().left + finalPosition;
		}else if(leftPos.indexOf('-') != -1){
			finalPosition = slider.position().left - finalPosition;
		}
	}
	//
	var acutalSlideNumber = jQuery.inArray($("#EasingIndex ul li.active")[0],$("#EasingIndex ul li"));
	// Wich is the number of the next slide?
	var slideNumber = (Math.abs(finalPosition))/SLIDER_WIDTH;
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
				console.info($(sliderTextContents[acutalSlideNumber]));
				$(sliderTextContents[acutalSlideNumber]).css('left' ,20);
				console.info($(sliderTextContents[acutalSlideNumber]).css('left'));
				isSliding = false;
			}
		}
	);
	
	if(slideNumber != 3){
		slideIntervalId = setTimeout("doSlide('-='+SLIDER_WIDTH+'px',EASELONG);", SLIDER_INTERVAL);
	}else{
		slideIntervalId = setTimeout("doSlide('0px',EASELONG);", SLIDER_INTERVAL);
	}
}

$(document).ready( function(){	
	// Background Part of Slider
	slider = $('#EasingSlider');
	// Text Part pf Slider
	sliderTextContents = $('#EasingSlider .slideItem .text');
	
	slideIntervalId = setTimeout("doSlide('-='+SLIDER_WIDTH+'px',EASELONG);", SLIDER_INTERVAL);
	
	$("#EasingIndex ul li:not(.active)").live(clickEvent,function(){
		if(!isSliding){
			isSliding = true;
			clearInterval(slideIntervalId);
			var slideNumber = jQuery.inArray(this,$("#EasingIndex ul li"));
			doSlide(-(SLIDER_WIDTH*slideNumber)+'px',EASELONG);
		}
	});

});