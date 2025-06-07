import os
import faiss
import numpy as np
import pickle
from PyPDF2 import PdfReader
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
import google.generativeai as genai
from dotenv import load_dotenv

# --- Load Environment Variables (Optional) ---
genai.configure(api_key='AIzaSyD08db9gKCjzHM6gvAi1a5b22Ant_9MPqE')

# --- FAISS Setup ---
dimension = 768  # Dimension for Gemini embeddings
index_file = 'uploads/faiss_index.pkl'
chunks_file = 'uploads/stored_chunks.pkl'

# Initialize or load existing index and chunks
def load_or_create_index():
    global index, stored_chunks
    if os.path.exists(index_file) and os.path.exists(chunks_file):
        with open(index_file, 'rb') as f:
            index = pickle.load(f)
        with open(chunks_file, 'rb') as f:
            stored_chunks = pickle.load(f)
    else:
        index = faiss.IndexFlatL2(dimension)
        stored_chunks = []

def save_index_and_chunks():
    os.makedirs('uploads', exist_ok=True)
    with open(index_file, 'wb') as f:
        pickle.dump(index, f)
    with open(chunks_file, 'wb') as f:
        pickle.dump(stored_chunks, f)

# Load initial state
load_or_create_index()

# --- Lazy loading of Gemini models ---
def get_embedding_model():
    return genai.embed_content

def get_chat_model():
    return genai.GenerativeModel("gemini-2.0-flash")


class UploadPDF(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        global index, stored_chunks

        # Reset FAISS index and stored chunks for new PDF
        index = faiss.IndexFlatL2(dimension)
        stored_chunks = []

        pdf_file = request.FILES.get("pdf")
        if not pdf_file:
            return Response({"error": "No PDF provided"}, status=400)

        try:
            # Save file to disk
            os.makedirs("uploads", exist_ok=True)
            file_path = os.path.join("uploads", pdf_file.name)
            with open(file_path, "wb") as f:
                f.write(pdf_file.read())

            # Extract text from PDF
            reader = PdfReader(file_path)
            text_chunks = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    # Split into smaller chunks for better context
                    chunks = text.split("\n\n")
                    text_chunks.extend(chunks)

            embeddings = []
            cleaned_chunks = []

            for chunk in text_chunks:
                chunk = chunk.strip()
                if not chunk or len(chunk) < 10:  # Skip very short chunks
                    continue
                try:
                    response = genai.embed_content(
                        model="models/text-embedding-004",
                        content=chunk,
                        task_type="retrieval_document"
                    )
                    emb = np.array(response["embedding"], dtype=np.float32)
                    embeddings.append(emb)
                    cleaned_chunks.append(chunk)
                except Exception as e:
                    print(f"[Embed ERROR] Chunk: {chunk[:30]}... -> {e}")

            if embeddings:
                index.add(np.array(embeddings))
                stored_chunks.extend(cleaned_chunks)
                save_index_and_chunks()  # Persist the updated index and chunks

            return Response({"message": f"{len(embeddings)} chunks embedded from {pdf_file.name}"}, status=200)

        except Exception as e:
            return Response({"error": f"Failed to process PDF: {str(e)}"}, status=500)


class AskQuestion(APIView):
    # Add this at the start of AskQuestion.post method
    def post(self, request):
        global index, stored_chunks
        
        # Ensure index and chunks are loaded
        if not hasattr(index, 'ntotal') or index.ntotal == 0:
            load_or_create_index()
            
        try:
            question = request.data.get("question")
            if not question:
                return Response({"error": "No question provided"}, status=400)

            if not stored_chunks:
                return Response({"error": "No PDF has been processed yet"}, status=400)

            # Embed the question
            response = genai.embed_content(
                model="models/text-embedding-004",
                content=question,
                task_type="retrieval_query"
            )
            question_vector = np.array([response["embedding"]], dtype=np.float32)

            # Perform FAISS search with more neighbors for better context
            k = min(5, len(stored_chunks))  # Get up to 5 chunks, but no more than we have
            distances, indices = index.search(question_vector, k)
            retrieved_chunks = [stored_chunks[i] for i in indices[0] if i < len(stored_chunks)]
            
            if not retrieved_chunks:
                return Response({"error": "No relevant content found"}, status=404)

            # Build prompt with better context formatting
            context_text = "\n\n".join([f"Passage {i+1}:\n{chunk}" for i, chunk in enumerate(retrieved_chunks)])
            prompt = f"""Based on the following passages from the document, please answer the question. If the answer cannot be fully determined from these passages, please say so.

Passages:
{context_text}

Question: {question}

Answer: """

            # Get response from Gemini
            chat_model = get_chat_model()
            response = chat_model.generate_content(prompt)
            answer = response.text.strip()

            return Response({
                "answer": answer,
                "context": retrieved_chunks
            }, status=200)

        except Exception as e:
            return Response({"error": f"Failed to process question: {str(e)}"}, status=500)
