class TrustController < ApplicationController
  layout "trust"

  # Sets @root variable for link generation.
  # Links will differ if trust site is accessed
  # via subdomain (trust.database.com/) or via subfolder (database.com/trust/)
  before_filter :set_root
  def set_root
    @root = /trust\..*/ =~ request.headers["SERVER_NAME"] ? "/" : "/trust/"
  end

  def pagenotfound(exception = nil)
    logger.info "Rendering 404 with exception: #{exception.message}" if exception

    respond_to do |format|
      format.html { render "404", :status => :not_found }
      format.xml  { head :not_found }
      format.any  { head :not_found }
    end

  end

  def security
    case params[:subpage]
    when nil, ""
      render "security"
    when "reportsecurityissue"
      render "security_reportsecurityissue"
    else
      pagenotfound
    end
  end

  def privacy
    case params[:subpage]
    when nil, ""
      render "privacy"
    when "tools"
      render "privacy_tools"
    when "global-privacy"
      render "privacy_globalprivacy"
    else
      pagenotfound
    end
  end

end
