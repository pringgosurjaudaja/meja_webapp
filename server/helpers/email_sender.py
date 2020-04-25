import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import render_template

class EmailSender:
    def __init__(self):
        self.config = {
            'sender': 'artemisproject28@gmail.com',
        }
    
    def send_email(self, recipient_email, email_content):
        '''
        Referenced from 
        https://realpython.com/python-send-email
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

    def prepare_receipt_email(self, session, user):
        receipt = {
            'name': user['name'],
            'restaurant': 'Cho Cho San',
            'order_id': session['_id'],
            'order_items': [],
            'total_price': 0
        }

        for orders in session['order_list']:
            for item in orders['order_items']:
                receipt['order_items'].append({
                    'name': item['menu_item']['name'],
                    'quantity': item['quantity'],
                    'unit_price': item['menu_item']['price']
                })
                receipt['total_price'] += item['quantity'] * item['menu_item']['price']

        return {
            'subject': 'Receipt for your time at ' + receipt['restaurant'],
            'text': 'Please go to Meja app for your receipt.',
            'html': render_template('receipt.html', context=receipt)
        }

    def prepare_reservation_email(self, reservation):
        reservation_context = {
            'name': reservation['email'],
            'number_diner': reservation['number_diner'],
            'date_time': reservation['datetime'],
            'notes': reservation['reservation_notes']
        }

        return {
            'subject': f"Reservation Confirmation for {reservation['datetime']}",
            'text': f"Your reservation at {reservation['datetime']} for {reservation['number_diner']} people are confirmed.",
            'html': render_template('reservation_confirmation.html', context=reservation_context)
        }