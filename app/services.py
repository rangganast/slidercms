import requests
import json

token = 'e9afcf297d4cff57bd1824d5899b48c068446946'

def get_list():
    url = 'https://keywords-log-qa.holahalo.dev/api/v1/keyword/list/'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                    'Authorization': 'Token {}'.format(token)})
    keywords_list = r.json()
    return keywords_list

def get_keywords():
    url = 'https://keywords-log-qa.holahalo.dev/api/v1/keyword/search/'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)})
    keywords_list = r.json()
    return keywords_list

def get_count_keywords():
    url = 'https://keywords-log-qa.holahalo.dev/api/v1/keyword/count/'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)})

    count_list = r.json()
    return count_list

def get_count_keywords_with_params(date1=None, date2=None):
    url = 'https://keywords-log-qa.holahalo.dev/api/v1/keyword/count/'

    params = {"date1" : date1, "date2": date2}

    r = requests.get(url, headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)}, params=params)

    count_list = r.json()
    return count_list

def post_keyword(keyword):
    url = 'https://keywords-log-qa.holahalo.dev/api/v1/keyword/search/'
    
    data = {"keyword" : keyword}
    return requests.post(url, data=json.dumps(data), headers={'Content-Type': 'application/json',
                                                  'Authorization': 'Token {}'.format(token)})