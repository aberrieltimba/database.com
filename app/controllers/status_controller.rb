class StatusController < ApplicationController
  layout nil
  
  def download_page(file, url)
    begin
      f = File.open(file,File::WRONLY|File::CREAT|File::EXCL)
      @response = Net::HTTP.get_response( URI.parse( url ) )
      
      @response.body.each_line do |line|
        f.write line.gsub(/(link.*?href|src)=["|']([\w\.\-\/]*)\/([\w\.\-]*)(\?[^\"]*)?["|']/, "\\1=\"\\3\"")
      end
      f.close
      return true
    rescue
      return false
    end
  end

  # Fetch status pages from trust.salesforce.com and cache them.
  # Use cached pages if they exist and are not older than 5 minutes.
  def fetch_cache(file, url)
    @path = "tmp/" + file + ".html";
    @temp = @path + ".fetch"
    @doFetch = !(FileTest.exists?(@path) && (Time.new - File.mtime(@path) < (5 * 60)))
    
    if @doFetch and download_page(@temp,url) then
        File.delete(@path) if File.exists?(@path)
        File.rename(@temp, @path)
    end
    
    if File.exists?(@path) then
      return @path
    else
      @useOnce = @path + "." + rand(100000).to_s + ".once"
      download_file(@useOnce, url)
      return @useOnce
    end
  end

  def status_status
    @path = fetch_cache("status_status","http://trust.salesforce.com/status-data/status.jsp")
    render :file => @path
    File.delete(@path) if @path =~ /\.once$/
  end

  def status_maintenance
    @path = fetch_cache("status_maintenance","http://trust.salesforce.com/status-data/maintenance.jsp")
    render :file => @path
    File.delete(@path) if @path =~ /\.once$/
  end

  def status_releasewindow
    @path = fetch_cache("status_releasewindow","http://trust.salesforce.com/status-data/release-window.jsp")
    render :file => @path
    File.delete(@path) if @path =~ /\.once$/
  end

end
