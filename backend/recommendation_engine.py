import os
import joblib
import pandas as pd
import numpy as np
import pathlib
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity

# Setup paths
BASE_DIR = pathlib.Path(__file__).parent.absolute()

# Global variables
rank_model = None
tourism_df = None
place_embeddings = None
tokenizer = None
bert_model = None

ranking_features = [
    "safety_norm",
    "condition_score",
    "sentiment_norm",
    "crowd_score",
    "child_score",
    "senior_score"
]

def load_recommendation_models():
    global rank_model, tourism_df, place_embeddings, tokenizer, bert_model
    try:
        print("Loading Recommendation Models...")
        rank_model_path = os.path.join(BASE_DIR, "tourism_rank_model.pkl")
        csv_path = os.path.join(BASE_DIR, "processed_tourism_data.csv")
        embeddings_path = os.path.join(BASE_DIR, "place_embeddings.npy")
        
        if os.path.exists(rank_model_path):
            rank_model = joblib.load(rank_model_path)
        
        if os.path.exists(csv_path):
            tourism_df = pd.read_csv(csv_path)
            
        if os.path.exists(embeddings_path):
            place_embeddings = np.load(embeddings_path)
            
        # Load Transformers model directly to avoid sentence-transformers crash
        model_name = "sentence-transformers/all-MiniLM-L6-v2"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        bert_model = AutoModel.from_pretrained(model_name)
        
        print("Recommendation Models loaded successfully!")
    except Exception as e:
        print(f"Error loading recommendation models: {e}")

# Mean Pooling - Take attention mask into account for correct averaging
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] # First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

def get_bert_candidates(user_input, top_k=30):
    if bert_model is None or place_embeddings is None or tourism_df is None:
        return pd.DataFrame()

    # Convert user query to embedding
    try:
        encoded_input = tokenizer([user_input], padding=True, truncation=True, return_tensors='pt')
        with torch.no_grad():
            model_output = bert_model(**encoded_input)
        
        sentence_embeddings = mean_pooling(model_output, encoded_input['attention_mask'])
        sentence_embeddings = F.normalize(sentence_embeddings, p=2, dim=1)
        
        # Convert tensor to numpy array
        user_embedding = sentence_embeddings.numpy()
    except Exception as e:
        print(f"Error encoding query: {e}")
        return pd.DataFrame()

    # Compute cosine similarity
    similarity_scores = cosine_similarity(
        user_embedding, place_embeddings
    )[0]

    # Attach similarity to dataframe
    temp_df = tourism_df.copy()
    temp_df["semantic_similarity"] = similarity_scores

    # Return top-k most relevant places
    return temp_df.sort_values(
        "semantic_similarity", ascending=False
    ).head(top_k)

def ai_recommend_places(user_input, top_n=5):
    if rank_model is None:
         # Fallback if rank model missing but semantic search works
        candidates = get_bert_candidates(user_input, top_k=top_n)
        if candidates.empty:
            return []
        return candidates.sort_values("semantic_similarity", ascending=False).head(top_n)

    # Stage 1: Semantic relevance (BERT)
    candidates = get_bert_candidates(user_input, top_k=30)
    
    if candidates.empty:
        return []

    # Stage 2: Quality ranking (ML model)
    # Ensure all features exist
    if not all(feature in candidates.columns for feature in ranking_features):
        print("Missing features for ranking, falling back to similarity")
        return candidates.head(top_n)

    candidates["ml_rank_score"] = rank_model.predict(
        candidates[ranking_features]
    )

    # Stage 3: Combine relevance + quality
    candidates["final_score"] = (
        0.6 * candidates["semantic_similarity"] +
        0.4 * candidates["ml_rank_score"]
    )

    # Return top-N places
    return candidates.sort_values(
        "final_score", ascending=False
    ).head(top_n)

def get_recommendations(user_query, top_n=5):
    """
    Get recommendations based on user query.
    Returns a list of dictionaries with place_name, reason, and similarity.
    """
    if bert_model is None:
        if bert_model is None:
             load_recommendation_models()
        if bert_model is None:
             raise Exception('Recommendation model not loaded')

    results = ai_recommend_places(user_query, top_n=top_n)
    
    recommendations = []
    if not isinstance(results, list) and not results.empty:
        for _, row in results.iterrows():
            recommendations.append({
                'place_name': row['place_name'],
                'reason': f"Match Score: {row.get('final_score', row.get('semantic_similarity', 0)):.2f}",
                'similarity': float(row.get('semantic_similarity', 0))
            })
    return recommendations
