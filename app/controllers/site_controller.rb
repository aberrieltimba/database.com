class SiteController < ApplicationController

    API_COUNTER_FILE = "db/apicounter"

    def index
        # read stored api counter value before rendering
        @apicounter = System.find(1).apicounter
	end

	def pricing
	end
	def what
	end
	def howitworks
	end

	def update_api_counter
		# read email important contents
		subject = params[:subject]
		plain = params[:plain]

		# validate subject is proper value (to prevent strangers from updating the counter)
		if subject == "fe146181-5026-4108-a5c4-17b645d004f9" then
			value = 0
			if /(\d\d\/\d\d\/\d\d):(\d+):/ =~ plain then value = Integer($2) end
			if value > 0 then
				System.update(1, :apicounter => value) # there's only one, always
				@message = "API counter value updated succesfully"
			else
				@message = "API counter was not updated: wrong format"
			end
			render :layout => nil
		else
			render :status => 404
		end
	end

    # ===========
    # Signup form
    # ===========

    EMAIL_REGEX = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
    UNNEEDED_PARAMS = /^(action|controller|utf8|msa|recaptcha.*)$/

    def signup_form_language
        # English, Dutch, French, German, Italian, Spanish, Swedish, Portuguese (Brazilian),
        # Japanese, Chinese (Simplified), Chinese (Traditional), Korean, Thai, Finnish
        if ['fr','de','it','es','sv','ja','ko','th','fi','nl_NL','pt_BR','zh_CN','zh_TW'].include?(I18n.locale) then
            return I18n.locale
        else
            return case I18n.locale
            when 'nl' then 'nl_NL'
            when 'pt' then 'pt_BR'
            when 'zh' then 'zh_CN'
            else 'en_US'
            end
        end
    end

    def signup_submit
        @baseurl = "http://" + request.host_with_port + "/" + locale.to_s + "/"
        @success = @baseurl + "signup_success"
        @error   = @baseurl + "signup_error"

        # Validate data submitted. Redirect to error page if invalid.
        if
            params['FirstName'].blank? or
            params['LastName'].blank? or
            params['Email'].blank? or !(EMAIL_REGEX =~ params['Email']) or
            params['DeveloperJobRole'].blank? or
            params['Country'].blank? or
            params['CompanyPostalCode'].blank? or
            params['Company'].blank? or
            params['UserUsername'].blank? or !(EMAIL_REGEX =~ params['UserUsername']) or
            params['msa'].blank? or
            !verify_recaptcha
        then
           redirect_to @error
        else
           # Invoke servlet and redirect as indicated.
           # -----------------------------------------
           body = ""
           params.each do |key,value| body += "#{key}=#{value}&" unless UNNEEDED_PARAMS =~ key end

           body += "process_form=true&"
           body += "LeadSource=Trialforce&"
           body += "CompanyLanguage=#{signup_form_language}&"

           # Add Signup Config Item Name of Config record as formName
           body += "formName=db.com&"
           body += "CompanyTemplate=db_default&"
           body += "EditionDefinitionUri=edition:DB.DBEdition&"

           # Update Success and Failure Page
           body += "successPage=#{@success}&"
           body += "failPage=#{@error}&"

           # Add Product Interest to specify your trialforce solution
           body += "Product_Interest__c=Database.com&"
           body += "SubscriptionAgreement=on"

           # invoke servlet at "http://www.salesforce.com/leadcapture/PartnerSignupServlet"
           request = [
               'POST /leadcapture/PartnerSignupServlet HTTP/1.1',
               'Host: www.salesforce.com',
               'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
               'Accept-Language: en-us,en;q=0.5',
               'Accept-Encoding: gzip, deflate',
               'Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7',
               'Connection: keep-alive',
               'Content-Type: application/x-www-form-urlencoded',
               'Content-Length: ' + body.length.to_s,
               '',
               body
           ]

           @location = nil
           socket = TCPSocket.open('www.salesforce.com', 80)
           request.each { |line| socket.puts(line) }
           while (line = socket.gets)
              if /^Location: (.*)$/.match(line) then @location = $1 end
              logger.debug line
              break if (line.length <= 2) or (@location != nil)
           end

           @return = @location.to_s
           if /signup_success/ =~ @return then AccountMailer::welcome_email(params).deliver end
           redirect_to @return
        end
    end
end
