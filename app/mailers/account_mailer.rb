class AccountMailer < ActionMailer::Base
  default :from => "no-reply@database.com"
  
  def welcome_email(params)
    @name = params['FirstName'] + ' ' + params['LastName']
    mail( :to => params['Email'], :subject => 'Welcome to database.com' )
  end
end
