
from db import db_client
import json
import os
import dialogflow
import requests
import json
from flask import jsonify, request
import re

menu_db = db_client.menu
menu_db = db_client.menu
review_db = db_client.review

def construct_custom_intent(type, items, text_message):
    message1 = {
    "fulfillmentText": "Your text response",
    "fulfillmentMessages": [
        {
            "text": {
                "text": [
                    text_message
                ]
            }
        },
        {
            "payload": {

            }
        }
    ]
        }
    message = {
        "richContent": [
            [
            ]
        ]
        }
    if(type == 'menu_category'):
        for x in items['menu_items']:
            menu_item_rich = {
                "type": "list",
                "title": x['name'],
                "subtitle": f"Description: {x['description']}\nPrice: {x['price']}",
            }
            message['richContent'][0].append(menu_item_rich)
            message['richContent'][0].append({'type':'divider'})
    elif(type == 'menu_category_general'):
        for x in items:
            # print(x['name']i)
            menu_category_rich = {
                "type": "list",
                "title": x['name'],
                }
            message['richContent'][0].append(menu_category_rich)
            message['richContent'][0].append({'type':'divider'})
    elif(type == 'review'):
        z=0
        for x in items:
            print(x)
            if(z==3):break
            review_item = {
                "type": "list",
                "title": x['review'],
                "subtitle": f"Rating: {x['rating']}/5\nDate Reviewed: {x['date_time']}"
            }
            message['richContent'][0].append(review_item)
            message['richContent'][0].append({'type':'divider'})
            z+=1
    elif(type == 'suggestion'):
        for x in items:
            for menu_item in x['menu_items']:
                if menu_item['chefs_pick'] == True:
                    menu_item_rich = {
                        "type": "list",
                        "title": menu_item['name'],
                        "subtitle": f"Description: {menu_item['description']}\nPrice: {menu_item['price']}\nRating: {menu_item['rating']}/5.0",
                    }
                    message['richContent'][0].append(menu_item_rich)
                    message['richContent'][0].append({'type':'divider'})
    message1['fulfillmentMessages'][1]['payload'] = message
    return jsonify(message1)
def handle_chats():
    data = request.get_json(silent=True)
    print(data['queryResult']['parameters'])
    if 'menu_item' in data['queryResult']['parameters']:
        menu_item_raw = data['queryResult']['parameters']['menu_item']
        category = menu_db.find_one({'menu_items.name': re.compile(menu_item_raw, re.IGNORECASE)})
        menu_item_queried = menu_db.aggregate([
                {'$unwind': '$menu_items'},
                {'$match':{"menu_items.name": re.compile(menu_item_raw, re.IGNORECASE)}},
                {'$project': {
                            'name': '$menu_items.name',
                            'price': '$menu_items.price'
                }}
        ])
        item = menu_item_queried.next()
        message = {
            "fulfillmentText": "Your text response",
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            f"Here is the detail of {item['name']}"
                        ]
                    }
                },
                {
                    "payload": {
                        
                        "richContent": [
                            [
                            {
                                "type": "image",
                                "rawUrl": "http://localhost:3000/static/media/test.17541ace.jpg",
                            },
                            {
                                "type": "info",
                                "title": item['name'],
                                "subtitle": f"Menu-category: {category['name']}\nPrice: {item['price']}",
                                
                            }
                            ]
                        ]
                        
                    }
                }
            ]
        }
        return jsonify(message)
    elif('menu_category' in data['queryResult']['parameters']):
        menu_category = data['queryResult']['parameters']['menu_category']
        category = menu_db.find_one({'name': re.compile(menu_category, re.IGNORECASE)})
        text_message = f"Here are the list of {menu_category}"
        return construct_custom_intent('menu_category', category, text_message)
    elif('menu_category_general' in data['queryResult']['parameters']):
        category = menu_db.find({})
        text_message = "Here are the categories"
        return construct_custom_intent('menu_category_general',category, text_message)
    elif('review' in data['queryResult']['parameters']):
        reviews = review_db.find({})
        text_message ="Here are some reviews for this restaurant"
        return construct_custom_intent("review", reviews, text_message)
    elif('suggestion' in data['queryResult']['parameters']):
        categories = list(menu_db.find({}).sort("menu_items.rating"))
        print(categories)
        text_message="Here are the top rated dish in our menu"
        return construct_custom_intent('suggestion', categories, text_message)
    return jsonify(reply)