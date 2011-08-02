/* SiteCatalyst code version: H.22
Copyright 1997-2008 Omniture, Inc. More info available at
http://www.omniture.com */
var s_account = Server.getAccount();
var s=s_gi(s_account);

/************************** CONFIG SECTION **************************/
/* You may add or alter any code config here. */
/* Conversion Config */
s.currencyCode="USD"
/* Link Tracking Config */
s.trackDownloadLinks=true
s.trackExternalLinks=true
s.trackInlineStats=true
s.linkDownloadFileTypes=".exe,.zip,.wav,.mp3,.mov,.mpg,.avi,.wmv,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.eps"
s.linkInternalFilters="javascript:,.salesforce.com,.force.com,.successforce.com,.salesforce.co.jp,opinionlab.com"
s.linkLeaveQueryString=false
s.linkTrackVars="None"
s.linkTrackEvents="None"
/* DynamicObjectIDs config */
function s_getObjectID(o){
	var ID=o.href;
	return ID;
}
s.getObjectID=s_getObjectID

/* OpinionLab integration */
try{
	custom_var=Page.getLocale()+'|'+vp.getType()+'|'+Page.getSegment()+'|'+vp.getTypeDetailed()+'|'+vp.getVisitNumber()+'|'+Page.getName();
}catch(ex){}
/* ForeSee integration */
try{
	FSR.CPPS.set('siteLocale', Page.getLocale());
	FSR.CPPS.set('visitorType', vp.getType());
	FSR.CPPS.set('segment', Page.getSegment());
	FSR.CPPS.set('visitorTypeDetailed', vp.getTypeDetailed());
	FSR.CPPS.set('visitNumber', vp.getVisitNumber());
	FSR.CPPS.set('previousPage', Page.getName());
}catch(ex){}

