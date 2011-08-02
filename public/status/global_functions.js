// *************************************************************
// file: global_styles.js
// created: Aug-23-2001
// modified: February-20-2001
// description: JavaScript fuctions for the corporate Web sites.
// *************************************************************


var beenFocused = false;
document.onmousedown = markFocused;
function markFocused() {
	beenFocused = true;
}


function setFocusOnLoad() {
	if (!beenFocused) { loader(); }
}


// don't submit blank search request....
function isBlank()
{ 
	value=document.search_form.elements['sp-q'].value

	if ( value == "" )
	{ 
		alert("Please enter search word"); 
		return false; 
	} 
	else
	{ 
		return true; 
	} 
} 


/********
 * displays flash content or alternate
 * content is flash not detected. 
********/

function getSecureFlash(width, height, file, loop, alternate, classid)
{
	if (MM_FlashCanPlay)
	{
		var oeTags = '<OBJECT CLASSID="' + classid + '"'
         + 'WIDTH="' + width + '" HEIGHT="' + height + '"'
		 + 'CODEBASE="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">'
         + '<PARAM NAME="MOVIE" VALUE="' + file + '">'
         + '<PARAM NAME="PLAY" VALUE="true">'
         + '<PARAM NAME="LOOP" VALUE="' + loop + '">'
         + '<PARAM NAME="QUALITY" VALUE="high">'
         + '<PARAM NAME="MENU" VALUE="false">'
         + '<EMBED SRC="' + file + '"'
         + 'WIDTH="' + width + '" HEIGHT="' + height + '"'
         + 'PLAY="true"'
         + 'LOOP="' + loop + '"'
         + 'QUALITY="high"'
         + 'MENU="false"'
         + 'TYPE="application/x-shockwave-flash"'
		 + 'PLUGINSPAGE="https://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">'
         + '</EMBED>'
         + '</OBJECT>';
		document.write(oeTags);
	}
	else
	{
		var alternateContent = '<IMG SRC="' + alternate + '" HEIGHT="' + height + '" WIDTH="' + width + '" BORDER="0">'
		document.write(alternateContent);
	}
}

/********
 * displays flash content or alternate
 * content is flash not detected. 
********/

function getFlash(width, height, file, loop, alternate, classid, usemap)
{
	if (MM_FlashCanPlay)
	{
		var curProtocol = "http:";
		if (null != top.location.protocol && top.location.protocol=='https:')
		{
			curProtocol = "https:";
		}
		var oeTags = '<OBJECT CLASSID="' + classid + '"'
         + 'WIDTH="' + width + '" HEIGHT="' + height + '"'
         + 'CODEBASE="' + curProtocol + '//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0">'
         + '<PARAM NAME="MOVIE" VALUE="' + file + '">'
         + '<PARAM NAME="PLAY" VALUE="true">'
         + '<PARAM NAME="LOOP" VALUE="' + loop + '">'
         + '<PARAM NAME="QUALITY" VALUE="high">'
         + '<PARAM NAME="MENU" VALUE="false">'
         + '<EMBED SRC="' + file + '"'
         + 'WIDTH="' + width + '" HEIGHT="' + height + '"'
         + 'PLAY="true"'
         + 'LOOP="' + loop + '"'
         + 'QUALITY="high"'
         + 'MENU="false"'
         + 'TYPE="application/x-shockwave-flash"'
         + 'PLUGINSPAGE="' + curProtocol + '//www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">'
         + '</EMBED>'
         + '</OBJECT>';
		document.write(oeTags);
	}
	else
	{

		var alternateContent = '<IMG SRC="' + alternate + '" HEIGHT="' + height + '" WIDTH="' + width + '" BORDER="0" usemap="' +usemap+ '">'

		document.write(alternateContent);
	}
}

/********
 * Image rollovers for global navigation
********/

function globalNavOver(image_name) {
	image_name.src = "/web-common/assets/rt_blu_arrow.gif";
}

function globalNavOut(image_name) {
	image_name.src = "/web-common/assets/1x1_spacer.gif";
}

/********
 * Image swaping (mouseover) for the Web site
********/

