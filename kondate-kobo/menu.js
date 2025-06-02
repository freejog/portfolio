// 献立データ
const menuData = {
  "ハンバーグ": {
    side1: ["人参グラッセ", "ポテト", "目玉焼き", "野菜ソテー"],
    side2: ["コールスロー", "ヨーグルト", "果物"],
    soup: ["コンソメ", "ポタージュ"]
  },
  "焼き魚": {
    side1: ["煮物", "磯辺揚げ"],
    side2: ["青菜のお浸し", "酢の物"],
    soup: ["味噌汁", "清汁"]
  },
  "カレー": {
    side1: ["コールスロー", "果物"],
    side2: [],
    soup: []
  }
};

// 主菜セレクトメニューを初期化
const mainSelect = document.getElementById("mainDish");
for (const main in menuData) {
  const option = document.createElement("option");
  option.value = main;
  option.textContent = main;
  mainSelect.appendChild(option);
}

// 主菜が選ばれたときにサブメニューを更新
mainSelect.addEventListener("change", () => {
  const selected = mainSelect.value;
  if (!selected) return;

  const { side1, side2, soup } = menuData[selected];

  populateSelect("side1", side1);
  populateSelect("side2", side2);
  populateSelect("soup", soup);
});

// 再生成ボタンの処理
document.getElementById("regen").addEventListener("click", () => {
  const selected = mainSelect.value;
  if (!selected) return alert("先に主菜を選んでね！");
  
  const { side1, side2, soup } = menuData[selected];

  populateSelect("side1", side1);
  populateSelect("side2", side2);
  populateSelect("soup", soup);
});

// ランダムに選ぶ関数
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function populateSelect(id, options) {
  const select = document.getElementById(id);
  select.innerHTML = "";

  // 常に「なし」を追加
  const extendedOptions = [...options];
  if (!extendedOptions.includes("なし")) {
    extendedOptions.push("なし");
  }

  extendedOptions.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });

  // ランダム選択時、「なし」は除外。ただし他に候補がない場合は「なし」を選ぶ
  const filtered = options.length === 0 ? ["なし"] : options;
  // 複数ランダム選択
  const defaultSelections = getRandomMultiple(filtered);
  Array.from(select.options).forEach(opt => {
    opt.selected = defaultSelections.includes(opt.value);
  });
  updateLabel(id);
}

["side1", "side2", "soup"].forEach(id => {
  document.getElementById(id).addEventListener("change", () => {
    updateLabel(id);
  });
});

function getRandomMultiple(arr) {
  if (arr.length === 0) return ["なし"];
  const count = Math.floor(Math.random() * Math.min(arr.length, 2)) + 1; // 1〜2個ランダムで選ぶ
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function updateLabel(id) {
  const select = document.getElementById(id);
  const selected = Array.from(select.selectedOptions).map(opt => opt.value);
  document.getElementById("label-" + id).textContent = selected.join("、");
}