/* Plugin Config */
s.usePlugins=true
function s_doPlugins(s) {
	// ClickMap DYNAMIC OBJECT IDs
	s.setupDynamicObjectIDs();

	// clear s.events
	s.manageVars('clearVars','events,products,campaign,prop22,prop36,prop40,eVar11,eVar20,eVar22,eVar30,eVar32,eVar37,eVar44');
		
	/* vars */
	// PAGE, CHANNEL, SERVER, LOCALE
	s.pageName=s.pageName?s.pageName:Page.getName();
	s.charSet="UTF-8";
	s.channel=s.eVar6=Page.getChannel();
	s.server=Page.getServer();
	s.eVar3=Page.getLocale();
	// previous page
	if(!s.pageLoaded){
		s.prevPage=Page.getPrevious();
		s.prop35=s.prevPage?s.prevPage:'[NO PREVIOUS PAGE AVAILABLE]';
	}
	
	// PAGE WITHOUT LOCALE
	s.prop39=Page.getNameNoLocale();
	
	// PAGE TYPE & CLOUD
	s.eVar36=Page.getType();
	s.eVar35=Page.getCloud();
	
	// PAGE SCORES
	s.eVar45=Page.getScore('to')?'+'+Page.getScore('to'):'';
	s.eVar46=Page.getScore('sa')?'+'+Page.getScore('sa'):'';
	s.eVar47=Page.getScore('se')?'+'+Page.getScore('se'):'';
	s.eVar48=Page.getScore('cu')?'+'+Page.getScore('cu'):'';
	s.eVar49=Page.getScore('co')?'+'+Page.getScore('co'):'';
	s.eVar50=Page.getScore('sm')?'+'+Page.getScore('sm'):'';
	if(s.eVar45&&!s.pageLoaded){
		s.events=s.apl(s.events,'event6',',',2);
		s.products=';'+s.eVar35+';;;event6='+Page.getScore('to');
	}

	// to expire cookies
	s.expDate=new Date();
	s.expDate.setDate(s.expDate.getDate()-1);
	
	// FIX REFERRER IF NECESSARY
	// look for overwrite referrer
	s.referrer=Page.getReferrer();
	
	// BROWSER HEIGHT/WIDTH
	// % page viewed
	if(!s.pageLoaded){
		s.prop37=s.getPercentPageViewed();
		if(s.prop37<=0||!s.prop35||s.c_r('s_ppv_x')=='true'){
			s.prop37='100|0';
			s.c_w('s_ppv_x','');
		}
	}
	// override browser h/w on iframes
	if(top!=self){
		s.browserWidth=s.browserHeight='';
		s.c_w('s_ppv_x', 'true');
	}
	
	// NAV CLICKS
	if(s.c_r('c34')&&!s.pageLoaded){
		s.prop21=s.c_r('c21');
		s.prop34=s.c_r('c34');
		s.events=s.apl(s.events,'event2',',',2);
		s.c_w('c21','',s.expDate);
		s.c_w('c34','',s.expDate);
	}
	// SUPER SASSY
	if(s.c_r('v2')&&!s.pageLoaded){
		s.eVar2=s.c_r('v2');
		s.c_w('v2','',s.expDate);
	}
	
	// PAGE URL
	s.pageURL=window.location.href;
	s.prop8=s.pageURL.replace(window.location.search,'');
		
	// PAGE VIEW EVENT / # OF PAGE VIEWS
	s.events=s.events?s.events:'';
	s.events=s.apl(s.events,'event11',',',2);
	s.eVar17=s.eVar26='+1';
	
	// +4 PV VISITS
	if(vp.getActivity('pv')>3){
		s.events=s.apl(s.events,'event5',',',2);
	}
	// SECOND PAGE OF VISIT
	if(vp.getActivity('pv')==2){
		s.prop10='D=pageName';	
	}
	
	// VISITOR TYPE
	s.prop9=vp.getVersion();
	s.eVar14=vp.getType();
	s.prop49=Page.getSegment();
	s.prop27=vp.getTypeDetailed();
	
	// LOGIN TYPE
	if(Page.isLogin()){
		if(vp.hasCurrentTrial()){
			s.prop31='freetrial';
			s.events=s.apl(s.events,'event44',',',2);
		}else if(s.eVar14=='developer'){
			s.prop31='developer';
		}else{
			s.prop31='customer';
		}
	}

	// LOGIN COOKIE QA
	if(vp.OrgInfo.getStatus()||vp.OrgInfo.getType()){
		s.prop5=vp.OrgInfo.getStatus()+'|'+vp.OrgInfo.getType();
		if(s.prop5.charAt(0)=='|') s.prop5='no status'+s.prop5;
		if(s.prop5.charAt(s.prop5.length-1)=='|') s.prop5=s.prop5+'no type';
		s.prop5+='|'+s.eVar14;
	}
	
	// VISITOR TYPE PATHING
	s.prop15=s.eVar14+":"+s.pageName;
	
	// TARGETING (DEMANDBASE/BIZO)
	s.db=vp.getTargeting('db','size');
	s.bizo=vp.getTargeting('bizo','size');
	s.eVar10='DB='+(s.db?s.db:'[NO DATA]')+'|BIZO='+(s.bizo?s.bizo:'[NO DATA]');
	s.db=vp.getTargeting('db','ind');
	s.bizo=vp.getTargeting('bizo','ind');
	s.eVar41='DB='+(s.db?s.db:'[NO DATA]')+'|BIZO='+(s.bizo?s.bizo:'[NO DATA]');
	s.db=vp.getTargeting('db','name');
	s.eVar52='DB='+(s.db?s.db:'[NO DATA]')+'|SFDC='+(vp.getCompanyName()?vp.getCompanyName():'[NO DATA]');
	
	// PRODUCT VIEWS
	if(Page.isProductCategory()){
		s.events=s.apl(s.events,'scRemove',',',2);
	}
	
	// FLASH VERSION
	s.detectRIA('c16','prop16','','','','');
	
	// TIME PARTING
	s.tpDate=new Date();
	s.eVar24=s.getTimeParting('h','-8',s.tpDate.getFullYear());  // hour
	s.eVar25=s.getTimeParting('d','-8',s.tpDate.getFullYear());  // day
	
	// 404 ERRORS
	if (Page.is404()) {
		s.pageType='errorPage';
		s.prop29='D=g';
	}

	// INTERNAL SEARCH + ORIGINATION
	s.searchTerm=Page.getSearchTerm();
	s.eVar12=s.searchTerm;
	// search locale
	s.prop11=s.eVar12?Page.getSearchLocale():'';
	// # of results
	s.prop47=Page.getNumSearchResults();
	s.searchTerm=s.getValOnce(s.eVar12,'v12',0);
	if(s.searchTerm){
		s.events=s.apl(s.events,'event12',',',2);
		
		// # of searches
		s.eVar33='+1';
		
		// no clicks yet
		s.c_w('nsc','-');
	}
	if(s.getQueryParam('fromSearch')=='true'){
		s.events=s.apl(s.events,'event38',',',2);
		s.c_w('nsc',parseInt(s.c_r('nsc'))?parseInt(s.c_r('nsc'))+1:1);
		if(s.c_r('nsc')<=1){
			s.events=s.apl(s.events,'event39',',',2);
		}
		if(s.getQueryParam('promotion')=='true'){
			s.eVar51='promotion';
		}else{
			s.eVar51='organic';	
		}
		s.prop51=s.eVar51+'|'+(vp.getActivity('l_search')?vp.getActivity('l_search'):'[NO KEYWORD AVAILABLE]');
	}
	
	// CUSTOM EXITS
	s.exitUrl=s.linkHandler('','e');
	if(s.exitUrl&&s.pageName.indexOf('news-press')>-1){
		s.linkName='pr_page:'+s.exitUrl;
	}
	
	// SOCIAL SHARING
	if(s.shareChannel){
		s.events=s.apl(s.events,'event26',',',2);
		s.linkTrackVars=s.apl(s.linkTrackVars,'events',',',2);
		s.linkTrackVars=s.apl(s.linkTrackVars,'eVar53',',',2);
		s.linkTrackEvents=s.apl(s.linkTrackEvents,'event26',',',2);
		s.eVar53=s.shareChannel;
		s.linkName=s.eVar53+': social share';
		s.shareChannel='';
	}

	// FILE DOWNLOADS + ORIGINATION
	s.downloadUrl=s.linkHandler('','d','',1);
	if(s.downloadUrl){
		s.eVar13=s.repl(s.downloadUrl,'https://','');
		s.eVar13=s.repl(s.eVar13,'http://','');
		s.events=s.apl(s.events,'event13',',',2);
	
		// new pagename
		s.downloadUrl=s.eVar13.substring(s.eVar13.indexOf('/')+1);
		s.downloadUrl=s.repl(s.downloadUrl,'/',':');
		s.pageName=s.server+':'+s.eVar6+':file:'+s.downloadUrl;
	}
	
	// TIME BETWEEN PAGES
	s.prop17=vp.getIdleTime();
	
	// VISIT NUMBER
	s.eVar34=vp.getVisitNumber();
	if (vp.isNewSession()) {
		if(vp.isNewVisitor()){
			s.events=s.apl(s.events,'event36',',',2);
		}else{
			s.events=s.apl(s.events,'event37',',',2);
		}
		s.nve='nve';
		s.nve=s.getValOnce(s.nve,'nve',0);
	}
	
	// DAYS SINCE LAST VISIT
	s.eVar4=vp.getDaysSinceLastVisit();
	
	// RESPONSYS ID
	s.eVar42=s.getQueryParam('RRID')?s.getQueryParam('RRID'):s.getQueryParam('eid');
	s.eVar42=s.getValOnce(s.eVar42,'v42',0);
	
	// CAMPAIGNS
	s.driver=Page.getDriver();;
	if(s.driver) {
		if(s.driver.type=='internal') {
			// internal campaign
			s.eVar22=s.getValOnce(s.driver.id,'v22');		
			if(s.eVar22){
				s.events=s.apl(s.events,'event20',',',2);

				// cross visit
				s.eVar29=s.cvpSimple(s.eVar22,'v29','365','5',' ^ ');
				
				// add previous page
				s.eVar22=s.prop35+'|'+s.eVar22;
			}
		}else{
			if((s.driver.type=='Typed/Bookmarked'||s.driver.type=='Force.com')&&s.c_r('v0')) s.driver.id='';
			s.driver.id=s.getValOnce(s.driver.id,'v0',0);
			
			if(s.driver.id){
				s.campaign=s.driver.id;
				if(s.driver.type=='SEO'||s.driver.type=='SEM'){
					s.eVar11=s.driver.keyword;
					s.eVar37=s.driver.engine;
					s.events=s.apl(s.events,'event18',',',2);
					
					// keyword pathing
					s.prop36=s.getAndPersistValue(s.driver.type+'|'+s.driver.keyword,'c36',0);
					
					if(s.driver.type=='SEO'){
						s.events=s.apl(s.events,'event15',',',2);
					}else if(s.driver.type=='SEM'){
						s.events=s.apl(s.events,'event14',',',2);
					}
					
					// get Google ranking if available
					//if(s.driver.engine.toLowerCase().indexOf('google')>-1){
					//	s.eVar32=s.getQueryParam('cd','',document.referrer);
					//}
				}
				
				// DRIVER TYPE PATHING
				s.prop22=s.prop40=s.getAndPersistValue(s.driver.type,'c22',0);
				
				// CROSS-VISIT DRIVER TYPE
				s.eVar44=s.cvpSimple(s.driver.type,'v44','365','5',' ^ ');
				
				// CROSS-VISIT DRIVER
				s.eVar30=s.cvpSimple(s.driver.id,'v30','365','5',' ^ ');
			}
		}
	}
	
	// CTA TRACKING
	if(s.dynamicCTAs){
		s.products=s.dynamicCTAs;
	} else {
		s.products=s.trackCTAs(Page.getCTAs(),(s.driver&&s.driver.type=='internal'?s.driver.id:''));
	}
	if(s.products){
		s.products=(s.products==s.oldProducts)?'':s.products;	
		s.oldProducts=s.products;
	}
	s.events=s.products.indexOf('event19')==-1?s.events:s.apl(s.events,'event19',',',2);
	s.events=s.products.indexOf('event25')==-1?s.events:s.apl(s.events,'event25',',',2);
	if(s.linkType&&s.products){
		s.linkTrackVars=s.apl(s.linkTrackVars,'products',',',2);
		s.linkTrackVars=s.apl(s.linkTrackVars,'events',',',2);
		s.linkTrackEvents=s.apl(s.linkTrackEvents,'event19',',',2);
		s.linkTrackEvents=s.apl(s.linkTrackEvents,'event25',',',2);
	}
	
	// CONVERTING PAGE
	if((s.campaign||s.eVar22||(Page.hasLeadCaptureForm()&&!s.c_r('v20')))&&!s.pageLoaded){
		if(s.prevPage){
			s.eVar20=s.prevPage;
		}else if(!s.c_r('v20')){
			s.eVar20='Direct Landing';
		}
		if(s.eVar20) s.c_w('v20',s.eVar20);
	}
			
	// FORM VIEWS AND COMPLETES
	if(Page.hasLeadCaptureForm()){
		s.prop41=Page.isFormBuilderForm()?'D=c8':'';
		s.offerId=(s.eVar28&&s.eVar28.indexOf('|')==-1)?s.eVar28:Page.getNameCaptureId();
		if(s.offerId&&(!s.pageLoaded||s.linkName)){
			s.c_w('lastOffer',s.offerId+':view');
			s.eVar28=s.getValOnce(s.offerId,'v28');
			s.eVar31=s.eVar28?s.cvpSimple(s.eVar28,'v31','365','5',' ^ '):'';
			s.offerId=s.pageName+'|'+s.offerId;
			s.offerId=(s.prop41?'form-builder':'old-form')+'|'+s.offerId;
			if(s.eVar28&&s.eVar28.indexOf(s.pageName)==-1){
				s.eVar28=s.offerId;
				s.prop30='D=v28';
			}
		}
		s.events=s.eVar28?s.apl(s.events,'event16',',',2):s.events;
		s.eVar21=Page.getTestName();
		if(s.eVar21){
			s.c_w('v21',s.eVar21);	
		}
	}else if(Page.isConfirmation()&&vp.WebCmp.getCampaignMemberId()&&!Page.isError()){
		s.transactionID=s.getValOnce(vp.WebCmp.getCampaignMemberId(),'xact',0);
		s.eVar5=s.getValOnce(vp.WebCmp.getFormCampaignMemberId(),'v5',0);
		if(s.transactionID&&s.eVar5) vp.WebCmp.nuke();
		// hack
		if(s.pageName.indexOf('conf:contactme_chatter')>-1){
			s.transactionID=s.eVar5='';
		}
		s.lastOffer=s.c_r('lastOffer');
		if(s.transactionID&&s.getQueryParam('redirect')=='true'){
			s.events=s.apl(s.events,'event23:'+s.transactionID,',',2);
			s.eVar28=Util.convert15To18(vp.WebCmp.getFormCampaignId()?vp.WebCmp.getFormCampaignId():s.getQueryParam('FormCampaignId'));
			if(s.eVar28)s.eVar28='form-builder|'+s.prop35+'|'+s.eVar28;
		}else if(s.transactionID&&(s.lastOffer.indexOf(':view')>-1||(!s.c_r('v28')&&!s.c_r('lastOffer')))){
			if(s.lastOffer) s.c_w('lastOffer',s.repl(s.lastOffer,':view',':complete'));
			s.events=s.apl(s.events,'event17:'+s.transactionID,',',2);
			if (Page.isDemo()) s.events=s.apl(s.events,'event21:'+s.transactionID,',',2);
			if (Page.isSignup()) s.events=s.apl(s.events,'event22:'+s.transactionID,',',2);
			s.eVar43='+1';
			s.eVar54=vp.getFirstFormCompleteTime();
		}else{
			s.transactionID='';
		}
		if(s.transactionID){
			// FORM FIELDS
			s.eVar16=vp.getCompanyEmployees() ? vp.getCompanyEmployees() : s.defaultValues.formCompanyEmployees;
			s.eVar18=vp.getCompanyCountry() ? vp.getCompanyCountry() : s.defaultValues.formCompanyCountry;
			s.eVar19=vp.getPrimaryProductInterest() ? vp.getPrimaryProductInterest() : s.defaultValues.formPrimaryProductInterest;
			s.eVar38=vp.getCompanyName() ? vp.getCompanyName() : s.defaultValues.formCompanyName;
			if(s.c_r('v21')){
				s.eVar21=s.c_r('v21');
				s.c_w('v21','',s.expDate);
			}
		}
	}else if(Page.isError()){
		s.events=s.apl(s.events,'event1',',',2);
		s.transactionID=s.getValOnce(vp.WebCmp.getCampaignMemberId(),'xact',0);
	}else{
		s.transactionID='';
	}
	
	// FORM ERROR TRACKING
	if(s.prop52){
		s.prop30=s.offerId;
		s.events=s.apl(s.events,'event43',',',2);
		s.linkTrackVars=s.apl(s.linkTrackVars,'prop30',',',2);
		s.linkTrackVars=s.apl(s.linkTrackVars,'prop52',',',2);
		s.linkTrackVars=s.apl(s.linkTrackVars,'events',',',2);
		s.linkTrackEvents=s.apl(s.linkTrackEvents,'event43',',',2);
	}
	
	// DEFAULT DRIVER/PLACEMENT/OFFER WHEN NONE PRESENT
	if(s.events.indexOf('event17')>-1){
		if(!s.c_r('v29')) s.eVar29='[NO INTERNAL PLACEMENT ID]';
		if(!s.c_r('v30')) s.eVar30='[NO DRIVER ID]';
		if(!s.c_r('v31')) s.eVar31='[NO OFFER ID]';
		
		if(!s.c_r('v28')) s.eVar28='[NO OFFER ID]';
		if(!s.c_r('v22')) s.eVar22='[NO INTERNAL PLACEMENT ID]';
	
		// WIPE OUT DRIVER/PLACEMENT/OFFER/CONVERTING PAGE
		s.c_w('v0','',s.expDate);
		s.c_w('v20','',s.expDate);
		s.c_w('v22','',s.expDate);
		s.c_w('v28','',s.expDate);
	}
	
	// DRIVER & SEO KEYWORD PATHING
	s.prop24=s.getAndPersistValue(s.campaign,'c24',0);
	s.prop24=s.prop24?s.prop24+":"+s.pageName:'';
	s.prop36=s.getAndPersistValue('','c36',0);
	s.prop36=s.prop36?s.prop36+":"+s.pageName:'';
	s.prop22=s.getAndPersistValue('','c22',0);
	s.prop22=s.prop22?s.prop22+":"+s.pageName:'';
	if(s.c_r('c40')||s.prop40){
		if (!s.prop40||(s.prop40==s.c_r('c40'))) s.prop40='did not bounce';
		else if (s.prop40!=s.c_r('c40')) s.prop40=s.getAndPersistValue(s.prop40,'c40',0);
	}
	
	// REPORT SUITES
	s.prop50=Server.getAccount();
	
	// T&T INTEGRATION/PATHING
	s.tnt=s.deDupe(s.trackTNT(),',');
	s.prop20=s.tnt?'D=c8':'';
	s.prop48=s.getAndPersistValue(s.tnt,'c48',0);
	s.prop48=s.prop48?s.prop48+":"+s.pageName:'';
	if(!s.eVar21){
		s.c_w('v21','',s.expDate);
	}
	
	// ADD EXTRA PARAMETERS ON LINKS
	s.clicked=s.p_go();
	if(s.clicked&&s.clicked.href){
		// internal drivers
		if(s.clicked.href.indexOf('d=')>-1){
			s.clicked.href=s.clicked.href+'&internal=true';
		}
		try{
			// dreamforce registration
			s.dfSite='dreamevent.secure.force.com/dreamforce';
			if(s.clicked.href.indexOf(s.dfSite)>-1){
				s.clicked.href=s.clicked.href.indexOf(s.dfSite+'/')>-1?s.clicked.href:s.clicked.href.replace(s.dfSite,s.dfSite+'/');
				s.clicked.href+=(s.clicked.href.indexOf('?')>-1?'&':'?')+'wl='+Page.getLocale()+'&wt='+vp.getType();
				s.clicked.href+=(s.clicked.href.indexOf('?')>-1?'&':'?')+'mboxSession='+mboxFactoryDefault.getSessionId().getId();
			}
		}catch(ex){}
	}
	
	// CAMPAIGN TYPE
	s.prop4=s.getQueryParam('ctype');

	// DYNAMIC VARIABLE SYNTAX
	s.prop1=s.eVar1='D=g';
	s.prop2=s.eVar3?'D=v3':'';
	s.channel=s.eVar6?'D=v6':'';
	s.prop12=s.eVar12?'D=v12':'';
	s.prop13=s.eVar13?'D=v13':'';
	s.prop14=s.eVar14?'D=v14':'';
	s.prop18=s.eVar24?'D=v24':'';
	s.prop19=s.eVar25?'D=v25':'';
	s.prop23=s.eVar34?'D=v34':'';
	s.prop32=s.eVar35?'D=v35':'';
	s.prop33=s.eVar36?'D=v36':'';
	s.prop38=s.eVar2?'D=v2':'';
	s.eVar8=s.pageName?'D=pageName':'';
	s.eVar23=s.transactionID?'D=xact':'';
	s.eVar27=s.campaign?'D=v0':'';
	s.eVar39=s.prop35?'D=c35':'';
	
	// MODULE TRACKING
	if(s.c_r('v32')&&(s.linkType||!s.pageLoaded)){
		s.eVar32=s.c_r('v32');
		s.c_w('v32','');
		if(s.linkType){
			s.linkTrackVars=s.apl(s.linkTrackVars,'eVar32',',',2);
		}
	}
	
	// always send prop49, eVar34, eVar8
	s.linkTrackVars=s.apl(s.linkTrackVars,'prop49',',',2);
	s.linkTrackVars=s.apl(s.linkTrackVars,'eVar34',',',2);
	s.linkTrackVars=s.apl(s.linkTrackVars,'eVar8',',',2);
	s.linkTrackVars=s.apl(s.linkTrackVars,'eVar35',',',2);
	
	// to prevent some code from firing more than once
	s.pageLoaded=true;
}
s.doPlugins=s_doPlugins
/************************** PLUGINS SECTION *************************/
/* You may insert any plugins you wish to use here.                 */
// nav clicks
try{
	(function($){
		$('#header a, #nav a, #footer a, #seo-container a, .module-spotlight a, .module-simple-tabs a, .module-simple-pods a, #sidebar a, #billboard a, #homepage-products a, #clouds-bounce a').click(function(){
			s.trackModules(this);
		});
		
		$('.sf-menu a, #nav a').click(function(){
			s.trackModules(this);
			var parent=$(this).siblings('.catheader:first').html();
			var tab=$(this).parents('.primaryli').find('a.primary').html();
			parent=parent==null?'':parent+':';
			tab=tab==null?'':tab+':';
			s.prop34=tab+parent+$(this).html();
			s.prop34=$.trim(s.prop34);
			s.prop34=s.prop34.toLowerCase();
			s.prop34=s.prop34.replace(/<\/?[^>]+(>|$)/g,'');
			s.prop34=s.prop34.replace('&amp;','&');
			s.prop34=s.prop34.replace('\n', ' ');
			s.prop21=$('#menu_alternate').hasClass('version2')  ? 'version 2' : 'version 1';
			if($(this).attr('href')&&($(this).attr('href').indexOf('http://')>-1||$(this).attr('href').indexOf('.force.com')>-1||$(this).attr('href')=='/community/')){
				s.prop35=s.pageName;
				s.events=s.apl(s.events,'event2',',',2);
				s.linkTrackVars=s.apl(s.linkTrackVars,'prop21',',',2);
				s.linkTrackVars=s.apl(s.linkTrackVars,'prop34',',',2);
				s.linkTrackVars=s.apl(s.linkTrackVars,'prop35',',',2);
				s.linkTrackVars=s.apl(s.linkTrackVars,'eVar39',',',2);
				s.linkTrackVars=s.apl(s.linkTrackVars,'events',',',2);
				s.linkTrackEvents=s.apl(s.linkTrackEvents,'event2',',',2);
				if($(this).attr('href').indexOf('.force.com')>-1||$(this).attr('href')=='/community/'){
					s.tl(this,'o','Topnav click');
				}
			}else{
				s.c_w('c21',s.prop21);
				s.c_w('c34',s.prop34);
			}
		});
	
		$('#newsticker-demo a').click(function(){
			s.eVar2=$(this).attr('title');
			s.eVar2=s.eVar2?'ss:'+s.eVar2.toLowerCase():'';
			s.eVar2=s.repl(s.eVar2,'&amp;','&');
			if($(this).attr('href').indexOf('.force.com')>-1){
				s.linkTrackVars='eVar2,prop38';
				s.tl(this,'o','Super-sassy click');
			}else{
				s.c_w('v2',s.eVar2);
			}
		});
	
		$('.seo_link,.readmore,#seo-header-wrap li a,#seo-expand-trigger-container').click(function(){
			if ($(this).attr('class').indexOf('readmore') > -1 || $(this).attr('id')=='seo-expand-trigger-container') {
				s.linkName='read more';
			} else if ($(this).attr('title')){
				s.linkName=$(this).attr('title');
			} else {
				s.linkName=$(this).html();	
			}
			s.linkName+='|'+s.pageName;
			s.tl(this,'o',s.linkName);
		});
	})(jQuery);
}catch(ex){}

