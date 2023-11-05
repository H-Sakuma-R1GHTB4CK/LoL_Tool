// このインターフェースは、JSONデータの構造を定義します。
interface ChampionsData {
    [key: string]: string[];
}

document.addEventListener('DOMContentLoaded', () => {
    let selectedChampions: string[] = [];

    function fetchData(): Promise<ChampionsData> {
        return fetch('data.json') // JSONファイルのパス
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }

    function updateDisplayedList(championsData: ChampionsData): void {
        const searchQuery: string = (document.getElementById('searchBar') as HTMLInputElement).value.toLowerCase();
        const list: HTMLElement = document.getElementById('championsContainer')!;
        list.innerHTML = ''; // リストをクリア
        Object.keys(championsData).forEach((champion) => {
            if (champion.toLowerCase().includes(searchQuery)) {
                const checkbox: HTMLInputElement = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = champion;
                checkbox.name = 'champions';
                checkbox.value = champion;
                checkbox.checked = selectedChampions.includes(champion);
                checkbox.onchange = () => {
                    onCheckboxChange(checkbox, champion, championsData);
                };

                const label: HTMLLabelElement = document.createElement('label');
                label.htmlFor = champion;
                // チャンピオンの名前と役割をラベルに追加
                const roles = championsData[champion].join(' ');
                label.appendChild(document.createTextNode(`${champion} : ${roles}`));

                list.appendChild(checkbox);
                list.appendChild(label);
                list.appendChild(document.createElement('br'));
            }
        });
    }

    function onCheckboxChange(checkbox: HTMLInputElement, champion: string, championsData: ChampionsData): void {
        if (checkbox.checked) {
            selectedChampions.push(champion); // チャンピオンを選択リストに追加
        } else {
            selectedChampions = selectedChampions.filter((champ: string) => champ !== champion); // チャンピオンを選択リストから削除
        }
        updateSelectedList(championsData); // 修正：championsDataを渡す
    }


    function updateSelectedList(championsData: ChampionsData): void {
        const list: HTMLElement = document.getElementById('selectedList')!;
        list.innerHTML = ''; // リストをクリア
        selectedChampions.forEach((champion: string) => {
            const li: HTMLLIElement = document.createElement('li');
            // チャンピオンの名前と役割を表示
            const roles = championsData[champion].join(' '); // 役割を取得して文字列に変換
            li.textContent = `${champion} : ${roles}`;
            list.appendChild(li);
        });
    }


    // 検索バーと初期のリスト表示
    const searchBar: HTMLInputElement = document.getElementById('searchBar') as HTMLInputElement;
    searchBar.addEventListener('input', () => {
        fetchData().then(updateDisplayedList).catch(error => {
            console.error('Error fetching the champions data:', error);
        });
    });

    // 初期データの取得とリストの更新
    fetchData().then(updateDisplayedList).catch(error => {
        console.error('Error fetching the champions data:', error);
    });
});