function swapImage(daImage, daSrc){
var objStr, obj;
    if(document.images){
        if (typeof(daImage) == 'string') {
            objStr = 'document.' + daImage;
            obj = eval(objStr);
            obj.src = daSrc;
        } else if ((typeof(daImage) == 'object') && daImage && daImage.src) {
            daImage.src = daSrc;
        }
    }
}

/********
 * Opens a new window
********/

var curPopupWindow = null;

function openWindow(url, winName, width, height, center, winType) {

   var xposition = 50; // Postions the window vertically in px
   var yposition = 50; // Postions the window horizontally in px
   var location, menubar, resizable, scrollbars, status, titlebar;

   if ((parseInt(navigator.appVersion) >= 4 ) && (center)){
       xposition = (screen.width - 800) / 2;
       yposition = (screen.height - 600) / 2;
   } 
   
   if (winType == "1") {           // winType 1 is for regular popup windows
      location=1;
      menubar=1;
      resizable=1;
      scrollbars=1;
      status=1;
      titlebar=1;
   } else if (winType == "2") {   // winType 2 is for Quick Tour like popups
      location=0;
      menubar=0;
      resizable=0;
      scrollbars=0;
      status=0;
      titlebar=1;
   } else if (winType == "3") {   // winType 3 is for footer like popups
      location=0;
      menubar=0;
      resizable=1;
      scrollbars=1;
      status=0;
      titlebar=1;
   } else if (winType == "4") { // winType 4 sforce footer - no resizing
      location=0;
      menubar=0;
      resizable=0;
      scrollbars=1;
      status=0;
      titlebar=0;
   } else if (winType == "5") {
      location=0;
      menubar=1;
      resizable=0;
      scrollbars=1;
      status=0;
      titlebar=0;
   }else {                       // if no arg is passed for winType
      location=1;
      menubar=1;
      resizable=1;
      scrollbars=1;
      status=1;
      titlebar=1;
   } 
   
   // Features to specify for a new window
   args = "width=" + width + ","
   + "height=" + height + ","
   + "location=" + location + ","
   + "menubar=" + menubar + ","
   + "resizable=" + resizable + ","
   + "scrollbars=" + scrollbars + ","
   + "status=" + status + ","
   + "titlebar=" + titlebar + ","
   + "toolbar=0,"
   + "hotkeys=0,"
   + "screenx=" + xposition + ","  //NN Only
   + "screeny=" + yposition + ","  //NN Only
   + "left=" + xposition + ","     //IE Only
   + "top=" + yposition;           //IE Only
   
	// Performs the opening of the window (and closing of a window already opened for that page).
	if (curPopupWindow != null) {
		curPopupWindow.close();
	}
	curPopupWindow = window.open(url, winName, args, false);
	curPopupWindow.focus();
}


/********
 * Opens a URL location in the parent window of a popup
********/

function switchWindows(url) {
   parent.opener.location.href = url; 
}

/********
 * Close tour window and bring up signup screen(s)
********/

function switchAndClose(url) {
   top.opener.location.href=url;    
   top.close();
   top.opener.focus();
}

/********
 * Takes a Select option value and loads it into a higher level frame
********/

function goto_URL(object) {
   parent.frames[0].location.replace(object.options[object.selectedIndex].value);
}

/********
 * Takes a Select option value and loads reloads the URL in the current window
********/

function goto_URL_2(object) {
   location.replace(object.options[object.selectedIndex].value);
}


/********
 * Handdle login stuff.
********/

// sets focus based on existance of username
function loader() {
  var username = document.login_form.username.value;
  if (username != null && username.length > 0) {
    document.login_form.pw.focus();
  } else {
    document.login_form.username.focus();
  }
}


function handleLogin() {
  document.login_form.un.value = document.login_form.username.value;
  document.login_form.width.value = screen.width;
  document.login_form.height.value = screen.height;
}



/********
 * Handdle sforce login stuff.
********/

// sets focus based on existance of username
function sforceLoader() {
  var username = document.login_form.un.value;
  if (username != null && username.length > 0) {
    document.login_form.pw.focus();
  } else {
    document.login_form.un.focus();
  }
}



/********
 * Validate phone number for international countries
********/