s.defaultValues = {
	formCompanyCountry: '[FORM:NO COUNTRY]',
	formCompanyEmployees : '[FORM:NO COMPANY SIZE]',
	formPrimaryProductInterest : '[FORM:NO PRIMARY PRODUCT INTEREST]',
	formProductInterests : '[FORM:NO ALL PRODUCT INTEREST]',
	formCompanyName : '[FORM:NO COMPANY NAME]'
};

s.trackModules = function(obj) {
	/* 
		#header a 				-> header
		#nav a 					-> topnav
		#footer a 				-> footer
		#seo-container a 		-> seo
		.module-spotlight a 	-> moduleid + spotlight
		.module-simple-pods a 	-> moduleid + buckets
		.module-simple-tabs a 	-> moduleid + tabs
	*/
	var module = '';
	try {
		(function($, obj){
			$(obj).parents().each(function(){
				if ($(this).attr('id') == 'nav') {
					module = 'topnav';
				} else if ($(this).attr('id') == 'header') {
					module = 'header';
				} else if ($(this).attr('id') == 'footer') {
					module = 'footer';
				} else if ($(this).attr('id') == 'seo-container') {
					module = 'seo';
				} else if ($(this).attr('id') == 'sidebar') {
					module = 'promo-buttons';
				} else if ($(this).attr('id') == 'billboard') {
					module = 'flash-banner';
				} else if ($(this).attr('id') == 'homepage-products') {
					module = 'homepage-cloud-promos';
				} else if ($(this).attr('id') == 'clouds-bounce') {
					module = 'homepage-customers';
				} else if ($(this).hasClass('module-spotlight')) {
					module = $(this).attr('id') + '-spotlight';
				} else if ($(this).hasClass('module-simple-pods')) {
					module = $(this).attr('id') + '-' + $(this).find('.pod-container').length + 'buckets';
				} else if ($(this).hasClass('module-simple-tabs')) {
					module = ($(this).attr('id') ? $(this).attr('id') : 'module0') + '-' + $(this).find('ul.tabs li').length + 'tabs';
				}
			});
		})(jQuery, obj);
	} catch(ex) {}
	
	if (module) {
		s.c_w('v32', s.pageName+'|'+module);
	}
};

