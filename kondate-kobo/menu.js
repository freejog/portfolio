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
  document.getElementById("side1").textContent = getRandom(side1);
  document.getElementById("side2").textContent = getRandom(side2);
  document.getElementById("soup").textContent = getRandom(soup);
});

// ランダムに選ぶ関数
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}