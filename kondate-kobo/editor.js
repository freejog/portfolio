window.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://rokgqeuxkztcwxljgaxd.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJva2dxZXV4a3p0Y3d4bGpnYXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNzI3ODIsImV4cCI6MjA2NDc0ODc4Mn0.e8rXHGBs2TjnI0JZrFhg1wBKharHwGYuPeq3GWXjPoU";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // menu.json から献立データを読み込んで表示
  fetch("menu.json")
    .then(response => response.json())
    .then(data => {
      const menuList = document.getElementById("menuList");
      menuList.innerHTML = "";

      for (const main in data) {
        const item = data[main];

        const div = document.createElement("div");
        div.className = "menu-item";

        // 献立表示
        div.innerHTML = `
          <h3>${main}</h3>
          <p><strong>小鉢1：</strong> ${item.side1.join("、") || "なし"}</p>
          <p><strong>小鉢2：</strong> ${item.side2.join("、") || "なし"}</p>
          <p><strong>汁物：</strong> ${item.soup.join("、") || "なし"}</p>
          <button class="edit-btn" data-main="${main}">編集</button>
          <button class="delete-btn" data-main="${main}">削除</button>
        `;

        menuList.appendChild(div);
      }
      setupActionButtons(data);
    })
    .catch(err => {
      console.error("menu.jsonの読み込みに失敗しました:", err);
    });

  const menuData = {}; // 仮のmenuData（保存はしない）

  document.getElementById("menuForm").addEventListener("submit", async (e) => {
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

    try {
      const { data, error } = await supabase.from("menus").insert([
        { name: main, side1, side2, soup }
      ]);

      if (error) {
        console.error("Supabase保存エラー:", error.message);
        alert("保存に失敗しました！");
      } else {
        console.log("Supabase保存成功:", data);
        alert("メニューを保存しました！");
      }
    } catch (err) {
      console.error("接続または処理エラー:", err);
      alert("予期しないエラーが発生しました");
    }

    // 結果を表示
    document.getElementById("result").textContent = JSON.stringify(menuData, null, 2);

    // フォームをリセット
    document.getElementById("menuForm").reset();
  });

  function setupActionButtons(data) {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const main = btn.dataset.main;
        if (confirm(`${main} を削除しますか？`)) {
          delete data[main];
          location.reload(); // 今は仮の再読み込みで対応
        }
      });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const main = btn.dataset.main;
        const item = data[main];
        document.getElementById("mainName").value = main;
        document.getElementById("side1Input").value = item.side1.join("、");
        document.getElementById("side2Input").value = item.side2.join("、");
        document.getElementById("soupInput").value = item.soup.join("、");
        window.scrollTo(0, 0); // フォームにスクロール
      });
    });
  }
});