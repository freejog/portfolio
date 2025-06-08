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
  let isEditing = false;
  let editingName = "";

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
      let result;
      if (isEditing) {
        result = await supabase.from("menus").update({
          name: main,
          side1,
          side2,
          soup
        }).eq("name", editingName).select();
      } else {
        result = await supabase.from("menus").insert([
          { name: main, side1, side2, soup }
        ]);
      }

      const { data, error } = result;

      if (error) {
        console.error("Supabase保存エラー:", error.message);
        alert("保存に失敗しました！");
      } else {
        console.log("Supabase保存成功:", data);
        alert(isEditing ? "メニューを更新しました！" : "メニューを保存しました！");
        setTimeout(() => {
          location.reload();
        }, 100);
      }
    } catch (err) {
      console.error("接続または処理エラー:", err);
      alert("予期しないエラーが発生しました");
    }

    isEditing = false;
    editingName = "";

    // 結果を表示
    document.getElementById("result").textContent = JSON.stringify(menuData, null, 2);

    // フォームをリセット
    document.getElementById("menuForm").reset();
  });

  function setupActionButtons(data) {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const main = btn.dataset.main.trim();
        console.log(`削除対象のname: [${main}]`);  // ←ここを追加        
        if (confirm(`${main} を削除しますか？`)) {
          try {
            const { data, error } = await supabase
              .from("menus")
              .delete()
              .eq("name", main)
              .select(); // ここを追加

            if (error) {
              console.error("削除エラー:", error.message);
              alert("削除に失敗しました");
            } else if (!data || data.length === 0) {
              console.warn("該当データが見つからず、削除されませんでした:", main);
              alert("削除対象が見つかりませんでした");
            } else {
              alert("削除しました！");
              location.reload();
            }
          } catch (err) {
            console.error("削除中の接続エラー:", err);
            alert("削除中にエラーが発生しました");
          }
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
        isEditing = true;
        editingName = main;
        window.scrollTo(0, 0); // フォームにスクロール
      });
    });
  }
});