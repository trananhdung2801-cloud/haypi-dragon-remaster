# Hướng Dẫn Tái Hiện & Clone Game Haypi Dragon 2D

Dự án này được trích xuất và phân tích trực tiếp từ bộ cài gốc **Haypi Dragon v1.6.1 APK**.

---

## 1. Cấu Trúc Tài Nguyên Đã Trích Xuất

| Thư mục | Mô tả nội dung | Số lượng file |
| :--- | :--- | :--- |
| `animation/hd/` | Toàn bộ Spritesheet rồng (`.png`) & tọa độ frame cắt animation (`.plist`) | 76 file |
| `data/` | Bảng điểm kinh nghiệm (`dragonExp.txt`), cấp độ, chỉ số quái, phần thưởng | 30+ file |
| `images/` | Texture hiệu ứng chiêu thức, tia sét, vụ nổ, đạn bay, icon UI | 486 file |
| `map/` | Bản đồ địa hình các ải PVE (`.map`), thông tin màn chơi | 463 file |
| `scripts/` | **Toàn bộ mã nguồn LUA nguyên bản (Plaintext)**: logic bắn, AI máy, kỹ năng rồng | 12 file |
| `sound/` | File âm thanh gốc (`.mp3`): tiếng gầm, phóng đạn, nổ, nhạc nền | 89 file |

---

## 2. Các File Logic Cốt Lõi (Nằm Trong Thư Mục `scripts/`)

- **`attack_ai.lua`**:
  - Chứa hàm tính góc và lực bắn: `get_power_of_long_distance_attack(npc.slot_index, slot_index, battle)`
  - Thuật toán bù trừ lực theo hướng gió (`wind`) và tỉ lệ trúng mục tiêu (`hit_rate`).
- **`skill_list.lua`**:
  - Định nghĩa toàn bộ chiêu thức của rồng: Lượng nộ/mana tiêu hao, thời gian hồi chiêu (`cool_round`), hiệu ứng hoạt ảnh gắn kèm.
- **`npc_list.lua`**:
  - Bảng chỉ số máu (`hp`), tấn công (`attack`), phòng thủ (`defend`), bạo kích (`crit_chance`) của từng chủng rồng.

---

## 3. Chơi Thử Bản Demo Ngay Trên Trình Duyệt

Chúng tôi đã xây dựng sẵn bản Demo mô phỏng cơ chế chiến đấu bắn tọa độ chuẩn Haypi Dragon:
- **Đường dẫn**: `Haypi_Dragon_Project/game_demo.html`
- **Cách mở**: Nhấp đúp chuột vào file `game_demo.html` để mở bằng trình duyệt (Google Chrome, Microsoft Edge, Cốc Cốc...).
- **Cơ chế đã tích hợp**:
  - Điều khiển rồng di chuyển: Phím mũi tên Trái `←` / Phải `→`
  - Chỉnh góc bắn: Phím mũi tên Lên `↑` / Xuống `↓`
  - Kéo lực bắn: Giữ phím `SPACE` (hoặc giữ nút **BẮN**)
  - Hệ thống gió thay đổi ngẫu nhiên từng lượt
  - Máy (Boss AI) tự động tính toán quỹ đạo bắn trả dựa trên công thức từ `attack_ai.lua`.
  - Hiệu ứng đạn Parabol, nổ hạt và trừ máu theo lượt.

---

## 4. Hướng Tiếp Cận Đưa Lên Game Engine (Godot 4 hoặc Unity)

1. **Godot 4 (2D)**:
   - Tạo `CharacterBody2D` cho Rồng.
   - Dùng `AnimatedSprite2D` nạp các frame từ `animation/hd/` thông qua TexturePacker importer.
   - Thêm node `RayCast2D` để vẽ đường cong chỉ hướng bắn.
   - Áp dụng công thức vật lý Parabol:
     $$v_x = v_0 \cdot \cos(\alpha) + a_{\text{wind}} \cdot t$$
     $$v_y = -v_0 \cdot \sin(\alpha) + g \cdot t$$
2. **Backend / Multiplayer** (nếu muốn làm bản PVP Online):
   - Xây dựng máy chủ WebSocket nhẹ bằng Node.js (`ws` hoặc `socket.io`) đồng bộ trạng thái góc, lực và lượt bắn giữa 2 người chơi.
