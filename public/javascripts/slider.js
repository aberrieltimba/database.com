
var SLIDER_WIDTH = 938;
var isSliding = false;



function doSlide(leftPos,duration,backease,textease){
	
	if(typeof backease == 'undefined')
		backease = "easeInQuart";
		
	if(typeof textease == 'undefined')
		backease = "linear";
	
	sliderBackground.animate(
		{"left": leftPos}, 
		{
			"duration": duration,
			"easing": backease
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
	
}

$(document).ready( function(){	
	// Background Part of Slider
	sliderBackground = $('#EasingBackground');
	// Text Part pf Slider
	sliderText = $('#EasingText');
	
	$('#SliderWrapper').click(function(){
		
		if(!isSliding){
			
			isSliding = true;
			
			if( sliderBackground.position().left - SLIDER_WIDTH > SLIDER_WIDTH*-4 ){
				doSlide('-='+SLIDER_WIDTH+'px',1500);
			}else{
				doSlide('0',4000);
			}
			
		}
	});

});

function slideBack(){
	if(!isSliding){
			
			isSliding = true;
			
			if( sliderBackground.position().left + SLIDER_WIDTH < SLIDER_WIDTH*4 ){
				doSlide('+='+SLIDER_WIDTH+'px',1500,'linear','easeInOutElastic');
			}else{
				doSlide('0',4000);
			}
			
		}
}