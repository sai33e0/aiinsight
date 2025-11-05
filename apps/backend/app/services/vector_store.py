import os
import pickle
import json
from typing import List, Dict, Tuple, Optional
from datetime import datetime
import numpy as np

import faiss
from sklearn.metrics.pairwise import cosine_similarity

from app.core.config import settings
from app.core.exceptions import AIServiceError
from app.services.ai_service import AIService


class VectorStore:
    """Vector store service using FAISS for similarity search."""

    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self.dimension = settings.EMBEDDING_DIMENSION
        self.index_path = os.path.join(settings.VECTOR_STORE_PATH, "faiss_index.bin")
        self.metadata_path = os.path.join(settings.VECTOR_STORE_PATH, "metadata.json")

        # Initialize FAISS index
        self.index = self._load_or_create_index()
        self.metadata = self._load_or_create_metadata()

    def _load_or_create_index(self) -> faiss.IndexFlatIP:
        """Load existing FAISS index or create new one."""
        if os.path.exists(self.index_path):
            try:
                index = faiss.read_index(self.index_path)
                print(f"Loaded FAISS index with {index.ntotal} vectors")
                return index
            except Exception as e:
                print(f"Failed to load index: {e}. Creating new one.")

        # Create new index
        index = faiss.IndexFlatIP(self.dimension)
        print(f"Created new FAISS index with dimension {self.dimension}")
        return index

    def _load_or_create_metadata(self) -> Dict:
        """Load existing metadata or create new one."""
        if os.path.exists(self.metadata_path):
            try:
                with open(self.metadata_path, 'r') as f:
                    metadata = json.load(f)
                print(f"Loaded metadata with {len(metadata.get('documents', {}))} documents")
                return metadata
            except Exception as e:
                print(f"Failed to load metadata: {e}. Creating new one.")

        # Create new metadata structure
        metadata = {
            "documents": {},
            "chunks": [],
            "last_updated": datetime.utcnow().isoformat(),
            "total_chunks": 0
        }
        return metadata

    def _save_index(self):
        """Save FAISS index to disk."""
        try:
            faiss.write_index(self.index, self.index_path)
        except Exception as e:
            raise AIServiceError(f"Failed to save FAISS index: {str(e)}")

    def _save_metadata(self):
        """Save metadata to disk."""
        try:
            self.metadata["last_updated"] = datetime.utcnow().isoformat()
            with open(self.metadata_path, 'w') as f:
                json.dump(self.metadata, f, indent=2)
        except Exception as e:
            raise AIServiceError(f"Failed to save metadata: {str(e)}")

    async def add_document(
        self,
        document_id: str,
        title: str,
        chunks: List[str],
        metadata: Optional[Dict] = None
    ) -> int:
        """Add document chunks to vector store."""
        try:
            if not chunks:
                return 0

            # Generate embeddings for chunks
            print(f"Generating embeddings for {len(chunks)} chunks...")
            embeddings = await self.ai_service.generate_embeddings(chunks)

            # Normalize embeddings for cosine similarity
            embeddings_array = np.array(embeddings, dtype=np.float32)
            norms = np.linalg.norm(embeddings_array, axis=1, keepdims=True)
            embeddings_array = embeddings_array / norms

            # Add to FAISS index
            start_idx = self.index.ntotal
            self.index.add(embeddings_array)

            # Update metadata
            chunk_metadata = {
                "document_id": document_id,
                "title": title,
                "metadata": metadata or {},
                "chunk_count": len(chunks),
                "added_at": datetime.utcnow().isoformat()
            }

            # Update documents metadata
            self.metadata["documents"][document_id] = chunk_metadata

            # Update chunks metadata
            for i, chunk in enumerate(chunks):
                chunk_info = {
                    "chunk_index": i,
                    "document_id": document_id,
                    "title": title,
                    "content": chunk[:500] + "..." if len(chunk) > 500 else chunk,
                    "faiss_index": start_idx + i
                }
                self.metadata["chunks"].append(chunk_info)

            self.metadata["total_chunks"] = len(self.metadata["chunks"])

            # Save changes
            self._save_index()
            self._save_metadata()

            print(f"Successfully added {len(chunks)} chunks for document {document_id}")
            return len(chunks)

        except Exception as e:
            raise AIServiceError(f"Failed to add document to vector store: {str(e)}")

    async def search(
        self,
        query: str,
        top_k: int = 5,
        document_ids: Optional[List[str]] = None,
        similarity_threshold: float = None
    ) -> List[Dict]:
        """Search for similar chunks."""
        try:
            if self.index.ntotal == 0:
                return []

            if similarity_threshold is None:
                similarity_threshold = settings.SIMILARITY_THRESHOLD

            # Generate query embedding
            query_embedding = await self.ai_service.generate_embedding(query)
            query_array = np.array([query_embedding], dtype=np.float32)

            # Normalize query embedding
            query_array = query_array / np.linalg.norm(query_array, axis=1, keepdims=True)

            # Search FAISS index
            distances, indices = self.index.search(query_array, min(top_k * 2, self.index.ntotal))

            results = []
            for distance, idx in zip(distances[0], indices[0]):
                if idx == -1:  # FAISS returns -1 for invalid indices
                    continue

                # Get chunk metadata
                if idx < len(self.metadata["chunks"]):
                    chunk_info = self.metadata["chunks"][idx]

                    # Filter by document IDs if specified
                    if document_ids and chunk_info["document_id"] not in document_ids:
                        continue

                    # Filter by similarity threshold
                    if distance < similarity_threshold:
                        continue

                    # Get full document metadata
                    doc_metadata = self.metadata["documents"].get(
                        chunk_info["document_id"], {}
                    )

                    result = {
                        "chunk_id": f"{chunk_info['document_id']}_chunk_{chunk_info['chunk_index']}",
                        "document_id": chunk_info["document_id"],
                        "document_title": chunk_info["title"],
                        "chunk_content": chunk_info["content"],
                        "chunk_index": chunk_info["chunk_index"],
                        "similarity_score": float(distance),
                        "document_metadata": doc_metadata.get("metadata", {}),
                        "faiss_index": int(idx)
                    }

                    results.append(result)

                if len(results) >= top_k:
                    break

            # Sort by similarity score (descending)
            results.sort(key=lambda x: x["similarity_score"], reverse=True)

            return results

        except Exception as e:
            raise AIServiceError(f"Failed to search vector store: {str(e)}")

    async def get_similar_chunks(
        self,
        chunk_id: str,
        top_k: int = 3
    ) -> List[Dict]:
        """Find chunks similar to a given chunk."""
        try:
            # Parse chunk ID to get document and chunk index
            parts = chunk_id.split("_chunk_")
            if len(parts) != 2:
                raise AIServiceError(f"Invalid chunk ID format: {chunk_id}")

            document_id, chunk_index_str = parts
            chunk_index = int(chunk_index_str)

            # Find the chunk in metadata
            target_chunk = None
            target_faiss_index = None

            for chunk_info in self.metadata["chunks"]:
                if (chunk_info["document_id"] == document_id and
                    chunk_info["chunk_index"] == chunk_index):
                    target_chunk = chunk_info
                    target_faiss_index = chunk_info["faiss_index"]
                    break

            if not target_chunk:
                raise AIServiceError(f"Chunk not found: {chunk_id}")

            # Get the actual chunk content (first 500 chars might be truncated)
            full_content = target_chunk["content"]
            if len(full_content) < 500:  # If content is truncated, try to get full content
                # In a real implementation, you might want to store the full content
                # or retrieve it from the original document
                full_content = target_chunk["content"]

            # Search for similar chunks
            similar_results = await self.search(
                query=full_content,
                top_k=top_k + 1,  # Get one extra to exclude the original
                document_ids=[document_id]  # Search within the same document
            )

            # Remove the original chunk from results
            similar_results = [
                result for result in similar_results
                if result["chunk_index"] != chunk_index
            ]

            return similar_results[:top_k]

        except Exception as e:
            raise AIServiceError(f"Failed to find similar chunks: {str(e)}")

    async def delete_document(self, document_id: str) -> bool:
        """Delete document from vector store."""
        try:
            if document_id not in self.metadata["documents"]:
                print(f"Document {document_id} not found in vector store")
                return False

            # Get all chunks for this document
            document_chunks = [
                chunk for chunk in self.metadata["chunks"]
                if chunk["document_id"] == document_id
            ]

            if not document_chunks:
                # Just remove from metadata
                del self.metadata["documents"][document_id]
                self._save_metadata()
                return True

            # For FAISS IndexFlatIP, we need to rebuild the index
            # This is a limitation of FAISS - we can't easily delete individual vectors
            print(f"Rebuilding index to remove document {document_id}...")

            # Collect all chunks to keep
            chunks_to_keep = [
                chunk for chunk in self.metadata["chunks"]
                if chunk["document_id"] != document_id
            ]

            # Rebuild index with remaining chunks
            if chunks_to_keep:
                # Get original content for remaining chunks
                remaining_texts = [chunk["content"] for chunk in chunks_to_keep]
                remaining_embeddings = await self.ai_service.generate_embeddings(remaining_texts)

                # Create new index
                new_index = faiss.IndexFlatIP(self.dimension)
                embeddings_array = np.array(remaining_embeddings, dtype=np.float32)
                norms = np.linalg.norm(embeddings_array, axis=1, keepdims=True)
                embeddings_array = embeddings_array / norms
                new_index.add(embeddings_array)

                self.index = new_index

                # Update metadata
                self.metadata["chunks"] = chunks_to_keep
                for i, chunk in enumerate(chunks_to_keep):
                    chunk["faiss_index"] = i

                self.metadata["total_chunks"] = len(chunks_to_keep)
            else:
                # No chunks left, create empty index
                self.index = faiss.IndexFlatIP(self.dimension)
                self.metadata["chunks"] = []
                self.metadata["total_chunks"] = 0

            # Remove document from metadata
            del self.metadata["documents"][document_id]

            # Save changes
            self._save_index()
            self._save_metadata()

            print(f"Successfully deleted document {document_id} and {len(document_chunks)} chunks")
            return True

        except Exception as e:
            raise AIServiceError(f"Failed to delete document from vector store: {str(e)}")

    def get_document_stats(self, document_id: str) -> Optional[Dict]:
        """Get statistics for a specific document."""
        if document_id not in self.metadata["documents"]:
            return None

        doc_metadata = self.metadata["documents"][document_id]
        chunk_count = doc_metadata.get("chunk_count", 0)

        return {
            "document_id": document_id,
            "title": doc_metadata.get("title", ""),
            "chunk_count": chunk_count,
            "added_at": doc_metadata.get("added_at", ""),
            "metadata": doc_metadata.get("metadata", {})
        }

    def get_global_stats(self) -> Dict:
        """Get global vector store statistics."""
        return {
            "total_documents": len(self.metadata["documents"]),
            "total_chunks": self.metadata["total_chunks"],
            "index_size": self.index.ntotal,
            "dimension": self.dimension,
            "last_updated": self.metadata["last_updated"]
        }

    async def rebuild_index(self) -> int:
        """Rebuild the entire index from metadata."""
        try:
            if not self.metadata["chunks"]:
                return 0

            print("Rebuilding FAISS index from metadata...")

            # Get all chunk contents
            all_chunks = [chunk["content"] for chunk in self.metadata["chunks"]]

            # Generate embeddings for all chunks
            embeddings = await self.ai_service.generate_embeddings(all_chunks)

            # Create new index
            new_index = faiss.IndexFlatIP(self.dimension)
            embeddings_array = np.array(embeddings, dtype=np.float32)
            norms = np.linalg.norm(embeddings_array, axis=1, keepdims=True)
            embeddings_array = embeddings_array / norms
            new_index.add(embeddings_array)

            # Replace index
            self.index = new_index

            # Update FAISS indices in metadata
            for i, chunk in enumerate(self.metadata["chunks"]):
                chunk["faiss_index"] = i

            # Save changes
            self._save_index()
            self._save_metadata()

            print(f"Successfully rebuilt index with {len(all_chunks)} vectors")
            return len(all_chunks)

        except Exception as e:
            raise AIServiceError(f"Failed to rebuild index: {str(e)}")