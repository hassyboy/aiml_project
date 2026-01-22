# 🎓 Project Documentation: AI-Powered Smart Tourism Assistant

use this guide to explain the project to your faculty. It covers the **Architecture**, **Workflow**, and **AI Models** in deep technical detail.

---

## 1. Project Overview
This is a **Smart Tourism & Heritage Preservation System** designed to enhance the tourist experience and preserve historical monuments using Artificial Intelligence.

**Core Features:**
1.  **Smart Recommendations:** Suggests places based on user queries (e.g., "Peaceful temples near river") using NLP.
2.  **Heritage Preservation (Monument Doctor):** Detects damage in monuments (Cracks, Erosion, etc.) using Computer Vision.
3.  **Digital Reports:** Generates and saves damage reports for authorities.

---

## 2. System Architecture & Workflow

### 🏗️ High-Level Architecture
The system follows a **Microservice Architecture** to handle heavy AI workloads efficiently.

```mermaid
graph TD
    User[User (Frontend)] -->|HTTP Request| API[Flask Backend (Port 5000)]
    API -->|Query| NLP[Recommendation Engine (BERT)]
    API -->|Image Upload| Colab[Google Colab (GPU Service)]
    Colab -->|Prediction| API
    API -->|Save Data| JSON[Local JSON Database]
```

### 🔄 Connection Workflow (Step-by-Step)
1.  **User Interface (React + Vite)**:
    *   The user interacts with the website (Frontend).
    *   When the user searches or uploads an image, the Frontend sends an API request to the **Flask Backend**.

2.  **Backend (Flask - Port 5000)**:
    *   Acts as the "Brain". It receives requests and decides which AI model to call.
    *   **For Recommendations**: It runs the NLP model *locally* on the CPU.
    *   **For Damage Detection**: It forwards the image to **Google Colab** via a secure tunnel (**Ngrok**).

3.  **The "Bridge" (Ngrok)**:
    *   Since Google Colab runs on the cloud, we use **Ngrok** to create a public link (the one in `colab_url.txt`).
    *   The backend sends the image through this tunnel to the running Colab instance.

4.  **Google Colab (Damage Microservice)**:
    *   Receives the image.
    *   Runs the heavy "Deep Learning" model on Google's powerful GPUs.
    *   Returns the result (e.g., "Crack Detected - 98%") back to the local backend.

---

## 3. Deep Dive: The AI Models 🧠

### 🤖 Model 1: Recommendation Engine (NLP)
*   **Purpose:** To understand *context* and *meaning* behind a user's search query, not just keyword matching.
*   **Algorithm:** **BERT (Bidirectional Encoder Representations from Transformers)**.
*   **Specific Model:** `sentence-transformers/all-MiniLM-L6-v2`.
*   **How it Works (Hybrid Approach)**:
    1.  **Vector Embeddings:** The model converts every place description into a "Vector" (a list of 384 numbers representing meaning).
    2.  **Semantic Search:** When a user searches "peaceful place", it converts that text to a vector and finds places effectively "close" to it in mathematical space (Cosine Similarity).
    3.  **Re-Ranking:** It combines this similarity score (60% weight) with a **Quality Score** (40% weight) predicted by a separate Machine Learning model (`tourism_rank_model.pkl`) based on safety, popularity, and cleanliness data.

### 📸 Model 2: Damage Detection (Computer Vision)
*   **Purpose:** To automatically identify structural defects in heritage sites.
*   **Algorithm:** **CNN (Convolutional Neural Network)**.
*   **Architecture:** **MobileNetV2** (Transfer Learning).
    *   *Why MobileNetV2?* It is lightweight and fast, making it ideal for web applications.
*   **Training:**
    *   The model was pre-trained on ImageNet (to recognize shapes/edges).
    *   We **Fine-Tuned** it on a custom dataset of monument damages.
*   **Classes**:
    1.  `Cracking` (Structural fissures)
    2.  `Erosion` (Material wearing away)
    3.  `Flaking` (Surface peeling)
    4.  `No_Damage` (Healthy structure)

---

## 4. Key Technical Highlights (For "Wow" Factor)
*   **Hybrid AI System:** Combines Cloud GPU (Colab) for heavy vision tasks and Local CPU for fast text processing.
*   **Robust Tunneling:** Uses custom headers (`ngrok-skip-browser-warning`) to ensure reliable connection to the free-tier Ngrok tunnel.
*   **React Portals:** The History Dashboard uses advanced React Portals to render *outside* the main DOM hierarchy effectively overlaying the map and other complex UI elements.
