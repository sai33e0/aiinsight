import asyncio
from typing import List, Dict, Optional, AsyncGenerator
from datetime import datetime
import json

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from langchain.callbacks.streaming_aiter import AsyncIteratorCallbackHandler
import openai

from app.core.config import settings
from app.core.exceptions import AIServiceError
from app.models.document import Document
from app.models.conversation import Conversation
from app.models.message import Message


class AIService:
    """AI service for handling OpenAI integration."""

    def __init__(self):
        self.chat_model = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            openai_api_key=settings.OPENAI_API_KEY,
            temperature=0.7,
            max_tokens=2000,
            streaming=True
        )
        self.embeddings = OpenAIEmbeddings(
            model=settings.OPENAI_EMBEDDING_MODEL,
            openai_api_key=settings.OPENAI_API_KEY
        )

    async def generate_chat_response(
        self,
        messages: List[Dict[str, str]],
        context_documents: Optional[List[Dict]] = None,
        stream: bool = False
    ) -> AsyncGenerator[str, None] | str:
        """Generate chat response with optional document context."""
        try:
            # Convert messages to LangChain format
            langchain_messages = []
            for msg in messages:
                if msg["role"] == "system":
                    langchain_messages.append(SystemMessage(content=msg["content"]))
                elif msg["role"] == "user":
                    langchain_messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    langchain_messages.append(AIMessage(content=msg["content"]))

            # Add context documents if provided
            if context_documents:
                context_text = self._format_document_context(context_documents)
                context_message = SystemMessage(content=f"Context from documents:\n{context_text}")
                langchain_messages.insert(-1, context_message)  # Insert before last user message

            if stream:
                return await self._stream_response(langchain_messages)
            else:
                return await self._generate_response(langchain_messages)

        except Exception as e:
            raise AIServiceError(f"Failed to generate AI response: {str(e)}")

    async def _stream_response(self, messages: List) -> AsyncGenerator[str, None]:
        """Stream AI response."""
        callback_handler = AsyncIteratorCallbackHandler()

        try:
            task = asyncio.create_task(
                self.chat_model.agenerate(
                    messages,
                    callbacks=[callback_handler]
                )
            )

            async for token in callback_handler.aiter():
                yield token

            await task

        except Exception as e:
            raise AIServiceError(f"Failed to stream AI response: {str(e)}")

    async def _generate_response(self, messages: List) -> str:
        """Generate complete AI response."""
        try:
            response = await self.chat_model.agenerate(messages)
            return response.generations[0][0].text
        except Exception as e:
            raise AIServiceError(f"Failed to generate AI response: {str(e)}")

    def _format_document_context(self, documents: List[Dict]) -> str:
        """Format document context for AI."""
        context_parts = []
        for i, doc in enumerate(documents, 1):
            context_parts.append(
                f"Document {i}: {doc['title']}\n"
                f"Content: {doc['content'][:500]}...\n"
                f"Relevance: {doc.get('relevance_score', 'N/A')}"
            )
        return "\n\n".join(context_parts)

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for texts."""
        try:
            embeddings = await self.embeddings.aembed_documents(texts)
            return embeddings
        except Exception as e:
            raise AIServiceError(f"Failed to generate embeddings: {str(e)}")

    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for single text."""
        try:
            embedding = await self.embeddings.aembed_query(text)
            return embedding
        except Exception as e:
            raise AIServiceError(f"Failed to generate embedding: {str(e)}")

    async def analyze_sentiment(self, text: str) -> Dict[str, float]:
        """Analyze sentiment of text."""
        try:
            # Use OpenAI's completion API for sentiment analysis
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "Analyze the sentiment of the following text and return a JSON object with 'positive', 'negative', and 'neutral' scores that sum to 1.0."
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ],
                temperature=0.1
            )

            result_text = response.choices[0].message.content
            try:
                return json.loads(result_text)
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return {"positive": 0.5, "negative": 0.3, "neutral": 0.2}

        except Exception as e:
            raise AIServiceError(f"Failed to analyze sentiment: {str(e)}")

    async def extract_keywords(self, text: str, max_keywords: int = 10) -> List[str]:
        """Extract keywords from text."""
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": f"Extract the {max_keywords} most important keywords from the following text. Return them as a comma-separated list."
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ],
                temperature=0.1
            )

            keywords_text = response.choices[0].message.content
            keywords = [kw.strip() for kw in keywords_text.split(",")]
            return keywords[:max_keywords]

        except Exception as e:
            raise AIServiceError(f"Failed to extract keywords: {str(e)}")

    async def summarize_text(self, text: str, max_length: int = 150) -> str:
        """Summarize text."""
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": f"Summarize the following text in no more than {max_length} words. Keep the most important information."
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ],
                temperature=0.3,
                max_tokens=max_length * 2  # Approximate token count
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise AIServiceError(f"Failed to summarize text: {str(e)}")

    async def classify_text(self, text: str, categories: List[str]) -> Dict[str, float]:
        """Classify text into categories."""
        try:
            categories_str = ", ".join(categories)
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": f"Classify the following text into one of these categories: {categories_str}. Return a JSON object with category names as keys and confidence scores (0-1) as values."
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ],
                temperature=0.1
            )

            result_text = response.choices[0].message.content
            try:
                return json.loads(result_text)
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return {cat: 0.0 for cat in categories}

        except Exception as e:
            raise AIServiceError(f"Failed to classify text: {str(e)}")

    async def generate_document_questions(self, document_content: str, num_questions: int = 5) -> List[str]:
        """Generate questions based on document content."""
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": f"Generate {num_questions} relevant questions that can be answered based on the following document. Return them as a JSON array of strings."
                    },
                    {
                        "role": "user",
                        "content": document_content[:2000]  # Limit content length
                    }
                ],
                temperature=0.5
            )

            result_text = response.choices[0].message.content
            try:
                return json.loads(result_text)
            except json.JSONDecodeError:
                # Fallback: split by newlines and clean up
                questions = [q.strip().strip('"') for q in result_text.split("\n") if q.strip()]
                return questions[:num_questions]

        except Exception as e:
            raise AIServiceError(f"Failed to generate questions: {str(e)}")

    def get_model_info(self) -> Dict[str, str]:
        """Get information about the AI model."""
        return {
            "model": settings.OPENAI_MODEL,
            "embedding_model": settings.OPENAI_EMBEDDING_MODEL,
            "max_tokens": "2000",
            "temperature": "0.7"
        }