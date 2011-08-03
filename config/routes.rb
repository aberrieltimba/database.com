DatabaseCom::Application.routes.draw do

	constraints ({:subdomain=>/trust/}) do
		match "/" => "trust#home"
		match "/home" => "trust#home"
		match "/security" => "trust#security"
		match "/security/reportsecurityissue" => "trust#security", :subpage => "reportsecurityissue"
		match "/privacy" => "trust#privacy"
		match "/privacy/global-privacy" => "trust#privacy", :subpage => "global-privacy"
		match "/privacy/tools" => "trust#privacy", :subpage => "tools"

		match "/status" => "trust#status"
        match "/status/status" => "status#status_status"
        match "/status/maintenance" => "status#status_maintenance"
        match "/status/releasewindow" => "status#status_releasewindow"

		match "/*anything" => "trust#pagenotfound"
	end

    match "/:locale" => "site#index", :constraints => {:locale => /en|es/}
    match "(/:locale)/:action", :controller => "site", :constraints => {:locale => /en|es/}
    root :to => "site#index"

end