/*
 * Custom Plugin: trackForm
 */
s.trackForm = function(fields) {
	var s = this, loc = Page.getLocale(), errors = '';
	if (!fields) {
		return false;	
	}
	for (var f in fields){
		var newError = (loc + ':' + f);
		if ((errors + newError).length < 100) {
			errors += (errors == '' ? '' : '|') + newError;
		}
	}
	if (errors) {
		errors=errors.toLowerCase();
		s.prop52=errors;
		s.tl(true,'o','Form error tracking');
		return true;
	}
	return false;
}

/*
 * Custom Plugin: trackCTAs
 */
s.trackCTAs = function(impr, clck) {
	var s = this, ctas = '';
	if (!impr) {
		return clck ? ';' + clck + ';;;event25=1' : '';
	}

	
	for (var i=0; i<impr.length; i++) {
		ctas += ((ctas != '' ? ',' : '') + ';' + impr[i] + ';;;' + (impr[i] == clck ? 'event25=1' : 'event19=1'));
	}
	if (ctas.indexOf(clck) == -1) {
		ctas += ',;' + clck + ';;;event25=1';	
	}
	return ctas;
};

/*
 * Custom Plugin: cvpSimple (a slimmed-down version of crossVisitParticipation
 */
// "v","cn","ex","ct","dl"
s.cvpSimple = function(v, cn, ex, ct, dl) {
	// if no value, quit
	if (!v)	return '';
	ex = ex ? ex : 365; // default 1 year
	var exd = new Date(), cv = s.c_r(cn), na = new Array();
		
	// if value contains [[, convert to new format
	if (cv.indexOf('[[') > -1) {
		var oa = new Array();
		oa = eval(cv);
		for (var i=0; i<oa.length; i++) {
			na[na.length] = oa[i][0];
		}
		exd.setDate(exd.getDate() - 1);
	} else if (cv) {
		na = cv.split('~');	
	}
	
	// if total length > max, strip first value
	if (na.length >= ct) {
		na.splice(0, 1);
	}
	// add newest value
	na[na.length] = v;
	
	// set new cookie
	exd.setDate(exd.getDate() + ex);
	s.c_w(cn, na.join('~'), exd);
	
	// return delimited value
	return na.join(dl);
};

/*
 * Plugin: deDupe (remove duplicates from a list)
 */
s.deDupe=new Function("l","d",""
+"d=d?d:',';if(!(l&&d)){return false;}var a=l.split(d),lv='',i=0;a.so"
+"rt();while(i<a.length){if(a[i]==lv){a.splice(i,1);}else{lv=a[i];i++"
+";}}return a.join(d)");

/*
 * Plugin: getQueryParam 2.4 (custom)
 */
s.getQueryParam=new Function("p","d","u",""
+"var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"
+"on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"
+".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t){t=t.indexOf('#')>-"
+"1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i="
+"=p.length?i:i+1)}return v");
s.p_gpv=new Function("k","u",""
+"var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=u.substring(i+1);v"
+"=s.pt(q,'&','p_gvf',k)}return v");
s.p_gvf=new Function("t","k",""
+"if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
+"rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
+"unescp(v)}return ''");

/*
 * Plugin: getValOnce 0.2 - get a value once per session or number of days
 */
s.getValOnce=new Function("v","c","e",""
+"var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("
+")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");

/*
 * Plugin: getPreviousValue_v1.0 - return previous value of designated
 *   variable (requires split utility)
 */
s.getPreviousValue=new Function("v","c","el",""
+"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
+"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
+"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
+":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
+"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");

/*
 * Plugin: getAndPersistValue 0.3 - get a value on every page
 */
s.getAndPersistValue=new Function("v","c","e",""
+"var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if("
+"v)s.c_w(c,v,e?a:0);return s.c_r(c);");

/*
 *	Plug-in: crossVisitParticipation v1.5 - stacks values from
 *	specified variable in cookie and returns value
 */
s.crossVisitParticipation=new Function("v","cn","ex","ct","dl","ev","dv",""
+"var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var"
+" ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.l"
+"ength;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}i"
+"f(!v||v=='')return '';v=escape(v);var arry=new Array(),a=new Array("
+"),c=s.c_r(cn),g=0,h=new Array();if(c&&c!='')arry=eval(c);var e=new "
+"Date();e.setFullYear(e.getFullYear()+5);if(dv==0 && arry.length>0 &"
+"& arry[arry.length-1][0]==v)arry[arry.length-1]=[v, new Date().getT"
+"ime()];else arry[arry.length]=[v, new Date().getTime()];var start=a"
+"rry.length-ct<0?0:arry.length-ct;var td=new Date();for(var x=start;"
+"x<arry.length;x++){var diff=Math.round((td.getTime()-arry[x][1])/86"
+"400000);if(diff<ex){h[g]=unescape(arry[x][0]);a[g]=[arry[x][0],arry"
+"[x][1]];g++;}}var data=s.join(a,{delim:',',front:'[',back:']',wrap:"
+"\"'\"});s.c_w(cn,data,e);var r=s.join(h,{delim:dl});if(ce) s.c_w(cn"
+",'');return r;");

/*
 * Utility manageVars v0.2 - clear variable values (requires split 1.5)
 */
