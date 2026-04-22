from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import os
from openai import OpenAI

SUPPORTED_OPERATIONS = {"uppercase", "lowercase", "reverse", "word_count"}


@dataclass(frozen=True)
class ProcessedTask:
    result: str
    logs: list[dict[str, object]]


def now() -> datetime:
    return datetime.now(timezone.utc)


def process_task(operation: str, input_text: str) -> ProcessedTask:
    operation = operation.strip().lower()

    if operation not in SUPPORTED_OPERATIONS:
        raise ValueError(f"Unsupported operation: {operation}")

    started_at = now()
    logs: list[dict[str, object]] = [
        {
            "level": "info",
            "message": f"Task processing started for operation '{operation}' via OpenAI",
            "at": started_at,
        }
    ]

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    try:
        if operation == "uppercase":
            system_prompt = "You are a helpful assistant. Convert the given text to uppercase. Return ONLY the uppercase text."
        elif operation == "lowercase":
            system_prompt = "You are a helpful assistant. Convert the given text to lowercase. Return ONLY the lowercase text."
        elif operation == "reverse":
            system_prompt = "You are a helpful assistant. Reverse the given text. Return ONLY the reversed text."
        else:
            system_prompt = "You are a helpful assistant. Count the number of words in the given text. Return ONLY the number as a string."

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": input_text}
            ],
            temperature=0.0
        )
        
        result = response.choices[0].message.content.strip() if response.choices[0].message.content else ""

        logs.append(
            {
                "level": "info",
                "message": "Task processing completed successfully via OpenAI",
                "at": now(),
            }
        )
    except Exception as e:
        logs.append(
            {
                "level": "error",
                "message": f"OpenAI API error: {str(e)}",
                "at": now(),
            }
        )
        raise e

    return ProcessedTask(result=result, logs=logs)
