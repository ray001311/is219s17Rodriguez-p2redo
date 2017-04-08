// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function getQueryParams(qs) {
  qs = qs.split("+").join(" ");
  var params = {},
  tokens,
  re = /[?&]?([^=]+)=([^&]*)/g;
  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  return params;
}

var $_GET = getQueryParams(document.location.search);
console.log($_GET["json"]); 

function GalleryImage(location, description, date, img) {
  this.location = location;
  this.description = description;
  this.date = date;
  this.img = img;
	//implement me as an object to hold the following data about an image:
	//1. location where photo was taken
	//2. description of photo
	//3. the date when the photo was taken
	//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
}
// Counter for the mImages array
var mCurrentIndex = 0;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = '../images.json';
//console.log(typeof $_GET);
if (typeof $_GET["json"] !== 'undefined'){
  mUrl = '../' + $_GET["json"];
} 
//console.log(mUrl);
// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();
mRequest.onreadystatechange = function(){
  if (mRequest.readyState == 4 && mRequest.status == 200){
    try {
      mJson = JSON.parse(mRequest.responseText);
      console.log(mJson);
      
      for (var i = 0; i < mJson.images.length; i++){
        var myLine = mJson.images[i];
        var myImg = new GalleryImage(myLine.imgLocation, myLine.description, myLine.date, myLine.imgPath);
        mImages.push(myImg);
      }
    }
    catch(err){
      console.log(err.message);
    }
  }
}
mRequest.open("GET", mUrl, true);
mRequest.send();

console.log(mImages);
var first = true;

function swapPhoto() {
  //$("#slideShow")
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded 
	//from the JSON string
	console.log('swap photo');
  if (mCurrentIndex >= mImages.length){
    mCurrentIndex = 0;
  }
  
  else if(first == true){
  first = false;
  }

  else if(mCurrentIndex < 0){
    mCurrentIndex = mImages.length - 1;
  }
  console.log(mCurrentIndex);
  $("#photo").attr("src", mImages[mCurrentIndex].img);
  $('.location').text("Location: " + mImages[mCurrentIndex].location);
  $('.description').text("Description: " + mImages[mCurrentIndex].description);
  $('.date').text("Date: " + mImages[mCurrentIndex].date);  
  mCurrentIndex++;
  
}

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();
	
  //have the more indicator button clickable
  $('.moreIndicator').click(function(){
    $('.details').eq(0).toggle();
    $(this).toggleClass("rot90");
    $(this).toggleClass("rot270");
  });
  
  $('#nextPhoto').click(function(){
    //mCurrentIndex += 1;
    first = false;
    mLastFrameTime = 0;
    swapPhoto();
  });
  
  $('#prevPhoto').click(function(){
    mCurrentIndex = mCurrentIndex - 2;
    first=false;
    mLastFrameTime = 0;
    swapPhoto();
  });
});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);

