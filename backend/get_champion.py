import requests
from bs4 import BeautifulSoup

def get_champion_names_from_opgg():
    # チャンピオン一覧ページのURL
    url = 'https://www.op.gg/champions'

    # ユーザーエージェントを偽装する
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

    # requestsを使ってウェブページの内容を取得（ユーザーエージェントを指定）
    response = requests.get(url, headers=headers)

    # チャンピオン名を格納するリスト
    champion_names = []

    # ウェブページの内容が正常に取得できたか確認
    if response.status_code == 200:
        # BeautifulSoupオブジェクトを作成し、パーサーとして'lxml'を使用
        soup = BeautifulSoup(response.text, 'lxml')

        # チャンピオンへのリンクを含むすべてのaタグを検索
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            # '/champions/'を含むリンクを見つけたら
            if '/champions/' in href:
                # URLからチャンピオン名を抜き出す
                parts = href.split('/')
                if len(parts) > 2 and parts[1] == 'champions':
                    champion_names.append(parts[2])

        # 重複を削除して出力
        unique_champion_names = list(set(champion_names))
        return unique_champion_names
    else:
        print(f"Web page could not be retrieved from {url}: Status code", response.status_code)
        return None

# テスト
champion_names = get_champion_names_from_opgg()
if champion_names:
    print(champion_names)
