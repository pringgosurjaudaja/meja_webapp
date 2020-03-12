import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

'''
Referenced from 
https://realpython.com/python-send-email/#option-1-setting-up-a-gmail-account-for-development
'''

email = {
    'sender': 'artemisproject28@gmail.com',
    'recipient': 'artemisproject28+test@gmail.com',
    'subject': 'Multipart Test',
    'text': '''\
            Hi,
            How are you?
            Real Python has many great tutorials:
            www.realpython.com\
           ''',
    'html': '''
            <html>
            <body>
                <p>Hi,<br>
                How are you?<br>
                <a href="http://www.realpython.com">Real Python</a> 
                has many great tutorials.
                </p>
            </body>
            </html>
           '''
}

# Addding config and HTML/plain-text parts to a MIMEMultipart message
message = MIMEMultipart('alternative')
message['Subject'] = email['subject']
message['From'] = email['sender']
message['To'] = email['recipient']
# The email client will try to render HTML version before plain-text
message.attach(MIMEText(email['text'], 'plain'))
message.attach(MIMEText(email['html'], 'html'))

# Config setup for SMTP server
password = input('Type your password: ')
port = 465
context = ssl.create_default_context()

# Create secure SSL Context
with smtplib.SMTP_SSL('smtp.gmail.com', port, context=context) as server:
    server.login('artemisproject28@gmail.com', password)    
    server.sendmail(email['sender'], email['recipient'], message.as_string())