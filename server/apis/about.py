import requests
from pprint import pprint
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from config.zomato import config as zomato_config


'''
*******************************************************************
About Details Backend Service

API endpoints to obtain details regarding the restaurant as a whole,
primarily reviews for the restaurant. Contacts Zomato API as well
for additional community reviews on the restaurant.
*******************************************************************
'''


about = Namespace('about', description='Restaurant Details Backend Service')

@about.route('')
class RestaurantRoute(Resource):
    @about.doc(description='Get All Details of the Restaurant')
    def get(self):
        # Fetch from Zomato API
        response = requests.get(
            url=zomato_config['url'] + '/restaurant', 
            params=zomato_config['params'], 
            headers=zomato_config['headers']
        )

        if response.status_code == status.HTTP_200_OK:
            return response.json(), status.HTTP_200_OK

        return {
            'error': 'Invalid Restaurant ID'
        }, status.HTTP_400_BAD_REQUEST
