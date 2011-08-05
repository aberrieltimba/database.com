DatabaseCom::Application.routes.draw do

	LANGS = /en|es/

	constraints ({:subdomain=>/trust/,:locale=>LANGS}) do
        match "/" => "trust#home"
		match "(/:locale)/" => "trust#home"
		match "(/:locale)/home" => "trust#home"
		match "(/:locale)/security" => "trust#security"
		match "(/:locale)/security/reportsecurityissue" => "trust#security", :subpage => "reportsecurityissue"
		match "(/:locale)/privacy" => "trust#privacy"
		match "(/:locale)/privacy/global-privacy" => "trust#privacy", :subpage => "global-privacy"
		match "(/:locale)/privacy/tools" => "trust#privacy", :subpage => "tools"

		match "(/:locale)/status" => "trust#status"
		match "(/:locale)/status/status" => "status#status_status"
		match "(/:locale)/status/maintenance" => "status#status_maintenance"
		match "(/:locale)/status/releasewindow" => "status#status_releasewindow"

		match "(/:locale)/*anything" => "trust#pagenotfound"
	end

	constraints ({:locale=>LANGS}) do
		# match trust pages without using subdomain
		match "/trust(/:locale)/" => "trust#home"
		match "/trust(/:locale)/home" => "trust#home"
		match "/trust(/:locale)/security" => "trust#security"
		match "/trust(/:locale)/security/reportsecurityissue" => "trust#security", :subpage => "reportsecurityissue"
		match "/trust(/:locale)/privacy" => "trust#privacy"
		match "/trust(/:locale)/privacy/global-privacy" => "trust#privacy", :subpage => "global-privacy"
		match "/trust(/:locale)/privacy/tools" => "trust#privacy", :subpage => "tools"

		match "/trust(/:locale)/status" => "trust#status"
		match "/trust(/:locale)/status/status" => "status#status_status"
		match "/trust(/:locale)/status/maintenance" => "status#status_maintenance"
		match "/trust(/:locale)/status/releasewindow" => "status#status_releasewindow"

		match "/trust(/:locale)/*anything" => "trust#pagenotfound"
	end

	match "/:locale" => "site#index", :constraints => {:locale => LANGS}
	match "(/:locale)/:action", :controller => "site", :constraints => {:locale => LANGS}
	root :to => "site#index"

end