s.manageVars=new Function("c","l","f",""
+"var s=this,vl,la,vla;l=l?l:'';f=f?f:1 ;if(!s[c])return false;vl='pa"
+"geName,purchaseID,channel,server,pageType,campaign,state,zip,events"
+",products,transactionID';for(var n=1;n<51;n++){vl+=',prop'+n+',eVar"
+"'+n+',hier'+n;}if(l&&(f==1||f==2)){if(f==1){vl=l;}if(f==2){la=s.spl"
+"it(l,',');vla=s.split(vl,',');vl='';for(x in la){for(y in vla){if(l"
+"a[x]==vla[y]){vla[y]='';}}}for(y in vla){vl+=vla[y]?','+vla[y]:'';}"
+"}s.pt(vl,',',c,0);return true;}else if(l==''&&f==1){s.pt(vl,',',c,0"
+");return true;}else{return false;}");
s.clearVars=new Function("t","var s=this;s[t]='';");
s.lowercaseVars=new Function("t",""
+"var s=this;if(s[t]){s[t]=s[t].toString();s[t]=s[t].toLowerCase();}");

/*
 * Plugin: linkHandler 0.x - identify and report custom links (modified)
 */
s.linkHandler=new Function("p","t","r","c",""
+"var s=this;var o=s.p_go(),h=o.href;var i,l;var n=p?'':t=='e'?'linkI"
+"nternalFilters':t=='d'?'linkDownloadFileTypes':'';t=t?t:'o';if(!h||"
+"(s.linkType&&(h||s.linkName)))return '';i=h.indexOf('?');h=s.linkLe"
+"aveQueryString||i<0?h:h.substring(0,i);if(n){p=s.rep(s[n],',','|');"
+"}l=s.pt(p,'|','p_gn',h.toLowerCase());if(l&&n!='linkInternalFilters"
+"'||(!l&&n=='linkInternalFilters')){s.linkName=l=='[['?'':l;s.linkTy"
+"pe=t;if(c){s.linkName=s.linkType=s.lnk=s.eo='';}return r?o:h;}retur"
+"n '';");
s.p_gn=new Function("t","h",""
+"var i=t?t.indexOf('~'):-1,n,x;if(t&&h){n=i<0?'':t.substring(0,i);x="
+"t.substring(i+1);if(h.indexOf(x.toLowerCase())>-1)return n?n:'[[';}"
+"return 0;");

/*
 * DynamicObjectIDs v1.4: Setup Dynamic Object IDs based on URL
 */
s.setupDynamicObjectIDs=new Function(""
+"var s=this;if(!s.doi){s.doi=1;if(s.apv>3&&(!s.isie||!s.ismac||s.apv"
+">=5)){if(s.wd.attachEvent)s.wd.attachEvent('onload',s.setOIDs);else"
+" if(s.wd.addEventListener)s.wd.addEventListener('load',s.setOIDs,fa"
+"lse);else{s.doiol=s.wd.onload;s.wd.onload=s.setOIDs}}s.wd.s_semapho"
+"re=1}");
s.setOIDs=new Function("e",""
+"var s=s_c_il["+s._in+"],b=s.eh(s.wd,'onload'),o='onclick',x,l,u,c,i"
+",a=new Array;if(s.doiol){if(b)s[b]=s.wd[b];s.doiol(e)}if(s.d.links)"
+"{for(i=0;i<s.d.links.length;i++){l=s.d.links[i];c=l[o]?''+l[o]:'';b"
+"=s.eh(l,o);z=l[b]?''+l[b]:'';u=s.getObjectID(l);if(u&&c.indexOf('s_"
+"objectID')<0&&z.indexOf('s_objectID')<0){u=s.repl(u,'\"','');u=s.re"
+"pl(u,'\\n','').substring(0,97);l.s_oc=l[o];a[u]=a[u]?a[u]+1:1;x='';"
+"if(c.indexOf('.t(')>=0||c.indexOf('.tl(')>=0||c.indexOf('s_gs(')>=0"
+")x='var x=\".tl(\";';x+='s_objectID=\"'+u+'_'+a[u]+'\";return this."
+"s_oc?this.s_oc(e):true';if(s.isns&&s.apv>=5)l.setAttribute(o,x);l[o"
+"]=new Function('e',x)}}}s.wd.s_semaphore=0;return true");

/*
 * Plugin: getPercentPageViewed v1.1 (modified, do not replace)
 */
s.getPercentPageViewed=new Function("",""
+"var s=this;if(typeof(s.linkType)=='undefined'||s.linkType=='e'){var"
+" v=s.c_r('s_ppv');s.c_w('s_ppv',0);return v;}");
s.getPPVCalc=new Function("",""
+"var s=s_c_il["+s._in+"],dh=Math.max(Math.max(s.d.body.scrollHeight,"
+"s.d.documentElement.scrollHeight),Math.max(s.d.body.offsetHeight,s."
+"d.documentElement.offsetHeight),Math.max(s.d.body.clientHeight,s.d."
+"documentElement.clientHeight)),vph=s.wd.innerHeight||(s.d.documentE"
+"lement.clientHeight||s.d.body.clientHeight),st=s.wd.pageYOffset||(s"
+".wd.document.documentElement.scrollTop||s.wd.document.body.scrollTo"
+"p),vh=st+vph,pv=Math.round(vh/dh*100),cv=s.c_r('s_ppv'),cpi=cv.inde"
+"xOf('|'),cpv='',ps='';if(cpi!=-1){cpv=cv.substring(0,cpi);ps=parseI"
+"nt(cv.substring(cpi+1));}else{cpv=ps=0;}if(pv<=100){if(pv>parseInt("
+"cpv)){ps=pv-Math.round(vph/dh*100);s.c_w('s_ppv',pv+'|'+ps);}}else{"
+"s.c_w('s_ppv','');}");
s.getPPVSetup=new Function("",""
+"var s=this;if(s.wd.addEventListener){s.wd.addEventListener('load',s"
+".getPPVCalc,false);s.wd.addEventListener('scroll',s.getPPVCalc,fals"
+"e);s.wd.addEventListener('resize',s.getPPVCalc,false);}else if(s.wd"
+".attachEvent){s.wd.attachEvent('onload',s.getPPVCalc);s.wd.attachEv"
+"ent('onscroll',s.getPPVCalc);s.wd.attachEvent('onresize',s.getPPVCa"
+"lc);}");
s.getPPVSetup();

/*
 * Plugin: getTimeParting 1.3 - Set timeparting values based on time zone
 */
s.getTimeParting=new Function("t","z","y",""
+"dc=new Date('1/1/2000');f=15;ne=8;if(dc.getDay()!=6||"
+"dc.getMonth()!=0){return'Data Not Available'}else{;z=parseInt(z);"
+"if(y=='2009'){f=8;ne=1};gmar=new Date('3/1/'+y);dsts=f-gmar.getDay("
+");gnov=new Date('11/1/'+y);dste=ne-gnov.getDay();spr=new Date('3/'"
+"+dsts+'/'+y);fl=new Date('11/'+dste+'/'+y);cd=new Date();"
+"if(cd>spr&&cd<fl){z=z+1}else{z=z};utc=cd.getTime()+(cd.getTimezoneO"
+"ffset()*60000);tz=new Date(utc + (3600000*z));thisy=tz.getFullYear("
+");var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Fr"
+"iday','Saturday'];if(thisy!=y){return'Data Not Available'}else{;thi"
+"sh=tz.getHours();thismin=tz.getMinutes();thisd=tz.getDay();var dow="
+"days[thisd];var ap='AM';var dt='Weekday';var mint='00';if(thismin>3"
+"0){mint='30'}if(thish>=12){ap='PM';thish=thish-12};if (thish==0){th"
+"ish=12};if(thisd==6||thisd==0){dt='Weekend'};var timestring=thish+'"
+":'+mint+ap;var daystring=dow;var endstring=dt;if(t=='h'){return tim"
+"estring}if(t=='d'){return daystring};if(t=='w'){return en"
+"dstring}}};"
);

/*
 * Plugin: detectRIA v0.1 - detect and set Flash, Silverlight versions
 * -captures Flash and Silverlight versions and writes them to 2 props
 * -writes value to a cookie to only test once per visit
 * -can be called inside or outside s_doPlugins
 * -capture value on every page or use flag to set only once
 * -allows for a max version to be look for (IE-only)
 *  -10 for Flash, 2 for Silverlight
 */
