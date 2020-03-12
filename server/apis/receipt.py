import smtplib, ssl

port = 465
password = input('Type your password: ')

# Create secure SSL Context
context = ssl.create_default_context()
sender_email = 'artemisproject28@gmail.com'
recipient_email = 'artemisproject28+test@gmail.com'
email = """\
Subject: Hi there

This message is sent from Python."""


with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
    server.login("artemisproject28@gmail.com", password)    
    server.sendmail(sender_email, recipient_email, email)