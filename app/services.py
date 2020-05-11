import requests
import json
from datetime import datetime

token = '94efa1fdcbef94fbdaeb39f0cff9c246d9154fb1'

def get_list():
    url = 'https://keywords-log-qa.holahalo.dev/api/v1/keyword/list'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                    'Authorization': 'Token {}'.format(token)})
    keywords_list = r.json()
    return keywords_list

def get_keywords():
    url = 'https://keywords-log-qa.holahalo.dev/api/v1/keyword/search'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)})
    keywords_list = r.json()
    return keywords_list

def get_count_keywords():
    url = 'https://keywords-log-qa.holahalo.dev/api/v1/keyword/count'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)})

    count_list = r.json()
    return count_list

def get_count_keywords_with_params(date1=None, date2=None):
    url = 'https://keywords-log-qa.holahalo.dev/api/v1/keyword/count'

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