import requests
from bs4 import BeautifulSoup
import json

def get_positions(champion_name):
    # ビルドページのURLを構築
    url = f'https://www.op.gg/champions/{champion_name}/build'

    # ユーザーエージェントを偽装する
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

    # requestsを使ってウェブページの内容を取得（ユーザーエージェントを指定）
    response = requests.get(url, headers=headers)

    # ウェブページの内容が正常に取得できたか確認
    if response.status_code == 200:
        # BeautifulSoupオブジェクトを作成し、パーサーとして'lxml'を使用
        soup = BeautifulSoup(response.text, 'lxml')

        # 'FILTER-POSITION' data-keyを持つすべての要素を検索
        position_elements = soup.find_all(attrs={"data-key": "FILTER-POSITION"})

        # 各要素から'data-value'を取得
        positions = [element['data-value'] for element in position_elements]

        # 重複を削除して出力
        unique_positions = list(set(positions))
        # print(f"Champion '{champion_name}' positions:", ', '.join(unique_positions))
        print(f"Champion '{champion_name}' : ", ', '.join(unique_positions))


        # データを辞書に変換
        data = {champion_name: unique_positions}

        # JSON形式に変換して表示
        json_data = json.dumps(data, indent=2)  # indentは整形するためのスペースの数
        print(json_data)

    else:
        print(f"Web page could not be retrieved from {url}: Status code", response.status_code)

# テスト
get_positions('akali')
get_positions('ezreal')
get_positions('Akali')
get_positions('Aatrox')
get_positions('Ahri')
get_positions('Ashe')
get_positions('HOGEHOGE')