function isValidPhoneNumber(num, requiredDigits) {
    var digits = 0;
    if (num == null) return false;
    for( i=0; i<num.length; i++ ){
        var c = num.charCodeAt(i);  
        //convert the i-th character to ascii code value
        if( (c>=48) && (c<=57) ) digits++;
    }    
    return (digits >= requiredDigits);
}

/********
 * Verify that an email addres is valid
 * Written by Paolo Wales (paolo@taize.fr)
********/

function isValidEmail(emailad) {

   var exclude=/[^@\-\.\w]|^[_@\.\-]|[\._\-]{2}|[@\.]{2}|(@)[^@]*\1/;
   var check=/@[\w\-]+\./;
   var checkend=/\.[a-zA-Z]{2,4}$/;
   if(((emailad.search(exclude) != -1) ||
       (emailad.search(check)) == -1) ||
       (emailad.search(checkend) == -1)){
      return false;
   } else {
      return true;
   }
}

/********
 * Ensures valid emails are present and that the sender email doesn't contain
 * an 'salesforce.com' in the sender's domain.
 * 
 * use: for "email a friend" security
 * created by: Scott Yancey
********/

function isValidEmails() {
   
   var recipientEmail = document.forms[0].recipientEmail.value;
   var senderEmail = document.forms[0].senderEmail.value;
   var error = false;
   
   var errorMessage = "The following errors are present:\n\n";
   
   if (recipientEmail.indexOf(',') < 0) {
   		if (!isValidEmail(recipientEmail)){
   			error = true;
			errorMessage += "The recipient's Email address is not valid\n"
   	  }	
   } else {
   
   	 var addresses = new Array();
	 addresses = recipientEmail.split(',');
	 var currentAddress;
	 var i;
	 for (var i=0; i < addresses.length; i++) {      
	
		if (!isValidEmail(trim(addresses[i]))){
   			error = true;
   	    }
		
	 }
	 if (i > 10) {
			error = true;
			errorMessage += "Only 10 addresses are allowed\n"	
	 } 
	 if (error) {
	 	errorMessage += "A recipient's Email address is not valid\n"	
	 } 
	 
   }

   if (!isValidEmail(senderEmail)) {
   	error = true;
	errorMessage += "The sender's Email address is not valid"
   }
   if (senderEmail.indexOf("salesforce.com") >= 0) {
   	error = true;
	errorMessage += "The sender's Email address can not contain 'salesforce.com'."
   }
   
   if (error) {
      alert(errorMessage);
      return false;
   } else {
      return true;
   }
}

/********
*   Removes leading and trailing spaces from the passed string. Also removes
*   consecutive spaces and replaces it with one space. If something besides
*   a string is passed in (null, custom object, etc.) then return the input.
* 
*   created by: Scott Yancey
********/
function trim(inputString) {
   
   if (typeof inputString != "string") { return inputString; }
   var retValue = inputString;
   var ch = retValue.substring(0, 1);
   while (ch == " ") { // Check for spaces at the beginning of the string
      retValue = retValue.substring(1, retValue.length);
      ch = retValue.substring(0, 1);
   }
   ch = retValue.substring(retValue.length-1, retValue.length);
   while (ch == " ") { // Check for spaces at the end of the string
      retValue = retValue.substring(0, retValue.length-1);
      ch = retValue.substring(retValue.length-1, retValue.length);
   }
   while (retValue.indexOf("  ") != -1) { // Note that there are two spaces in the string - look for multiple spaces within the string
      retValue = retValue.substring(0, retValue.indexOf("  ")) + retValue.substring(retValue.indexOf("  ")+1, retValue.length); // Again, there are two spaces in each of the strings
   }
   return retValue; // Return the trimmed string back to the user
} // Ends the "trim" function


/********
 *  Handle form dropdown redirects 
********/

function gotoURL(object) {
    window.location.href = object.options[object.selectedIndex].value;
}


/********
 * Form Validation Function
 *
 * This function serves as a general purpose form validator.  The array constructed is based on the order 
 * of the required form elements of the particular form being validated (determined by the value of "formId").  
 * If the  function detects a required elements is missing information, it prints out the associated name in 
 * the error  message. 
 *
 * created by: Scott Yancey
********/

