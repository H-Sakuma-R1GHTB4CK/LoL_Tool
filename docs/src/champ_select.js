"use strict";
// このインターフェースは、JSONデータの構造を定義します。
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
        selectedChampions.forEach((championKey) => {
            const li = document.createElement('li');
            // 日本語名を取得して表示
            const japaneseName = championsData[championKey].japanese_name;
            const roles = championsData[championKey].positions.join(' ');
            li.textContent = `${championKey}(${japaneseName}) : ${roles}`;
            li.onclick = () => {
                fetchChampionDetails(championKey)
                    .then(displayChampionDetails)
                    .catch(error => console.error('Error fetching the champion details:', error));
            };
            list.appendChild(li);
        });
    }
    // チャンピオンの詳細情報をフェッチする関数
    function fetchChampionDetails(championKey) {
        return fetch('src/champion_details.json')
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then((details) => details[championKey]);
    }
    // チャンピオンの詳細情報を表示する関数
    function displayChampionDetails(championInfo) {
        const detailsContainer = document.getElementById('championDetailsContainer');
        if (detailsContainer) {
            // 基本性能の情報を表示
            // const baseStatsElement = document.getElementById('baseStats');
            // if (baseStatsElement) {
            //     baseStatsElement.textContent = ''; // コンテナの内容をクリア
            //     if (championInfo.base_stats) {
            //         const roleParagraph = document.createElement('p');
            //         roleParagraph.classList.add('base-stats-role');
            //         roleParagraph.textContent = `Role: ${championInfo.base_stats.role}`;
            //         baseStatsElement.appendChild(roleParagraph);
            //         const featuresParagraph = document.createElement('p');
            //         featuresParagraph.classList.add('base-stats-features');
            //         featuresParagraph.textContent = `Features: ${championInfo.base_stats.features}`;
            //         baseStatsElement.appendChild(featuresParagraph);
            //     }
            // }
            const baseStatsElement = document.getElementById('baseStats');
            updateBaseStatsContent(baseStatsElement, championInfo.base_stats);
            // OW/Valorantとの比較を表示
            const comparisonElement = document.getElementById('comparison');
            updateTextContent(comparisonElement, championInfo.comparison, 'comparison');
            // スキル情報を表示
            const skillsElement = document.getElementById('skills');
            updateSkillsContent(skillsElement, championInfo.skills);
            // ゲームプレイのヒントを表示
            const gameplayTipsElement = document.getElementById('gameplayTips');
            updateTextContent(gameplayTipsElement, championInfo.gameplay_tips, 'gameplay-tips');
        }
        else {
            console.error('Champion details container not found');
        }
    }
    // 項目のテキストを更新するヘルパー関数
    function updateTextContent(element, textContent, className) {
        if (element) {
            element.textContent = textContent || ''; // textContentがundefinedの場合は空文字を設定
            element.classList.add(className); // CSSでスタイルを適用するためのクラスを追加
        }
    }
    // 基本情報を更新するヘルパー関数
    function updateBaseStatsContent(element, base_stats) {
        if (element) {
            element.innerHTML = ''; // Clear previous base_stats
            if (base_stats) {
                Object.entries(base_stats).forEach(([base_stat, description]) => {
                    const base_statItem = document.createElement('li');
                    base_statItem.classList.add('base_stat-item'); // CSSでスタイルを適用するためのクラスを追加
                    base_statItem.innerHTML = `<span class="base_stat-key">${base_stat}:</span> ${description || ''}`;
                    element.appendChild(base_statItem);
                });
            }
        }
    }
    // スキル情報を更新するヘルパー関数
    function updateSkillsContent(element, skills) {
        if (element) {
            element.innerHTML = ''; // Clear previous skills
            if (skills) {
                Object.entries(skills).forEach(([skill, description]) => {
                    const skillItem = document.createElement('li');
                    skillItem.classList.add('skill-item'); // CSSでスタイルを適用するためのクラスを追加
                    skillItem.innerHTML = `<span class="skill-key">${skill}:</span> ${description || ''}`;
                    element.appendChild(skillItem);
                });
            }
        }
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
