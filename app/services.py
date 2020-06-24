import requests
import json
import datetime
import time
from decouple import config

token = config('TOKEN')
domain = config('DOMAIN')

def get_list():
    url = domain + '/api/v1/keyword/list'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                    'Authorization': 'Token {}'.format(token)})
    keywords_list = r.json()
    return keywords_list

def get_keywords():
    url =  domain + '/api/v1/keyword/search'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)})
    keywords_list = r.json()
    return keywords_list

def get_keyword_ips(id):
    url =  domain + '/api/v1/keyword/ip/' + str(id)

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)})
    ip_list = r.json()
    return ip_list

def get_regions(id, country):
    url =  domain + '/api/v1/keyword/ajax/load-regions'

    params = {"keyword_id" : id, "country": country}

    r = requests.get(url, headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)}, params=params)

    regions = r.json()
    regions = str(list(set([item['keyword_ip_region'] for item in regions])))

    return regions

def get_count_keywords():
    url =  domain + '/api/v1/keyword/count'

    r = requests.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)})

    count_list = r.json()
    return count_list

def get_count_keywords_with_params(date1=None, date2=None):
    url =  domain + '/api/v1/keyword/count'

    date1_check = True
    date2_check = True

    try:
        datetime.datetime.strptime(date1, '%d-%m-%Y')
    except ValueError:
        date1_check = False

    try:
        datetime.datetime.strptime(date2, '%d-%m-%Y')
    except ValueError:
        date2_check = False

    if date1_check and date2_check:
        params = {"date1" : date1, "date2": date2}

        r = requests.get(url, headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)}, params=params)

        count_list = r.json()
        return count_list

    else:
        return None

def post_scrape(id, products_num):
    url =  domain + '/api/v1/keyword/scrape'

    if id and products_num:
        data = {
            "id" : id,
            "lastscrape_date" : datetime.date.today().strftime('%Y-%m-%d'),
            "lastscrape_time" : datetime.datetime.now().time().strftime('%H:%M:%S'),
            "lastscrape_products" : products_num,
        }

        return requests.post(url, data=json.dumps(data), headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)})