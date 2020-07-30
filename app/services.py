import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

import json
import datetime
import time
import pickle
from decouple import config
from io import StringIO, BytesIO
from lxml import etree
from .models import SMSStatus, SMSBlast, SMSBlastJob, Contact

token = config('TOKEN')
domain = config('DOMAIN')

session = requests.Session()
retry = Retry(total=3, connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

def get_list():
    url = domain + '/api/v1/keyword/list'

    r = session.get(url, headers={'Content-Type': 'application/json',
                                    'Authorization': 'Token {}'.format(token)})
    keywords_list = r.json()
    return keywords_list

def get_keywords():
    url =  domain + '/api/v1/keyword/search'

    r = session.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)})
    keywords_list = r.json()
    return keywords_list

def get_keyword_ips(id, date1, date2):
    url =  domain + '/api/v1/keyword/ip/' + str(id)

    date1 = datetime.datetime.strptime(date1, '%d-%m-%Y').strftime('%Y-%m-%d')
    date2 = datetime.datetime.strptime(date2, '%d-%m-%Y').strftime('%Y-%m-%d')

    params = {"date1" : date1, "date2": date2}

    r = session.get(url, headers={'Content-Type': 'application/json',
                                   'Authorization': 'Token {}'.format(token)}, params=params)
    ip_list = r.json()
    return ip_list

def get_regions(id, country):
    url =  domain + '/api/v1/keyword/ajax/load-regions'

    params = {"keyword_id" : id, "country": country}

    r = session.get(url, headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)}, params=params)

    regions = r.json()
    regions = list(set([item['keyword_ip_region'] + '/' for item in regions if item['keyword_ip_region'] is not None]))

    return regions

def get_cities(id, country, region):
    url =  domain + '/api/v1/keyword/ajax/load-cities'

    params = {"keyword_id": id, "country": country, "region": region}

    r = session.get(url, headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)}, params=params)

    cities = r.json()
    cities = list(set([item['keyword_ip_city'] + '/' for item in cities if item['keyword_ip_city'] is not None]))

    return cities

def get_count_keywords():
    url =  domain + '/api/v1/keyword/count'

    r = session.get(url, headers={'Content-Type': 'application/json',
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

        r = session.get(url, headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)}, params=params)

        count_list = r.json()
        return count_list

    else:
        return None

def post_products_total(id, keyword):
    url =  domain + '/api/v1/keyword/scrape'
    products_total_url = 'https://qaweb.holahalo.dev/api/v1/public/search-product?q=' + keyword
    r = session.get(products_total_url, headers={'Content-Type': 'application/json'}, params={'q' : keyword})
    
    products_data = r.json()

    products_num = 0

    if(products_data):
        products_num = products_data['meta']['total']

    if id:
        data = {
            "id" : id,
            "lastscrape_date" : datetime.date.today().strftime('%Y-%m-%d'),
            "lastscrape_time" : datetime.datetime.now().time().strftime('%H:%M:%S'),
            "lastscrape_products" : products_num,
        }

        return session.post(url, data=json.dumps(data), headers={'Content-Type': 'application/json', 'Authorization': 'Token {}'.format(token)})

def export_excel(date1, date2, app):
    url =  domain + '/api/v1/keyword/export'

    params = {"date1" : date1, "date2": date2, "app": app}

    r = session.get(url, stream=True, headers={'Content-Type': 'application/vnd.ms-excel',
                                   'Authorization': 'Token {}'.format(token)}, params=params)

    return r.content

def sms_blast(name, message_title, message_text, contacts, send_date, send_time, job_instance_id):
    message_text = message_text.replace(' ', '+')

    smsjob_instance = SMSBlastJob.objects.get(pk=job_instance_id)
    contact_instance = Contact.objects.get(name=name)
    
    statuses = []
    for contact in contacts:
        sms_api_url = 'http://api-sms.nadyne.com/sms.php?user=regholahalo&pwd=reg778899&sender=HOLAHALO&msisdn=62' + contact[1:] + '&message=' + message_text + '&desc=pesanhhmarketing'
        r = session.get(sms_api_url)

        file_like_xml = BytesIO(r.content)
        response = etree.parse(file_like_xml)
        message = response.getroot()
        
        status = message.find('Status').text

        statuses.append(status)

    with open('pickles/status/status-' + message_title.replace(' ', '-') + '-' + name.replace(' ', '-') + '.p', 'wb') as f:
        pickle.dump(statuses, f)
        f.close()

    smsstatus_instance = SMSStatus(job=smsjob_instance, contact=contact_instance)
    smsstatus_instance.status.name = 'pickles/status/status-' + message_title.replace(' ', '-') + '-' + name.replace(' ', '-') + '.p'
    smsstatus_instance.save()

    return statuses