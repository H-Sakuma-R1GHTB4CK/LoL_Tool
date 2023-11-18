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
    let currentFilter = 'all'; // 現在選択されているフィルター
    function updateDisplayedList(championsData) {
        const searchQuery = document.getElementById('searchBar').value.toLowerCase();
        const list = document.getElementById('championsContainer');
        list.innerHTML = ''; // リストをクリア
        Object.keys(championsData).forEach((champion) => {
            const japaneseName = championsData[champion].japanese_name.toLowerCase();
            const roles = championsData[champion].positions.join(' ');
            if ((champion.toLowerCase().includes(searchQuery) || japaneseName.includes(searchQuery)) &&
                (currentFilter === 'all' || championsData[champion].positions.includes(currentFilter))) {
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
                const roles = championsData[champion].positions.join(' ');
                label.appendChild(document.createTextNode(`${champion}(${japaneseName}) : ${roles}`));
                list.appendChild(checkbox);
                list.appendChild(label);
                list.appendChild(document.createElement('br'));
            }
        });
    }
    // フィルターボタンのイベントハンドラ
    function setupFilterButtons() {
        const buttons = document.querySelectorAll('.filter-button');
        buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                // イベントのcurrentTargetをHTMLButtonElementとしてキャスト
                const clickedButton = event.currentTarget;
                buttons.forEach(btn => btn.classList.remove('selected'));
                clickedButton.classList.add('selected');
                currentFilter = clickedButton.dataset.filter || 'all';
                fetchData().then(updateDisplayedList).catch(error => {
                    console.error('Error fetching the champions data:', error);
                });
            });
        });
    }
    setupFilterButtons();
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
            // チャンピオンの英名、日本語名、役割を表示
            const japaneseName = championsData[champion].japanese_name;
            const roles = championsData[champion].positions.join(' '); // 役割を取得して文字列に変換
            li.textContent = `${champion}(${japaneseName}) : ${roles}`;
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
    const buttons = document.querySelectorAll('.filter-button');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            // 他のボタンの選択状態を解除
            buttons.forEach(btn => btn.classList.remove('selected'));
            // クリックされたボタンに 'selected' クラスを追加
            button.classList.add('selected');
        });
    });
});