function validateForm(formId) {
   
   p = new Array();
   if (formId == 1) {         // for the Billing Inquiry page:  /customercare/billing-contact.jsp
      p[6] = "Priority\n";
      p[7] = "Name\n";
      p[8] = "Company Name\n";
      p[9] = "valid E-mail Address\n";
      p[10] = "Subject\n";
      p[11] = "Comment\n";
   } else if (formId == 2) {  // for the US Partner Contact page:  /partners/contact.jsp
      p[4] = "Company\n";
      p[5] = "Street\n";
      p[6] = "City\n";
      p[7] = "State\n";
      p[8] = "Zip\n";
      p[9] = "Country\n";
      p[10] = "Industry\n";
      p[11] = "Revenue\n";
	  p[12] = "Company URL\n";
	  p[13] = "Company HQ\n";
      p[14] = "First Name\n";
      p[15] = "Last Name\n";
	  p[16] = "Title\n";
      p[17] = "Telephone Number\n";
      p[18] = "valid E-mail Address\n";
	  p[19] = "Number of Personnel\n";
	  p[20] = "Referral Source\n";
	  p[22] = "Currently a Customer\n";
	  p[25] = "Primary Area of Interest\n";
	  p[27] = "Business Goals\n";
	  p[28] = "Business Goals\n";
	  p[29] = "Business Goals\n";
	  p[30] = "Business Goals\n";
	  p[31] = "Business Goals\n";
	  p[32] = "Business Goals\n"; 
   } else if (formId == 3) {  // for the US Partner Apply page:  /partners/apply.jsp
      p[5] = "Company\n";
      p[6] = "Street\n";
      p[7] = "City\n";
      p[8] = "State\n";
      p[9] = "Zip\n";
      p[10] = "Country\n";
      p[11] = "Industry\n";
      p[12] = "Number of Employees\n";
	  p[13] = "Annual Revenue\n";
	  p[14] = "Company URL\n";
      p[15] = "First Name\n";
      p[16] = "Last Name\n";
	  p[17] = "Title\n";
      p[18] = "Telephone Number\n";
      p[19] = "Fax Number\n";
	  p[20] = "Mobile Number\n";
	  p[21] = "valid E-mail Address\n";
	  p[23] = "3a\n";
	  p[25] = "3b\n";
	  p[27] = "3c\n";
	  p[29] = "4a\n";
	  p[31] = "4b\n";
	  p[33] = "4c\n";
	  p[35] = "4d\n";
	  p[37] = "5a\n";
	  p[39] = "6a\n";
	  p[41] = "7a\n";
	  p[43] = "7b\n";
	  p[45] = "7c\n";
	  p[47] = "7d\n";
   } else if (formId == 4) {  // for the Partner Invite page:  /partners/invite.jsp
      p[5] = "First Name\n";
      p[6] = "Last Name\n";
      p[8] = "Division\n";
      p[9] = "Telephone Number\n";
      p[10] = "valid E-mail Address\n";
      p[11] = "City\n";
      p[12] = "State/Province\n";
      p[13] = "Country\n";
   }  else if (formId == 5) {  // for the City Tour invite page:  /newsevents/citytour-form.jsp
      p[6] = "First Name\n";
      p[7] = "Last Name\n";
      p[8] = "Title\n";
      p[9] = "Company Name\n";
      p[10] = "Telephone Number\n";
      p[11] = "valid E-mail Address\n";
	  p[12] = "State\n";
   } else if (formId == 6) {  // for the Partner Lead page (STEP 3):  /partners/referral.jsp
      p[18] = "Company\n";
      p[19] = "Street\n";
      p[20] = "City\n";
      p[21] = "State/Province\n";
      p[22] = "Zip/Postal Code\n";
      p[23] = "Country\n";
      p[28] = "Number of Sales, Support & Marketing Personnel\n";
      p[29] = "Primary Area of Interest\n";
      p[30] = "Current System\n";
      p[31] = "First Name\n";
      p[32] = "Last Name\n";
	  p[33] = "Title\n";
      p[34] = "Telephone Number\n";
      p[37] = "valid E-mail Address\n";
      p[41] = "relationship with this referral\n";
      p[43] = "CRM system being evaluated\n";
      p[45] = "timeframe for CRM purchase\n";
      p[47] = "top requirements\n";
      p[49] = "other decision makers & influencers\n";
      p[51] = "suggested next step\n";
      p[53] = "how did you come in contact with this lead\n";
	  p[55] = "CRM needs of this lead\n";
   }  else if (formId == 7) {  // for the EMEA Partner Contact page:  /partners/contact.jsp
      p[3] = "Company\n";
      p[4] = "Street\n";
      p[5] = "City\n";
      p[6] = "Zip/Postal Code\n";
      p[7] = "Country\n";
      p[8] = "Industry\n";
      p[9] = "Revenue\n";
      p[12] = "First Name\n";
      p[131] = "Last Name\n";
      p[15] = "Telephone Number\n";
      p[16] = "valid E-mail Address\n";
   }  else if (formId == 8) {  // for the EMEA Partner Apply page:  /partners/apply.jsp
      p[4] = "Company\n";
      p[5] = "Street\n";
      p[6] = "City\n";
      p[7] = "Postal Code\n";
      p[8] = "Country\n";
      p[9] = "Industry\n";
      p[10] = "Number of Employees\n";
      p[13] = "First Name\n";
      p[14] = "Last Name\n";
      p[16] = "Telephone Number\n";
      p[19] = "valid E-mail Address\n";
   }  else if (formId == 9) {  // for Resource Center WebToLead from:  /us/resource/index.jsp
      p[3] = "First Name\n";
      p[4] = "Last Name\n";
      p[5] = "Company Name\n";
      p[6] = "Web Site URL\n";
      p[7] = "Telephone Number\n";
      p[8] = "valid E-mail Address\n";
      p[9] = "Category\n";
      p[10] = "Description\n";
   }  else if (formId == 10) {  // for Resource Center WebToLead from (STEP 1):  /us/partners/referral.jsp
      p[2] = "First Name\n";
      p[3] = "Last Name\n";
      p[4] = "Title\n";
      p[5] = "Company Name\n";
      p[6] = "Address\n";
      p[7] = "Telephone Number\n";
      p[9] = "valid E-mail Address\n";
   }  else if (formId == 11) {  //    /us/partners/referral.jsp
      p[5] = "First Name\n";
      p[6] = "Last Name\n";
      p[7] = "Company Name\n";
      p[8] = "Telephone Number\n";
      p[10] = "Your Story\n";
   } else if (formId == 12) {  // for cobrand partner form:  /cobrand/contact_me.jsp
      p[7] = "First Name\n";
      p[8] = "Last Name\n";
      p[9] = "Title\n";
      p[10] = "Company Name\n";
      p[11] = "Telephone Number\n";
      p[12] = "valid E-mail Address\n";
	} else if (formId == 13) {  // for the Team Edition info page:  /promos/teamedition.jsp
      p[7] = "First Name\n";
      p[8] = "Last Name\n";
      p[9] = "Title\n";
      p[10] = "Company Name\n";
      p[11] = "Telephone Number\n";
      p[12] = "valid E-mail Address\n";
	  p[13] = "City\n";
	  p[14] = "State\n";
	  p[15] = "Zip\n";
   }
   else if (formId == 14) {  // for the EMEA Team Edition info page:  /ie/promos/teamedition.jsp
      p[7] = "First Name\n";
      p[8] = "Last Name\n";
      p[9] = "Title\n";
      p[10] = "Company Name\n";
      p[11] = "Telephone Number\n";
      p[12] = "valid E-mail Address\n";
	  p[13] = "City\n";
	  p[14] = "Postal Code\n";
   }  else if (formId == 15) {  // for the EMEA City Tour invite page:  /ie/newsevents/citytour-form.jsp
      p[5] = "First Name\n";
      p[6] = "Last Name\n";
      p[7] = "Job Title\n";
      p[8] = "Company Name\n";
	  p[9] = "City\n";
      p[10] = "Country\n";
      p[11] = "Telephone Number\n";
      p[12] = "valid E-mail Address\n";
	}
   else if (formId == 16) {         // for the EMEA Billing Inquiry page:  /customercare/billing-contact.jsp
      p[7] = "Priority\n";
      p[8] = "Name\n";
      p[9] = "Company Name\n";
      p[10] = "valid E-mail Address\n";
      p[11] = "Subject\n";
      p[12] = "Comment\n";
   }else {
      alert("INTERNAL ERROR: No form ID passed. Please attempt this action at a later time.");
      return false;
   }

   var errorMessage = "Please fix the following errors: \n\n";
   var errorFound = 0;
   var checkedFound = false;
   var count = 1;
   	
   for(i=0; i < p.length; i++ ){
      var error = false;
      if (p[i] != null) {
         var elem = document.forms[2].elements[i];
         if (elem.type == "text" || elem.type == "textarea") {
            if (p[i] == "valid E-mail Address\n") {  // tests to see if an email field is being validated, and if so, it uses the isValidEmail function to ensure a properly formatted address is given
               if (!isValidEmail(elem.value)) {  
                  error = true;
               }
            } else if (elem.value.length == 0) {  // test for text and text area boxes
               error = true;
            } 
         } else if (elem.type == "select-one") {  // test for select boxes
            if (elem.selectedIndex == 0) {
               error = true;
            }
         } 
      }
      if (error) {
         errorFound = 1;
         if (elem.type == "textarea") {
		 	errorMessage += "Please enter ";
		 } else if (elem.type == "select-one") {
		 	errorMessage += "Please select a ";
		 } else {
		 	errorMessage += "Please enter a ";
		 }
         errorMessage += p[i];
      }
   }
   
   // Fabulous one off solution for validating check boxes on the Partner contact form
   var checkFound = false;
   if (formId == 2) {
   	for(i=27; i < 32; i++){
		if (isChecked(document.forms[0].elements[i])) {
			checkFound = true;
		}	
	}
	if (!checkFound) {
		errorMessage += "Please select a Business Goal";	
	}
   }
   // end one off soultion
   
   if (errorFound == 1) {
      alert(errorMessage);
      return false;
   } else {
      return true;
   }
}

