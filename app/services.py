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
    regions = list(set([item['keyword_ip_region'] + '/' for item in regions]))

    return regions

def get_cities(id, country, region):
    url =  domain + '/api/v1/keyword/ajax/load-cities'

    params = {"keyword_id": id, "country": country, "region": region}

    r = requests.get(url, headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)}, params=params)

    cities = r.json()
    cities = list(set([item['keyword_ip_city'] + '/' for item in cities]))

    return cities

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

def post_products_total(id, keyword):
    url =  domain + '/api/v1/keyword/scrape'
    products_total_url = 'https://qaweb.holahalo.dev/api/v1/public/search-product?q=' + keyword
    r = requests.get(products_total_url, headers={'Content-Type': 'application/json'}, params={'q' : keyword})

    products_data = r.json()

    products_num = 0

    if(products_data):
        products_num = len(products_data['data'])

    if id:
        data = {
            "id" : id,
            "lastscrape_date" : datetime.date.today().strftime('%Y-%m-%d'),
            "lastscrape_time" : datetime.datetime.now().time().strftime('%H:%M:%S'),
            "lastscrape_products" : products_num,
        }

        return requests.post(url, data=json.dumps(data), headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)})