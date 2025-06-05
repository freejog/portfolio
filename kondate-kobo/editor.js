

const menuData = {}; // 仮のmenuData（保存はしない）

document.getElementById("menuForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const main = document.getElementById("mainName").value.trim();
  const side1 = document.getElementById("side1Input").value.split("、").map(s => s.trim()).filter(Boolean);
  const side2 = document.getElementById("side2Input").value.split("、").map(s => s.trim()).filter(Boolean);
  const soup = document.getElementById("soupInput").value.split("、").map(s => s.trim()).filter(Boolean);

  if (!main) {
    alert("主菜名を入力してください");
    return;
  }

  menuData[main] = {
    side1,
    side2,
    soup
  };

  // 結果を表示
  document.getElementById("result").textContent = JSON.stringify(menuData, null, 2);

  // フォームをリセット
  document.getElementById("menuForm").reset();
});