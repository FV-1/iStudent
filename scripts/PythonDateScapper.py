import json
import re
from urllib.parse import unquote

import requests
from bs4 import BeautifulSoup


def get_lat_long_from_url(url):
    decoded_url = unquote(url)  # Décodage de l'URL
    match = re.search(r'query=(-?\d+\.\d+),(-?\d+\.\d+)', decoded_url)
    if match:
        latitude = match.group(1)
        longitude = match.group(2)
        return latitude, longitude
    return None, None

def get_all_url():
    page_number = 1
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
    list_urls = []

    while True:
        print(f"Fetching data from page {page_number}...")
        url = f'https://www.bigcitynantes.fr/agenda/liste/page/{page_number}/?hide_subsequent_recurrences=1'
        r = requests.get(url, headers=headers)

        if r.status_code != 200:
            print(f"Error: {r.status_code}")
            break

        soup = BeautifulSoup(r.content, 'html.parser')
        urls = soup.find_all("a", class_="tribe-events-calendar-list__event-title-link tribe-common-anchor-thin")

        if not urls:
            print("Plus aucun URL à récupérer")
            break

        for a in urls:
            href = a.get('href')
            if href:
                print(f"URL: {href}")
                list_urls.append(href)

        page_number += 1

    with open("urls.json", "w", encoding="utf-8") as json_file:
        json.dump(list_urls, json_file, ensure_ascii=False, indent=4)

    print(f"Les URLs ont été sauvegardées dans 'urls.json'.")

import json
import re
from urllib.parse import unquote

import requests
from bs4 import BeautifulSoup


def get_lat_long_from_url(url):
    decoded_url = unquote(url)  # Décodage de l'URL
    match = re.search(r'query=(-?\d+\.\d+),(-?\d+\.\d+)', decoded_url)
    if match:
        latitude = match.group(1)
        longitude = match.group(2)
        return latitude, longitude
    return None, None

def get_all_data():
    id = 0
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
    events = []

    with open("urls.json", "r", encoding="utf-8") as json_file:
        urls = json.load(json_file)

    for event_url in urls:
        print(f"Fetching data for event at {event_url}...")
        r = requests.get(event_url, headers=headers)

        if r.status_code != 200:
            print(f"Error: {r.status_code} for URL: {event_url}")
            continue

        soup = BeautifulSoup(r.content, 'html.parser')

        titles = soup.find_all("h1", class_="tribe-events-single-event-title")
        tag_divs = soup.find_all("div", class_="event-tags")
        descriptions = soup.find_all("div", class_="tribe-events-single-event-description tribe-events-content")

        location_div = soup.find('div', class_='tribe-events-schedule tribe-clearfix')
        date_div = soup.find('div', class_='tribe-events-schedule tribe-clearfix')

        image_div = soup.find("div", class_="tribe-events-event-image")
        image_src = image_div.find("img").get("src") if image_div else "Aucune image disponible"

        coordonate = soup.find_all('a', href=lambda href: href and 'google.com/maps' in href)
        coordinates = [get_lat_long_from_url(coord.get('href')) for coord in coordonate]

        div = soup.find('div', class_='event-info-flex')

        if div:
            a_tag = div.find('a')
            if a_tag and a_tag.has_attr('href'):
                link = a_tag['href']
                print(link)
            else:
                print("Aucun lien trouvé.")
        else:
            print("Div non trouvée.")



        if location_div:
            location_p = location_div.find('p')
            location = location_p.get_text(strip=True) if location_p else "Localisation non trouvée"
        else:
            location = "Localisation non trouvée"

        if date_div:
            date_h2 = date_div.find('h2')
            dates = re.sub(r'(\D)(\d)', r'\1 \2', date_h2.get_text(strip=True)) if date_h2 else "Date non trouvée"
        else:
            dates = "Date non trouvée"

        if not dates or not titles or not tag_divs or not location or not descriptions:
            print("Plus aucune information trouvée.")
            continue

        for title, tag_div, description in zip(titles, tag_divs, descriptions):
            id += 1
            spans = tag_div.find_all("span")
            tags = [' '.join(span.stripped_strings) for span in spans]

            event = {
                "id": id,
                "date": " ".join(dates.strip().split()),
                "title": ' '.join(title.stripped_strings),
                "tags": tags,
                "location": location,
                "descriptions": ' '.join(description.stripped_strings),
                "image": image_src,
                "coordinates": coordinates,
                "link": link
            }

            print(f"Id : {id}")
            print(f"Date : {event['date']}")
            print(f"Titre : {event['title']}")
            print(f"Tags : {event['tags']}")
            print(f"Location : {event['location']}")
            print(f"Description : {event['descriptions']}")
            print(f"Image : {event['image']}")
            print(f"Coordinates : {event['coordinates']}")
            print(f"Link : {event['link']}")

            print("-" * 40)

            # Validation stricte : champs non vides + coordonnées valides
            if (
                event.get("title") and str(event["title"]).strip() and
                event.get("date") and str(event["date"]).strip() and
                event.get("location") and str(event["location"]).strip() and
                event.get("coordinates") and
                any(coord and coord != (None, None) for coord in event["coordinates"])
            ):
                events.append(event)
            else:
                print(f"Événement ignoré (champ vide ou coordonnées manquantes) : {event}")

    with open("evenements.json", "w", encoding="utf-8") as json_file:
        json.dump(events, json_file, ensure_ascii=False, indent=4)

    print(f"Les événements ont été sauvegardés dans 'evenements.json'.")


#get_all_url()
get_all_data()

