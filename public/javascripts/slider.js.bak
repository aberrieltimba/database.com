var slideIntervalId;
var SLIDER_INTERVAL = 3000;
var SLIDER_WIDTH = 938;
var isSliding = false;

function doSlide(leftPos,duration,backease,textease){
	var finalPosition;
	// Normalize leftPos
	finalPosition = leftPos.replace(/[^0-9]/g,'');
	// Calculate the next slide
	if(leftPos.indexOf('=') != -1){
		if(leftPos.indexOf('+') != -1){
			finalPosition = sliderBackground.position().left + finalPosition;
		}else if(leftPos.indexOf('-') != -1){
			finalPosition = sliderBackground.position().left - finalPosition;
		}
	}
	// Wich is the number of the next slide?
	var slideNumber = (Math.abs(finalPosition))/SLIDER_WIDTH;
	// set active next slide index
	$("#EasingIndex ul li").removeClass('active');
	$($("#EasingIndex ul li")[slideNumber]).addClass('active');
	
	if(typeof backease == 'undefined')
		backease = "easeOutCubic";
		
	if(typeof textease == 'undefined')
		textease = "easeInOutElastic";
	
	sliderBackground.animate(
		{"left": leftPos}, 
		{
			"duration": duration,
			"easing": backease,
			"complete":function(){
				//
			}
		}
	);
	sliderText.animate(
		{"left": leftPos}, 
		{
			"duration": duration,
			"easing": textease,
			"complete":function(){
				isSliding = false;
			}
		}
	);
	if(slideNumber != 3){
		slideIntervalId = setTimeout("doSlide('-='+SLIDER_WIDTH+'px',1000);", SLIDER_INTERVAL);
	}else{
		slideIntervalId = setTimeout("doSlide('0px',1000);", SLIDER_INTERVAL);
	}
}

$(document).ready( function(){	
	// Background Part of Slider
	sliderBackground = $('#EasingBackground');
	// Text Part pf Slider
	sliderText = $('#EasingText');
	
	slideIntervalId = setTimeout("doSlide('-='+SLIDER_WIDTH+'px',1000);", SLIDER_INTERVAL);
	
	$("#EasingIndex ul li:not(.active)").live('click',function(){
		if(!isSliding){
			
			isSliding = true;
			clearInterval(slideIntervalId);
			var slideNumber = jQuery.inArray(this,$("#EasingIndex ul li"));
			doSlide(-(SLIDER_WIDTH*slideNumber)+'px',1000);
		}
	});

});

function slideBack(){
	if(!isSliding){
			
		isSliding = true;
		
		if( sliderBackground.position().left + SLIDER_WIDTH < SLIDER_WIDTH*4 ){
			doSlide('+='+SLIDER_WIDTH+'px',1500,'linear','easeInOutElastic');
		}else{
			doSlide('0px',4000);
		}
		
	}
}