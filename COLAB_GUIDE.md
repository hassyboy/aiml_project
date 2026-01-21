# 🚀 How to Restart the AI Backend (Google Colab)

Since Google Colab disconnects after some time, you will need to follow these steps whenever you want to use the **Damage Detection** feature.

### 1. on Google Colab
1.  **Open your Colab Notebook**.
2.  **Upload the Model**:
    *   Click the **Folder Icon 📁** on the left.
    *   Upload `tourism_damage_detector.keras`.
    *   *Wait for the upload to finish!*
3.  **Run the Code**:
    *   Click the **Play Button ▶️** on the main code cell.
    *   Wait until you see: `🚀 YOUR PUBLIC URL IS: https://xxxx.ngrok-free.app`

### 2. on Your Computer (VS Code)
1.  **Copy** the new URL from Colab (e.g., `https://xxxx.ngrok-free.app`).
2.  **Open** the file `backend/colab_url.txt`.
3.  **Paste** the new URL and **Save**.
4.  **Restart the Backend**:
    *   Click in your terminal where `python backend/app.py` is running.
    *   Press `Ctrl+C` to stop it.
    *   Run `python backend/app.py` again.

### ✅ Verification
*   The terminal should say: `🔗 Damage Service Configured at: ...`
*   And: `✅ Connection established...`

**That's it! You are ready to go.**
