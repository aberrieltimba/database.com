class SiteController < ApplicationController

    API_COUNTER_FILE = "db/apicounter"

    def index
        # read stored api counter value before rendering
        @apicounter = 0
        if File.exists?(API_COUNTER_FILE) then @apicounter = File.read(API_COUNTER_FILE) end
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

            plain = plain.gsub(/[^\d]/,"") #strip all non-digits (this is supposed to be an integer anyway)

			# store value in file
			f = File.open(API_COUNTER_FILE,"w");
			f.write(plain)
			f.close
		end
		# render nothing
		render :layout => nil
	end
end
