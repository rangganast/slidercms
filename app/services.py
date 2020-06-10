import requests
import json
from datetime import datetime

token = 'f5cc920a4a4103f8e625d2aa66bfb030e8e2ee87'

def get_list():
    url = 'https://keywords-serach-api.holahalo.com/api/v1/keyword/list'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                    'Authorization': 'Token {}'.format(token)})
    keywords_list = r.json()
    return keywords_list

def get_keywords():
    url = 'https://keywords-serach-api.holahalo.com/api/v1/keyword/search'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)})
    keywords_list = r.json()
    return keywords_list

def get_count_keywords():
    url = 'https://keywords-serach-api.holahalo.com/api/v1/keyword/count'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)})

    count_list = r.json()
    return count_list

def get_count_keywords_with_params(date1=None, date2=None):
    url = 'https://keywords-serach-api.holahalo.com/api/v1/keyword/count'

    date1_check = True
    date2_check = True

    try:
        datetime.strptime(date1, '%d-%m-%Y')
    except ValueError:
        date1_check = False

    try:
        datetime.strptime(date2, '%d-%m-%Y')
    except ValueError:
        date2_check = False

    if date1_check and date2_check:
        params = {"date1" : date1, "date2": date2}

        r = requests.get(url, headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)}, params=params)
        print(r)

        count_list = r.json()
        return count_list

    else:
        return None