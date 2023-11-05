"use strict";
document.addEventListener('DOMContentLoaded', () => {
    let selectedChampions = [];
    function fetchData() {
        return fetch('src/data.json') // JSONファイルのパス
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    }
    function updateDisplayedList(championsData) {
        const searchQuery = document.getElementById('searchBar').value.toLowerCase();
        const list = document.getElementById('championsContainer');
        list.innerHTML = ''; // リストをクリア
        Object.keys(championsData).forEach((champion) => {
            if (champion.toLowerCase().includes(searchQuery)) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = champion;
                checkbox.name = 'champions';
                checkbox.value = champion;
                checkbox.checked = selectedChampions.includes(champion);
                checkbox.onchange = () => {
                    onCheckboxChange(checkbox, champion, championsData);
                };
                const label = document.createElement('label');
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
    function onCheckboxChange(checkbox, champion, championsData) {
        if (checkbox.checked) {
            selectedChampions.push(champion); // チャンピオンを選択リストに追加
        }
        else {
            selectedChampions = selectedChampions.filter((champ) => champ !== champion); // チャンピオンを選択リストから削除
        }
        updateSelectedList(championsData); // 修正：championsDataを渡す
    }
    function updateSelectedList(championsData) {
        const list = document.getElementById('selectedList');
        list.innerHTML = ''; // リストをクリア
        selectedChampions.forEach((champion) => {
            const li = document.createElement('li');
            // チャンピオンの名前と役割を表示
            const roles = championsData[champion].join(' '); // 役割を取得して文字列に変換
            li.textContent = `${champion} : ${roles}`;
            list.appendChild(li);
        });
    }
    // 検索バーと初期のリスト表示
    const searchBar = document.getElementById('searchBar');
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
