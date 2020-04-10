import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailSender:
    def __init__(self):
        self.config = {
            'sender': 'artemisproject28@gmail.com',
        }
    
    def send_email(self, recipient_email, email_content):
        '''
        Referenced from 
        https://realpython.com/python-send-email/#option-1-setting-up-a-gmail-account-for-development
        '''
        # Addding config and HTML/plain-text parts to a MIMEMultipart message
        message = MIMEMultipart('alternative')
        message['Subject'] = email_content['subject']
        message['From'] = self.config['sender']
        message['To'] = recipient_email
        # The email client will try to render HTML version before plain-text
        message.attach(MIMEText(email_content['text'], 'plain'))
        message.attach(MIMEText(email_content['html'], 'html'))

        # Config setup for SMTP server
        password = 'Artemis123'     # Need to hash and store this somewhere else (SECURITY RISK)
        port = 465
        context = ssl.create_default_context()

        # Create secure SSL Context
        with smtplib.SMTP_SSL('smtp.gmail.com', port, context=context) as server:
            server.login(self.config['sender'], password)    
            server.sendmail(self.config['sender'], recipient_email, message.as_string())