s.detectRIA=new Function("cn", "fp", "sp", "mfv", "msv", "sf", ""
+"cn=cn?cn:'s_ria';msv=msv?msv:2;mfv=mfv?mfv:10;var s=this,sv='',fv=-"
+"1,dwi=0,fr='',sr='',w,mt=s.n.mimeTypes,uk=s.c_r(cn),k=s.c_w('s_cc',"
+"'true',0)?'Y':'N';fk=uk.substring(0,uk.indexOf('|'));sk=uk.substrin"
+"g(uk.indexOf('|')+1,uk.length);if(k=='Y'&&s.p_fo('detectRIA')){if(u"
+"k&&!sf){if(fp){s[fp]=fk;}if(sp){s[sp]=sk;}return false;}if(!fk&&fp)"
+"{if(s.pl&&s.pl.length){if(s.pl['Shockwave Flash 2.0'])fv=2;x=s.pl['"
+"Shockwave Flash'];if(x){fv=0;z=x.description;if(z)fv=z.substring(16"
+",z.indexOf('.'));}}else if(navigator.plugins&&navigator.plugins.len"
+"gth){x=navigator.plugins['Shockwave Flash'];if(x){fv=0;z=x.descript"
+"ion;if(z)fv=z.substring(16,z.indexOf('.'));}}else if(mt&&mt.length)"
+"{x=mt['application/x-shockwave-flash'];if(x&&x.enabledPlugin)fv=0;}"
+"if(fv<=0)dwi=1;w=s.u.indexOf('Win')!=-1?1:0;if(dwi&&s.isie&&w&&exec"
+"Script){result=false;for(var i=mfv;i>=3&&result!=true;i--){execScri"
+"pt('on error resume next: result = IsObject(CreateObject(\"Shockwav"
+"eFlash.ShockwaveFlash.'+i+'\"))','VBScript');fv=i;}}fr=fv==-1?'flas"
+"h not detected':fv==0?'flash enabled (no version)':'flash '+fv;}if("
+"!sk&&sp&&s.apv>=4.1){var tc='try{x=new ActiveXObject(\"AgControl.A'"
+"+'gControl\");for(var i=msv;i>0;i--){for(var j=9;j>=0;j--){if(x.is'"
+"+'VersionSupported(i+\".\"+j)){sv=i+\".\"+j;break;}}if(sv){break;}'"
+"+'}}catch(e){try{x=navigator.plugins[\"Silverlight Plug-In\"];sv=x'"
+"+'.description.substring(0,x.description.indexOf(\".\")+2);}catch('"
+"+'e){}}';eval(tc);sr=sv==''?'silverlight not detected':'silverlight"
+" '+sv;}if((fr&&fp)||(sr&&sp)){s.c_w(cn,fr+'|'+sr,0);if(fr)s[fp]=fr;"
+"if(sr)s[sp]=sr;}}");

/*
 * TNT Integration Plugin v1.0
 */
s.trackTNT=new Function("v","p","b",""
+"var s=this,n='s_tnt',p=p?p:n,v=v?v:n,r='',pm=false,b=b?b:true;if(s."
+"getQueryParam){pm=s.getQueryParam(p);}if(pm){r+=(pm+',');}if(s.wd[v"
+"]!=undefined){r+=s.wd[v];}if(b){s.wd[v]='';}return r;");

/*
 * p_fo: fire only one
 */
s.p_fo=new Function("n",""
+"var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="
+"new Object;return 1;}else {return 0;}");

/*
 * Plugin Utility: apl v1.1
 */
s.apl=new Function("l","v","d","u",""
+"var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a."
+"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
+"e()));}}if(!m)l=l?l+d+v:v;return l");

/*
 * Utility: escp 0.1 - ensures encodeURIComponent will be used to encode URL parameters if it exists
 */
s.escp=new Function("x",""
+"var s=this;if(typeof(encodeURIComponent)=='function'&&x)return enco"
+"deURIComponent(s.rep(''+x,'+',' '));else return escape(s.rep(''+x,'"
+"+',' '));");

/*
 * Utility: unescp 0.1 - ensures decodeURIComponent will be used to decode URL parameters if it exists
 */
s.unescp=new Function("x",""
+"var s=this;if(typeof(decodeURIComponent)=='function'&&x)return deco"
+"deURIComponent(s.rep(''+x,'+',' '));else return unescape(s.rep(''+x"
+",'+',' '));");

/*
 * Utility Function: split v1.5 (JS 1.0 compatible)
 */
