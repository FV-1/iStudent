"""
Récupération des événements nantais depuis l'agenda de bigcitynantes.fr.

Usage :
    python PythonDateScapper.py --urls      # (re)construit urls.json
    python PythonDateScapper.py             # construit evenements.json

Le fichier produit doit ensuite être copié vers assets/data/evenements.json.
"""

import argparse
import json
import re
import time
from urllib.parse import unquote

import requests
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
        '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    )
}

# Délai entre deux requêtes : on interroge un site tiers, on reste courtois.
REQUEST_DELAY_SECONDS = 0.5
LIST_URL = 'https://www.bigcitynantes.fr/agenda/liste/page/{page}/?hide_subsequent_recurrences=1'


def get_lat_long_from_url(url):
    """Extrait (latitude, longitude) d'un lien Google Maps, sinon (None, None)."""
    decoded_url = unquote(url)
    match = re.search(r'query=(-?\d+\.\d+),(-?\d+\.\d+)', decoded_url)
    if match:
        return match.group(1), match.group(2)
    return None, None


def get_all_url():
    page_number = 1
    list_urls = []

    while True:
        print(f"Récupération de la page {page_number}...")
        response = requests.get(LIST_URL.format(page=page_number), headers=HEADERS, timeout=30)

        if response.status_code != 200:
            print(f"Erreur HTTP {response.status_code}")
            break

        soup = BeautifulSoup(response.content, 'html.parser')
        anchors = soup.find_all(
            "a",
            class_="tribe-events-calendar-list__event-title-link tribe-common-anchor-thin",
        )

        if not anchors:
            print("Plus aucune URL à récupérer.")
            break

        for anchor in anchors:
            href = anchor.get('href')
            if href:
                list_urls.append(href)

        page_number += 1
        time.sleep(REQUEST_DELAY_SECONDS)

    with open("urls.json", "w", encoding="utf-8") as json_file:
        json.dump(list_urls, json_file, ensure_ascii=False, indent=4)

    print(f"{len(list_urls)} URLs sauvegardées dans 'urls.json'.")


def extract_link(soup):
    """Lien « billetterie / site officiel » de l'événement, ou None."""
    div = soup.find('div', class_='event-info-flex')
    if not div:
        return None
    a_tag = div.find('a')
    if a_tag and a_tag.has_attr('href'):
        return a_tag['href']
    return None


def get_all_data():
    event_id = 0
    events = []

    with open("urls.json", "r", encoding="utf-8") as json_file:
        urls = json.load(json_file)

    for event_url in urls:
        print(f"Traitement de {event_url}...")
        response = requests.get(event_url, headers=HEADERS, timeout=30)
        time.sleep(REQUEST_DELAY_SECONDS)

        if response.status_code != 200:
            print(f"  Erreur HTTP {response.status_code}, ignoré.")
            continue

        soup = BeautifulSoup(response.content, 'html.parser')

        titles = soup.find_all("h1", class_="tribe-events-single-event-title")
        tag_divs = soup.find_all("div", class_="event-tags")
        descriptions = soup.find_all(
            "div",
            class_="tribe-events-single-event-description tribe-events-content",
        )

        schedule_div = soup.find('div', class_='tribe-events-schedule tribe-clearfix')

        image_div = soup.find("div", class_="tribe-events-event-image")
        image_tag = image_div.find("img") if image_div else None
        # None (et non un texte) : l'application bascule alors sur son image
        # de repli, alors qu'une chaîne serait interprétée comme une URL.
        image_src = image_tag.get("src") if image_tag else None

        map_anchors = soup.find_all(
            'a', href=lambda href: href and 'google.com/maps' in href
        )
        coordinates = [get_lat_long_from_url(a.get('href')) for a in map_anchors]

        # Réinitialisé à chaque événement : la variable était auparavant
        # définie hors de la boucle, si bien qu'un événement sans lien
        # héritait silencieusement de celui de l'événement précédent.
        link = extract_link(soup)

        location = "Localisation non trouvée"
        dates = "Date non trouvée"
        if schedule_div:
            location_p = schedule_div.find('p')
            if location_p:
                location = location_p.get_text(strip=True)
            date_h2 = schedule_div.find('h2')
            if date_h2:
                dates = re.sub(r'(\D)(\d)', r'\1 \2', date_h2.get_text(strip=True))

        if not titles or not tag_divs or not descriptions:
            print("  Informations incomplètes, ignoré.")
            continue

        for title, tag_div, description in zip(titles, tag_divs, descriptions):
            event_id += 1
            tags = [' '.join(span.stripped_strings) for span in tag_div.find_all("span")]

            event = {
                "id": event_id,
                "date": " ".join(dates.strip().split()),
                "title": ' '.join(title.stripped_strings),
                "tags": tags,
                "location": location,
                "descriptions": ' '.join(description.stripped_strings),
                "image": image_src,
                "coordinates": coordinates,
                "link": link,
            }

            has_coordinates = any(
                coord and coord != (None, None) for coord in event["coordinates"]
            )
            if (
                event["title"].strip()
                and event["date"].strip()
                and event["location"].strip()
                and has_coordinates
            ):
                events.append(event)
                print(f"  [{event_id}] {event['title']}")
            else:
                print(f"  [{event_id}] ignoré (champ vide ou coordonnées manquantes)")

    with open("evenements.json", "w", encoding="utf-8") as json_file:
        json.dump(events, json_file, ensure_ascii=False, indent=4)

    print(f"{len(events)} événements sauvegardés dans 'evenements.json'.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--urls",
        action="store_true",
        help="reconstruire urls.json au lieu de collecter les événements",
    )
    args = parser.parse_args()

    if args.urls:
        get_all_url()
    else:
        get_all_data()