function isChecked(object) {
    if (object.checked) return true;
    else return false;
}

/******** 
 * Used to get query string arguments before user
 * has a chance to alter them on the billing inqury form.
 * (billing-contact.jsp)
********/

function billFormInit()
{
	if (document.webtocase)
	{
	    var args = getArgs();
	    //show email field if not supplied -
	    //set value to empty string if null
	    var eml = args["eml"];
		document.webtocase.email.value = (eml != null ? eml : "");
	
	    //show name field if not supplied -
	    //set value to empty string if null
	    var nm = args["nm"];
		document.webtocase.first_name.value = (nm != null ? nm : "");
		
	    //show company field if not supplied -
	    //set value to empty string if null
	    var co = args["co"];
	    document.webtocase.company.value  = (co != null ? co : "");
	}
}

/********
 * parses name=value argument pairs from
 * the query string of the URL. It stores the pairs in 
 * properties of an object and returns that object from the
 * billing inqury form. (billing-contact.jsp)
********/

function getArgs() {
    var args = new Object();

    // Get query string.
    var query = location.search.substring(1);  

    // Break at ampersand.
    var pairs = query.split("&"); 

       for (var i = 0; i < pairs.length; i++) {
       // Look for "name=value"
       var pos = pairs[i].indexOf('=');

       // If not found, skip.
       if (pos == -1) continue; 
               
       // Extract the name.              
       var argname = pairs[i].substring(0,pos);  
            
       // Extract the value.
       var value = pairs[i].substring(pos+1);
            
       // Store as a property. 
       args[argname] = unescape(value);       
     }
   return args;
}

/**
* Used by login to change a request param used to communicate to the App whether a brower 
* supports Javascript.
*/
function setAppJSFlag(doc, jSparam) {
	if (doc != null && jSparam != null) {
		doc.getElementById(jSparam).value = 1;
	}
}


function launchDemo(url){
	var winwidth=screen.width;
	var winheight=screen.height;
	var scroll="";

	if(winwidth>1000){
		winwidth=1020;
		winheight=700;
		scroll="no";
	}else if(winwidth<1000){
		winwidth=790;
		winheight=530;
		scroll="yes";
	}
	url=url+"&scroll="+scroll;
	newWindow=window.open(url,"Demo","toolbar=no,scrollbars=no,resizable=no,width="+winwidth+",height="+winheight+",left=0,top=0");
}