s.split=new Function("l","d",""
+"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
+"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

/*
 * Plugin Utility: Replace v1.0
 */
s.repl=new Function("x","o","n",""
+"var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
+"substring(i+o.length);i=x.indexOf(o,i+l)}return x");

/*
 * Utility Function: Determine If A Particular Value Exists Within An Array
 */
s.ia=new Function("ar","v",""
+"for(var i=0;i<ar.length;i++){if(ar[i]==v)return i}return -1");

/*
 * Utility: inList v1.0 - find out if a value is in a list
 */
s.inList=new Function("v","l","d",""
+"var s=this,ar=Array(),i=0,d=(d)?d:',';if(typeof(l)=='string'){if(s."
+"split)ar=s.split(l,d);else if(l.split)ar=l.split(d);else return-1}e"
+"lse ar=l;while(i<ar.length){if(v==ar[i])return true;i++}return fals"
+"e;");

/*
 * Utility Function: p_go
 */
s.p_go=new Function(""
+"var s=this;if(!s.eo&&!s.lnk)return '';var o=s.eo?s.eo:s.lnk;var y=s"
+".ot(o);var n=s.oid(o);var x=o.s_oidt;if(s.eo&&o==s.eo){while(o&&!n&"
+"&y!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(!o)re"
+"turn '';y=s.ot(o);n=s.oid(o);x=o.s_oidt}}return o?o:'';");

/*
 * s.join: 1.0 - s.join(v,p)
 *
 *  v - Array (may also be array of array)
 *  p - formatting parameters (front, back, delim, wrap)
 *
 */
s.join = new Function("v","p",""
+"var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back"
+":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0"
+";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el"
+"se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");

/*
 * Function - read combined cookies v 0.3
 */
if(!s.__ccucr){s.c_rr=s.c_r;s.__ccucr = true;
s.c_r=new Function("k",""
+"var s=this,d=new Date,v=s.c_rr(k),c=s.c_rr('s_pers'),i,m,e;if(v)ret"
+"urn v;k=s.ape(k);i=c.indexOf(' '+k+'=');c=i<0?s.c_rr('s_sess'):c;i="
+"c.indexOf(' '+k+'=');m=i<0?i:c.indexOf('|',i);e=i<0?i:c.indexOf(';'"
+",i);m=m>0?m:e;v=i<0?'':s.epa(c.substring(i+2+k.length,m<0?c.length:"
+"m));if(m>0&&m!=e)if(parseInt(c.substring(m+1,e<0?c.length:e))<d.get"
+"Time()){d.setTime(d.getTime()-60000);s.c_w(s.epa(k),'',d);v='';}ret"
+"urn v;");}
/*
 * Function - write combined cookies v 0.3
 */
if(!s.__ccucw){s.c_wr=s.c_w;s.__ccucw = true;
s.c_w=new Function("k","v","e",""
+"this.new2 = true;"
+"var s=this,d=new Date,ht=0,pn='s_pers',sn='s_sess',pc=0,sc=0,pv,sv,"
+"c,i,t;d.setTime(d.getTime()-60000);if(s.c_rr(k)) s.c_wr(k,'',d);k=s"
+".ape(k);pv=s.c_rr(pn);i=pv.indexOf(' '+k+'=');if(i>-1){pv=pv.substr"
+"ing(0,i)+pv.substring(pv.indexOf(';',i)+1);pc=1;}sv=s.c_rr(sn);i=sv"
+".indexOf(' '+k+'=');if(i>-1){sv=sv.substring(0,i)+sv.substring(sv.i"
+"ndexOf(';',i)+1);sc=1;}d=new Date;if(e){if(e.getTime()>d.getTime())"
+"{pv+=' '+k+'='+s.ape(v)+'|'+e.getTime()+';';pc=1;}}else{sv+=' '+k+'"
+"='+s.ape(v)+';';sc=1;}if(sc) s.c_wr(sn,sv,0);if(pc){t=pv;while(t&&t"
+".indexOf(';')!=-1){var t1=parseInt(t.substring(t.indexOf('|')+1,t.i"
+"ndexOf(';')));t=t.substring(t.indexOf(';')+1);ht=ht<t1?t1:ht;}d.set"
+"Time(ht);s.c_wr(pn,pv,d);}return v==s.c_r(s.epa(k));");}

/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected.  Changes should only be
made when instructed to do so by your account manager.*/
s.visitorNamespace="salesforce"
s.trackingServer="omtr1.partners.salesforce.com"
s.trackingServerSecure="omtr2.partners.salesforce.com"
s.visitorMigrationKey="4BF75282"
s.visitorMigrationServer="salesforce.122.2o7.net"

/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code='',s_objectID;function s_gi(un,pg,ss){var c="s._c='s_c';s.wd=window;if(!s.wd.s_c_in){s.wd.s_c_il=new Array;s.wd.s_c_in=0;}s._il=s.wd.s_c_il;s._in=s.wd.s_c_in;s._il[s._in]=s;s.wd.s_c_in++;s"
+".an=s_an;s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}return y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=func"
+"tion(o){if(!o)return o;var n=new Object,x;for(x in o)if(x.indexOf('select')<0&&x.indexOf('filter')<0)n[x]=o[x];return n};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexO"
+"f(x.substring(p,p+1))<0)return 0;return 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3)"
+"return encodeURIComponent(x);else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.substring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n%16,n%16+1)+e;n=(n-n%"
+"16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}return y}else{x=s.rep(escape(''+x),'+','%2B');if(c&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if"
+"(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00'+x.substring(i);i=x.indexOf('%',i)}}}}return x};s.epa=function(x){var s=this;if(x){x=''+x;return s.em==3?de"
+"codeURIComponent(x):unescape(s.rep(x,'+',' '))}return x};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z+=y+d.l"
+"ength;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);if(t.substring(0,2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.f"
+"sf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf',f);return s.fsg};s.si=function(){var s=this,i,k,v,c="
+"s_gi+'var s=s_gi(\"'+s.oun+'\");s.sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)=='string')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}"
+"c+=\"s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var"
+" s=this,d=s.wd.location.hostname,n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('"
+".',p-1);n--}s.c_d=p>0&&s.pt(d,'.','c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s."
+"epa(c.substring(i+2+k.length,e<0?c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NON"
+"E'){t=(v!=''?parseInt(l?l:0):-60);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()"
+"+';':'')+(d?' domain='+d+';':'');return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i]."
+"o==o&&l[i].e==e)n=i}if(n<0){n=i;l[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv"
+">=5&&(!s.isopera||s.apv>=7)){tcf=new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,"
+"'onerror',0,o);r=s[f](a);s.eh(s.wd,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s"
+".t();if(c)s.d.write(c);s.etfs=0;return true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs="
+"p;return s.gtfsf(s.tfs)}return s.tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,"
+"l=s.rl[u],n,r;s.rl[u]=0;if(l)for(n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,0,r.t,r.u)}};s.br=function(id,rs){var s=this;if(s.disableBufferedRequests||!s.c_w('s_br',rs))s.brl=rs};s.flushBufferedReques"
+"ts=function(){this.fbr(0)};s.fbr=function(id){var s=this,br=s.c_r('s_br');if(!br)br=s.brl;if(br){if(!s.disableBufferedRequests)s.c_w('s_br','');s.mr(0,0,br)}s.brl=0};s.mr=function(sess,q,rs,id,ta,u"
+"){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackingServerBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+(un),im,b,e;if(!rs){if"
+"(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLowerCase();else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s"
+".ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/H.22/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac){if(s.apv>5.5)rs=s.fl(rs,4095);else rs=s.fl(rs,2047)}if(id){s.br(id,r"
+"s);return}}if(s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!s.rc[un]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(windo"
+"w.s_c_il)window.s_c_il['+s._in+'].mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r;return ''}imn+='_'+s.rc[un];s.rc[un]++}im=s.wd[imn];if(!im)im=s.wd[imn]=new Image;im"
+".s_l=0;im.onload=new Function('e','this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if(!s.nrs){s.nrs=1;s.m_m('rs')}else s.nrs++;i"
+"m.src=rs;if((!ta||ta=='_self'||ta=='_top'||(s.wd.name&&ta==s.wd.name))&&rs.indexOf('&pe=')>=0){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<500)e=new Date}return ''}return '<im'+'g sr'+'c=\""
+"'+rs+'\" width=1 height=1 border=0 alt=\"\">'};s.gg=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){if(t.substring(0,2)=='s_')t=t.substring(2);var s"
+"=this,v=s.gg(t);if(v)s[t]=v};s.gl=function(v){var s=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,l,a,b='',c='',t;if(x){y=''+x;i=y.indexOf('?');if(i>0){a=y.substring(i+1);y="
+"y.substring(0,i);h=y.toLowerCase();i=0;if(h.substring(0,7)=='http://')i+=7;else if(h.substring(0,8)=='https://')i+=8;h=h.substring(i);i=h.indexOf(\"/\");if(i>0){h=h.substring(0,i);if(h.indexOf('goo"
+"gle')>=0){a=s.sp(a,'&');if(a.length>1){l=',q,ie,start,search_key,word,kw,cd,';for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+="
+"(c?'&':'')+t}if(b&&c){y+='?'+b+'&'+c;if(''+x!=y)x=y}}}}}}return x};s.hav=function(){var s=this,qs='',fv=s.linkTrackVars,fe=s.linkTrackEvents,mn,i;if(s.pe){mn=s.pe.substring(0,1).toUpperCase()+s.pe."
+"substring(1);if(s[mn]){fv=s[mn].trackVars;fe=s[mn].trackEvents}}fv=fv?fv+','+s.vl_l+','+s.vl_l2:'';for(i=0;i<s.va_t.length;i++){var k=s.va_t[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt"
+"(x),q=k;if(v&&k!='linkName'&&k!='linkType'){if(s.pe||s.lnk||s.eo){if(fv&&(','+fv+',').indexOf(','+k+',')<0)v='';if(k=='events'&&fe)v=s.fs(v,fe)}if(v){if(k=='dynamicVariablePrefix')q='D';else if(k=="
+"'visitorID')q='vid';else if(k=='pageURL'){q='g';v=s.fl(v,255)}else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationServer'"
+"){q='vmf';if(s.ssl&&s.visitorMigrationServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase()=="
+"'AUTO')v='ISO8859-1';else if(s.em==2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProvider"
+"')q='vvp';else if(k=='currencyCode')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='c';e"
+"lse if(k=='javascriptVersion')q='j';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionType')q"
+"='ct';else if(k=='homepage')q='hp';else if(k=='plugins')q='p';else if(s.num(x)){if(b=='prop')q='c'+n;else if(b=='eVar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if"
+"(v)qs+='&'+q+'='+(k.substring(0,3)!='pev'?s.ape(v):v)}}}return qs};s.ltdf=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.subst"
+"ring(h.length-(t.length+1))=='.'+t)return 1;return 0};s.ltef=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.l"
+"inkDownloadFileTypes,lef=s.linkExternalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.wd.location.hostname;h=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.tr"
+"ackExternalLinks&&h.substring(0,1)!='#'&&(lef||lif)&&(!lef||s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','ltef',h)))return 'e';return ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this"
+",\"onclick\");s.lnk=s.co(this);s.t();s.lnk=0;if(b)return this[b](e);return true');s.bc=new Function('e','var s=s_c_il['+s._in+'],f,tcf;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;s.eo=e.srcElement?e."
+"srcElement:e.target;tcf=new Function(\"s\",\"var e;try{if(s.eo&&(s.eo.tagName||s.eo.parentElement||s.eo.parentNode))s.t()}catch(e){}\");tcf(s);s.eo=0');s.oh=function(o){var s=this,l=s.wd.location,h"
+"=o.href?o.href:'',i,j,k,p;i=h.indexOf(':');j=h.indexOf('?');k=h.indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k))){p=o.protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathn"
+"ame.lastIndexOf('/');h=(p?p+'//':'')+(o.host?o.host:(l.host?l.host:''))+(h.substring(0,1)!='/'?l.pathname.substring(0,i<0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;t=t&&t.toUpperCas"
+"e?t.toUpperCase():'';if(t=='SHAPE')t='';if(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=this,t=s.ot"
+"(o),p,c,n='',x=0;if(t&&!o.s_oid){p=o.protocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''+c,\"\\r"
+"\",''),\"\\n\",''),\"\\t\",''),' ','');x=2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.innerText;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t=='IMAGE"
+"')n=o.src;if(n){o.s_oid=s.fl(n,100);o.s_oidt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.substring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u+',').in"
+"dexOf(','+un+',')>=0){if(u!=s.un&&s.un.indexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this.un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)return s.p"
+"t(v,'&','rqf',un);return s.pt(un,',','rq',0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1));s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return 0};s.sqs"
+"=function(un,q){var s=this;s.squ[un]=q;return 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ=new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',q);v='';"
+"for(x in s.squ)if(x&&(!Object||!Object.prototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s.sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&s.sqq[x]"
+"&&(x==q||c<2)){v+=(v?'&':'')+s.sqq[x]+'='+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r=true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<s.d.lin"
+"ks.length;i++){o=s.d.links[i];oc=o.onclick?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=function("
+"){var s=this;if(s.apv>3&&(!s.isie||!s.ismac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s.b.addEventListener)s.b.addEventListener('click',s.bc,false);else s.eh("
+"s.wd,'onload',0,s.wdl)}};s.vs=function(x){var s=this,v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+s.un+(g?'_'+g:''),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if"
+"(v){v*=100;if(!n){if(!s.c_w(k,x,e))return 0;n=x}if(n%10000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='"
+"):-1,n,x;if(i>=0&&m){var n=t.substring(0,i),x=t.substring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s.uns=function(){var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynami"
+"cAccountMatch,n,i;s.un=s.un.toLowerCase();if(x&&l){if(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.toLowerCase();m=m.toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s."
+"fun=i<0?s.un:s.un.substring(0,i)};s.sa=function(un){var s=this;s.un=un;if(!s.oun)s.oun=un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.s"
+"ubstring(0,1),r,l,i;if(!s.m_l)s.m_l=new Object;if(!s.m_nl)s.m_nl=new Array;m=s.m_l[n];if(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd"
+".s_c_in++;m.s=s;m._n=n;m._l=new Array('_c','_in','_il','_i','_e','_d','_dl','s','n','_r','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r"
+"=m._r;r._m=m;l=m._l;for(i=0;i<l.length;i++)if(m[l[i]])r[l[i]]=m[l[i]];r._il[r._in]=r;m=s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_i"
+"l['+s._in+'],c=s[g+\"_c\"],m,x,f=0;if(!c)c=s.wd[\"s_\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if(x&&(!m._i||g!=\"m_\""
+"+n)){m._i=f=1;if((\"\"+x).indexOf(\"function\")>=0)x(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,i,x,m,f='_'+t,r=0,u;"
+"if(s.m_l&&s.m_nl)for(i=0;i<s.m_nl.length;i++){x=s.m_nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m[t]()}}if(u)r=1;u=m["
+"t+1];if(u&&!m[f]){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl,i,o;if(g)for(i=0;i<"
+"g.length;i++){o=g[i];if(o)s.loadModule(o.n,o.u,o.d,o.l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':');if(i>=0){g=n.subst"
+"ring(i+1);n=n.substring(0,i)}else g=\"m_\"+n;m=s.m_i(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');i='s_s:'+s._in+':'+n"
+"+':'+g;b='var s=s_c_il['+s._in+'],o=s.d.getElementById(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'')+')}';f2=b+'o.c++;"
+"if(!s.maxDelay)s.maxDelay=250;if(!o.l&&o.c<(s.maxDelay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s.d.createElement(\"s"
+"cript\");if(o){o.type=\"text/javascript\";'+(n?'o.id=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,100)':'')+'}}catch(e"
+"){o=0}return o');o=tcf(s,c,i,u,f1,f2)}else{o=new Object;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m=s.m_i(n);m._e=1}ret"
+"urn m};s.vo1=function(t,a){if(a[t]||a['!'+t])this[t]=a[t]};s.vo2=function(t,a){if(!a[t]){a[t]=this[t];if(!a[t])a['!'+t]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=new Date,i,vo,f=0;if(s.dll)"
+"for(i=0;i<s.dll.length;i++){vo=s.dll[i];if(vo){if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if(!s.dli)s.dli=setTimeout(s."
+"dlt,s.maxDelay)}else s.dll=0');s.dl=function(vo){var s=this,d=new Date;if(!vo)vo=new Object;s.pt(s.vl_g,',','vo2',vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if(!s.maxDel"
+"ay)s.maxDelay=250;s.dlt()};s.t=function(vo,id){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)%10"
+"+sed,y=tm.getYear(),vt=tm.getDate()+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta="
+"-1,q='',qs='',code='',vb=new Object;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i,x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y':'N',hp='',ct='',pn=0,ps;if"
+"(String&&String.prototype){j='1.1';if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach){j='1.6';i=0;o=new Object;t"
+"cf=new Function('o','var e,i=0;try{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next)j='1.7'}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.jav"
+"aEnabled()?'Y':'N';if(s.apv>=4){c=screen.pixelDepth;bw=s.wd.innerWidth;bh=s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5"
+"){bw=s.d.documentElement.offsetWidth;bh=s.d.documentElement.offsetHeight;if(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y"
+"\":\"N\"}catch(e){}return hp');hp=tcf(s,tl);tcf=new Function('s','var e,ct=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)w"
+"hile(pn<s.pl.length&&pn<30){ps=s.fl(s.pl[pn].name,100)+';';if(p.indexOf(ps)<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.b"
+"rowserHeight=bh;s.connectionType=ct;s.homepage=hp;s.plugins=p;s.td=1}if(vo){s.pt(s.vl_g,',','vo2',vb);s.pt(s.vl_g,',','vo1',vo)}if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);var l=s.w"
+"d.location,r=tfs.document.referrer;if(!s.pageURL)s.pageURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s.eo:s.lnk;if(!o)return"
+" '';var p=s.pageName,w=1,t=s.ot(o),n=s.oid(o),x=o.s_oidt,h,l,i,oc;if(s.eo&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(!o)return '';t=s.ot(o);n=s.oid(o);x=o.s"
+"_oidt}oc=o.onclick?''+o.onclick:'';if((oc.indexOf(\"s_gs(\")>=0&&oc.indexOf(\".s_oc(\")<0)||oc.indexOf(\".tl(\")>=0)return ''}if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeaveQueryString||i"
+"<0?h:h.substring(0,i);l=s.linkName;t=s.linkType?s.linkType.toLowerCase():s.lt(h);if(t&&(h||l))q+='&pe=lnk_'+(t=='d'||t=='e'?s.ape(t):'o')+(h?'&pev1='+s.ape(h):'')+(l?'&pev2='+s.ape(l):'');else trk="
+"0;if(s.trackInlineStats){if(!p){p=s.pageURL;w=0}t=s.ot(o);i=o.sourceIndex;if(s.gg('objectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s."
+"fl(n,100))+(x?'&oidt='+x:'')+'&ot='+s.ape(t)+(i?'&oi='+i:'')}}if(!trk&&!qs)return '';s.sampled=s.vs(sed);if(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,id,ta"
+");qs='';s.m_m('t');if(s.p_r)s.p_r();s.referrer=''}s.sq(qs);}else{s.dl(vo);}if(vo)s.pt(s.vl_g,',','vo1',vb);s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.p"
+"g)s.wd.s_lnk=s.wd.s_eo=s.wd.s_linkName=s.wd.s_linkType='';if(!id&&!s.tc){s.tc=1;s.flushBufferedRequests()}return code};s.tl=function(o,t,n,vo){var s=this;s.lnk=s.co(o);s.linkType=t;s.linkName=n;s.t"
+"(vo)};if(pg){s.wd.s_co=function(o){var s=s_gi(\"_\",1,1);return s.co(o)};s.wd.s_gs=function(un){var s=s_gi(un,1,1);return s.t()};s.wd.s_dc=function(un){var s=s_gi(un,1);return s.t()}}s.ssl=(s.wd.lo"
+"cation.protocol.toLowerCase().indexOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElementsByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns"
+"6=s.u.indexOf('Netscape6/');var apn=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer'"
+");s.isns=(apn=='Netscape');s.isopera=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=pa"
+"rseFloat(i)}else if(s.ns6>0)s.apv=parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.em=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUp"
+"perCase();s.em=(i=='%C4%80'?2:(i=='%U0100'?1:0))}s.sa(un);s.vl_l='dynamicVariablePrefix,visitorID,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigrationServerSecure,ppu,charSet,visitorName"
+"space,cookieDomainPeriods,cookieLifetime,pageName,pageURL,referrer,currencyCode';s.va_l=s.sp(s.vl_l,',');s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,s"
+"tate,zip,events,products,linkName,linkType';for(var n=1;n<76;n++)s.vl_t+=',prop'+n+',eVar'+n+',hier'+n+',list'+n;s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDepth,javascriptVersion,javaEnabled,"
+"cookiesEnabled,browserWidth,browserHeight,connectionType,homepage,plugins';s.vl_t+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackingServerSecure,trackingServerBase,fpCookieDom"
+"ainPeriods,disableBufferedRequests,mobile,visitorSampling,visitorSamplingGroup,dynamicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownloadLinks,trackExternalLinks,trackInlineStats,"
+"linkLeaveQueryString,linkDownloadFileTypes,linkExternalFilters,linkInternalFilters,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,_1_referrer';s.va_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);if(!ss)s."
+"wds()",
w=window,l=w.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,s;if(un){un=un.toLowerCase();if(l)for(i=0;i<l.length;i++){s=l[i];if(!s._c||s._c=='s_c'){if(s.oun==un)return s;else if(s.fs&&s.sa&&s.fs(s.oun,un)){s.sa(un);return s}}}}w.s_an='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
w.s_sp=new Function("x","d","var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
+"ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
w.s_jn=new Function("a","d","var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
w.s_rep=new Function("x","o","n","return s_jn(s_sp(x,o),n)");
w.s_d=new Function("x","var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
+"=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
+"x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
w.s_fe=new Function("c","return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
w.s_fa=new Function("f","var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
+"a");
w.s_ft=new Function("c","c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
+"f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
+"'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
c=s_d(c);if(e>0){a=parseInt(i=v.substring(e+5));if(a>3)a=parseFloat(i)}else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a>=5&&v.indexOf('Opera')<0&&u.indexOf('Opera')<0){w.s_c=new Function("un","pg","ss","var s=this;"+c);return new s_c(un,pg,ss)}else s=new Function("un","pg","ss","var s=new Object;"+s_ft(c)+";return s");return s(un,pg,ss)}

/* execute */
if (!Page.isAjax()) {
	s.t();
}