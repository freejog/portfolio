window.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://rokgqeuxkztcwxljgaxd.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJva2dxZXV4a3p0Y3d4bGpnYXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNzI3ODIsImV4cCI6MjA2NDc0ODc4Mn0.e8rXHGBs2TjnI0JZrFhg1wBKharHwGYuPeq3GWXjPoU";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // Supabase から献立データを読み込んで表示
  (async () => {
    try {
      const { data, error } = await supabase.from("menus").select("*");

      if (error) {
        console.error("Supabase読み込みエラー:", error.message);
      } else {
        const menuList = document.getElementById("menuList");
        menuList.innerHTML = "";

        const menuData = {};

        data.forEach(item => {
          menuData[item.name] = {
            side1: item.side1 || [],
            side2: item.side2 || [],
            soup: item.soup || []
          };

          const div = document.createElement("div");
          div.className = "menu-item";

          div.innerHTML = `
            <h3>${item.name}</h3>
            <p><strong>小鉢1：</strong> ${item.side1?.join("、") || "なし"}</p>
            <p><strong>小鉢2：</strong> ${item.side2?.join("、") || "なし"}</p>
            <p><strong>汁物：</strong> ${item.soup?.join("、") || "なし"}</p>
            <button class="edit-btn" data-main="${item.name}">編集</button>
            <button class="delete-btn" data-main="${item.name}">削除</button>
          `;

          menuList.appendChild(div);
        });

        setupActionButtons(menuData);
      }
    } catch (err) {
      console.error("Supabase読み込み中の接続エラー:", err);
    }
  })();

  const menuData = {}; // 仮のmenuData（保存はしない）

  const splitValues = value =>
    value
      .split("、")
      .map(s => s.trim())
      .filter(Boolean);

  document.getElementById("menuForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const main = document.getElementById("mainName").value.trim();
    const side1 = splitValues(document.getElementById("side1Input").value);
    const side2 = splitValues(document.getElementById("side2Input").value);
    const soup  = splitValues(document.getElementById("soupInput").value);

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
        setTimeout(() => {
          location.reload();
        }, 100); // 100ミリ秒後にリロード
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