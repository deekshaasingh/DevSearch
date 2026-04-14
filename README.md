# 🔍 DevSearch — Developer-Focused Search Engine For GitHub

A scalable backend search engine designed to help developers discover relevant GitHub repositories using intelligent ranking and efficient indexing techniques.

---

## 🚀 Overview

DevSearch is a backend system that fetches repository data from GitHub, processes textual content (description + README), and enables fast, relevant search using:

* Inverted Indexing
* TF-IDF Ranking
* Custom Text Cleaning Pipeline
* Caching for performance optimization

This project demonstrates core concepts of **Information Retrieval, Backend Architecture, and System Design**.

---

## 🧠 Key Features

### 🔎 Intelligent Search

* Query-based search (`/search?q=react`)
* Relevance ranking using **TF-IDF**
* Popularity boost using GitHub stars

### ⚡ High Performance

* In-memory **index caching**
* Repository caching to avoid repeated DB calls
* Optimized lookups using hash maps (O(1))

### 🧹 Advanced Text Processing

* Tokenization and normalization
* Stopword removal
* Noise filtering (URLs, badges, etc.)
* Frequency capping to prevent token spam

### 📄 Pagination

* Supports:

  ```
  /search?q=react&page=1&limit=10
  ```

### 💡 Autocomplete (Trie-based)

* Prefix search:

  ```
  /autocomplete?q=rea
  → ["react", "redux", "react-router"]
  ```

### 🛠 Clean Backend Architecture

```
routes → controllers → services → utils → database
```

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **External API:** GitHub API (Octokit)
* **Core Concepts:**

  * Inverted Index
  * TF-IDF
  * Trie (Autocomplete)
  * Caching

---

## ⚙️ How It Works

### 1️⃣ Data Ingestion

* Fetch repositories via GitHub API
* Extract:

  * Name
  * Description
  * README

---

### 2️⃣ Text Processing Pipeline

```
Raw Text
   ↓
Lowercase
   ↓
Tokenization
   ↓
Stopword Removal
   ↓
Noise Filtering
   ↓
Token Storage
```

---

### 3️⃣ Indexing

Build an **inverted index**:

```
word → [{ repoId, frequency }]
```

---

### 4️⃣ Search Flow

```
User Query
   ↓
Text Cleaning
   ↓
Token Extraction
   ↓
Index Lookup
   ↓
TF-IDF Scoring
   ↓
Ranking
   ↓
Return Results
```

---

### 5️⃣ Ranking Formula

```
TF = freq / total_tokens
IDF = log(total_docs / docs_with_word)

Score = TF × IDF + log(stars + 1)
```

---

## 📡 API Endpoints

### 🔍 Search

```
GET /search?q=react&page=1&limit=10
```

**Response:**

```json
{
  "page": 1,
  "limit": 10,
  "total": 120,
  "results": [
    {
      "name": "react-router",
      "description": "Declarative routing for React",
      "stars": 56000,
      "url": "https://github.com/..."
    }
  ]
}
```

---

### 💡 Autocomplete

```
GET /autocomplete?q=rea
```

**Response:**

```json
{
  "suggestions": ["react", "redux", "react-router"]
}
```

---

## ⚡ Performance Optimizations

* Index built once and cached in memory
* Repositories cached to reduce DB hits
* O(1) lookups using hash maps
* Query deduplication

---

## ⚠️ Edge Case Handling

* Empty query validation
* No-results response handling
* Safe indexing (prevents runtime crashes)

---

## 📁 Project Structure

```
src/
├── routes/
├── controllers/
├── services/
├── utils/
├── models/
├── config/
```

---

## ▶️ Running Locally

### 1. Clone the repo

```
git clone https://github.com/deekshaasingh/Devsearch.git
```

### 2. Install dependencies

```
npm install
```

### 3. Add environment variables

Create `.env`:

```
MONGO_URI=your_mongodb_uri
GITHUB_TOKEN=your_github_token
```

### 4. Run server

```
node server.js
```

---

## 🧪 Testing

Use browser or Postman:

```
http://localhost:5000/search?q=react
http://localhost:5000/autocomplete?q=rea
```

---

## 💡 Future Improvements

* Persistent index storage (MongoDB / Redis)
* Advanced ranking (BM25)
* Semantic search (embeddings)
* Query analytics (CTR, trends)

---

## 🏁 Conclusion

DevSearch demonstrates how core search engine concepts can be implemented in a real-world backend system. It highlights strong fundamentals in:

* Backend engineering
* Data processing
* Search relevance
* Performance optimization

---

## 📌 Author

Built by Deeksha Singh 🌷
