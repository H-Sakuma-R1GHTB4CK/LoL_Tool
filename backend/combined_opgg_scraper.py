
import requests
from bs4 import BeautifulSoup
import json

def get_html_from_opgg(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    response = requests.get(url, headers=headers)
    return response.text if response.status_code == 200 else None


def get_champion_names_from_opgg():
    url = 'https://www.op.gg/champions'
    html_content = get_html_from_opgg(url)
    if not html_content:
        return []
    soup = BeautifulSoup(html_content, 'lxml')
    return [a_tag['href'].split('/')[2] for a_tag in soup.find_all('a', href=True) if '/champions/' in a_tag['href']]


def get_positions(champion_name):
    url = f'https://www.op.gg/champions/{champion_name}/build'
    html_content = get_html_from_opgg(url)
    if not html_content:
        return []
    soup = BeautifulSoup(html_content, 'lxml')
    return list({element['data-value'] for element in soup.find_all(attrs={"data-key": "FILTER-POSITION"})})


def write_champions_to_js(champion_names, filename='data.js'):
    champ_dict = {name: get_positions(name) for name in champion_names}
    with open(filename, 'w', encoding='utf-8') as file:
        json_data = json.dumps(champ_dict, ensure_ascii=False, indent=2)
        file.write(f'export default {json_data};')


def write_champions_to_json(champion_names, filename='data.json'):
    # この関数は各チャンピオン名に対してポジションを取得し、辞書に格納します。
    champ_dict = {name: get_positions(name) for name in champion_names}
    with open(filename, 'w', encoding='utf-8') as file:
        json_data = json.dumps(champ_dict, ensure_ascii=False, indent=2)
        file.write(json_data)  # .jsonファイルには'export default'は不要です。


if __name__ == '__main__':
    champion_names = get_champion_names_from_opgg()  # この関数はチャンピオンの名前のリストを返すものとします。
    # write_champions_to_json(champion_names[0:5])  # 最初の5つのチャンピオンについてJSONファイルを生成します。
    write_champions_to_json(champion_names)